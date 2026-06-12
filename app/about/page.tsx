import type { Metadata } from "next";
import Footer from '@/app/components/Footer';

export const metadata: Metadata = {
  title: "About ServerHub - Trusted Used Server Equipment Seller Since 2010",
  description: "Learn about ServerHub's mission to make enterprise-grade server equipment accessible. 15+ years experience, 10,000+ units sold, 2-year warranty on all products.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background dark:bg-gray-950 pt-16">
      <main className="pt-16">
        <section className="bg-primary text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-bold mb-4">About ServerHub</h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Your trusted source for certified pre-owned enterprise server equipment since 2010.
            </p>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-foreground mb-6">Our Story</h2>
                <p className="text-muted-foreground mb-4">
                  ServerHub was founded with a simple mission: make enterprise-grade server equipment accessible to businesses of all sizes. We source, test, and certify pre-owned servers from top manufacturers like Dell, HP, Lenovo, and Cisco.
                </p>
                <p className="text-muted-foreground mb-4">
                  Every piece of equipment undergoes a rigorous 50-point inspection process before being listed on our platform. We stand behind our products with comprehensive warranties and dedicated technical support.
                </p>
                <p className="text-muted-foreground">
                  Whether you are building a startup data center or expanding an existing infrastructure, ServerHub delivers the performance you need at a fraction of the retail cost.
                </p>
              </div>
              <div className="bg-muted dark:bg-gray-800 h-80 rounded-lg flex items-center justify-center">
                <span className="text-muted-foreground">Company Photo</span>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-muted dark:bg-gray-800/50 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-foreground mb-12 text-center">By the Numbers</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: '15+', label: 'Years in Business' },
                { value: '10,000+', label: 'Units Sold' },
                { value: '5,000+', label: 'Customers Served' },
                { value: '2-Year', label: 'Warranty Coverage' },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">{stat.value}</div>
                  <div className="text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-foreground mb-8">Browse Our Inventory</h2>
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
