import Link from 'next/link'
import { Book } from '@/types'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useCart } from '@/hooks/useCart'
import { isAuthenticated } from '@/lib/auth'
import { ShoppingCart } from 'lucide-react'
import { useState } from 'react'

interface BookCardProps {
    book: Book
}

export default function BookCard({ book }: BookCardProps) {
    const { addToCart } = useCart()
    const [adding, setAdding] = useState(false)

    const precioFinal = book.precio - (book.precio * book.descuento / 100)

    const handleAddToCart = async () => {
        if (!isAuthenticated()) {
            window.location.href = '/login'
            return
        }
        setAdding(true)
        try {
            await addToCart(book.id, 1)
        } catch (error) {
            console.error('Error al agregar al carrito:', error)
        } finally {
            setAdding(false)
        }
    }

    return (
        <Card className="flex flex-col justify-between h-full hover:shadow-md transition-shadow">
            <CardHeader>
                <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-base leading-snug">{book.nombre}</CardTitle>
                    {book.descuento > 0 && (
                        <Badge variant="destructive" className="shrink-0">
                            -{book.descuento}%
                        </Badge>
                    )}
                </div>
                <p className="text-xs text-muted-foreground">{book.category.nombre}</p>
            </CardHeader>

            <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{book.descripcion}</p>
            </CardContent>

            <CardFooter className="flex items-center justify-between gap-2">
                <div className="flex flex-col">
                    {book.descuento > 0 && (
                        <span className="text-xs text-muted-foreground line-through">
                            S/ {Number(book.precio).toFixed(2)}
                        </span>
                    )}
                    <span className="font-bold text-lg">
                        S/ {precioFinal.toFixed(2)}
                    </span>
                </div>

                <div className="flex gap-2">
                    <Link href={`/books/${book.id}`}>
                        <Button variant="outline" size="sm">Ver más</Button>
                    </Link>
                    <Button size="sm" onClick={handleAddToCart} disabled={adding}>
                        <ShoppingCart className="h-4 w-4 mr-1" />
                        {adding ? 'Agregando...' : 'Agregar'}
                    </Button>
                </div>
            </CardFooter>
        </Card>
    )
}