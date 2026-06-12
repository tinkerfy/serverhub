export default function TrustedBy() {
  const companies = ['Dell', 'HP', 'Lenovo', 'Cisco', 'IBM', 'NetApp'];

  return (
    <section className="py-12 bg-card border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-muted-foreground mb-8 font-medium">Trusted by 1000+ businesses worldwide</p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
          {companies.map((company) => (
            <div key={company} className="text-2xl font-bold text-muted-foreground/40 hover:text-muted-foreground/70 transition-colors cursor-pointer">
              {company}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
