import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { products } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

  return NextResponse.json({
    id: product.id,
    name: product.name,
    brand: product.brand,
    model: product.model,
    categoryId: product.categoryId,
    description: product.description,
    condition: product.condition,
    status: product.status,
    sku: product.sku,
    price: parseFloat(product.price),
    cost: parseFloat(product.cost),
    originalPrice: parseFloat(product.originalPrice),
    stock: product.stock,
    specs: typeof product.specs === 'string' ? JSON.parse(product.specs) : product.specs,
    imageUrls: product.imageUrls || [],
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  });
}
