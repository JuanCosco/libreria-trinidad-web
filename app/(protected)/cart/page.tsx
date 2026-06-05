'use client'

import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react'
import Link from 'next/link'
import api from '@/lib/axios'

export default function CartPage() {
    const { user, loading: authLoading } = useAuth()
    const { cart, loading, fetchCart, updateItem, removeItem, } = useCart()
    const router = useRouter()

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login')
        }
    }, [user, authLoading, router])

    const handleCreateOrder = async () => {
        try {
            await api.post('/orders')
            await fetchCart()
            router.push('/orders')
        } catch (error) {
            console.error('Error al crear orden:', error)
        }
    }

    if (authLoading || loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Cargando...</p>
            </div>
        )
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <ShoppingBag className="h-16 w-16 text-muted-foreground" />
                <h2 className="text-xl font-semibold">Tu carrito está vacío</h2>
                <p className="text-muted-foreground">Agrega libros desde el catálogo</p>
                <Link href="/">
                    <Button>Ver catálogo</Button>
                </Link>
            </div>
        )
    }

    return (
        <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold mb-8">Mi carrito</h1>

            <div className="space-y-4">
                {cart.items.map((item) => {
                    const precio = Number(item.book.precio)
                    const descuento = item.book.descuento ?? 0
                    const precioFinal = precio - (precio * descuento) / 100
                    const subtotal = precioFinal * item.cantidad

                    return (
                        <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg">
                            <div className="flex-1">
                                <h3 className="font-semibold">{item.book.nombre}</h3>
                                <p className="text-sm text-muted-foreground">{item.book.category.nombre}</p>
                                <p className="text-sm font-medium mt-1">S/ {precioFinal.toFixed(2)} c/u</p>
                            </div>

                            {/* Controles de cantidad */}
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateItem(item.book.id, item.cantidad - 1)}
                                    disabled={item.cantidad <= 1}
                                >
                                    <Minus className="h-3 w-3" />
                                </Button>
                                <span className="w-8 text-center font-medium">{item.cantidad}</span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-8 w-8"
                                    onClick={() => updateItem(item.book.id, item.cantidad + 1)}
                                >
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </div>

                            {/* Subtotal */}
                            <p className="w-24 text-right font-semibold">S/ {subtotal.toFixed(2)}</p>

                            {/* Eliminar */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-destructive hover:text-destructive"
                                onClick={() => removeItem(item.book.id)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    )
                })}
            </div>

            <Separator className="my-6" />

            {/* Total y checkout */}
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-muted-foreground text-sm">Total</p>
                    <p className="text-3xl font-bold">S/ {Number(cart.total).toFixed(2)}</p>
                </div>
                <Button size="lg" onClick={handleCreateOrder}>
                    Confirmar orden
                </Button>
            </div>
        </div>
    )
}