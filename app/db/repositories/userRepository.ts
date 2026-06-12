import { db } from '../index';
import { users, addresses } from '../schema';
import { eq } from 'drizzle-orm';

export async function getById(id: number) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result[0] || null;
}

export async function getByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result[0] || null;
}

export async function create(data: typeof users.$inferInsert) {
  return db.insert(users).values(data).returning();
}

export async function update(id: number, data: Partial<typeof users.$inferInsert>) {
  return db.update(users).set(data).where(eq(users.id, id)).returning();
}

export async function getWithOrders(userId: number) {
  return db.select().from(users).where(eq(users.id, userId)).limit(1);
}
