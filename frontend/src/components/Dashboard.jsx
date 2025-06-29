import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const [role, setRole] = useState(null)

  useEffect(() => {
    setRole(localStorage.getItem('role'))
  }, [])

  if (!role) return <p>Loading...</p>

  return (
    <div className="card" style={{ maxWidth: 500, margin: '2em auto' }}>
      <h2 style={{ textAlign: 'center' }}>{role === 'admin' ? 'Admin Dashboard' : 'Contributor Dashboard'}</h2>
      <ul>
        {role === 'admin' && (
          <>
            <li><Link to="/projects">Projects</Link></li>
            <li><Link to="/logs">Activity Logs</Link></li>
          </>
        )}
        <li><Link to="/tasks">Tasks</Link></li>
      </ul>
    </div>
  )
}
