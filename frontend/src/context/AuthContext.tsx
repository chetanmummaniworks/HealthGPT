import { createContext, useContext, useState, type ReactNode } from 'react'
import { getCurrentUser, type User } from '../api/auth'

/**
 * Simple authentication state for the local development prototype.
 *
 * SECURITY NOTE: The JWT is stored in localStorage for this prototype.
 * This is NOT production-grade security. Production hardening (e.g.,
 * httpOnly cookies, refresh tokens) will be implemented in a later
 * milestone.
 */

const TOKEN_KEY = 'healthgpt_access_token'

interface AuthContextValue {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (token: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem(TOKEN_KEY),
  )
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  async function login(newToken: string) {
    localStorage.setItem(TOKEN_KEY, newToken)
    setToken(newToken)
    setIsLoading(true)
    try {
      const currentUser = await getCurrentUser(newToken)
      setUser(currentUser)
    } finally {
      setIsLoading(false)
    }
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}