'use client'

import { useEffect, useState } from 'react'
import {
  Search,
  Clock,
  Building2,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  Receipt,
  Loader2,
  ExternalLink,
  Banknote
} from 'lucide-react'

interface OrderPayment {
  id: string
  method: string
  amount: string | null
  receiptUrl: string | null
  receiptName: string | null
  status: string
  reference: string | null
  createdAt: string
}

interface ServiceOrder {
  id: string
  orderNumber: string
  serviceTitle: string
  name: string
  email: string
  phone: string | null
  company: string | null
  budget: string | null
  details: string
  status: string
  paymentStatus: string
  adminNotes: string | null
  adminMessage: string | null
  receiptUrl: string | null
  receiptFileName: string | null
  paymentMethod: string | null
  amountPaid: string | null
  createdAt: string
  updatedAt: string
  payments: OrderPayment[]
}

type StatusFilter = 'all' | 'pending' | 'processing' | 'completed' | 'rejected' | 'cancelled'

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/10 text-yellow-500',
  processing: 'bg-blue-500/10 text-blue-500',
  completed: 'bg-green-500/10 text-green-500',
  rejected: 'bg-red-500/10 text-red-500',
  cancelled: 'bg-gray-500/10 text-gray-500',
}

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  unpaid: 'bg-gray-500/10 text-gray-500',
  pending: 'bg-yellow-500/10 text-yellow-500',
  paid: 'bg-green-500/10 text-green-500',
  refunded: 'bg-purple-500/10 text-purple-500',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<ServiceOrder[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filter, setFilter] = useState<StatusFilter>('all')
  const [selectedOrder, setSelectedOrder] = useState<ServiceOrder | null>(null)
  const [acting, setActing] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetchOrders()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/orders?sortBy=createdAt&sortOrder=desc')
      const data = await response.json()
      if (data.success) setOrders(data.data || [])
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateOrder = async (id: string, body: any) => {
    setActing(true)
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      const data = await response.json()
      if (response.ok && data.success) return data.data
      throw new Error(data.error?.message || 'Update failed')
    } finally {
      setActing(false)
    }
  }

  const handleApprove = async (order: ServiceOrder) => {
    const updated = await updateOrder(order.id, {
      approvePayment: true,
      status: 'processing',
      adminMessage: message || undefined,
    })
    if (updated) {
      const msg = message.trim()
      const merged = { ...updated, adminMessage: updated.adminMessage ?? (msg || null) }
      setOrders(orders.map((o) => (o.id === order.id ? merged : o)))
      setSelectedOrder(merged)
      setMessage('')
    }
  }

  const handleReject = async (order: ServiceOrder) => {
    const updated = await updateOrder(order.id, { status: 'rejected', adminMessage: message || undefined })
    if (updated) {
      setOrders(orders.map((o) => (o.id === order.id ? updated : o)))
      setSelectedOrder(updated)
      setMessage('')
    }
  }

  const handleMarkCompleted = async (order: ServiceOrder) => {
    const updated = await updateOrder(order.id, { status: 'completed', paymentStatus: 'paid' })
    if (updated) {
      setOrders(orders.map((o) => (o.id === order.id ? updated : o)))
      setSelectedOrder(updated)
    }
  }

  const filteredOrders = orders.filter((o) => {
    const q = searchQuery.toLowerCase()
    const matchesSearch =
      o.name.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q) ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.serviceTitle.toLowerCase().includes(q) ||
      o.company?.toLowerCase().includes(q)
    const matchesFilter = filter === 'all' || o.status === filter
    return matchesSearch && matchesFilter
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Orders</h1>
        <p className="text-muted-foreground">Review, approve payments, and manage client engagements</p>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-lg p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name, email, reference, service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'pending', 'processing', 'completed', 'rejected', 'cancelled'] as StatusFilter[]).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm capitalize ${filter === f ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
              >
                {f} ({f === 'all' ? orders.length : orders.filter((o) => o.status === f).length})
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders List */}
        <div className="lg:col-span-2 space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-card border rounded-lg p-12 text-center text-muted-foreground">No orders found</div>
          ) : (
            filteredOrders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className={`bg-card border rounded-lg p-6 cursor-pointer transition-colors ${
                  selectedOrder?.id === order.id ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold">{order.name}</h3>
                      <span className="text-xs text-primary font-mono">{order.orderNumber}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{order.email}</p>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[order.status] || 'bg-muted'}`}>
                      {order.status}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${PAYMENT_STATUS_COLORS[order.paymentStatus] || 'bg-muted'}`}>
                      {order.paymentStatus}
                    </span>
                  </div>
                </div>

                <p className="text-sm font-medium mb-2">{order.serviceTitle}</p>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{order.details}</p>

                <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                  {order.company && (
                    <div className="flex items-center gap-1">
                      <Building2 className="w-3 h-3" /> {order.company}
                    </div>
                  )}
                  {order.budget && <div>{order.budget}</div>}
                  {order.receiptUrl && (
                    <div className="flex items-center gap-1 text-green-500">
                      <Receipt className="w-3 h-3" /> Receipt uploaded
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Order Details */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <div className="bg-card border rounded-lg p-6 sticky top-6 space-y-6 max-h-[calc(100vh-120px)] overflow-y-auto">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-xl font-bold">Order Details</h2>
                  <span className="text-sm text-primary font-mono">{selectedOrder.orderNumber}</span>
                </div>
                <p className="text-xs text-muted-foreground">{selectedOrder.serviceTitle}</p>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-2 text-sm font-medium">Client</div>
                <div className="px-4 py-3 space-y-2 text-sm">
                  <div>
                    <span className="text-muted-foreground text-xs">Name</span>
                    <div className="font-medium">{selectedOrder.name}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs">Email</span>
                    <a href={`mailto:${selectedOrder.email}`} className="font-medium text-primary hover:underline flex items-center gap-1">
                      <Mail className="w-3 h-3" /> {selectedOrder.email}
                    </a>
                  </div>
                  {selectedOrder.phone && (
                    <div>
                      <span className="text-muted-foreground text-xs">Phone</span>
                      <div className="font-medium flex items-center gap-1">
                        <Phone className="w-3 h-3" /> {selectedOrder.phone}
                      </div>
                    </div>
                  )}
                  {selectedOrder.company && (
                    <div>
                      <span className="text-muted-foreground text-xs">Company</span>
                      <div className="font-medium">{selectedOrder.company}</div>
                    </div>
                  )}
                  {selectedOrder.budget && (
                    <div>
                      <span className="text-muted-foreground text-xs">Budget</span>
                      <div className="font-medium">{selectedOrder.budget}</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-2 text-sm font-medium">Project Brief</div>
                <div className="px-4 py-3 text-sm bg-muted/30">{selectedOrder.details}</div>
              </div>

              <div className="border rounded-lg overflow-hidden">
                <div className="bg-muted px-4 py-2 text-sm font-medium flex items-center gap-2">
                  <Banknote className="w-4 h-4" /> Payment
                </div>
                <div className="px-4 py-3 space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Method</span>
                    <span className="font-medium capitalize">{selectedOrder.paymentMethod || 'bank_receipt'}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Status</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${PAYMENT_STATUS_COLORS[selectedOrder.paymentStatus] || 'bg-muted'}`}>
                      {selectedOrder.paymentStatus}
                    </span>
                  </div>
                  {selectedOrder.amountPaid && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Amount</span>
                      <span className="font-medium">{selectedOrder.amountPaid}</span>
                    </div>
                  )}
                  {selectedOrder.receiptUrl && (
                    <div>
                      <a
                        href={selectedOrder.receiptUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-2 text-primary hover:underline text-sm"
                      >
                        <ExternalLink className="w-3.5 h-3.5" /> View Receipt
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {selectedOrder.payments && selectedOrder.payments.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-muted px-4 py-2 text-sm font-medium">Payment Records</div>
                  <div className="divide-y">
                    {selectedOrder.payments.map((p) => (
                      <div key={p.id} className="px-4 py-3 text-sm space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-medium capitalize">{p.method.replace('_', ' ')}</span>
                          <span className="text-xs text-muted-foreground">{new Date(p.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{p.reference || 'No reference'}</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${p.status === 'approved' ? 'bg-green-500/10 text-green-500' : p.status === 'rejected' ? 'bg-red-500/10 text-red-500' : 'bg-yellow-500/10 text-yellow-500'}`}>
                            {p.status}
                          </span>
                        </div>
                        {p.receiptUrl && (
                          <a href={p.receiptUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline text-xs inline-flex items-center gap-1">
                            <Receipt className="w-3 h-3" /> Receipt
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Message to client */}
              <div>
                <label className="text-sm font-medium text-muted-foreground">Message to Client (shown on their status page)</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  placeholder="e.g. Your payment has been approved. We'll begin work this week."
                  className="w-full px-3 py-2 border rounded-lg text-sm mt-1 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 border-t pt-4">
                {selectedOrder.paymentStatus !== 'paid' && (
                  <button
                    onClick={() => handleApprove(selectedOrder)}
                    disabled={acting}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-green-500/10 text-green-500 hover:bg-green-500/20 rounded-lg text-sm font-medium disabled:opacity-50"
                  >
                    {acting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                    Approve Payment
                  </button>
                )}
                {selectedOrder.status !== 'rejected' && (
                  <button
                    onClick={() => handleReject(selectedOrder)}
                    disabled={acting}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg font-medium disabled:opacity-50"
                  >
                    <XCircle className="w-4 h-4" /> Reject Order
                  </button>
                )}
                {selectedOrder.status === 'processing' && (
                  <button
                    onClick={() => handleMarkCompleted(selectedOrder)}
                    disabled={acting}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/10 text-primary hover:bg-primary/20 rounded-lg font-medium disabled:opacity-50"
                  >
                    {acting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                    Mark Completed
                  </button>
                )}
              </div>

              <div className="pt-4 border-t text-xs text-muted-foreground space-y-1">
                <div>Placed: {new Date(selectedOrder.createdAt).toLocaleString()}</div>
                <div>Last updated: {new Date(selectedOrder.updatedAt).toLocaleString()}</div>
              </div>
            </div>
          ) : (
            <div className="bg-card border rounded-lg p-12 text-center text-muted-foreground">
              <Receipt className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select an order to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}