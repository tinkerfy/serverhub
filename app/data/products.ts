import { db } from '@/app/db';
import { products, categories } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export interface Product {
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

export async function getProducts(): Promise<Product[]> {
  const result = await db
    .select()
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.status, 'active'))
    .orderBy(products.createdAt);

  return result.map((row: any) => ({
    ...row.products,
    categoryName: row.categories?.name,
    price: parseFloat(row.products.price),
    cost: parseFloat(row.products.cost),
    originalPrice: parseFloat(row.products.originalPrice),
    specs: typeof row.products.specs === 'string' ? JSON.parse(row.products.specs) : row.products.specs,
  }));
}

export async function getProductById(id: number): Promise<Product | null> {
  const result = await db
    .select()
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.id, id))
    .limit(1);

  if (!result[0]) return null;

  return {
    ...result[0].products,
    categoryName: result[0].categories?.name,
    price: parseFloat(result[0].products.price),
    cost: parseFloat(result[0].products.cost),
    originalPrice: parseFloat(result[0].products.originalPrice),
    specs: typeof result[0].products.specs === 'string' ? JSON.parse(result[0].products.specs) : result[0].products.specs,
  };
}

export async function getCategories() {
  return db.select().from(categories);
}
