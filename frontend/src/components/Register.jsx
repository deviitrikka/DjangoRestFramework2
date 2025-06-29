import React, { useState } from 'react'
import API from '../api'

export default function Register() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('contributor')

  const handleRegister = async (e) => {
    e.preventDefault()
    await API.post('register/', { username, password, role })
    window.location.href = '/'
  }

  return (
    <div className="card" style={{ maxWidth: 400, margin: '2em auto' }}>
      <h2 style={{ textAlign: 'center' }}>Register</h2>
      <form onSubmit={handleRegister}>
        <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
        <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <select onChange={(e) => setRole(e.target.value)} value={role} required>
          <option value="admin">Admin</option>
          <option value="contributor">Contributor</option>
        </select>
        <button type="submit" style={{ width: '100%', backgroundColor: '#db5e16' }}>Register</button>
      </form>
    </div>
  )
}
