import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { orders, orderItems } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, items, subtotal, tax, shippingCost, total, shippingAddress, paymentMethod } = body;

    if (!userId || !items || items.length === 0) {
      return NextResponse.json({ error: 'User ID and items are required' }, { status: 400 });
    }

    const orderNumber = 'SH-' + new Date().getFullYear() + '-' + Math.floor(Math.random() * 9000 + 1000);

    const [order] = await db
      .insert(orders)
      .values({
        userId,
        orderNumber,
        status: 'pending',
        paymentStatus: paymentMethod === 'credit_card' ? 'pending' : 'pending',
        subtotal: String(subtotal),
        tax: String(tax),
        shippingCost: String(shippingCost),
        total: String(total),
      })
      .returning();

    for (const item of items) {
      await db.insert(orderItems).values({
        orderId: order.id,
        productId: item.productId,
        name: item.name,
        price: String(item.price),
        quantity: item.quantity,
        total: String(item.price * item.quantity),
      });
    }

    return NextResponse.json({
      success: true,
      orderNumber: order.orderNumber,
      orderId: order.id,
    });
  } catch (error) {
    console.error('Order creation failed:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
