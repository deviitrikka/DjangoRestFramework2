import React, { useEffect, useState } from 'react'
import API from '../api'

export default function ProjectList() {
  const [projects, setProjects] = useState([])

  useEffect(() => {
    API.get('projects/').then(res => setProjects(res.data.results))
  }, [])

  return (
    <div className="card">
      <h2>Projects</h2>
      <ul>
        {Array.isArray(projects) && projects.map(p => (
          <li key={p.id}>
            <div>
              <strong>{p.title}</strong>
              <div style={{ color: '#666', fontSize: '0.95em', marginTop: 4 }}>{p.description}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
