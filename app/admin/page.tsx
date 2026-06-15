'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAdminDashboardStats } from '@/app/actions/admin/dashboard';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  lowStockItems: number;
  todayOrders: number;
  recentOrders: any[];
  recentCustomers: any[];
}

export default function AdminHomePage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    lowStockItems: 0,
    todayOrders: 0,
    recentOrders: [],
    recentCustomers: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAdminDashboardStats().then(setStats).finally(() => setLoading(false));
  }, []);

  const statCards = [
    { label: 'Total Revenue', value: `₱${stats.totalRevenue.toLocaleString()}`, color: 'bg-success', icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Total Orders', value: stats.totalOrders.toString(), color: 'bg-primary', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 002-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
    { label: 'Customers', value: stats.totalCustomers.toString(), color: 'bg-purple', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
    { label: 'Products', value: stats.totalProducts.toString(), color: 'bg-secondary', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  ];

  const statusColors: Record<string, string> = {
    pending: 'bg-warning-background text-warning-foreground',
    processing: 'bg-info-background text-info-foreground',
    shipped: 'bg-purple-background text-purple-foreground',
    delivered: 'bg-success-background text-success-foreground',
    cancelled: 'bg-error-background text-error-foreground',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat) => (
          <div key={stat.label} className="bg-card rounded-lg p-6 border border-border shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
              </div>
              <div className={`${stat.color} p-3 rounded-lg`}>
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={stat.icon} />
                </svg>
              </div>
            </div>
          </div>
        ))}
      </div>

      {stats.lowStockItems > 0 && (
        <div className="bg-warning-background border border-warning-background rounded-lg p-4">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="text-warning-foreground font-medium">
              {stats.lowStockItems} product(s) with low stock (below 10 units)
            </span>
            <Link href="/admin/products" className="ml-auto text-warning hover:text-warning-dark text-sm font-medium">
              View Products →
            </Link>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border shadow-sm">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Recent Orders</h2>
              <Link href="/admin/orders" className="text-primary hover:text-primary-dark text-sm font-medium">View All →</Link>
            </div>
          </div>
          <div className="divide-y divide-border">
            {stats.recentOrders.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">No orders yet</div>
            ) : (
              stats.recentOrders.map((order: any) => (
                <div key={order.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                  <div>
                    <p className="text-foreground font-medium">{order.orderNumber}</p>
                    <p className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-foreground font-medium">₱{parseFloat(order.total).toLocaleString()}</p>
                    <span className={`inline-block px-2 py-1 text-xs rounded-full ${statusColors[order.status] || 'bg-muted text-muted-foreground'}`}>{order.status}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="bg-card rounded-lg border border-border shadow-sm">
          <div className="p-6 border-b border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">Recent Customers</h2>
              <Link href="/admin/customers" className="text-primary hover:text-primary-dark text-sm font-medium">View All →</Link>
            </div>
          </div>
          <div className="divide-y divide-border">
            {stats.recentCustomers.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground">No customers yet</div>
            ) : (
              stats.recentCustomers.map((customer: any) => (
                <div key={customer.id} className="p-4 flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">{customer.name.charAt(0).toUpperCase()}</div>
                  <div className="flex-1">
                    <p className="text-foreground font-medium">{customer.name}</p>
                    <p className="text-sm text-muted-foreground">{customer.email}</p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full capitalize">{customer.role}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link href="/admin/products" className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium">+ Add Product</Link>
          <Link href="/admin/orders" className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium">View Orders</Link>
          <Link href="/admin/analytics" className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium">View Analytics</Link>
          <Link href="/admin/settings" className="px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-colors font-medium">Settings</Link>
        </div>
      </div>
    </div>
  );
}
