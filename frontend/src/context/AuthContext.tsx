import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react"

import {
  getCurrentUser,
  type User,
} from "../api/auth"

import i18n from "../i18n"


/**
 * Simple authentication state for the local development prototype.
 *
 * SECURITY NOTE:
 * The JWT is stored in localStorage for this prototype.
 * This is NOT production-grade security.
 *
 * Production hardening such as httpOnly cookies and
 * refresh tokens can be implemented later.
 */

const TOKEN_KEY =
  "healthgpt_access_token"


interface AuthContextValue {
  user: User | null
  token: string | null
  isLoading: boolean
  login: (token: string) => Promise<void>
  logout: () => void
}


const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined,
  )


/**
 * Convert the language stored in the database
 * into the language code used by i18next.
 */
function getLanguageCode(
  language: string | undefined,
): string {

  switch (language) {

    case "Hindi":
      return "hi"

    case "Telugu":
      return "te"

    case "Tamil":
      return "ta"

    case "Bengali":
      return "bn"

    case "Marathi":
      return "mr"

    case "Kannada":
      return "kn"

    case "Malayalam":
      return "ml"

    case "Gujarati":
      return "gu"

    case "English":
    default:
      return "en"
  }
}


export function AuthProvider({
  children,
}: {
  children: ReactNode
}) {

  const [token, setToken] =
    useState<string | null>(() =>
      localStorage.getItem(
        TOKEN_KEY,
      ),
    )


  const [user, setUser] =
    useState<User | null>(null)


  const [isLoading, setIsLoading] =
    useState<boolean>(false)


  // ==========================================================
  // RESTORE SESSION
  // ==========================================================

  useEffect(() => {

    async function restoreSession() {

      if (!token) {

        setIsLoading(false)

        return
      }


      setIsLoading(true)


      try {

        const currentUser =
          await getCurrentUser(
            token,
          )


        setUser(
          currentUser,
        )


        const language =
          getLanguageCode(
            currentUser.preferred_language,
          )


        await i18n.changeLanguage(
          language,
        )


      } catch (error) {

        console.error(
          "Failed to restore session:",
          error,
        )


        localStorage.removeItem(
          TOKEN_KEY,
        )


        setToken(null)
        setUser(null)


        await i18n.changeLanguage(
          "en",
        )


      } finally {

        setIsLoading(false)

      }
    }


    restoreSession()

  }, [token])


  // ==========================================================
  // LOGIN
  // ==========================================================

  async function login(
    newToken: string,
  ) {

    localStorage.setItem(
      TOKEN_KEY,
      newToken,
    )


    setToken(newToken)
    setIsLoading(true)


    try {

      const currentUser =
        await getCurrentUser(
          newToken,
        )


      setUser(
        currentUser,
      )


      const language =
        getLanguageCode(
          currentUser.preferred_language,
        )


      await i18n.changeLanguage(
        language,
      )


    } catch (error) {

      console.error(
        "Login user loading failed:",
        error,
      )

      localStorage.removeItem(
        TOKEN_KEY,
      )

      setToken(null)
      setUser(null)

      await i18n.changeLanguage(
        "en",
      )

      throw error

    } finally {

      setIsLoading(false)

    }
  }


  // ==========================================================
  // LOGOUT
  // ==========================================================

  function logout() {

    localStorage.removeItem(
      TOKEN_KEY,
    )


    setToken(null)
    setUser(null)


    i18n.changeLanguage(
      "en",
    )
  }


  return (

    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>

  )
}


export function useAuth(): AuthContextValue {

  const context =
    useContext(
      AuthContext,
    )


  if (
    context === undefined
  ) {

    throw new Error(
      "useAuth must be used within an AuthProvider",
    )

  }


  return context
}