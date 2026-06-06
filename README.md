# Librería Trinidad — Frontend

Interfaz web para una tienda online de libros, construida con Next.js 16, Tailwind CSS y shadcn/ui.

## Stack

- **Framework:** Next.js 16 (App Router)
- **Lenguaje:** TypeScript
- **Estilos:** Tailwind CSS + shadcn/ui
- **Estado global:** React Context (Auth + Cart)
- **HTTP:** Axios
- **PDF:** jsPDF

## Estructura

app/
├── (public)/        # Catálogo y detalle de libros
├── (auth)/          # Login y registro
├── (protected)/     # Carrito y órdenes (requiere login)
└── admin/           # Panel de administración (requiere ADMIN)
components/
├── ui/              # Componentes shadcn
├── layout/          # Navbar, AuthGuard
└── books/           # BookCard
context/             # AuthContext, CartContext
hooks/               # useAuth, useCart
lib/                 # axios, auth helpers, pdf
types/               # Interfaces TypeScript

## Páginas

| Ruta                | Descripción              | Acceso      |
|---------------------|--------------------------|-------------|
| /                   | Catálogo de libros       | Público     |
| /books/:id          | Detalle del libro        | Público     |
| /login              | Iniciar sesión           | Público     |
| /register           | Registrarse              | Público     |
| /cart               | Carrito de compras       | Autenticado |
| /orders             | Mis órdenes              | Autenticado |
| /admin/books        | Gestión de libros        | Admin       |
| /admin/categories   | Gestión de categorías    | Admin       |
| /admin/orders       | Gestión de órdenes       | Admin       |

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local

# Iniciar servidor de desarrollo
npm run dev
```

## Variables de entorno

```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

## Requisitos

El backend debe estar corriendo en `http://localhost:3001` antes de iniciar el frontend.