import React, { useState } from 'react'
import API from '../api'

export default function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    try {
      const res = await API.post('token/', { username, password })
      localStorage.setItem('token', res.data.access)

      // Fetch user profile to determine role
      const profile = await API.get('role/')
      localStorage.setItem('role', profile.data.role)

      window.location.href = '/dashboard'
    } catch {
      alert('Invalid credentials')
    }
  }

  return (
    <div className="card" style={{ maxWidth: 400, margin: '2em auto', padding: '2em', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}>
      <h2 style={{ textAlign: 'center', marginBottom: '1.5em' }}>Login</h2>
      <form onSubmit={handleLogin}>
        <input style={{ marginBottom: '1em', padding: '0.75em', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }} placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
        <input style={{ marginBottom: '1.5em', padding: '0.75em', borderRadius: '4px', border: '1px solid #ccc', width: '100%' }} type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit" style={{ width: '100%', padding: '0.75em', borderRadius: '4px', border: 'none', backgroundColor: '#007bff', color: 'white', fontSize: '1em', cursor: 'pointer' }}>Login</button>
      </form>
    </div>
  )
}
