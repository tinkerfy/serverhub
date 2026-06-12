import { db } from '../index';
import { cartItems, products } from '../schema';
import { eq, and, isNull } from 'drizzle-orm';

export async function getBySession(sessionId: string) {
  return db.select().from(cartItems).where(and(eq(cartItems.sessionId, sessionId), isNull(cartItems.userId)));
}

export async function getByUserId(userId: number) {
  return db.select().from(cartItems).where(eq(cartItems.userId, userId));
}

export async function addItem(data: typeof cartItems.$inferInsert) {
  return db.insert(cartItems).values(data).returning();
}

export async function updateQuantity(id: number, quantity: number) {
  return db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id)).returning();
}

export async function removeItem(id: number) {
  return db.delete(cartItems).where(eq(cartItems.id, id)).returning();
}

export async function merge(sessionId: string, userId: number) {
  const sessionItems = await getBySession(sessionId);
  for (const item of sessionItems) {
    await db.update(cartItems).set({ userId, sessionId: null }).where(eq(cartItems.id, item.id));
  }
  return sessionItems.length;
}

export async function clear(sessionId: string, userId: number) {
  if (sessionId) await db.delete(cartItems).where(eq(cartItems.sessionId, sessionId));
  if (userId) await db.delete(cartItems).where(eq(cartItems.userId, userId));
}

export async function getTotals(userId: number, sessionId?: string) {
  const items = sessionId ? await getBySession(sessionId) : await getByUserId(userId);
  let subtotal = 0;
  for (const item of items) {
    const product = await db.select({ price: products.price }).from(products).where(eq(products.id, item.productId)).limit(1);
    if (product[0]) {
      subtotal += parseFloat(product[0].price) * item.quantity;
    }
  }
  return { subtotal, tax: subtotal * 0.085, shipping: subtotal > 5000 ? 0 : 150, total: subtotal * 1.085 + (subtotal > 5000 ? 0 : 150) };
}
