import React, { useEffect, useState } from 'react'
import API from '../api'

export default function ActivityLog() {
  const [logs, setLogs] = useState([])

  useEffect(() => {
    API.get('activity-logs/').then(res => setLogs(res.data.results))
  }, [])

  return (
    <div className="card">
      <h2>Activity Logs</h2>
      <ul>
        {logs.map(log => (
          <li key={log.id}>
            <div>
              <strong>Task:</strong> {log.task || 'N/A'}
              <span style={{ marginLeft: 12 }}><strong>Previous Assignee:</strong> {log.previous_assignee?.user?.username || 'Not Assigned'}</span>
              <span style={{ marginLeft: 12 }}><strong>Status:</strong> {log.previous_status}</span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
