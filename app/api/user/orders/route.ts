import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { orders, orderItems } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = parseInt(searchParams.get('userId') || '0');

  if (!userId) {
    return NextResponse.json({ error: 'User ID required' }, { status: 400 });
  }

  const userOrders = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, userId))
    .orderBy(orders.createdAt);

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

  return NextResponse.json(result);
}
