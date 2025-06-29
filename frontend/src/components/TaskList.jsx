import React, { useEffect, useState } from 'react'
import API from '../api'

export default function TaskList() {
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    API.get('tasks/').then(res => setTasks(res.data.results))
  }, [])

  return (
    <div className="card">
      <h2>Tasks</h2>
      <ul>
        {tasks.map(task => (
          <li key={task.id}>
            <div>
              <strong>{task.title}</strong>
              <span style={{ marginLeft: 12, color: '#888' }}>{task.status}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
