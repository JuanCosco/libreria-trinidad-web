export interface User {
    id: string
    nombre: string
    apellido: string
    email: string
    role: " ADMIN" | "CLIENT"
}

export interface Category {
    id: string
    nombre: string
    createdAt: string
}

export interface Book {
    id: string
    nombre: string
    descripcion: string
    precio: number
    descuento: number
    activo: boolean
    categoryId: string
    category: Category
    createdAt: string
    updatedAt: string
}

export interface CartItem {
    id: string
    cartId: string
    bookId: string
    cantidad: number
    book: Book
}

export interface Cart {
    id: string
    userId: string
    items: CartItem[]
    total: string
}

export interface OrderItem {
    id: string
    orderId: string
    bookId: string
    nombreSnapshot: string
    precioSnapshot: number
    cantidad: number
}

export interface Order {
    id: string
    paypalTransactionId: string
    status: string
    total: number
    payerEmail: string
    fecha: string
    userId: string
    items: OrderItem[]
}

export interface AuthResponse {
    token: string
    user: User
}