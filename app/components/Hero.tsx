import Link from 'next/link';

export default function Hero() {
  return (
    <section id="home" className="pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-br from-info-bg via-background to-secondary/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-info-background text-info-foreground px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full animate-pulse"></span>
              Certified Pre-Owned Server Equipment
            </div>
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground leading-tight mb-6">
              Premium Used{' '}
              <span className="text-primary">Server</span>
              <br />
              Equipment
            </h1>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Save up to 70% on enterprise-grade server hardware. All equipment is tested and backed by warranty. Dell, HP, Lenovo servers, storage, and networking gear.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/inventory" className="bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors font-semibold text-lg flex items-center gap-2">
                Browse Inventory
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              <button className="border-2 border-border text-foreground px-8 py-3 rounded-lg hover:border-primary hover:text-primary transition-colors font-semibold text-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Watch Demo
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="bg-card text-card-foreground rounded-2xl shadow-2xl border border-border overflow-hidden">
              <div className="bg-muted px-4 py-3 flex items-center gap-2">
                <div className="w-3 h-3 bg-error rounded-full"></div>
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <div className="w-3 h-3 bg-success rounded-full"></div>
                <span className="text-sm text-muted-foreground ml-2">serverhub.com/inventory</span>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="bg-success-background border border-success-background rounded-lg p-4">
                    <div className="text-sm text-success-foreground font-medium">In Stock</div>
                    <div className="text-2xl font-bold text-success-foreground">1,247</div>
                  </div>
                  <div className="bg-info-background border border-info-background rounded-lg p-4">
                    <div className="text-sm text-info-foreground font-medium">Brands</div>
                    <div className="text-2xl font-bold text-info-foreground">12+</div>
                  </div>
                  <div className="bg-secondary/10 border border-secondary/30 rounded-lg p-4">
                    <div className="text-sm text-secondary font-medium">Warranty</div>
                    <div className="text-2xl font-bold text-secondary">3yr</div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm font-medium text-foreground">Dell R740 XL</span>
                    </div>
                    <span className="text-sm text-success font-medium">₱2,499</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm font-medium text-foreground">HP DL380 Gen10</span>
                    </div>
                    <span className="text-sm text-success font-medium">₱2,199</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm font-medium text-foreground">Lenovo SR650</span>
                    </div>
                    <span className="text-sm text-success font-medium">₱1,899</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-success rounded-full"></div>
                      <span className="text-sm font-medium text-foreground">Cisco Nexus 9K</span>
                    </div>
                    <span className="text-sm text-success font-medium">₱3,499</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-primary/20 dark:bg-primary/10 rounded-full opacity-50 blur-xl"></div>
            <div className="absolute -top-4 -left-4 w-32 h-32 bg-secondary/20 dark:bg-secondary/10 rounded-full opacity-50 blur-xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
