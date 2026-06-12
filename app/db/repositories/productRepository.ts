import { db } from '../index';
import { products, categories, productImages, productStatusEnum, productConditionEnum } from '../schema';
import { eq, and, like, or, asc, desc, gte, lte, ne, inArray } from 'drizzle-orm';

export interface ProductFilters {
  brand?: string[];
  category?: string[];
  condition?: 'refurbished' | 'certified-pre-owned' | 'like-new' | 'good';
  status?: 'active' | 'inactive' | 'draft';
  minPrice?: number;
  maxPrice?: number;
  keyword?: string;
}

export interface ProductSort {
  field: 'price' | 'name' | 'createdAt' | 'stock';
  order: 'asc' | 'desc';
}

export async function getAll(filters: ProductFilters = {}, sort: ProductSort = { field: 'createdAt', order: 'desc' }, page = 1, limit = 12) {
  const whereClauses: ReturnType<typeof and>[] = [];

  if (filters.brand?.length) {
    whereClauses.push(inArray(products.brand, filters.brand));
  }

  if (filters.condition) {
    whereClauses.push(eq(products.condition, filters.condition));
  }

  if (filters.status) {
    whereClauses.push(eq(products.status, filters.status));
  }

  if (filters.minPrice !== undefined) {
    whereClauses.push(gte(products.price, filters.minPrice.toString()));
  }

  if (filters.maxPrice !== undefined) {
    whereClauses.push(lte(products.price, filters.maxPrice.toString()));
  }

  if (filters.keyword) {
    const kw = `%${filters.keyword}%`;
    whereClauses.push(or(
      like(products.name, kw),
      like(products.brand, kw),
      like(products.description, kw),
    ));
  }

  let query: any = db.select().from(products).leftJoin(categories, eq(products.categoryId, categories.id));
  if (whereClauses.length > 0) {
    query = query.where(and(...whereClauses));
  }

  const sortOrder = sort.order === 'asc' ? asc : desc;
  const sortColumn = sort.field === 'price' ? products.price : sort.field === 'name' ? products.name : products.createdAt;
  query = query.orderBy(sortOrder(sortColumn));

  const offset = (page - 1) * limit;
  query = query.limit(limit).offset(offset);

  const results = await query;
  return results;
}

export async function getById(id: number) {
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result[0] || null;
}

export async function search(keyword: string) {
  const kw = `%${keyword}%`;
  return db.select().from(products).where(or(
    like(products.name, kw),
    like(products.brand, kw),
    like(products.model, kw),
  )).limit(20);
}

export async function getRelated(productId: number, limit = 4) {
  const product = await getById(productId);
  if (!product) return [];
  return db.select().from(products)
    .where(and(eq(products.categoryId, product.categoryId), eq(products.status, 'active'), ne(products.id, productId)))
    .limit(limit);
}

export async function create(data: typeof products.$inferInsert) {
  return db.insert(products).values(data).returning();
}

export async function update(id: number, data: Partial<typeof products.$inferInsert>) {
  return db.update(products).set(data).where(eq(products.id, id)).returning();
}

export async function remove(id: number) {
  return db.delete(products).where(eq(products.id, id)).returning();
}

export async function getCategories() {
  return db.select().from(categories);
}
