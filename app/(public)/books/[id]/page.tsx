'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import api from '@/lib/axios'
import { Book } from '@/types'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/hooks/useCart'
import { useAuth } from '@/hooks/useAuth'
import { ArrowLeft, ShoppingCart } from 'lucide-react'

export default function BookDetailPage() {
    const { id } = useParams()
    const router = useRouter()
    const { addToCart } = useCart()
    const { user } = useAuth()  // ← agrega esto
    const [book, setBook] = useState<Book | null>(null)
    const [loading, setLoading] = useState(true)
    const [adding, setAdding] = useState(false)

    useEffect(() => {
        const bookId = Array.isArray(id) ? id[0] : id
        api.get(`/books/${bookId}`)
            .then(({ data }) => setBook(data.book))
            .catch(() => { router.push('/') })
            .finally(() => { setLoading(false) })
    }, [id, router])

    const handleAddToCart = async () => {
        if (!user) {
            router.push('/login')
            return
        }
        if (!book) return
        setAdding(true)
        try {
            await addToCart(book.id, 1)
        } catch (error) {
            console.error('Error al agregar al carrito: ', error)
        } finally {
            setAdding(false)
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <p className="text-muted-foreground">Cargando...</p>
            </div>
        )
    }

    if (!book) return null

    const precioFinal = Number(book.precio) - (Number(book.precio) * book.descuento) / 100

    return (
        <div className="max-w-3xl mx-auto">
            <Button variant="ghost" onClick={() => router.back()} className="mb-6 -ml-2">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Volver
            </Button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Info del libro */}
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-muted-foreground mb-1">
                            {book.category?.nombre ?? 'Sin categoría'}
                        </p>
                        <h1 className="text-3xl font-bold">{book.nombre}</h1>
                    </div>

                    <p className="text-muted-foreground leading-relaxed">{book.descripcion}</p>

                    <div className="flex items-center gap-3">
                        {book.descuento > 0 && (
                            <>
                                <span className="text-muted-foreground line-through text-lg">
                                    S/ {Number(book.precio).toFixed(2)}
                                </span>
                                <Badge variant="destructive">-{book.descuento}%</Badge>
                            </>
                        )}
                    </div>

                    <p className="text-4xl font-bold">S/ {precioFinal.toFixed(2)}</p>

                    <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={adding}>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        {adding ? 'Agregando...' : 'Agregar al carrito'}
                    </Button>
                </div>

                {/* Detalles adicionales */}
                <div className="bg-muted/40 rounded-lg p-6 space-y-4 h-fit">
                    <h2 className="font-semibold">Detalles</h2>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Categoría</span>
                            <span>{book.category?.nombre ?? 'Sin categoría'}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Disponibilidad</span>
                            <span className="text-green-600 font-medium">En stock</span>
                        </div>
                        {book.descuento > 0 && (
                            <div className="flex justify-between">
                                <span className="text-muted-foreground">Descuento</span>
                                <span className="text-destructive font-medium">{book.descuento}%</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}