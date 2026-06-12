import { db } from '../index';
import { orders, orderItems, users, addresses, orderStatusEnum, paymentStatusEnum } from '../schema';
import { eq, and, like, gte, lte, desc, asc } from 'drizzle-orm';

export interface OrderFilters {
  status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus?: 'pending' | 'paid' | 'failed' | 'refunded';
  userId?: number;
  keyword?: string;
  minDate?: Date;
  maxDate?: Date;
}

export async function getAll(filters: OrderFilters = {}, page = 1, limit = 20) {
  const whereClauses: ReturnType<typeof and>[] = [];

  if (filters.status) whereClauses.push(eq(orders.status, filters.status));
  if (filters.paymentStatus) whereClauses.push(eq(orders.paymentStatus, filters.paymentStatus));
  if (filters.userId) whereClauses.push(eq(orders.userId, filters.userId));
  if (filters.keyword) whereClauses.push(like(orders.orderNumber, `%${filters.keyword}%`));
  if (filters.minDate) whereClauses.push(gte(orders.createdAt, filters.minDate));
  if (filters.maxDate) whereClauses.push(lte(orders.createdAt, filters.maxDate));

  let query: any = db.select().from(orders).leftJoin(users, eq(orders.userId, users.id)).leftJoin(addresses, eq(orders.shippingAddressId, addresses.id));
  if (whereClauses.length > 0) {
    query = query.where(and(...whereClauses));
  }

  query = query.orderBy(desc(orders.createdAt)).limit(limit).offset((page - 1) * limit);

  return query;
}

export async function getById(id: number) {
  const result = await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  return result[0] || null;
}

export async function getByUserId(userId: number) {
  return db.select().from(orders).where(eq(orders.userId, userId)).orderBy(desc(orders.createdAt));
}

export async function getByOrderNumber(orderNumber: string) {
  const result = await db.select().from(orders).where(eq(orders.orderNumber, orderNumber)).limit(1);
  return result[0] || null;
}

export async function create(data: typeof orders.$inferInsert) {
  return db.insert(orders).values(data).returning();
}

export async function updateStatus(id: number, status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled') {
  return db.update(orders).set({ status, updatedAt: new Date() }).where(eq(orders.id, id)).returning();
}

export async function getAnalytics() {
  return {
    totalRevenue: await db.select({ total: orders.total }).from(orders).where(eq(orders.paymentStatus, 'paid')),
    totalOrders: await db.select({ count: orders.id }).from(orders),
  };
}
