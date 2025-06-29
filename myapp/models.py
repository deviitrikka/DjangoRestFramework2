from django.contrib.auth.models import User
from django.db import models

class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('admin', 'Admin'),
        ('contributor', 'Contributor'),
    )
    user: models.OneToOneField = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role: models.CharField = models.CharField(max_length=20, choices=ROLE_CHOICES, default='contributor')

    def __str__(self):
        return f"{self.user.username} Profile"

class Project(models.Model):
    title:models.CharField = models.CharField(max_length=255)
    description: models.TextField = models.TextField(blank=True)
    created_at: models.DateTimeField = models.DateTimeField(auto_now_add=True)
    owner: models.ForeignKey= models.ForeignKey('UserProfile', related_name='owned_projects', on_delete=models.CASCADE)

    def __str__(self):
        return self.title

class Task(models.Model):
    STATUS_CHOICES = (
        ('todo', 'Todo'),
        ('in_progress', 'In Progress'),
        ('done', 'Done'),
    )
    title: models.CharField = models.CharField(max_length=255)
    description: models.TextField = models.TextField(blank=True)
    status:models.CharField = models.CharField(max_length=20, choices=STATUS_CHOICES, default='todo')
    due_date:models.DateField = models.DateField(null=True, blank=True)
    created_at:models.DateTimeField = models.DateTimeField(auto_now_add=True)
    assigned_to:models.ForeignKey = models.ForeignKey('UserProfile', related_name='tasks', on_delete=models.SET_NULL, null=True, blank=True)
    project:models.ForeignKey = models.ForeignKey(Project, related_name='tasks', on_delete=models.CASCADE)
    is_deleted:models.BooleanField = models.BooleanField(default=False)

    def __str__(self):
        return self.title

class ActivityLog(models.Model):
    task: models.OneToOneField = models.OneToOneField(Task, related_name='activity_log', on_delete=models.CASCADE)
    previous_assignee: models.ForeignKey = models.ForeignKey('UserProfile', related_name='activity_logs', on_delete=models.SET_NULL, null=True, blank=True)
    previous_status: models.CharField = models.CharField(max_length=20, choices=Task.STATUS_CHOICES, null=True, blank=True)
    previous_due_date: models.DateField = models.DateField(null=True, blank=True)
    updated_at: models.DateTimeField = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f'Log for {self.task.title}'
