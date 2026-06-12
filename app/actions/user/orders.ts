'use server';

import { db } from '@/app/db';
import { orders, orderItems } from '@/app/db/schema';
import { eq, desc } from 'drizzle-orm';

export async function getUserOrders(userId: number) {
  const orderItemsList = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, 0));

  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(desc(orders.createdAt));

  const result = [];
  for (const order of userOrders) {
    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, order.id));

    result.push({
      ...order,
      subtotal: parseFloat(order.subtotal),
      tax: parseFloat(order.tax),
      shippingCost: parseFloat(order.shippingCost),
      total: parseFloat(order.total),
      items: items.map(item => ({
        id: item.id,
        productId: item.productId,
        name: item.name,
        price: parseFloat(item.price),
        quantity: item.quantity,
        total: parseFloat(item.total),
      })),
    });
  }

  return result;
}
