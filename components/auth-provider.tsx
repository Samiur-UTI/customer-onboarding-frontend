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
    const authToken = getCookie("auth-token") as string | undefined
    setToken(authToken || null)
    setIsAuthenticated(!!authToken)
  }, [])

  const logout = () => {
    deleteCookie("auth-token")
    setToken(null)
    setIsAuthenticated(false)
    router.push("/login")
  }

  return <AuthContext.Provider value={{ isAuthenticated, logout, token }}>{children}</AuthContext.Provider>
}

