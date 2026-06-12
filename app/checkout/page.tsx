'use client';

import { useState, useEffect, use } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/app/context/AuthContext';
import { useCart } from '@/app/context/CartContext';

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  condition: string;
  stock: number;
}

export default function CheckoutPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const { cart, addItem } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const params = use(searchParams);
  const queryString = new URLSearchParams(params).toString();
  const searchParamsObj = useSearchParams();

  const [shipping, setShipping] = useState({
    fullName: '',
    email: '',
    phone: '',
    company: '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
    shippingMethod: 'standard',
  });

  const [payment, setPayment] = useState({
    cardNumber: '',
    expiry: '',
    cvv: '',
    cardholder: '',
    sameAsShipping: true,
    billingStreet: '',
    billingCity: '',
    billingState: '',
    billingZip: '',
    paymentMethod: 'credit_card',
  });

  const [review, setReview] = useState({
    termsAccepted: false,
  });

  useEffect(() => {
    const productId = searchParamsObj.get('add');
    if (productId) {
      fetch(`/api/cart/add?id=${productId}`)
        .then(res => res.json())
        .then((product: Product) => {
          addItem({
            productId: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            condition: product.condition,
            stock: product.stock,
          });
          router.replace('/checkout');
        })
        .catch(err => console.error('Failed to add product:', err));
    }
  }, [searchParamsObj]);

  const handleNext = () => {
    if (step === 1) setStep(2);
    else if (step === 2) setStep(3);
    else if (step === 3) handlePlaceOrder();
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    if (!review.termsAccepted) return;
    setLoading(true);
    
    if (!user) {
      router.push('/login');
      return;
    }
    
    let orderNumber = 'SH-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 9000 + 1000);
    
    try {
      const orderResponse = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          items: cart.items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
          })),
          subtotal: cart.subtotal,
          tax: cart.tax,
          shippingCost: cart.shipping,
          total: cart.grandTotal,
          shippingAddress: shipping,
          paymentMethod: payment.paymentMethod,
        }),
      });
      
      if (orderResponse.ok) {
        const orderData = await orderResponse.json();
        orderNumber = orderData.orderNumber || orderNumber;
      }
    } catch (error) {
      console.error('Order creation failed:', error);
    } finally {
      if (typeof window !== 'undefined') {
        localStorage.setItem('lastOrder', JSON.stringify({
          orderNumber: orderNumber,
          items: cart.items,
          total: cart.grandTotal,
          shipping,
          payment: 'pending',
        }));
        
        localStorage.removeItem('cart');
      }
      
      setTimeout(() => {
        router.push('/confirmation');
      }, 1000);
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-950 pt-20">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Your cart is empty</h2>
          <a href="/inventory" className="text-primary hover:text-primary-dark">
            Browse Inventory →
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-950 pt-20 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Checkout</h1>

        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= s ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {s}
                </div>
                <span className={`ml-2 text-sm ${step >= s ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {s === 1 ? 'Shipping' : s === 2 ? 'Payment' : 'Review'}
                </span>
                {s < 3 && (
                  <div className={`w-16 h-0.5 mx-4 ${step > s ? 'bg-primary' : 'bg-border'}`} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">
          <div className="lg:col-span-7">
            {step === 1 && (
              <div className="bg-card text-card-foreground shadow rounded-lg p-6 space-y-6 border border-border">
                <h2 className="text-lg font-medium text-foreground">Shipping Information</h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground">Full Name</label>
                    <input
                      type="text"
                      value={shipping.fullName}
                      onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })}
                      className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground">Email</label>
                    <input
                      type="email"
                      value={shipping.email}
                      onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                      className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">Phone</label>
                    <input
                      type="tel"
                      value={shipping.phone}
                      onChange={(e) => setShipping({ ...shipping, phone: e.target.value })}
                      className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">Company (optional)</label>
                    <input
                      type="text"
                      value={shipping.company}
                      onChange={(e) => setShipping({ ...shipping, company: e.target.value })}
                      className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground">Street Address</label>
                    <input
                      type="text"
                      value={shipping.street}
                      onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                      className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">City</label>
                    <input
                      type="text"
                      value={shipping.city}
                      onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                      className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">State</label>
                    <input
                      type="text"
                      value={shipping.state}
                      onChange={(e) => setShipping({ ...shipping, state: e.target.value })}
                      className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">ZIP</label>
                    <input
                      type="text"
                      value={shipping.zip}
                      onChange={(e) => setShipping({ ...shipping, zip: e.target.value })}
                      className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground">Country</label>
                    <select
                      value={shipping.country}
                      onChange={(e) => setShipping({ ...shipping, country: e.target.value })}
                      className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-foreground mb-2">Shipping Method</label>
                    <div className="space-y-2">
                      {['standard', 'express', 'overnight'].map((method) => (
                        <label key={method} className="flex items-center">
                          <input
                            type="radio"
                            name="shipping"
                            value={method}
                            checked={shipping.shippingMethod === method}
                            onChange={(e) => setShipping({ ...shipping, shippingMethod: e.target.value })}
                            className="h-4 w-4 text-primary focus:ring-primary border-border"
                          />
                          <span className="ml-2 text-sm text-foreground capitalize">
                            {method} ({method === 'standard' ? '5-7 days' : method === 'express' ? '2-3 days' : 'Next day'})
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="bg-card text-card-foreground shadow rounded-lg p-6 space-y-6 border border-border">
                <h2 className="text-lg font-medium text-foreground">Payment Information</h2>
                <div className="space-y-4">
                  {['credit_card', 'wire_transfer', 'purchase_order'].map((method) => (
                    <label key={method} className="flex items-center p-4 border border-border bg-card rounded-md cursor-pointer">
                      <input
                        type="radio"
                        name="payment"
                        value={method}
                        checked={payment.paymentMethod === method}
                        onChange={(e) => setPayment({ ...payment, paymentMethod: e.target.value })}
                        className="h-4 w-4 text-primary focus:ring-primary border-border"
                      />
                      <span className="ml-2 text-sm text-foreground capitalize">{method.replace('_', ' ')}</span>
                    </label>
                  ))}
                </div>
                {payment.paymentMethod === 'credit_card' && (
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 pt-4">
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-foreground">Card Number</label>
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        value={payment.cardNumber}
                        onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
                        className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground">Expiry</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={payment.expiry}
                        onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
                        className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={payment.cvv}
                        onChange={(e) => setPayment({ ...payment, cvv: e.target.value })}
                        className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-foreground">Cardholder Name</label>
                      <input
                        type="text"
                        value={payment.cardholder}
                        onChange={(e) => setPayment({ ...payment, cardholder: e.target.value })}
                        className="mt-1 block w-full border border-border bg-card text-foreground rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {step === 3 && (
              <div className="bg-card text-card-foreground shadow rounded-lg p-6 space-y-6 border border-border">
                <h2 className="text-lg font-medium text-foreground">Review Your Order</h2>
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-foreground">Shipping Address</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {shipping.fullName}<br />
                      {shipping.street}<br />
                      {shipping.city}, {shipping.state} {shipping.zip}<br />
                      {shipping.country}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">Payment Method</h3>
                    <p className="text-sm text-muted-foreground mt-1 capitalize">{payment.paymentMethod.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-foreground">Items</h3>
                    <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                      {cart.items.map((item) => (
                        <li key={item.productId}>
                          {item.name} x{item.quantity} - ₱{(item.price * item.quantity).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center">
                    <input
                      id="terms"
                      type="checkbox"
                      checked={review.termsAccepted}
                      onChange={(e) => setReview({ ...review, termsAccepted: e.target.checked })}
                      className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                    />
                    <label htmlFor="terms" className="ml-2 block text-sm text-foreground">
                      I agree to the Terms & Conditions
                    </label>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-6 flex justify-between">
              {step > 1 ? (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 border border-border rounded-md text-sm font-medium text-foreground hover:bg-muted"
                >
                  Back
                </button>
              ) : (
                <div />
              )}
              <button
                onClick={handleNext}
                disabled={loading || (step === 3 && !review.termsAccepted)}
                className="px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
              >
                {step === 3 ? 'Place Order' : 'Next'}
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 mt-8 lg:mt-0">
            <div className="bg-card text-card-foreground shadow rounded-lg p-6 sticky top-4 border border-border">
              <h2 className="text-lg font-medium text-foreground mb-4">Order Summary</h2>
              <ul className="divide-y divide-border text-sm">
                {cart.items.map((item) => (
                  <li key={item.productId} className="py-3 flex justify-between">
                    <span className="text-muted-foreground">{item.name} x{item.quantity}</span>
                    <span className="font-medium text-foreground">₱{(item.price * item.quantity).toLocaleString()}</span>
                  </li>
                ))}
              </ul>
              <dl className="mt-4 space-y-2 text-sm">
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Subtotal</dt>
                  <dd className="font-medium text-foreground">₱{cart.subtotal.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Tax</dt>
                  <dd className="font-medium text-foreground">₱{cart.tax.toLocaleString()}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-muted-foreground">Shipping</dt>
                  <dd className="font-medium text-foreground">{cart.shipping === 0 ? 'Free' : `₱${cart.shipping}`}</dd>
                </div>
                <div className="flex justify-between text-base font-medium pt-2 border-t border-border">
                  <dt className="text-foreground">Total</dt>
                  <dd className="text-foreground">₱{cart.grandTotal.toLocaleString()}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
