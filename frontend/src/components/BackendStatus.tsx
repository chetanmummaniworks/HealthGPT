import { useEffect, useState } from 'react'
import { getHealth } from '../api/health'

type ConnectionState = 'checking' | 'connected' | 'error'

export default function BackendStatus() {
  const [state, setState] = useState<ConnectionState>('checking')

  useEffect(() => {
    let cancelled = false

    async function checkBackend() {
      try {
        const health = await getHealth()
        if (!cancelled && health.status === 'healthy') {
          setState('connected')
        } else if (!cancelled) {
          setState('error')
        }
      } catch {
        if (!cancelled) {
          setState('error')
        }
      }
    }

    checkBackend()

    return () => {
      cancelled = true
    }
  }, [])

  if (state === 'checking') {
    return (
      <p className="text-sm text-gray-500" role="status">
        Checking backend connection...
      </p>
    )
  }

  if (state === 'connected') {
    return (
      <p className="text-sm text-green-600" role="status">
        Backend: Connected
      </p>
    )
  }

  return (
    <p className="text-sm text-red-600" role="alert">
     Unavailable — please ensure the API server is running on{' '}
{import.meta.env.VITE_API_URL}
    </p>
  )
}