from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from django_filters.rest_framework import DjangoFilterBackend
from .models import Project, Task, ActivityLog, User, UserProfile
from .serializers import ProjectSerializer, TaskSerializer, ActivityLogSerializer, UserProfileSerializer
from .permissions import IsAdmin, IsContributor, IsAdminOrReadOnly
from django.db import transaction
from rest_framework.views import APIView
from django.contrib.auth.models import User


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.all()
    serializer_class = ProjectSerializer
    filter_backends = [filters.SearchFilter]
    search_fields = ['title', 'description']

    def get_permissions(self):
        if self.action in ['create', 'update', 'partial_update', 'destroy']:
            return [IsAdmin()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user.profile)

class TaskViewSet(viewsets.ModelViewSet):
    queryset = Task.objects.filter(is_deleted=False)
    serializer_class = TaskSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['status', 'project', 'assigned_to']
    search_fields = ['title', 'description']

    def get_permissions(self):
        user = self.request.user
        if not user.is_authenticated:
            return [IsAuthenticated()]
        # Use user.profile.role for role-based checks
        if hasattr(user, 'profile') and user.profile.role == 'admin':
            return [IsAuthenticated()]
        elif hasattr(user, 'profile') and user.profile.role == 'contributor':
            return [IsContributor()]
        return [IsAuthenticated()]

    def perform_destroy(self, instance):
        instance.is_deleted = True
        instance.save()

    @transaction.atomic
    def perform_update(self, serializer):
        instance = self.get_object()
        # Save previous state to ActivityLog
        log, _ = ActivityLog.objects.get_or_create(task=instance)
        log.previous_assignee = instance.assigned_to
        log.previous_status = instance.status
        log.previous_due_date = instance.due_date
        log.save()
        serializer.save()

class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ActivityLog.objects.select_related('task').all()
    serializer_class = ActivityLogSerializer
    permission_classes = [IsAdmin]

class UserViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserProfileSerializer
    permission_classes = [IsAdmin]

class RegisterView(APIView):
    permission_classes=[AllowAny]
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        role = request.data.get('role', 'contributor')
        if not username or not password:
            return Response({'error': 'Username and password required'}, status=400)
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=400)
        user = User.objects.create_user(username=username, password=password)
        # Use get_or_create to avoid IntegrityError
        profile, created = UserProfile.objects.get_or_create(user=user)
        profile.role = role
        profile.save()
        return Response({'message': 'User created'}, status=201)
    
class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        if request.user.profile.role != 'admin':
            return Response({'error': 'Forbidden'}, status=403)
        projects = Project.objects.all()
        tasks = Task.objects.all()
        logs = ActivityLog.objects.all()
        return Response({
            'projects': ProjectSerializer(projects, many=True).data,
            'tasks': TaskSerializer(tasks, many=True).data,
            'activity_logs': ActivityLogSerializer(logs, many=True).data,
        })

class ContributorDashboardView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        if request.user.profile.role != 'contributor':
            return Response({'error': 'Forbidden'}, status=403)
        tasks = Task.objects.filter(assigned_to=request.user.profile)
        return Response({
            'tasks': TaskSerializer(tasks, many=True).data,
        })
    
class RoleView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = request.user.profile
        return Response({
            'username': request.user.username,
            'role': profile.role
        })