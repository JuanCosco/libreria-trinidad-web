import { User } from "@/types"

export const getToken = (): string | null => {
    if (typeof window === "undefined") return null
    return localStorage.getItem("token")
}

export const getUser = (): User | null => {
    if (typeof window === "undefined") return null
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
}

export const saveAuth = (token: string, user: User): void => {
    console.log('[saveAuth] Guardando token y usuario...')
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
    console.log('[saveAuth] Token guardado:', localStorage.getItem('token')?.slice(0, 20) + '...')
}

export const clearAuth = (): void => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
}

export const isAuthenticated = (): boolean => {
    if (typeof window === 'undefined') return false
    const token = localStorage.getItem('token')
    console.log('[isAuthenticated] token en localStorage:', token ? token.slice(0, 20) + '...' : 'null')
    return !!getToken()
}

export const isAdmin = (): boolean => {
    const user = getUser()
    return user?.role === "ADMIN"
}