'use client'

import React, { useEffect, useState } from 'react'
import api from '@/lib/axios'
import { Book, Category } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { Badge } from '@/components/ui/badge'
import { Plus, Pencil, Trash2 } from 'lucide-react'

const emptyForm = { nombre: '', descripcion: '', precio: '', descuento: '0', categoryId: '' }

export default function AdminBooksPage() {
    const [books, setBooks] = useState<Book[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [form, setForm] = useState(emptyForm)
    const [editing, setEditing] = useState<string | null>(null)
    const [open, setOpen] = useState(false)

    const fetchBooks = async () => {
        const { data } = await api.get('/books')
        setBooks(data.books)
    }

    const fetchCategories = async () => {
        const { data } = await api.get('/categories')
        setCategories(data.categories)
    }

    useEffect(() => {
        fetchBooks()
        fetchCategories()
    }, [])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const payload = {
            nombre: form.nombre,
            descripcion: form.descripcion,
            precio: parseFloat(form.precio),
            descuento: parseFloat(form.descuento),
            categoryId: form.categoryId,
        }
        if (editing) {
            await api.patch(`/books/${editing}`, payload)
        } else {
            await api.post('/books', payload)
        }
        setForm(emptyForm)
        setEditing(null)
        setOpen(false)
        fetchBooks()
    }

    const handleEdit = (book: Book) => {
        setForm({
            nombre: book.nombre,
            descripcion: book.descripcion,
            precio: String(book.precio),
            descuento: String(book.descuento),
            categoryId: book.categoryId,
        })
        setEditing(book.id)
        setOpen(true)
    }

    const handleDelete = async (id: string) => {
        await api.delete(`/books/${id}`)
        fetchBooks()
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold">Libros</h1>
                <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) { setForm(emptyForm); setEditing(null) } }}>
                    <DialogTrigger className="inline-flex items-center gap-1 text-sm px-3 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                        <Plus className="h-4 w-4" />
                        Nuevo libro
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>{editing ? 'Editar libro' : 'Nuevo libro'}</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label>Nombre</Label>
                                <Input value={form.nombre} onChange={(e) => setForm({ ...form, nombre: e.target.value })} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Descripción</Label>
                                <Textarea value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Precio (S/)</Label>
                                    <Input type="number" step="0.01" value={form.precio} onChange={(e) => setForm({ ...form, precio: e.target.value })} required />
                                </div>
                                <div className="space-y-2">
                                    <Label>Descuento (%)</Label>
                                    <Input type="number" min="0" max="100" value={form.descuento} onChange={(e) => setForm({ ...form, descuento: e.target.value })} />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label>Categoría</Label>
                                <Select value={form.categoryId} onValueChange={(v) => setForm({ ...form, categoryId: v ?? "" })}>
                                    <SelectTrigger><SelectValue placeholder="Selecciona una categoría" /></SelectTrigger>
                                    <SelectContent>
                                        {categories.map((cat) => (
                                            <SelectItem key={cat.id} value={cat.id}>{cat.nombre}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button type="submit" className="w-full">{editing ? 'Guardar cambios' : 'Crear libro'}</Button>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Categoría</TableHead>
                        <TableHead>Precio</TableHead>
                        <TableHead>Descuento</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {books.map((book) => (
                        <TableRow key={book.id}>
                            <TableCell className="font-medium">{book.nombre}</TableCell>
                            <TableCell>{book.category.nombre}</TableCell>
                            <TableCell>S/ {Number(book.precio).toFixed(2)}</TableCell>
                            <TableCell>{book.descuento > 0 ? <Badge variant="destructive">-{book.descuento}%</Badge> : '—'}</TableCell>
                            <TableCell>
                                <Badge variant={book.activo ? 'default' : 'secondary'}>
                                    {book.activo ? 'Activo' : 'Inactivo'}
                                </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-end gap-2">
                                    <Button variant="ghost" size="icon" onClick={() => handleEdit(book)}>
                                        <Pencil className="h-4 w-4" />
                                    </Button>
                                    <AlertDialog>
                                        <AlertDialogTrigger className="inline-flex items-center justify-center h-9 w-9 rounded-md text-destructive hover:bg-muted transition-colors">
                                                <Trash2 className="h-4 w-4" />
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>¿Desactivar libro?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    El libro no aparecerá en el catálogo pero no se eliminará de la base de datos.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDelete(book.id)}>Desactivar</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}