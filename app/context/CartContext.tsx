'use client';

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { useSettings } from './SettingsContext';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  condition: string;
  stock: number;
}

interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  tax: number;
  shipping: number;
  grandTotal: number;
}

interface CartContextType {
  cart: CartState;
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
}

const calculateTotals = (items: CartItem[], taxRate: number, freeThreshold: number, shippingCost: number): Pick<CartState, 'totalItems' | 'subtotal' | 'tax' | 'shipping' | 'grandTotal'> => {
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * (taxRate / 100);
  const shipping = subtotal >= freeThreshold ? 0 : shippingCost;
  const grandTotal = subtotal + tax + shipping;
  return { totalItems, subtotal, tax, shipping, grandTotal };
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  const [items, setItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cart');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch {
          return [];
        }
      }
    }
    return [];
  });

  const saveCart = useCallback((cartItems: CartItem[]) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cart', JSON.stringify(cartItems));
    }
  }, []);

  const addItem = useCallback((item: Omit<CartItem, 'quantity'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === item.productId);
      let updated: CartItem[];
      if (existing) {
        updated = prev.map((i) =>
          i.productId === item.productId ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        updated = [...prev, { ...item, quantity: 1 }];
      }
      saveCart(updated);
      return updated;
    });
  }, [saveCart]);

  const removeItem = useCallback((productId: number) => {
    setItems((prev) => {
      const updated = prev.filter((i) => i.productId !== productId);
      saveCart(updated);
      return updated;
    });
  }, [saveCart]);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity < 1) return;
    setItems((prev) => {
      const updated = prev.map((i) =>
        i.productId === productId ? { ...i, quantity: Math.min(quantity, i.stock) } : i
      );
      saveCart(updated);
      return updated;
    });
  }, [saveCart]);

  const clearCart = useCallback(() => {
    setItems([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('cart');
    }
  }, []);

  const totals = calculateTotals(items, settings.taxRate, settings.freeShippingThreshold, settings.standardShipping);

  const cart: CartState = {
    items,
    ...totals,
  };

  return (
    <CartContext.Provider value={{ cart, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
}
