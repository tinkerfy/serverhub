export default function DashboardPreview() {
  return (
    <section className="py-20 bg-gradient-to-br from-primary to-primary-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
            Quality Assurance Process
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Every piece of equipment goes through a rigorous 50-point inspection before it reaches you.
          </p>
        </div>
        <div className="relative">
          <div className="bg-card text-card-foreground rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-muted px-4 py-3 flex items-center gap-2 border-b border-border">
              <div className="flex gap-2">
                <div className="w-3 h-3 bg-error rounded-full"></div>
                <div className="w-3 h-3 bg-warning rounded-full"></div>
                <div className="w-3 h-3 bg-success rounded-full"></div>
              </div>
              <div className="flex-1 flex justify-center">
                <div className="bg-background px-4 py-1 rounded text-sm text-muted-foreground">serverhub.com/quality</div>
              </div>
            </div>
            <div className="p-6 md:p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                  { label: 'Inspection Points', value: '50+', color: 'blue' },
                  { label: 'Pass Rate', value: '99.2%', color: 'green' },
                  { label: 'Data Sanitized', value: '100%', color: 'orange' },
                  { label: 'Warranty', value: '3yr', color: 'blue' },
                ].map((stat, i) => (
                  <div key={i} className={`${stat.color === 'green' ? 'bg-success-background border-success-background text-success-foreground' : stat.color === 'orange' ? 'bg-warning-background border-warning-background text-warning-foreground' : 'bg-info-background border-info-background text-info-foreground'} border rounded-xl p-4`}>
                    <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                    <div className={`text-2xl font-bold ${stat.color === 'green' ? 'text-success-foreground' : stat.color === 'orange' ? 'text-warning-foreground' : 'text-info-foreground'}`}>{stat.value}</div>
                  </div>
                ))}
              </div>
              <div className="bg-muted rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-foreground">Inventory Categories</h4>
                  <div className="flex gap-2">
                    <span className="text-xs bg-info-background text-info-foreground px-2 py-1 rounded">In Stock</span>
                    <span className="text-xs bg-success-background text-success-foreground px-2 py-1 rounded">Certified</span>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { name: 'Dell PowerEdge R740', stock: '142 units', price: 'From ₱1,499' },
                    { name: 'HP ProLiant DL380 Gen10', stock: '98 units', price: 'From ₱1,299' },
                    { name: 'Lenovo ThinkSystem SR650', stock: '76 units', price: 'From ₱1,199' },
                    { name: 'Cisco Nexus 9300 Series', stock: '45 units', price: 'From ₱2,499' },
                    { name: 'NetApp AFF A250', stock: '23 units', price: 'From ₱3,999' },
                    { name: 'HPE MSA 2060', stock: '34 units', price: 'From ₱1,899' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-card rounded-lg border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-2.5 h-2.5 bg-primary rounded-full"></div>
                        <span className="font-medium text-foreground">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">{item.stock}</span>
                        <span className="text-sm font-semibold text-primary">{item.price}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-400 dark:bg-blue-600 rounded-full opacity-30 blur-2xl"></div>
          <div className="absolute -top-6 -right-6 w-40 h-40 bg-secondary/40 dark:bg-secondary/20 rounded-full opacity-30 blur-2xl"></div>
        </div>
      </div>
    </section>
  );
}
