'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'
import { Order } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import AuthGuard from '@/components/layout/AuthGuard'

const statusLabel: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
    PENDING: { label: 'Pendiente', variant: 'secondary' },
    PAID: { label: 'Pagado', variant: 'default' },
    CANCELLED: { label: 'Cancelado', variant: 'destructive' },
}

export default function OrdersPage() {
    const { user } = useAuth()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)


    useEffect(() => {

        if (!user) return
        api.get('/orders/my')
            .then(({ data }) => setOrders(data.orders))
            .catch((error) => console.error('Error al cargar órdenes:', error))
            .finally(() => setLoading(false))

    }, [user])

    return (
        <AuthGuard requireAuth>
            {loading ? (
                <div className="flex items-center justify-center min-h-[400px]">
                    <p className="text-muted-foreground">Cargando...</p>
                </div>
            ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                    <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                    <h2 className="text-xl font-semibold">No tienes órdenes aún</h2>
                    <p className="text-muted-foreground">Tus compras aparecerán aquí</p>
                    <Link href="/"><Button>Ver catálogo</Button></Link>
                </div>
            ) : (
                <div className="max-w-3xl mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Mis órdenes</h1>
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const status = statusLabel[order.status] ?? { label: order.status, variant: 'secondary' }
                            return (
                                <div key={order.id} className="border rounded-lg p-6 space-y-4">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <p className="text-xs text-muted-foreground font-mono">{order.id}</p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {new Date(order.fecha).toLocaleDateString('es-PE', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                })}
                                            </p>
                                        </div>
                                        <Badge variant={status.variant}>{status.label}</Badge>
                                    </div>
                                    <Separator />
                                    <div className="space-y-2">
                                        {order.items.map((item) => (
                                            <div key={item.id} className="flex justify-between text-sm">
                                                <span>
                                                    {item.nombreSnapshot}
                                                    <span className="text-muted-foreground ml-2">x{item.cantidad}</span>
                                                </span>
                                                <span className="font-medium">
                                                    S/ {(Number(item.precioSnapshot) * item.cantidad).toFixed(2)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>S/ {Number(order.total).toFixed(2)}</span>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </AuthGuard>
    )
}