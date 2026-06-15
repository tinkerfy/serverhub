'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
}

interface LastOrder {
  orderNumber: string;
  items: OrderItem[];
  total: number;
}

export default function ConfirmationPage() {
  const [order, setOrder] = useState<LastOrder | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('lastOrder');
      if (saved) {
        setOrder(JSON.parse(saved));
      }
    }
  }, []);

  const handleContinueShopping = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lastOrder');
    }
  };

  return (
    <div className="min-h-screen bg-background pt-20 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-card text-card-foreground shadow rounded-lg p-8 text-center border border-border">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-success-background mb-6">
            <svg className="h-8 w-8 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-6">Thank you for your purchase.</p>
          {order && (
            <>
              <div className="bg-muted rounded-lg p-4 mb-6">
                <p className="text-sm text-muted-foreground">Order Number</p>
                <p className="text-xl font-bold text-foreground">{order.orderNumber}</p>
              </div>

              <div className="bg-muted rounded-lg p-4 mb-6 text-left">
                <h3 className="text-lg font-semibold text-foreground mb-3">Order Items</h3>
                <ul className="divide-y divide-border">
                  {order.items.map((item: OrderItem, index: number) => (
                    <li key={index} className="py-3 flex justify-between">
                      <span className="text-muted-foreground">{item.name} x{item.quantity}</span>
                      <span className="font-medium text-foreground">₱{(item.price * item.quantity).toLocaleString()}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-4 border-t border-border text-right">
                  <span className="text-lg font-bold text-foreground">Total: ₱{order.total.toLocaleString()}</span>
                </div>
              </div>
            </>
          )}

          <div className="space-x-4">
            <Link
              href="/inventory"
              onClick={handleContinueShopping}
              className="inline-block px-6 py-3 border border-border rounded-md text-sm font-medium text-muted-foreground hover:bg-muted"
            >
              Continue Shopping
            </Link>
            <Link
              href="/orders"
              className="inline-block px-6 py-3 bg-primary text-white rounded-md text-sm font-medium hover:bg-primary-dark"
            >
              View Order Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
