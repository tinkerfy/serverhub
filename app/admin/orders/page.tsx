'use client';

import { useState, useEffect } from 'react';
import { getAdminOrders, updateOrderStatus, updatePaymentStatus } from '@/app/actions/admin/dashboard';

interface Order {
  id: number;
  userId: number | null;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  shippingAddressId: number | null;
  billingAddressId: number | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
  userName?: string;
  userEmail?: string;
}

export default function AdminOrdersPage() {
  const [ordersList, setOrdersList] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');
  const [filterPayment, setFilterPayment] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    loadData();
  }, [filterStatus, filterPayment, search]);

  async function loadData() {
    setLoading(true);
    try {
      const result = await getAdminOrders(filterStatus, filterPayment, search);
      setOrdersList(result);
    } catch (err) {
      console.error('Failed to load orders:', err);
    } finally {
      setLoading(false);
    }
  }

  const updateStatus = async (orderId: number, status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') => {
    try {
      await updateOrderStatus(orderId, status);
      loadData();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const updatePaymentStatusAction = async (orderId: number, paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded') => {
    try {
      await updatePaymentStatus(orderId, paymentStatus);
      loadData();
    } catch (err) {
      console.error('Failed to update payment status:', err);
    }
  };

  const statusColors: Record<string, string> = {
    pending: 'bg-warning-background text-warning-foreground',
    processing: 'bg-info-background text-info-foreground',
    shipped: 'bg-purple-background text-purple-foreground',
    delivered: 'bg-success-background text-success-foreground',
    cancelled: 'bg-error-background text-error-foreground',
  };

  const paymentColors: Record<string, string> = {
    pending: 'bg-warning-background text-warning-foreground',
    paid: 'bg-success-background text-success-foreground',
    failed: 'bg-error-background text-error-foreground',
    refunded: 'bg-muted text-muted-foreground',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Orders</h2>
        <p className="text-muted-foreground mt-1">Manage customer orders</p>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Search order number..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-background border border-border text-foreground rounded-lg px-4 py-2 focus:ring-primary focus:border-primary" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-background border border-border text-foreground rounded-lg px-4 py-2 focus:ring-primary focus:border-primary">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)} className="bg-background border border-border text-foreground rounded-lg px-4 py-2 focus:ring-primary focus:border-primary">
            <option value="">All Payments</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                {['Order', 'Customer', 'Date', 'Total', 'Order Status', 'Payment Status'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">Loading...</td></tr>
              ) : ordersList.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">No orders found</td></tr>
              ) : (
                ordersList.map((order) => (
                  <tr key={order.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4 text-foreground font-medium">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div className="text-foreground font-medium">{order.userName || 'Guest'}</div>
                      <div className="text-sm text-muted-foreground">{order.userEmail || '-'}</div>
                    </td>
                    <td className="px-6 py-4 text-foreground">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-foreground font-medium">₱{order.total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled')} className="bg-background border border-border text-foreground rounded px-2 py-1 text-sm focus:ring-primary focus:border-primary">
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <select value={order.paymentStatus} onChange={(e) => updatePaymentStatusAction(order.id, e.target.value as 'pending' | 'paid' | 'failed' | 'refunded')} className="bg-background border border-border text-foreground rounded px-2 py-1 text-sm focus:ring-primary focus:border-primary">
                        <option value="pending">Pending</option>
                        <option value="paid">Paid</option>
                        <option value="failed">Failed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
