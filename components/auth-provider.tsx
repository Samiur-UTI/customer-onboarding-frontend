"use client"

import { createContext, useContext, useEffect, useState, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import { getCookie, deleteCookie } from "cookies-next"

interface AuthContextType {
  isAuthenticated: boolean
  logout: () => void
  token: string | null
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  logout: () => {},
  token: null,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    // Check for token on client side
    const checkAuth = () => {
      const authToken = getCookie("auth-token") as string | undefined
      setToken(authToken || null)
      setIsAuthenticated(!!authToken)
    }

    // Initial check
    checkAuth()

    // Set up event listener for storage changes (for multi-tab support)
    const handleStorageChange = () => {
      checkAuth()
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  const logout = () => {
    deleteCookie("auth-token")
    setToken(null)
    setIsAuthenticated(false)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ isAuthenticated, logout, token }}>{children}</AuthContext.Provider>
}

