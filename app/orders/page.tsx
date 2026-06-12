'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/app/context/AuthContext';

interface OrderItem {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  total: number;
}

interface Order {
  id: number;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  createdAt: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    if (user) {
      Promise.all([
        fetch(`/api/user/orders?userId=${user.id}`).then(res => res.json()).catch(() => []),
      ])
        .then(([apiOrders]) => {
          const dbOrders = Array.isArray(apiOrders) ? apiOrders : [];
          
          const localStorageOrders: Order[] = [];
          if (typeof window !== 'undefined') {
            const lastOrderStr = localStorage.getItem('lastOrder');
            if (lastOrderStr) {
              try {
                const orderData = JSON.parse(lastOrderStr);
                const existingOrderIds = new Set(dbOrders.map((o: Order) => o.orderNumber));
                
                if (!existingOrderIds.has(orderData.orderNumber)) {
                  localStorageOrders.push({
                    id: Date.now(),
                    orderNumber: orderData.orderNumber,
                    status: 'pending',
                    paymentStatus: orderData.payment || 'pending',
                    subtotal: Math.floor(orderData.total / 1.085),
                    tax: Math.floor(orderData.total - Math.floor(orderData.total / 1.085)),
                    shippingCost: 0,
                    total: orderData.total,
                    createdAt: new Date().toISOString(),
                    items: (orderData.items || []).map((item: any, i: number) => ({
                      id: i + 1,
                      productId: item.productId,
                      name: item.name,
                      price: item.price,
                      quantity: item.quantity,
                      total: item.price * item.quantity,
                    })),
                  });
                }
              } catch (e) {
                console.error('Failed to parse localStorage order:', e);
              }
            }
          }
          
          const allOrders = [...dbOrders, ...localStorageOrders].sort((a, b) => 
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
          
          setOrders(allOrders);
          setLoading(false);
        })
        .catch(() => {
          const localStorageOrders: Order[] = [];
          if (typeof window !== 'undefined') {
            const lastOrderStr = localStorage.getItem('lastOrder');
            if (lastOrderStr) {
              try {
                const orderData = JSON.parse(lastOrderStr);
                localStorageOrders.push({
                  id: Date.now(),
                  orderNumber: orderData.orderNumber,
                  status: 'pending',
                  paymentStatus: orderData.payment || 'pending',
                  subtotal: Math.floor(orderData.total / 1.085),
                  tax: Math.floor(orderData.total - Math.floor(orderData.total / 1.085)),
                  shippingCost: 0,
                  total: orderData.total,
                  createdAt: new Date().toISOString(),
                  items: (orderData.items || []).map((item: any, i: number) => ({
                    id: i + 1,
                    productId: item.productId,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    total: item.price * item.quantity,
                  })),
                });
              } catch (e) {
                console.error('Failed to parse localStorage order:', e);
              }
            }
          }
          setOrders(localStorageOrders);
          setLoading(false);
        });
    } else if (typeof window !== 'undefined') {
      const lastOrderStr = localStorage.getItem('lastOrder');
      if (lastOrderStr) {
        try {
          const orderData = JSON.parse(lastOrderStr);
          setOrders([{
            id: Date.now(),
            orderNumber: orderData.orderNumber,
            status: 'pending',
            paymentStatus: orderData.payment || 'pending',
            subtotal: Math.floor(orderData.total / 1.085),
            tax: Math.floor(orderData.total - Math.floor(orderData.total / 1.085)),
            shippingCost: 0,
            total: orderData.total,
            createdAt: new Date().toISOString(),
            items: (orderData.items || []).map((item: any, i: number) => ({
              id: i + 1,
              productId: item.productId,
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              total: item.price * item.quantity,
            })),
          }]);
        } catch (e) {
          console.error('Failed to parse localStorage order:', e);
        }
      }
      setLoading(false);
    }
  }, [user]);

  const statusColors: Record<string, string> = {
    pending: 'bg-warning-background border-warning-background text-warning-foreground',
    processing: 'bg-info-background border-info-background text-info-foreground',
    shipped: 'bg-purple-background border-purple-background text-purple-foreground',
    delivered: 'bg-success-background border-success-background text-success-foreground',
    cancelled: 'bg-error-background border-error-background text-error-foreground',
  };

  const paymentColors: Record<string, string> = {
    pending: 'bg-warning-background border-warning-background text-warning-foreground',
    paid: 'bg-success-background border-success-background text-success-foreground',
    failed: 'bg-error-background border-error-background text-error-foreground',
    refunded: 'bg-muted text-muted-foreground',
  };

  const filteredOrders = filterStatus
    ? orders.filter(o => o.status === filterStatus)
    : orders;

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-foreground dark:text-white">My Orders</h1>
          <Link href="/inventory" className="text-primary hover:text-primary-dark font-medium">
            Continue Shopping
          </Link>
        </div>

        {!user ? (
          <div className="bg-card text-card-foreground rounded-lg shadow p-12 text-center border border-border">
            <p className="text-muted-foreground mb-4">Please log in to view your orders</p>
            <Link href="/login" className="text-primary hover:text-primary-dark font-medium">
              Log In →
            </Link>
          </div>
        ) : loading ? (
          <div className="bg-card text-card-foreground rounded-lg shadow p-12 text-center border border-border">
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilterStatus('')}
                className={`px-4 py-2 rounded-lg text-sm font-medium ${filterStatus === '' ? 'bg-primary text-white' : 'bg-card text-muted-foreground border border-border hover:bg-muted'}`}
              >
                All Orders
              </button>
              {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(status => (
                <button
                  key={status}
                  onClick={() => setFilterStatus(status)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium capitalize ${filterStatus === status ? 'bg-primary text-white' : 'bg-card text-muted-foreground border border-border hover:bg-muted'}`}
                >
                  {status}
                </button>
              ))}
            </div>

            {filteredOrders.length === 0 ? (
              <div className="bg-card text-card-foreground rounded-lg shadow p-12 text-center border border-border">
                <p className="text-muted-foreground mb-4">No orders found</p>
                <Link href="/inventory" className="text-primary hover:text-primary-dark font-medium">
                  Browse Inventory →
                </Link>
              </div>
            ) : (
              filteredOrders.map(order => (
                <div key={order.id} className="bg-card text-card-foreground rounded-lg shadow overflow-hidden border border-border">
                  <div className="px-6 py-4 bg-muted border-b border-border flex items-center justify-between">
                    <div>
                      <Link href={`/orders/${order.id}`} className="text-primary hover:text-primary-dark font-medium">
                        {order.orderNumber}
                      </Link>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-2 py-1 text-xs rounded-full capitalize border ${statusColors[order.status] || 'bg-muted text-muted-foreground'}`}>
                        {order.status}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded-full capitalize border ${paymentColors[order.paymentStatus] || 'bg-muted text-muted-foreground'}`}>
                        {order.paymentStatus}
                      </span>
                    </div>
                  </div>
                  <div className="px-6 py-4">
                    <div className="space-y-2 mb-4">
                      {order.items?.slice(0, 3).map(item => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-muted-foreground">{item.name} x{item.quantity}</span>
                          <span className="text-foreground font-medium">₱{item.total.toLocaleString()}</span>
                        </div>
                      ))}
                      {order.items?.length > 3 && (
                        <p className="text-sm text-muted-foreground">+{order.items.length - 3} more items</p>
                      )}
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <Link href={`/orders/${order.id}`} className="text-primary hover:text-primary-dark text-sm font-medium">
                        View Details →
                      </Link>
                      <span className="text-lg font-bold text-foreground">₱{order.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
