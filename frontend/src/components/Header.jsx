import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Header() {
  const navigate = useNavigate()
  const location = useLocation()
  const hideLogout = location.pathname === '/' || location.pathname === '/register'
  return (
    <header style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', padding: '1rem 0', marginBottom: '1.5rem' }}>
      {!hideLogout && (
        <button onClick={() => {
          localStorage.removeItem('token');
          navigate('/')
        }}>
          Logout
        </button>
      )}
    </header>
  )
}
