'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import { saveAuth, clearAuth, getUser, isAuthenticated } from '@/lib/auth'
import { User, AuthResponse } from '@/types'

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<User>
  register: (nombre: string, apellido: string, email: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    console.log('[AuthContext] useEffect corriendo...')
    console.log('[AuthContext] isAuthenticated:', isAuthenticated())
    console.log('[AuthContext] getUser:', getUser())
    console.log('[AuthContext] montado, leyendo localStorage...')

    if (isAuthenticated()) {
      const u = getUser()
      console.log('[AuthContext] usuario encontrado:', u?.email)
      setUser(u)
    } else {
      console.log('[AuthContext] No hay sesión en localStorage')
    }
    setLoading(false)
    console.log('[AuthContext] loading: false')
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await api.post<AuthResponse>('/auth/login', { email, password })
    saveAuth(data.token, data.user)
    setUser(data.user)
    return data.user
  }

  const register = async (nombre: string, apellido: string, email: string, password: string) => {
    await api.post('/auth/register', { nombre, apellido, email, password })
  }

  const logout = () => {
    clearAuth()
    setUser(null)
    router.push('/login')
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider')
  return context
}