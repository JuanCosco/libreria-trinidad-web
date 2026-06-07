'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import { Book, Category } from '@/types'
import BookCard from '@/components/books/BookCard'
import { Button } from '@/components/ui/button'

export default function Home() {
  const [books, setBooks] = useState<Book[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriaActiva, setCategoriaActiva] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      api.get('/books'),
      api.get('/categories')
    ])

      .then(([booksRes, catsRes]) => {
        setBooks(booksRes.data.books)
        setCategories(catsRes.data.categories)
      })
      .catch((error) => console.error("Error al cargar libros:", error))
      .finally(() => setLoading(false))
  }, [])

  const librosFiltrados = categoriaActiva
    ? books.filter((b) => b.categoryId === categoriaActiva)
    : books

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Cargando catálogo...</p>
      </div>
    )
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Catálogo</h1>
      <p className="text-muted-foreground mb-6">
        {librosFiltrados.length} libro(s) disponible(s)
      </p>

      {/* Filtros por categoría */}
      <div className="flex gap-2 flex-wrap mb-8">
        <Button
          variant={categoriaActiva === null ? 'default' : 'outline'}
          size="sm"
          onClick={() => setCategoriaActiva(null)}
        >
          Todos
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={categoriaActiva === cat.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCategoriaActiva(cat.id)}
          >
            {cat.nombre}
          </Button>
        ))}
      </div>

      {/* Grid de libros */}
      {librosFiltrados.length === 0 ? (
        <div className="flex items-center justify-center min-h-[200px]">
          <p className="text-muted-foreground">No hay libros en esta categoría.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {librosFiltrados.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  )
}
