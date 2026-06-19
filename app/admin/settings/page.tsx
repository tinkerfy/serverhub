'use client';

import { useState, useEffect } from 'react';

export default function AdminSettingsPage() {
  const [store, setStore] = useState({
    name: 'ServerHub',
    email: 'admin@serverhub.com',
    phone: '+1 (555) 123-4567',
    address: '123 Server Lane, San Jose, CA 95134',
  });
  const [shipping, setShipping] = useState({
    standard: 150,
    express: 250,
    overnight: 400,
    freeThreshold: 5000,
  });
  const [tax, setTax] = useState({
    rate: 8.5,
    inclusive: false,
  });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
        } else if (data) {
          setStore({
            name: data.storeName || 'ServerHub',
            email: data.storeEmail || 'admin@serverhub.com',
            phone: data.storePhone || '+1 (555) 123-4567',
            address: data.storeAddress || '123 Server Lane, San Jose, CA 95134',
          });
          setShipping({
            standard: parseFloat(data.standardShipping) || 150,
            express: parseFloat(data.expressShipping) || 250,
            overnight: parseFloat(data.overnightShipping) || 400,
            freeThreshold: parseFloat(data.freeShippingThreshold) || 5000,
          });
          setTax({
            rate: parseFloat(data.taxRate) || 8.5,
            inclusive: data.taxInclusive || false,
          });
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeName: store.name,
          storeEmail: store.email,
          storePhone: store.phone,
          storeAddress: store.address,
          standardShipping: shipping.standard,
          expressShipping: shipping.express,
          overnightShipping: shipping.overnight,
          freeShippingThreshold: shipping.freeThreshold,
          taxRate: tax.rate,
          taxInclusive: tax.inclusive,
        }),
      });

      const data = await res.json();
      if (data.error) {
        setError(data.error);
      } else {
        setSaved(true);
        setTimeout(() => setSaved(false), 2000);
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setError('Failed to save settings. Please check your database connection.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="space-y-6">Loading...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Settings</h2>
        <p className="text-muted-foreground mt-1">Configure your store settings</p>
      </div>

      {saved && (
        <div className="bg-success-background border border-success-background rounded-lg p-4 text-success-foreground font-medium">
          Settings saved successfully!
        </div>
      )}

      {error && (
        <div className="bg-error-background border border-error-background rounded-lg p-4 text-error-foreground font-medium">
          {error}
        </div>
      )}

      {/* Store Settings */}
      <div className="bg-card rounded-lg border border-border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Store Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={store.name} onChange={(e) => setStore({ ...store, name: e.target.value })} placeholder="Store Name" className="bg-background border border-border text-foreground rounded-lg px-4 py-2 focus:ring-primary focus:border-primary" />
          <input value={store.email} onChange={(e) => setStore({ ...store, email: e.target.value })} placeholder="Email" className="bg-background border border-border text-foreground rounded-lg px-4 py-2 focus:ring-primary focus:border-primary" />
          <input value={store.phone} onChange={(e) => setStore({ ...store, phone: e.target.value })} placeholder="Phone" className="bg-background border border-border text-foreground rounded-lg px-4 py-2 focus:ring-primary focus:border-primary" />
          <input value={store.address} onChange={(e) => setStore({ ...store, address: e.target.value })} placeholder="Address" className="bg-background border border-border text-foreground rounded-lg px-4 py-2 focus:ring-primary focus:border-primary" />
        </div>
      </div>

      {/* Shipping Settings */}
      <div className="bg-card rounded-lg border border-border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Shipping Rates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Standard (₱)</label>
            <input type="number" value={shipping.standard} onChange={(e) => setShipping({ ...shipping, standard: parseFloat(e.target.value) || 0 })} className="bg-background border border-border text-foreground rounded-lg px-4 py-2 w-full focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Express (₱)</label>
            <input type="number" value={shipping.express} onChange={(e) => setShipping({ ...shipping, express: parseFloat(e.target.value) || 0 })} className="bg-background border border-border text-foreground rounded-lg px-4 py-2 w-full focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Overnight (₱)</label>
            <input type="number" value={shipping.overnight} onChange={(e) => setShipping({ ...shipping, overnight: parseFloat(e.target.value) || 0 })} className="bg-background border border-border text-foreground rounded-lg px-4 py-2 w-full focus:ring-primary focus:border-primary" />
          </div>
          <div>
            <label className="block text-xs font-medium text-muted-foreground mb-1">Free Shipping Threshold (₱)</label>
            <input type="number" value={shipping.freeThreshold} onChange={(e) => setShipping({ ...shipping, freeThreshold: parseFloat(e.target.value) || 0 })} className="bg-background border border-border text-foreground rounded-lg px-4 py-2 w-full focus:ring-primary focus:border-primary" />
          </div>
        </div>
      </div>

      {/* Tax Settings */}
      <div className="bg-card rounded-lg border border-border shadow-sm p-6">
        <h3 className="text-lg font-semibold text-foreground mb-4">Tax Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1">Tax Rate (%)</label>
            <input type="number" value={tax.rate} onChange={(e) => setTax({ ...tax, rate: parseFloat(e.target.value) || 0 })} className="bg-background border border-border text-foreground rounded-lg px-4 py-2 w-full focus:ring-primary focus:border-primary" />
          </div>
          <div className="flex items-center gap-3 mt-8">
            <input type="checkbox" checked={tax.inclusive} onChange={(e) => setTax({ ...tax, inclusive: e.target.checked })} className="w-4 h-4 text-primary focus:ring-primary border-border rounded" />
            <label className="text-foreground font-medium">Tax included in price</label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSave} disabled={saving} className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed">
          {saving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}
