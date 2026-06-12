'use client';

import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { use } from 'react';

interface Product {
  id: number;
  name: string;
  brand: string;
  model: string;
  categoryId: number;
  description: string;
  condition: string;
  status: string;
  sku: string;
  price: number;
  cost: number;
  originalPrice: number;
  stock: number;
  specs: any;
  imageUrls: string[];
  createdAt: Date;
  updatedAt: Date;
  categoryName?: string;
}

function ProductCard({ product }: { product: Product }) {
  const savings = Math.round((1 - product.price / product.originalPrice) * 100);
  const conditionColors: Record<string, string> = {
    'refurbished': 'bg-info-background border-info-background text-info-foreground',
    'certified-pre-owned': 'bg-success-background border-success-background text-success-foreground',
    'like-new': 'bg-purple-background border-purple-background text-purple-foreground',
    'good': 'bg-muted text-muted-foreground',
  };

  return (
    <Link href={`/products/${product.id}`} className="block bg-card text-card-foreground rounded-lg shadow hover:shadow-lg transition-all cursor-pointer overflow-hidden border border-border hover:border-primary/50 hover:-translate-y-1">
      <div className="relative h-[400px] bg-muted dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
        {product.imageUrls && product.imageUrls.length > 0 ? (
          <div
            className="w-full h-full grid gap-0.5 p-0.5"
            style={{
              gridTemplateColumns: '1fr 1fr',
              gridTemplateRows: product.imageUrls.length <= 2 ? '1fr 1fr' : '1fr 1fr 1fr',
            }}
          >
            {product.imageUrls.map((url, i) => {
              if (i >= 4) return null;
              let spanClass = 'col-span-1 row-span-1';
              if (product.imageUrls.length === 1) {
                spanClass = 'col-span-2 row-span-2';
              } else if (product.imageUrls.length === 2) {
                spanClass = 'col-span-2 row-span-1';
              } else if (product.imageUrls.length === 3 && i === 0) {
                spanClass = 'col-span-2 row-span-1';
              }
              return (
                <div
                  key={i}
                  className={`${spanClass} overflow-hidden bg-muted flex items-center justify-center relative`}
                >
                  <img
                    src={url}
                    alt={`${product.name} - Image ${i + 1}`}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                  />
                  {product.imageUrls.length > 4 && i === 3 && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                      <span className="text-white text-lg font-bold">+{product.imageUrls.length - 4}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <span className="text-muted-foreground text-sm">Product Image</span>
        )}
      </div>
      <div className="p-4">
        <span className="text-xs font-medium text-muted-foreground uppercase">{product.brand}</span>
        <h3 className="text-lg font-semibold text-foreground mt-1 group-hover:text-primary">{product.name}</h3>
        <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-2 border ${conditionColors[product.condition] || 'bg-muted text-muted-foreground'}`}>
          {product.condition}
        </span>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-foreground">₱{product.price.toLocaleString()}</span>
          {product.originalPrice > product.price && (
            <span className="text-sm text-muted-foreground line-through">₱{product.originalPrice.toLocaleString()}</span>
          )}
        </div>
        <span className="inline-block mt-2 text-sm font-medium text-success">Save {savings}%</span>
        <div className="mt-3 flex items-center gap-2">
          <span className={`text-sm ${product.stock > 0 ? 'text-success' : 'text-error'}`}>
            {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
          </span>
        </div>
      </div>
    </Link>
  );
}

function InventoryFilters({
  searchParams,
}: {
  searchParams: Record<string, string>;
}) {
  const router = useRouter();
  const [brands, setBrands] = useState<string[]>([]);
  const [conditions, setConditions] = useState<string[]>([]);
  const [keyword, setKeyword] = useState(searchParams.keyword || '');
  const [minPrice, setMinPrice] = useState(searchParams.minPrice || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.maxPrice || '');
  const [sort, setSort] = useState(searchParams.sort || 'newest');
  const [page, setPage] = useState(parseInt(searchParams.page) || 1);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  const allBrands = ['Dell', 'HP', 'Lenovo', 'Cisco', 'NetApp', 'HPE', 'Intel', 'Samsung', 'Crucial', 'Broadcom', 'Seagate'];
  const allConditions = ['refurbished', 'certified-pre-owned', 'like-new', 'good'];

  useEffect(() => {
    setBrands(searchParams.brand?.split(',').filter(Boolean) || []);
    setConditions(searchParams.condition?.split(',').filter(Boolean) || []);
    setKeyword(searchParams.keyword || '');
    setMinPrice(searchParams.minPrice || '');
    setMaxPrice(searchParams.maxPrice || '');
    setSort(searchParams.sort || 'newest');
    setPage(parseInt(searchParams.page) || 1);
  }, [searchParams]);

  const updateParams = useCallback((updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams(searchParams);
    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined || value === '') params.delete(key);
      else params.set(key, value);
    }
    router.push(`/inventory?${params.toString()}`);
  }, [router, searchParams]);

  const toggleBrand = (brand: string) => {
    const updated = brands.includes(brand)
      ? brands.filter(b => b !== brand)
      : [...brands, brand];
    updateParams({ brand: updated.join(','), page: '1' });
  };

  const toggleCondition = (condition: string) => {
    const updated = conditions.includes(condition)
      ? conditions.filter(c => c !== condition)
      : [...conditions, condition];
    updateParams({ condition: updated.join(','), page: '1' });
  };

  const handlePriceChange = (type: 'min' | 'max', value: string) => {
    if (type === 'min') setMinPrice(value);
    else setMaxPrice(value);
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams({ [type === 'min' ? 'minPrice' : 'maxPrice']: value || undefined, page: '1' });
    }, 500);
  };

  return (
    <div className="lg:col-span-1">
      <div className="bg-card text-card-foreground shadow rounded-lg p-6 space-y-6 border border-border">
        <div>
          <h3 className="font-semibold text-foreground mb-3">Brands</h3>
          <div className="space-y-2">
            {allBrands.map((b) => (
              <label key={b} className="flex items-center">
                <input
                  type="checkbox"
                  value={b}
                  checked={brands.includes(b)}
                  onChange={() => toggleBrand(b)}
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                />
                <span className="ml-2 text-sm text-muted-foreground">{b}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-3">Condition</h3>
          <div className="space-y-2">
            {allConditions.map((c) => (
              <label key={c} className="flex items-center">
                <input
                  type="checkbox"
                  value={c}
                  checked={conditions.includes(c)}
                  onChange={() => toggleCondition(c)}
                  className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                />
                <span className="ml-2 text-sm text-muted-foreground capitalize">{c}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-foreground mb-3">Price Range</h3>
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => handlePriceChange('min', e.target.value)}
              className="w-full border border-border rounded px-2 py-1 text-sm bg-background text-foreground"
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => handlePriceChange('max', e.target.value)}
              className="w-full border border-border rounded px-2 py-1 text-sm bg-background text-foreground"
            />
          </div>
        </div>

        <button
          onClick={() => updateParams({ brand: undefined, condition: undefined, minPrice: undefined, maxPrice: undefined, keyword: undefined, sort: undefined })}
          className="w-full py-2 border border-border rounded text-sm font-medium text-muted-foreground hover:bg-muted"
        >
          Clear All
        </button>
      </div>
    </div>
  );
}

function InventoryContent() {
  const params = useSearchParams();
  const router = useRouter();
  const brand = useMemo(() => params.get('brand')?.split(',').filter(Boolean) || [], [params]);
  const condition = useMemo(() => params.get('condition')?.split(',').filter(Boolean) || [], [params]);
  const minPrice = useMemo(() => parseFloat(params.get('minPrice') || '0'), [params]);
  const maxPrice = useMemo(() => parseFloat(params.get('maxPrice') || 'Infinity') || Infinity, [params]);
  const keyword = useMemo(() => params.get('keyword') || '', [params]);
  const sort = useMemo(() => params.get('sort') || 'newest', [params]);
  const page = useMemo(() => parseInt(params.get('page') || '1'), [params]);

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const allProductsRef = useRef<Product[]>([]);

  useEffect(() => {
    fetch('/api/products?status=active')
      .then(res => res.json())
      .then((data: Product[]) => {
        allProductsRef.current = data;
        applyFilters(data);
      }).catch(() => setLoading(false));
  }, []);

  const applyFilters = useCallback((data: Product[]) => {
    let filtered = data.filter((p: Product) => {
      if (brand.length && !brand.includes(p.brand)) return false;
      if (condition.length && !condition.includes(p.condition)) return false;
      if (p.price < minPrice) return false;
      if (maxPrice !== Infinity && p.price > maxPrice) return false;
      if (keyword) {
        const kw = keyword.toLowerCase();
        if (!p.name.toLowerCase().includes(kw) && !p.brand.toLowerCase().includes(kw) && !p.description.toLowerCase().includes(kw)) return false;
      }
      return true;
    });

    if (sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
    else if (sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
    else filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    const ITEMS_PER_PAGE = 12;
    const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    setProducts(paginated);
    setLoading(false);
  }, [brand, condition, minPrice, maxPrice, keyword, sort, page]);

  useEffect(() => {
    applyFilters(allProductsRef.current);
  }, [brand, condition, minPrice, maxPrice, keyword, sort, page, applyFilters]);

  const totalPages = Math.ceil(products.length / 12) || 1;

  return (
    <div className="lg:col-span-3">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted-foreground">Showing {products.length} results</p>
        <select
          value={sort}
          onChange={(e) => {
            const url = new URL(window.location.href);
            url.searchParams.set('sort', e.target.value);
            router.push(url.toString());
          }}
          className="border border-border bg-background text-foreground rounded px-3 py-2 text-sm focus:ring-primary focus:border-primary"
        >
          <option value="newest">Newest First</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
        </select>
      </div>

      <div className="mb-6">
        <input
          type="text"
          placeholder="Search products..."
          defaultValue={keyword}
          onChange={(e) => {
            const url = new URL(window.location.href);
            url.searchParams.set('keyword', e.target.value);
            router.push(url.toString());
          }}
          className="w-full border border-border rounded-lg px-4 py-2 bg-background text-foreground"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {page > 1 && (
            <Link
              href={`/inventory?page=${page - 1}`}
              className="w-10 h-10 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted"
            >
              ← Prev
            </Link>
          )}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/inventory?page=${p}`}
              className={`w-10 h-10 flex items-center justify-center rounded border ${
                p === page ? 'bg-primary text-white border-primary' : 'border-border text-muted-foreground hover:bg-muted'
              }`}
            >
              {p}
            </Link>
          ))}
          {page < totalPages && (
            <Link
              href={`/inventory?page=${page + 1}`}
              className="w-10 h-10 flex items-center justify-center rounded border border-border text-muted-foreground hover:bg-muted"
            >
              Next →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function InventoryPage({ searchParams }: { searchParams: Promise<Record<string, string>> }) {
  const params = use(searchParams);

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-foreground mb-8">Inventory</h1>

        <div className="lg:grid lg:grid-cols-4 lg:gap-8">
          <InventoryFilters searchParams={params} />
          <InventoryContent />
        </div>
      </div>
    </div>
  );
}
