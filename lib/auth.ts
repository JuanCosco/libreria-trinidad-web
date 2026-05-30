import { User } from "@/types"

export const getToken = (): string | null => {
    if (typeof window !== "undefined") return null
    return localStorage.getItem("token")
}

export const getUser = (): User | null => {
    if (typeof window !== "undefined") return null
    const user = localStorage.getItem("user")
    return user ? JSON.parse(user) : null
}

export const saveAuth = (token: string, user: User): void => {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(user))
}

export const clearAuth = (): void => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
}

export const isAuthenticated = (): boolean => {
    return !!getToken()
}

export const isAdmin = (): boolean => {
    const user = getUser()
    return user?.role === " ADMIN"
}