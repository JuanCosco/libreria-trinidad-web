'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import { BookOpen, Tag, ShoppingBag } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()
    const router = useRouter()

    useEffect(() => {
        if (!loading && (!user || user.role !== 'ADMIN')) {
            router.push('/')
        }
    }, [user, loading, router])

    if (loading || !user || user.role !== 'ADMIN') return null

    return (
        <div className="flex gap-8">
            {/* Sidebar */}
            <aside className="w-48 shrink-0">
                <h2 className="font-semibold mb-4">Panel Admin</h2>
                <nav className="space-y-1">
                    <Link href="/admin/books" className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-muted transition-colors">
                        <BookOpen className="h-4 w-4" />
                        Libros
                    </Link>
                    <Link href="/admin/categories" className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-muted transition-colors">
                        <Tag className="h-4 w-4" />
                        Categorías
                    </Link>
                    <Link href="/admin/orders" className="flex items-center gap-2 text-sm px-3 py-2 rounded-md hover:bg-muted transition-colors">
                        <ShoppingBag className="h-4 w-4" />
                        Órdenes
                    </Link>
                </nav>
            </aside>

            {/* Contenido */}
            <main className="flex-1">{children}</main>
        </div>
    )
}