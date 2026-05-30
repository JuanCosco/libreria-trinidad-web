'use client'
import { useState, useEffect } from "react"
import api from "@/lib/axios"
import { Cart } from "@/types"
import { isAuthenticated } from "@/lib/auth"

export const useCart = () => {
    const [cart, setCart] = useState<Cart | null>(null)
    const [loading, setLoading] = useState(true)

    const fetchCart = async () => {
        if (!isAuthenticated()) return
        setLoading(true)
        try {
            const { data } = await api.get("/cart")
            setCart(data.cart)
        } catch (error) {
            console.error('[useCart] Error al obtener carrito:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCart()
    }, [])

    const addToCart = async (bookId: string, cantidad: number = 1) => {
        const { data } = await api.post("/cart/items", { bookId, cantidad })
        await fetchCart()
        return data.item
    }

    const updateItem = async (bookId: string, cantidad: number) => {
        await api.patch(`/cart/items/${bookId}`, { cantidad})
        await fetchCart()
    }

    const removeItem = async (bookId: string) => {
        await api.delete(`/cart/items/${bookId}`)
        await fetchCart()
    }

    const clearCart = async () => {
        await api.delete("/cart")
        await fetchCart()
    }

    const itemCount = cart?.items.reduce((sum, item) => sum + item.cantidad, 0) ?? 0

    return { cart, loading, addToCart, updateItem, removeItem, clearCart, itemCount }
}