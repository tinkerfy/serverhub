import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { products } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = parseInt(searchParams.get('id') || '0');

  if (!id) {
    return NextResponse.json({ error: 'Product ID required' }, { status: 400 });
  }

  const result = await db
    .select()
    .from(products)
    .where(eq(products.id, id))
    .limit(1);

  if (!result[0]) {
    return NextResponse.json({ error: 'Product not found' }, { status: 404 });
  }

  const product = result[0];

  return NextResponse.json({
    id: product.id,
    name: product.name,
    price: parseFloat(product.price),
    image: (product.imageUrls && product.imageUrls.length > 0) ? product.imageUrls[0] : '',
    condition: product.condition,
    stock: product.stock,
  });
}
