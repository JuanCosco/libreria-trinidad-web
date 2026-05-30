'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/axios"
import { saveAuth, clearAuth, getUser, isAuthenticated } from "@/lib/auth"
import { User, AuthResponse } from "@/types"

export const useAuth = () => {
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    useEffect(() => {
        if (isAuthenticated()) {
            setUser(getUser())
        }
        setLoading(false)
    }, [])

    const login = async (email: string, password: string) => {
        const { data } = await api.post<AuthResponse>("/auth/login", { email, password})
        saveAuth(data.token, data.user)
        setUser(data.user)
        return data.user
    }

    const register = async (nombre: string, apellido: string, email: string, password: string) => {
        const { data } = await api.post("/auth/register", { nombre, apellido, email, password })
        return data.user
    }

    const logout = () => {
        clearAuth()
        setUser(null)
        router.push("/login")
    }

    return { user, loading, login , register, logout}
}