'use client'
import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import { Book } from '@/types'
import BookCard from '@/components/books/BookCard'

export default function Home() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/books')
      .then(({ data }) => setBooks(data.books))
      .catch((error) => console.error("Error al cargar libros:", error))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">Cargando catálogo...</p>
      </div>
    )
  }

  if (books.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">No hay libros disponibles.</p>
      </div>
    )
  }


  return (
    <div>
      <h1 className="text-3xl font-bold mb-2">Catálogo</h1>
      <p className="text-muted-foreground mb-8">
        {books.length} libro(s) disponible(s)
      </p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((book) => (
          <BookCard key={book.id} book={book} />
        ))}
      </div>
    </div>
  );
}
