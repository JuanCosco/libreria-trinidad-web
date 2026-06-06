'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/axios'
import { Order } from '@/types'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { generateOrderPDF } from '@/lib/pdf'
import { Download } from 'lucide-react'

const statusOptions = ['PENDING', 'PAID', 'CANCELLED']
const statusLabel: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
    PENDING: { label: 'Pendiente', variant: 'secondary' },
    PAID: { label: 'Pagado', variant: 'default' },
    CANCELLED: { label: 'Cancelado', variant: 'destructive' },
}

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState<Order[]>([])

    const fetchOrders = async () => {
        const { data } = await api.get('/orders')
        setOrders(data.orders)
    }

    useEffect(() => { fetchOrders() }, [])

    const handleStatusChange = async (orderId: string, status: string) => {
        await api.patch(`/orders/${orderId}/status`, { status })
        fetchOrders()
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">Órdenes</h1>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Usuario</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Items</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {orders.map((order) => {
                        const status = statusLabel[order.status] ?? { label: order.status, variant: 'secondary' }
                        return (
                            <TableRow key={order.id}>
                                <TableCell className="font-mono text-xs">{order.id.slice(0, 8)}...</TableCell>
                                <TableCell className="text-sm">{order.payerEmail || '—'}</TableCell>
                                <TableCell className="text-sm">
                                    {new Date(order.fecha).toLocaleDateString('es-PE')}
                                </TableCell>
                                <TableCell>{order.items.length} item(s)</TableCell>
                                <TableCell className="font-semibold">S/ {Number(order.total).toFixed(2)}</TableCell>
                                <TableCell>
                                    <Select value={order.status} onValueChange={(v) => handleStatusChange(order.id, v ?? "")}>
                                        <SelectTrigger className="w-36">
                                            <Badge variant={status.variant}>{status.label}</Badge>
                                        </SelectTrigger>
                                        <SelectContent>
                                            {statusOptions.map((s) => (
                                                <SelectItem key={s} value={s}>{statusLabel[s].label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <Button variant="outline" size="sm" onClick={() => generateOrderPDF(order)}>
                                        <Download className="h-4 w-4 mr-1" />
                                        PDF
                                    </Button>
                                </TableCell>
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </div>
    )
}