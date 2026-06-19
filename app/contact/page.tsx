import type { Metadata } from "next";
import Footer from '@/app/components/Footer';
import StoreInfo from '@/app/components/StoreInfo';

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
                <StoreInfo />
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
