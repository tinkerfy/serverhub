'use client';

import type { Metadata } from "next";
import { useState, useActionState } from 'react';
import Footer from '@/app/components/Footer';
import { submitQuoteAction } from '@/app/actions/quote';

const CATEGORIES = [
  { value: 'servers', label: 'Servers' },
  { value: 'storage', label: 'Storage' },
  { value: 'networking', label: 'Networking' },
  { value: 'components', label: 'Components' },
];

const BUDGET_RANGES = [
  { value: 'under-5000', label: 'Under ₱5,000' },
  { value: '5000-15000', label: '₱5,000 – ₱15,000' },
  { value: '15000-50000', label: '₱15,000 – ₱50,000' },
  { value: 'over-50000', label: 'Over ₱50,000' },
  { value: 'flexible', label: 'Flexible' },
];

const STEPS = [
  { title: 'Submit Request', desc: 'Fill out the form with your requirements', icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-2.452 3.543l-1.343 1.343m-3.536-3.536l-1.343 1.343m3.536 3.536l-3.536-3.536m3.536 3.536l3.536 3.536' },
  { title: 'We Review', desc: 'Our team evaluates your needs and sources equipment', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' },
  { title: 'Get Your Quote', desc: 'Receive a custom quote via email within 24 hours', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
];

export default function QuotePage() {
  const [state, formAction, isSubmitting] = useActionState(submitQuoteAction, { success: false, quoteNumber: '' });

  return (
    <div className="min-h-screen bg-background pt-16">
      <main className="pt-16">
        {/* Hero */}
        <section className="bg-primary text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Request a Quote</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Tell us what you need and we&apos;ll get back to you within 24 hours with a custom quote.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              {/* Form */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Your Requirements</h2>
                <form action={formAction} className="space-y-4" aria-label="Quote request form">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-muted-foreground mb-1">First Name</label>
                      <input id="firstName" name="firstName" type="text" required className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" aria-required="true" />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-muted-foreground mb-1">Last Name</label>
                      <input id="lastName" name="lastName" type="text" required className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" aria-required="true" />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                      <input id="email" name="email" type="email" required className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" aria-required="true" />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
                      <input id="phone" name="phone" type="tel" className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-muted-foreground mb-1">Company</label>
                    <input id="company" name="company" type="text" className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                  </div>

                  <div>
                    <label htmlFor="category" className="block text-sm font-medium text-muted-foreground mb-1">Product Category</label>
                    <select id="category" name="category" required className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" aria-required="true">
                      <option value="">Select a category</option>
                      {CATEGORIES.map((cat) => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="specificInterest" className="block text-sm font-medium text-muted-foreground mb-1">Specific Interest</label>
                    <input id="specificInterest" name="specificInterest" type="text" placeholder="e.g., Dell R740, HP DL380, Cisco Switch" className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="quantity" className="block text-sm font-medium text-muted-foreground mb-1">Quantity</label>
                      <input id="quantity" name="quantity" type="number" min="1" defaultValue="1" className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                    </div>
                    <div>
                      <label htmlFor="budgetRange" className="block text-sm font-medium text-muted-foreground mb-1">Budget Range</label>
                      <select id="budgetRange" name="budgetRange" className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                        <option value="">Select budget</option>
                        {BUDGET_RANGES.map((range) => (
                          <option key={range.value} value={range.value}>{range.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-1">Additional Details</label>
                    <textarea id="message" name="message" rows={5} placeholder="Describe your requirements, specifications, or any special requests..." className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Quote Request'}
                  </button>

                  {state.success && (
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg text-green-800 dark:text-green-200">
                      <p className="font-medium">Quote request submitted successfully!</p>
                      <p className="text-sm mt-1">Your quote number is <strong>{state.quoteNumber}</strong>. We&apos;ll send the details to your email within 24 hours.</p>
                    </div>
                  )}
                </form>
              </div>

              {/* Info Panel */}
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Contact Information</h2>
                <div className="space-y-6 mb-8" role="list" aria-label="Contact information">
                  <div className="flex items-start space-x-4" role="listitem">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Phone</h3>
                      <p className="text-muted-foreground">+1 (555) 123-4567</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4" role="listitem">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Email</h3>
                      <p className="text-muted-foreground">sales@serverhub.com</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4" role="listitem">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Business Hours</h3>
                      <p className="text-muted-foreground">Mon-Fri: 8am - 6pm PST<br />Sat: 9am - 2pm PST</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-foreground mb-4">What Happens Next</h3>
                <div className="space-y-4 mb-8">
                  {STEPS.map((step, i) => (
                    <div key={i} className="flex items-start space-x-4">
                      <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                        {i + 1}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{step.title}</p>
                        <p className="text-muted-foreground text-sm">{step.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-muted rounded-lg p-6">
                  <h4 className="font-medium text-foreground mb-3">Why request a quote?</h4>
                  <ul className="space-y-2 text-muted-foreground text-sm">
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <span>No obligation pricing</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <span>Custom server configurations</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <span>Volume discounts available</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <svg className="w-4 h-4 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      <span>Expert technical consultation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="bg-muted py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { icon: 'M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z', title: 'Tell Us What You Need', desc: 'Fill out the form with your requirements and specifications.' },
                { icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', title: 'We Source the Best Equipment', desc: 'Our team evaluates your needs and sources the best available hardware.' },
                { icon: 'M9 12h2m2 0h2m-6-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Receive Your Custom Quote', desc: 'Get a detailed quote with pricing, specs, and delivery timeline.' },
              ].map((step, i) => (
                <div key={i} className="text-center">
                  <div className="w-16 h-16 bg-primary text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={step.icon} />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">Or Browse Available Inventory</h2>
            <a
              href="/inventory"
              className="inline-block px-8 py-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium text-lg"
            >
              View All Products
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
