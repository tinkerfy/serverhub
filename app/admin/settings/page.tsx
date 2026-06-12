'use client';

import { useState } from 'react';

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

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Configure your store settings</p>
      </div>

      {saved && (
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg p-4 text-green-800 dark:text-green-300 font-medium">
          Settings saved successfully!
        </div>
      )}

      {/* Store Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Store Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input value={store.name} onChange={(e) => setStore({ ...store, name: e.target.value })} placeholder="Store Name" className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500" />
          <input value={store.email} onChange={(e) => setStore({ ...store, email: e.target.value })} placeholder="Email" className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500" />
          <input value={store.phone} onChange={(e) => setStore({ ...store, phone: e.target.value })} placeholder="Phone" className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500" />
          <input value={store.address} onChange={(e) => setStore({ ...store, address: e.target.value })} placeholder="Address" className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 focus:ring-blue-500 focus:border-blue-500" />
        </div>
      </div>

      {/* Shipping Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Shipping Rates</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Standard (₱)</label>
            <input type="number" value={shipping.standard} onChange={(e) => setShipping({ ...shipping, standard: parseFloat(e.target.value) || 0 })} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 w-full focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Express (₱)</label>
            <input type="number" value={shipping.express} onChange={(e) => setShipping({ ...shipping, express: parseFloat(e.target.value) || 0 })} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 w-full focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Overnight (₱)</label>
            <input type="number" value={shipping.overnight} onChange={(e) => setShipping({ ...shipping, overnight: parseFloat(e.target.value) || 0 })} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 w-full focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Free Shipping Threshold (₱)</label>
            <input type="number" value={shipping.freeThreshold} onChange={(e) => setShipping({ ...shipping, freeThreshold: parseFloat(e.target.value) || 0 })} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 w-full focus:ring-blue-500 focus:border-blue-500" />
          </div>
        </div>
      </div>

      {/* Tax Settings */}
      <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tax Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Tax Rate (%)</label>
            <input type="number" value={tax.rate} onChange={(e) => setTax({ ...tax, rate: parseFloat(e.target.value) || 0 })} className="bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white rounded-lg px-4 py-2 w-full focus:ring-blue-500 focus:border-blue-500" />
          </div>
          <div className="flex items-center gap-3 mt-8">
            <input type="checkbox" checked={tax.inclusive} onChange={(e) => setTax({ ...tax, inclusive: e.target.checked })} className="w-4 h-4 text-blue-600 focus:ring-blue-500 border-gray-300 dark:border-gray-600 rounded" />
            <label className="text-gray-900 dark:text-white font-medium">Tax included in price</label>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSave} className="px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors font-medium">
          Save Settings
        </button>
      </div>
    </div>
  );
}
