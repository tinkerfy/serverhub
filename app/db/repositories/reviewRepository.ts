import { db } from '../index';
import { reviews } from '../schema';
import { eq } from 'drizzle-orm';

export async function getByProduct(productId: number) {
  return db.select().from(reviews).where(eq(reviews.productId, productId)).orderBy(reviews.createdAt);
}

export async function create(data: typeof reviews.$inferInsert) {
  return db.insert(reviews).values(data).returning();
}

export async function getById(id: number) {
  const result = await db.select().from(reviews).where(eq(reviews.id, id)).limit(1);
  return result[0] || null;
}
