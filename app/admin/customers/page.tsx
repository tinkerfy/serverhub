'use client';

import { useState, useEffect } from 'react';
import { getAdminCustomers } from '@/app/actions/admin/dashboard';

interface Customer {
  id: number;
  name: string;
  email: string;
  role: string;
  phone: string | null;
  company: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('');

  useEffect(() => {
    loadData();
  }, [search, filterRole]);

  async function loadData() {
    setLoading(true);
    try {
      const result = await getAdminCustomers(search, filterRole);
      setCustomers(result);
    } catch (err) {
      console.error('Failed to load customers:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Customers</h2>
        <p className="text-muted-foreground mt-1">Manage your customer base</p>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="bg-background border border-border text-foreground rounded-lg px-4 py-2 focus:ring-primary focus:border-primary" />
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)} className="bg-background border border-border text-foreground rounded-lg px-4 py-2 focus:ring-primary focus:border-primary">
            <option value="">All Roles</option>
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted border-b border-border">
              <tr>
                {['Customer', 'Email', 'Company', 'Joined', 'Role'].map((h) => (
                  <th key={h} className="px-6 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">Loading...</td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">No customers found</td></tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="hover:bg-muted/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-medium">{customer.name.charAt(0).toUpperCase()}</div>
                        <span className="text-foreground font-medium">{customer.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-foreground">{customer.email}</td>
                    <td className="px-6 py-4 text-foreground">{customer.company || '-'}</td>
                    <td className="px-6 py-4 text-foreground">{new Date(customer.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-xs rounded-full capitalize font-medium ${customer.role === 'admin' ? 'bg-purple-background text-purple-foreground' : 'bg-muted text-muted-foreground'}`}>{customer.role}</span>
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
