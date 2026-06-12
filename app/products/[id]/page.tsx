'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/app/context/CartContext';

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
  imageDir: string;
  createdAt: Date;
  updatedAt: Date;
  categoryName?: string;
}

function SpecsTable({ specs }: { specs: Record<string, string> }) {
  const entries = Object.entries(specs);
  if (entries.length === 0) return null;
  
  return (
    <div className="bg-muted rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4">Specifications</h3>
      <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entries.map(([key, value]) => (
          <div key={key} className="flex gap-2">
            <dt className="text-sm font-medium text-muted-foreground min-w-[120px] capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</dt>
            <dd className="text-sm text-foreground">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

function ImageGallery({ imageUrls, productName, productId }: { imageUrls: string[]; productName: string; productId: number }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slug = productName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const allProductImages = Array.from({ length: 10 }, (_, i) => `/images/products/${slug}/${i + 1}.jpg`);

  if (!imageUrls || imageUrls.length === 0) {
    return (
      <div className="h-[400px] bg-muted dark:bg-gray-800 rounded-lg flex items-center justify-center">
        <span className="text-muted-foreground">No image available</span>
      </div>
    );
  }

  const handleDownloadImages = async () => {
    try {
      const response = await fetch(`/api/products/${productId}/images/download`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${productName}-images.zip`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      console.error('Failed to download images:', err);
    }
  };

  return (
    <div>
      <div className="relative h-[400px] bg-muted dark:bg-gray-800 rounded-lg overflow-hidden mb-4">
        <img
          src={imageUrls[currentIndex]}
          alt={`${productName} - Image ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
        {imageUrls.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={() => setCurrentIndex(currentIndex > 0 ? currentIndex - 1 : imageUrls.length - 1)}
              className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              aria-label="Previous image"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="px-3 py-2 bg-black/50 text-white rounded-full text-sm">
              {currentIndex + 1} / {imageUrls.length}
            </span>
            <button
              onClick={() => setCurrentIndex(currentIndex < imageUrls.length - 1 ? currentIndex + 1 : 0)}
              className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
              aria-label="Next image"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
      {imageUrls.length > 1 && (
        <div className="mb-4">
          <button
            onClick={handleDownloadImages}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download All Images ({imageUrls.length})
          </button>
        </div>
      )}
      {imageUrls.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {imageUrls.slice(0, 5).map((url, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`h-20 bg-muted dark:bg-gray-800 rounded overflow-hidden border-2 transition-colors ${currentIndex === i ? 'border-primary' : 'border-transparent hover:border-border'}`}
            >
              <img src={url} alt={`${productName} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
          {imageUrls.length > 5 && (
            <div className="h-20 bg-muted dark:bg-gray-800 rounded flex items-center justify-center">
              <span className="text-sm text-muted-foreground">+{imageUrls.length - 5} more</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function AllProductImages({ product }: { product: Product }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeLightboxIndex, setActiveLightboxIndex] = useState<number | null>(null);

  let imageDir = '';
  if (product.imageUrls.length > 0) {
    const match = product.imageUrls[0].match(/\/images\/products\/([^/]+)\//);
    if (match) imageDir = match[1];
  }

  if (!imageDir) return null;

  const images = Array.from({ length: 10 }, (_, i) => ({
    src: `/images/products/${imageDir}/${i + 1}.jpg`,
    thumb: `/images/products/${imageDir}/${i + 1}.jpg`,
  }));

  const openLightbox = (index: number) => {
    setActiveIndex(index);
    setIsOpen(true);
  };

  const closeLightbox = () => setIsOpen(false);

  const prevImage = () => {
    setActiveIndex((activeIndex - 1 + images.length) % images.length);
  };

  const nextImage = () => {
    setActiveIndex((activeIndex + 1) % images.length);
  };

  return (
    <div className="h-full min-h-[500px] flex flex-col">
      <div className="flex-1 relative bg-muted dark:bg-gray-800 rounded-lg overflow-hidden">
        <img
          src={images[activeLightboxIndex !== null ? activeLightboxIndex : 0]?.src || images[0]?.src}
          alt={`${product.name} - Photo`}
          className="w-full h-full object-contain"
        />
        {images.length > 1 && (
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              onClick={() => setActiveLightboxIndex((activeLightboxIndex !== null ? activeLightboxIndex : 0) - 1 < 0 ? images.length - 1 : (activeLightboxIndex !== null ? activeLightboxIndex : 0) - 1)}
              className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <span className="px-3 py-2 bg-black/50 text-white rounded-full text-sm">
              {(activeLightboxIndex !== null ? activeLightboxIndex : 0) + 1} / {images.length}
            </span>
            <button
              onClick={() => setActiveLightboxIndex((activeLightboxIndex !== null ? activeLightboxIndex : 0) + 1 >= images.length ? 0 : (activeLightboxIndex !== null ? activeLightboxIndex : 0) + 1)}
              className="p-2 bg-black/50 text-white rounded-full hover:bg-black/70 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 mt-2 overflow-x-auto pb-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => { setActiveLightboxIndex(i); setIsOpen(true); }}
              className={`flex-shrink-0 w-16 h-16 bg-muted dark:bg-gray-800 rounded overflow-hidden border-2 transition-colors ${activeLightboxIndex === i ? 'border-primary' : 'border-transparent hover:border-border'}`}
            >
              <img src={img.thumb} alt={`${product.name} thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/90 flex justify-center items-center z-50"
          onClick={closeLightbox}
          onKeyDown={(e) => { if (e.key === 'Escape') closeLightbox(); }}
          role="button"
          tabIndex={0}
        >
          <button
            onClick={(e) => { e.stopPropagation(); closeLightbox(); }}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-10"
          >
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); setActiveLightboxIndex((activeLightboxIndex !== null ? activeLightboxIndex : activeIndex) - 1 < 0 ? images.length - 1 : (activeLightboxIndex !== null ? activeLightboxIndex : activeIndex) - 1); }}
            className="absolute left-4 text-white hover:text-gray-300 z-10"
          >
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <img
            src={images[activeLightboxIndex !== null ? activeLightboxIndex : activeIndex].src}
            alt={`${product.name} - Photo ${activeLightboxIndex !== null ? activeLightboxIndex + 1 : activeIndex + 1}`}
            className="w-4/5 h-4/5 object-contain"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={(e) => { e.stopPropagation(); setActiveLightboxIndex((activeLightboxIndex !== null ? activeLightboxIndex : activeIndex) + 1 >= images.length ? 0 : (activeLightboxIndex !== null ? activeLightboxIndex : activeIndex) + 1); }}
            className="absolute right-4 text-white hover:text-gray-300 z-10"
          >
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
            {images.map((_, i) => (
              <button
                key={i}
            onClick={(e) => { e.stopPropagation(); setActiveLightboxIndex(i); }}
            className={`w-2 h-2 rounded-full transition-colors ${activeLightboxIndex === i ? 'bg-white' : 'bg-white/40'}`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { addItem } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then(async ({ id }) => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        setProduct(data);
      } catch (err) {
        console.error('Failed to fetch product:', err);
      } finally {
        setLoading(false);
      }
    });
  }, [params]);

  const handleAddToCart = () => {
    if (!product) return;
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.imageUrls[0] || '',
      condition: product.condition,
      stock: product.stock,
    });
    router.push('/cart');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12 flex items-center justify-center">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background pt-20 pb-12 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Product Not Found</h1>
          <Link href="/inventory" className="text-primary hover:text-primary-dark">
            Back to Inventory
          </Link>
        </div>
      </div>
    );
  }

  const savings = Math.round((1 - product.price / product.originalPrice) * 100);
  
  const conditionLabels: Record<string, string> = {
    'refurbished': 'Refurbished',
    'certified-pre-owned': 'Certified Pre-Owned',
    'like-new': 'Like New',
    'good': 'Good',
  };

  const conditionColors: Record<string, string> = {
    'refurbished': 'bg-info-background border-info-background text-info-foreground',
    'certified-pre-owned': 'bg-success-background border-success-background text-success-foreground',
    'like-new': 'bg-purple-background border-purple-background text-purple-foreground',
    'good': 'bg-muted text-muted-foreground',
  };

  return (
    <div className="min-h-screen bg-background pt-20 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/inventory" className="hover:text-foreground">Inventory</Link>
          <span className="mx-2">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <AllProductImages product={product} />
          </div>

          <div>
            <span className={`inline-block px-3 py-1 text-xs font-medium rounded-full border ${conditionColors[product.condition] || 'bg-muted text-muted-foreground'}`}>
              {conditionLabels[product.condition] || product.condition}
            </span>
            
            <h1 className="text-3xl font-bold text-foreground mt-4">{product.name}</h1>
            <p className="text-sm text-muted-foreground mt-2">SKU: {product.sku}</p>

            <div className="mt-6">
              <div className="flex items-baseline gap-3">
                <span className="text-4xl font-bold text-foreground">₱{product.price.toLocaleString()}</span>
                {product.originalPrice > product.price && (
                  <>
                    <span className="text-xl text-muted-foreground line-through">₱{product.originalPrice.toLocaleString()}</span>
                    <span className="text-sm font-medium text-success bg-success-background px-2 py-1 rounded">Save {savings}%</span>
                  </>
                )}
              </div>
            </div>

            <div className="mt-6">
              <p className="text-foreground leading-relaxed">{product.description}</p>
            </div>

            <div className="mt-6">
              <SpecsTable specs={product.specs} />
            </div>

            <div className="mt-8 pt-6 border-t border-border">
              <div className="flex items-center gap-2 mb-4">
                <span className={`inline-block w-3 h-3 rounded-full ${product.stock > 0 ? 'bg-success' : 'bg-error'}`}></span>
                <span className={`text-sm font-medium ${product.stock > 0 ? 'text-success' : 'text-error'}`}>
                  {product.stock > 0 ? `In Stock (${product.stock} available)` : 'Out of Stock'}
                </span>
              </div>

              {product.stock > 0 ? (
                <button
                  onClick={handleAddToCart}
                  className="block w-full text-center py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                >
                  Add to Cart
                </button>
              ) : (
                <button disabled className="block w-full text-center py-4 bg-muted text-muted-foreground rounded-lg font-semibold cursor-not-allowed">
                  Out of Stock
                </button>
              )}
            </div>

            <div className="mt-6 grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-success font-semibold text-sm">Warranty</div>
                <div className="text-xs text-muted-foreground">3 Year</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-success font-semibold text-sm">Shipping</div>
                <div className="text-xs text-muted-foreground">Insured</div>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="text-success font-semibold text-sm">Returns</div>
                <div className="text-xs text-muted-foreground">30 Days</div>
              </div>
            </div>
          </div>
        </div>

        {product.categoryName && (
          <div className="mt-12">
            <Link href="/inventory" className="text-primary hover:text-primary-dark font-medium">
              ← Back to Inventory
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
