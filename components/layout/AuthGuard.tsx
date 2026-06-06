'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

interface AuthGuardProps {
    children: React.ReactNode
    requireAuth?: boolean
    requireAdmin?: boolean
    redirectTo?: string
}

export default function AuthGuard({
    children,
    requireAuth = false,
    requireAdmin = false,
    redirectTo = '/login',
}: AuthGuardProps) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        console.log('[AuthGuard] loading:', loading, '| user:', user?.email ?? 'null')
        if (loading) return

        if (requireAuth && !user) {
           console.log('[AuthGuard] Sin usuario, redirigiendo a:', redirectTo) 
            router.push(redirectTo)
            return
        }

        if (requireAdmin && user?.role !== 'ADMIN') {
            router.push('/')
            return
        }
    }, [user, loading, requireAuth, requireAdmin, redirectTo, router])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground text-sm">Cargando...</p>
            </div>
        )
    }

    if (requireAuth && !user) return null
    if (requireAdmin && user?.role !== 'ADMIN') return null

    return <>{children}</>
}