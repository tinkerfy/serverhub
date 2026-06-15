import type { Metadata } from "next";
import Footer from '@/app/components/Footer';

export const metadata: Metadata = {
  title: "Contact ServerHub - Get Support & Sales Inquiry",
  description: "Contact ServerHub for sales inquiries, technical support, or warranty claims. Phone, email, and contact form available. Business hours: Mon-Fri 8am-6pm PST.",
};

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background pt-16">
      <main className="pt-16">
        <section className="bg-primary text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-xl text-blue-100">Have questions? We are here to help.</p>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Send us a Message</h2>
                <form className="space-y-4" aria-label="Contact form">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-muted-foreground mb-1">First Name</label>
                      <input id="firstName" type="text" className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" aria-required="true" />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-muted-foreground mb-1">Last Name</label>
                      <input id="lastName" type="text" className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" aria-required="true" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                    <input id="email" type="email" className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" aria-required="true" />
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-muted-foreground mb-1">Phone</label>
                    <input id="phone" type="tel" className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-muted-foreground mb-1">Company</label>
                    <input id="company" type="text" className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" />
                  </div>
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-muted-foreground mb-1">Subject</label>
                    <select id="subject" className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground">
                      <option>General Inquiry</option>
                      <option>Sales</option>
                      <option>Technical Support</option>
                      <option>Warranty Claim</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-muted-foreground mb-1">Message</label>
                    <textarea id="message" rows={5} className="w-full border border-border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary bg-background text-foreground" aria-required="true" />
                  </div>
                  <button type="submit" className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
                    Send Message
                  </button>
                </form>
              </div>

              <div>
                <h2 className="text-2xl font-bold text-foreground mb-6">Contact Information</h2>
                <div className="space-y-6" role="list" aria-label="Contact information">
                  <div className="flex items-start space-x-4" role="listitem">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
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
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Address</h3>
                      <p className="text-muted-foreground">123 Server Lane<br />San Jose, CA 95134</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-4" role="listitem">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-medium text-foreground">Business Hours</h3>
                      <p className="text-muted-foreground">Mon-Fri: 8am - 6pm PST<br />Sat: 9am - 2pm PST</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-muted py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
            <div className="max-w-3xl mx-auto space-y-4">
              {[
                { q: 'What is your return policy?', a: 'We offer a 30-day return policy on all products. Items must be in original condition.' },
                { q: 'Do you ship internationally?', a: 'Yes, we ship to over 50 countries worldwide. Shipping costs vary by location.' },
                { q: 'What warranty do you offer?', a: 'All products come with a minimum 2-year warranty. Extended warranty options are available.' },
                { q: 'Can I request a custom configuration?', a: 'Contact our sales team and we will help you build a custom server configuration.' },
              ].map((faq, i) => (
                <details key={i} className="bg-card text-card-foreground rounded-lg p-6 border border-border">
                  <summary className="font-medium text-foreground cursor-pointer">{faq.q}</summary>
                  <p className="mt-2 text-muted-foreground">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
