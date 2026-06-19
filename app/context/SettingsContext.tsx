'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Settings {
  storeName: string;
  storeEmail: string;
  storePhone: string;
  storeAddress: string;
  standardShipping: number;
  expressShipping: number;
  overnightShipping: number;
  freeShippingThreshold: number;
  taxRate: number;
  taxInclusive: boolean;
}

const defaultSettings: Settings = {
  storeName: 'ServerHub',
  storeEmail: 'admin@serverhub.com',
  storePhone: '+1 (555) 123-4567',
  storeAddress: '123 Server Lane, San Jose, CA 95134',
  standardShipping: 150,
  expressShipping: 250,
  overnightShipping: 400,
  freeShippingThreshold: 5000,
  taxRate: 8.5,
  taxInclusive: false,
};

const SettingsContext = createContext<{ settings: Settings; loading: boolean }>({
  settings: defaultSettings,
  loading: true,
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/settings')
      .then((res) => res.json())
      .then((data) => {
        if (!data.error) {
          setSettings({
            storeName: data.storeName || defaultSettings.storeName,
            storeEmail: data.storeEmail || defaultSettings.storeEmail,
            storePhone: data.storePhone || defaultSettings.storePhone,
            storeAddress: data.storeAddress || defaultSettings.storeAddress,
            standardShipping: parseFloat(data.standardShipping) || defaultSettings.standardShipping,
            expressShipping: parseFloat(data.expressShipping) || defaultSettings.expressShipping,
            overnightShipping: parseFloat(data.overnightShipping) || defaultSettings.overnightShipping,
            freeShippingThreshold: parseFloat(data.freeShippingThreshold) || defaultSettings.freeShippingThreshold,
            taxRate: parseFloat(data.taxRate) || defaultSettings.taxRate,
            taxInclusive: data.taxInclusive ?? defaultSettings.taxInclusive,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
