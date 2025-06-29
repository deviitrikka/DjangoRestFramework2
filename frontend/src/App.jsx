import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'
import { Routes, Route } from 'react-router-dom'
import Login from './components/Login'
import Register from './components/Register'
import Dashboard from './components/Dashboard'
import ProjectList from './components/ProjectList'
import TaskList from './components/TaskList'
import ActivityLog from './components/ActivityLog'
import Header from './components/Header'

function App() {
  return (
    <>
      <h1>Smart Task Tracker</h1>
      <Header />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/projects" element={<ProjectList />} />
        <Route path="/tasks" element={<TaskList />} />
        <Route path="/logs" element={<ActivityLog />} />
      </Routes>
    </>
  )
}

export default App
