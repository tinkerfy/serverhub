import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { products } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    if (!productId) {
      return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
    }

    const result = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!result[0]) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    const product = result[0];
    const imageUrls = product.imageUrls || [];

    if (imageUrls.length === 0) {
      return NextResponse.json({ error: 'No images available' }, { status: 404 });
    }

    const images = [];
    for (let i = 0; i < imageUrls.length; i++) {
      try {
        const response = await fetch(imageUrls[i]);
        if (response.ok) {
          const buffer = Buffer.from(await response.arrayBuffer());
          const ext = imageUrls[i].split('.').pop()?.split('?')[0] || 'jpg';
          const filename = `${product.sku || 'product'}-${i + 1}.${ext}`;
          images.push({ buffer, filename });
        }
      } catch (err) {
        console.error(`Failed to fetch image ${i}:`, err);
      }
    }

    if (images.length === 0) {
      return NextResponse.json({ error: 'Failed to fetch images' }, { status: 500 });
    }

    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();

    for (const image of images) {
      zip.file(image.filename, image.buffer);
    }

    const content = await zip.generateAsync({ type: 'nodebuffer' });

    return new NextResponse(new Uint8Array(content).buffer as ArrayBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${product.sku || 'product'}-images.zip"`,
      },
    });
  } catch (error) {
    console.error('Image download failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
