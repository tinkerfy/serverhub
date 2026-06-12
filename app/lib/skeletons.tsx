export function CardSkeleton() {
  return (
    <div className="bg-card rounded-lg shadow animate-pulse border border-border">
      <div className="h-48 bg-muted rounded-t-lg" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-1/4" />
        <div className="h-6 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-1/2" />
        <div className="flex items-baseline gap-2">
          <div className="h-8 bg-muted rounded w-24" />
          <div className="h-4 bg-muted rounded w-20" />
        </div>
      </div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-card rounded-lg border border-border animate-pulse">
      <div className="p-6 space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-10 h-10 bg-muted rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-muted rounded w-1/3" />
              <div className="h-3 bg-muted rounded w-1/4" />
            </div>
            <div className="h-6 bg-muted rounded w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatCardSkeleton() {
  return (
    <div className="bg-card rounded-lg p-6 border border-border animate-pulse">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-4 bg-muted rounded w-24" />
          <div className="h-8 bg-muted rounded w-32" />
        </div>
        <div className="w-12 h-12 bg-muted rounded-lg" />
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="h-10 bg-muted rounded w-48" />
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-lg" />
        ))}
      </div>
      <div className="h-64 bg-muted rounded-lg" />
    </div>
  );
}
