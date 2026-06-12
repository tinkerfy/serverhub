import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { products as productsTable, categories } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export const revalidate = 3600;

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || 'active';

  const result = await db
    .select()
    .from(productsTable)
    .leftJoin(categories, eq(productsTable.categoryId, categories.id))
    .where(eq(productsTable.status, status as 'active' | 'inactive' | 'draft'))
    .orderBy(productsTable.createdAt);

  const mapped = result.map((row: any) => ({
    ...row.products,
    categoryName: row.categories?.name,
    price: parseFloat(row.products.price),
    cost: parseFloat(row.products.cost),
    originalPrice: parseFloat(row.products.originalPrice),
    specs: typeof row.products.specs === 'string' ? JSON.parse(row.products.specs) : row.products.specs,
  }));

  return NextResponse.json(mapped);
}
