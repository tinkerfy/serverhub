'use client';

import { useState, useEffect } from 'react';
import { getAdminOrders, updateOrderStatus } from '@/app/actions/admin/dashboard';

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

  const statusColors: Record<string, string> = {
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    processing: 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300',
    shipped: 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300',
    delivered: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    cancelled: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
  };

  const paymentColors: Record<string, string> = {
    pending: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300',
    paid: 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300',
    failed: 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300',
    refunded: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300',
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Orders</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Manage customer orders</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input type="text" placeholder="Search order number..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500" />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <select value={filterPayment} onChange={(e) => setFilterPayment(e.target.value)} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500">
            <option value="">All Payments</option>
            <option value="pending">Pending</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
              <tr>
                {['Order', 'Customer', 'Date', 'Total', 'Status', 'Payment', 'Actions'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {loading ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">Loading...</td></tr>
              ) : ordersList.length === 0 ? (
                <tr><td colSpan={7} className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">No orders found</td></tr>
              ) : (
                ordersList.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">{order.orderNumber}</td>
                    <td className="px-6 py-4">
                      <div className="text-gray-900 dark:text-white font-medium">{order.userName || 'Guest'}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{order.userEmail || '-'}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-700 dark:text-gray-300">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-gray-900 dark:text-white font-medium">₱{order.total.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full capitalize font-medium ${statusColors[order.status] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}>{order.status}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full capitalize font-medium ${paymentColors[order.paymentStatus] || 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'}`}>{order.paymentStatus}</span>
                    </td>
                    <td className="px-6 py-4">
                      <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value as 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled')} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded px-2 py-1 text-sm focus:ring-blue-500 focus:border-blue-500">
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
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
