'use client';

import { useState, useEffect } from 'react';
import { getAdminAnalytics } from '@/app/actions/admin/dashboard';

interface AnalyticsData {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  topCustomers: { name: string; total: number; orders: number }[];
  lowStockProducts: { name: string; stock: number }[];
  monthlyRevenue: { month: string; revenue: number }[];
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrderValue: 0,
    topCustomers: [],
    lowStockProducts: [],
    monthlyRevenue: [],
  });
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<'30' | '90' | '365'>('30');

  useEffect(() => {
    loadData();
  }, [dateRange]);

  async function loadData() {
    setLoading(true);
    try {
      const result = await getAdminAnalytics(parseInt(dateRange));
      setData(result);
    } catch (err) {
      console.error('Failed to load analytics:', err);
    } finally {
      setLoading(false);
    }
  }

  const maxRevenue = Math.max(...data.monthlyRevenue.map((m) => m.revenue), 1);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-muted-foreground">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
          <p className="text-muted-foreground mt-1">Business performance overview</p>
        </div>
        <div className="flex gap-2">
          {(['30', '90', '365'] as const).map((range) => (
            <button key={range} onClick={() => setDateRange(range)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${dateRange === range ? 'bg-primary text-white' : 'bg-card text-foreground border border-border hover:bg-muted'}`}>Last {range} days</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-3xl font-bold text-foreground mt-2">₱{data.totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="text-3xl font-bold text-foreground mt-2">{data.totalOrders}</p>
        </div>
        <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
          <p className="text-sm text-muted-foreground">Customers</p>
          <p className="text-3xl font-bold text-foreground mt-2">{data.totalCustomers}</p>
        </div>
        <div className="bg-card rounded-lg p-6 border border-border shadow-sm">
          <p className="text-sm text-muted-foreground">Avg Order Value</p>
          <p className="text-3xl font-bold text-foreground mt-2">₱{data.averageOrderValue.toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Revenue Trend</h3>
        {data.monthlyRevenue.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No revenue data available</p>
        ) : (
          <div className="flex items-end gap-4 h-48">
            {data.monthlyRevenue.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full bg-primary rounded-t transition-all" style={{ height: `${(m.revenue / maxRevenue) * 100}%`, minHeight: '4px' }} />
                <span className="text-xs text-muted-foreground">{m.month}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card rounded-lg border border-border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Top Customers</h3>
          {data.topCustomers.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No customer data</p>
          ) : (
            <div className="space-y-3">
              {data.topCustomers.map((c, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-medium">{i + 1}</span>
                    <span className="text-foreground font-medium">{c.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-foreground font-medium">₱{c.total.toLocaleString()}</span>
                    <span className="text-muted-foreground text-sm ml-2">({c.orders} orders)</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-card rounded-lg border border-border shadow-sm p-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Low Stock Alert</h3>
          {data.lowStockProducts.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">All products well stocked</p>
          ) : (
            <div className="space-y-3">
              {data.lowStockProducts.map((p, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-foreground font-medium">{p.name}</span>
                  <span className="px-2 py-1 bg-warning-background text-warning-foreground rounded text-sm font-medium">{p.stock} units</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
