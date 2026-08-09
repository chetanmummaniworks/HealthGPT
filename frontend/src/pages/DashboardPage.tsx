import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCurrentUser, type User } from '../api/auth'
import { useAuth } from '../context/AuthContext'

export default function DashboardPage() {
  const { token, logout } = useAuth()
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false

    async function loadUser() {
      if (!token) {
        navigate('/login')
        return
      }
      try {
        const currentUser = await getCurrentUser(token)
        if (!cancelled) {
          setUser(currentUser)
        }
      } catch {
        if (!cancelled) {
          setError('Unable to load your profile. Please log in again.')
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    loadUser()

    return () => {
      cancelled = true
    }
  }, [token, navigate])

  function handleLogout() {
    logout()
    navigate('/login')
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <p className="text-gray-600" role="status">
          Loading your profile...
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900">HealthGPT AI</h1>
          <button
            onClick={handleLogout}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-8">
        {error ? (
          <div className="rounded-lg bg-red-50 p-4 text-red-700" role="alert">
            {error}
          </div>
        ) : user ? (
          <div className="rounded-lg bg-white p-6 shadow">
            <h2 className="text-2xl font-bold text-gray-900">
              Welcome, {user.full_name}!
            </h2>
            <p className="mt-2 text-gray-600">This is your protected dashboard.</p>
            <dl className="mt-6 space-y-2">
              <div className="flex">
                <dt className="w-24 font-medium text-gray-500">Name</dt>
                <dd className="text-gray-900">{user.full_name}</dd>
              </div>
              <div className="flex">
                <dt className="w-24 font-medium text-gray-500">Email</dt>
                <dd className="text-gray-900">{user.email}</dd>
              </div>
            </dl>
          </div>
        ) : null}
      </main>
    </div>
  )
}