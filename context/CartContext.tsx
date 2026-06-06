'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import api from '@/lib/axios'
import { Cart } from '@/types'
import { useAuth } from '@/context/AuthContext'

interface CartContextType {
  cart: Cart | null
  loading: boolean
  fetchCart: () => Promise<void>
  addToCart: (bookId: string, cantidad?: number) => Promise<void>
  updateItem: (bookId: string, cantidad: number) => Promise<void>
  removeItem: (bookId: string) => Promise<void>
  clearCart: () => Promise<void>
  itemCount: number
}

const CartContext = createContext<CartContextType | null>(null)

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth()
  const [cart, setCart] = useState<Cart | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchCart = async () => {
    if (!user) {
      setCart(null)
      return
    }
    setLoading(true)
    try {
      const { data } = await api.get('/cart')
      setCart(data.cart)
    } catch (error) {
      console.error('[CartContext] Error al obtener carrito:', error)
    } finally {
      setLoading(false)
    }
  }

  // Se dispara cuando el usuario cambia — login o logout
  useEffect(() => {
    fetchCart()
  }, [user])

  const addToCart = async (bookId: string, cantidad: number = 1) => {
    await api.post('/cart/items', { bookId, cantidad })
    await fetchCart()
  }

  const updateItem = async (bookId: string, cantidad: number) => {
    await api.patch(`/cart/items/${bookId}`, { cantidad })
    await fetchCart()
  }

  const removeItem = async (bookId: string) => {
    await api.delete(`/cart/items/${bookId}`)
    await fetchCart()
  }

  const clearCart = async () => {
    await api.delete('/cart')
    await fetchCart()
  }

  const itemCount = cart?.items.reduce((sum, item) => sum + item.cantidad, 0) ?? 0

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addToCart, updateItem, removeItem, clearCart, itemCount }}>
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart debe usarse dentro de CartProvider')
  return context
}