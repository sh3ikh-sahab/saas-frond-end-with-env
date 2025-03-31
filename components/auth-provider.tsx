"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import axios from "axios"
import { useToast } from "@/components/ui/use-toast"
import { api } from "@/lib/axios"

type User = {
  id: string
  name: string
  email: string
  role: "User" | "CEO" | "HR" | "Manager" | "Employee"
  avatar?: string
}

type AuthContextType = {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (userData: any) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setLoading(false)
          if (!pathname.includes("/auth/") && !pathname.includes("/")) {
            router.push("/auth/login")
          }
          return
        }

        // Set default headers for all axios requests
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`

        // Make API call to verify token and get user data
        const response = await api.get("/auth/me")
        const userData = response.data

        setUser(userData)

        // Redirect if on auth page but already logged in
        if (pathname.includes("/auth/") && pathname !== "/") {
          router.push("/dashboard")
        }
      } catch (error) {
        console.error("Auth check error:", error)
        localStorage.removeItem("token")
        if (!pathname.includes("/auth/") && !pathname.includes("/")) {
          router.push("/auth/login")
        }
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)

      // Replace mock with actual API call
      const response = await api.post("/auth/login", { email, password })

      // Extract data from response
      const { token, user } = response.data

      localStorage.setItem("token", token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUser(user)

      toast({
        title: "Login successful",
        description: `Welcome back, ${user.name}!`,
      })

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Login error:", error)
      toast({
        variant: "destructive",
        title: "Login failed",
        description: error.response?.data?.message || "Invalid credentials",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signup = async (userData: any) => {
    try {
      setLoading(true)

      // Replace mock with actual API call
      const response = await api.post("/auth/register", userData)

      // Extract data from response
      const { token, user } = response.data

      localStorage.setItem("token", token)
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`
      setUser(user)

      toast({
        title: "Account created",
        description: "Your account has been created successfully!",
      })

      router.push("/dashboard")
    } catch (error: any) {
      console.error("Signup error:", error)
      toast({
        variant: "destructive",
        title: "Signup failed",
        description: error.response?.data?.message || "Could not create account",
      })
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    delete axios.defaults.headers.common["Authorization"]
    router.push("/auth/login")
    toast({
      title: "Logged out",
      description: "You have been logged out successfully",
    })
  }

  return <AuthContext.Provider value={{ user, loading, login, signup, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

