'use client';

import { useState, useEffect, useCallback } from 'react';

interface GalleryImage {
  url: string;
  thumbUrl: string;
  span: string;
}

export default function OrderImageGallery({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const open = useCallback((index: number) => setActiveIndex(index), []);
  const close = useCallback(() => setActiveIndex(null), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [close]);

  if (!images.length) return null;

  const spans = ['row-span-1', 'row-span-2', 'col-span-2 row-span-2', 'row-span-2', 'row-span-1'];

  return (
    <div className="px-6 py-6 border-b border-border">
      <h2 className="text-lg font-semibold text-foreground mb-4">Product Images</h2>
      <div className="grid gap-2 grid-cols-4 grid-rows-5">
        {images.map((img, i) => {
          const span = img.span || spans[i % spans.length];
          return (
            <button
              key={i}
              onClick={() => open(i)}
              className={`block relative bg-muted overflow-hidden rounded-lg cursor-pointer hover:opacity-80 transition-opacity ${span}`}
            >
              <img
                className="absolute inset-0 w-full h-full object-cover object-center"
                src={img.thumbUrl}
                alt={`Product image ${i + 1}`}
                loading="lazy"
              />
            </button>
          );
        })}
      </div>

      {activeIndex !== null && (
        <div
          onClick={close}
          className="fixed inset-0 bg-black bg-opacity-90 flex justify-center items-center z-50"
        >
          <button onClick={close} className="absolute top-4 right-4 text-white text-2xl">&times;</button>
          <button
            onClick={(e) => { e.stopPropagation(); setActiveIndex((activeIndex - 1 + images.length) % images.length); }}
            className="absolute left-4 text-white text-4xl"
          >‹</button>
          <button
            onClick={(e) => { e.stopPropagation(); setActiveIndex((activeIndex + 1) % images.length); }}
            className="absolute right-4 text-white text-4xl"
          >›</button>
          <img
            key={activeIndex}
            src={images[activeIndex].url}
            alt=""
            className="w-4/5 h-4/5 object-contain"
          />
          <div className="absolute bottom-4 text-white text-sm opacity-70">
            {activeIndex + 1} / {images.length}
          </div>
        </div>
      )}
    </div>
  );
}
