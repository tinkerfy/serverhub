'use client';

import { useCart } from '@/app/context/CartContext';
import Link from 'next/link';

export default function CartPage() {
  const { cart, removeItem, updateQuantity } = useCart();

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Looks like you have not added any items to your cart yet.</p>
          <Link
            href="/inventory"
            className="inline-block px-6 py-3 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Browse Inventory
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Shopping Cart</h1>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          <div className="lg:col-span-7">
            <div className="bg-card text-card-foreground shadow rounded-lg overflow-hidden border border-border">
              <ul className="divide-y divide-border">
                {cart.items.map((item) => (
                  <li key={item.productId} className="p-6 flex items-center space-x-4">
                    <div className="flex-shrink-0 w-24 h-24 bg-muted rounded-md overflow-hidden">
                      {item.image ? (
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      ) : (
                        <span className="text-muted-foreground text-xs">No image</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <Link
                        href={`/products/${item.productId}`}
                        className="text-lg font-medium text-foreground hover:text-primary"
                      >
                        {item.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.condition}</p>
                      <p className="text-sm text-muted-foreground mt-1">₱{item.price.toLocaleString()} each</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-9 h-9 flex items-center justify-center border border-border bg-card text-foreground rounded-md hover:bg-muted text-lg font-bold transition-colors"
                      >
                        −
                      </button>
                      <span className="w-10 text-center font-bold text-foreground text-lg">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-9 h-9 flex items-center justify-center border border-border bg-card text-foreground rounded-md hover:bg-muted text-lg font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <div className="text-right min-w-[100px]">
                      <p className="font-medium text-foreground">
                        ₱{(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-error hover:text-error/80 text-sm"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-6 flex items-center space-x-4">
              <Link
                href="/inventory"
                className="text-sm text-primary hover:text-primary-dark"
              >
                ← Continue Shopping
              </Link>
              <button
                onClick={() => {
                  if (typeof window !== 'undefined') {
                    localStorage.removeItem('cart');
                    window.location.reload();
                  }
                }}
                className="text-sm text-error hover:text-error/80"
              >
                Clear Cart
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="bg-card text-card-foreground shadow rounded-lg p-6 border border-border">
              <h2 className="text-lg font-medium text-foreground mb-4">Order Summary</h2>
              <div className="flow-root">
                <dl className="-my-4 text-sm divide-y divide-border">
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-muted-foreground">Subtotal</dt>
                    <dd className="font-medium text-foreground">₱{cart.subtotal.toLocaleString()}</dd>
                  </div>
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-muted-foreground">Tax (8.5%)</dt>
                    <dd className="font-medium text-foreground">₱{cart.tax.toLocaleString()}</dd>
                  </div>
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-muted-foreground">Shipping</dt>
                    <dd className="font-medium text-foreground">
                      {cart.shipping === 0 ? 'Free' : `₱${cart.shipping}`}
                    </dd>
                  </div>
                  <div className="py-4 flex items-center justify-between">
                    <dt className="text-base font-medium text-foreground">Total</dt>
                    <dd className="text-base font-medium text-foreground">₱{cart.grandTotal.toLocaleString()}</dd>
                  </div>
                </dl>
              </div>

              <div className="mt-6">
                <label htmlFor="promo-code" className="block text-sm font-medium text-foreground mb-1">
                  Promo Code
                </label>
                <div className="flex space-x-2">
                  <input
                    id="promo-code"
                    type="text"
                    className="flex-1 rounded-md border-border bg-card text-foreground shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
                    placeholder="Enter code"
                  />
                  <button className="px-4 py-2 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted">
                    Apply
                  </button>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/checkout"
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark"
                >
                  Proceed to Checkout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
