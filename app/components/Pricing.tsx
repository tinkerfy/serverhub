const plans = [
  {
    name: 'Refurbished',
    price: 'Save 50-60%',
    description: 'Fully tested and restored to working condition',
    features: ['Full Warranty', 'Data Sanitized', 'Cosmetic Blemishes', 'Standard Support', '30-Day Returns'],
    cta: 'Browse Refurbished',
    popular: false,
  },
  {
    name: 'Certified Pre-Owned',
    price: 'Save 60-70%',
    description: 'Like-new condition with comprehensive inspection',
    features: ['Extended Warranty', 'Data Sanitized', 'Near-Mint Condition', 'Priority Support', '60-Day Returns', 'Free Shipping', 'Performance Benchmarked'],
    cta: 'Browse Certified',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    description: 'Bulk orders and dedicated solutions',
    features: ['Volume Discounts', 'Custom Configurations', 'Dedicated Account Manager', 'SLA Guarantee', 'White-glove Delivery', 'On-site Support', 'Trade-in Programs'],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-20 bg-muted dark:bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">
            Equipment Grades
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Choose the grade that fits your budget and performance needs.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan, index) => (
            <div key={index} className={`bg-card text-card-foreground rounded-2xl p-8 border-2 ${plan.popular ? 'border-primary shadow-xl relative' : 'border-border shadow-sm'} hover:shadow-lg transition-shadow`}>
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-semibold">
                  Best Value
                </div>
              )}
              <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
              <p className="text-muted-foreground mb-6">{plan.description}</p>
              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
              </div>
              <button className={`w-full py-3 rounded-lg font-semibold mb-8 transition-colors ${plan.popular ? 'bg-primary text-primary-foreground hover:bg-primary-dark' : 'bg-muted text-foreground hover:bg-muted/80'}`}>
                {plan.cta}
              </button>
              <ul className="space-y-3">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-muted-foreground">
                    <svg className="w-5 h-5 text-success flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
