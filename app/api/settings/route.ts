import { NextResponse } from 'next/server';
import { db } from '@/app/db';
import { settings } from '@/app/db/schema';
import { eq } from 'drizzle-orm';

export async function GET() {
  try {
    const result = await db.query.settings.findFirst();
    if (!result) {
      return NextResponse.json({
        storeName: 'ServerHub',
        storeEmail: 'admin@serverhub.com',
        storePhone: '+1 (555) 123-4567',
        storeAddress: '123 Server Lane, San Jose, CA 95134',
        standardShipping: '150',
        expressShipping: '250',
        overnightShipping: '400',
        freeShippingThreshold: '5000',
        taxRate: '8.5',
        taxInclusive: false,
      });
    }
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings. The settings table may not exist in your database. Run: npx drizzle-kit push' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const existing = await db.query.settings.findFirst();

    if (existing) {
      const result = await db
        .update(settings)
        .set({
          storeName: body.storeName,
          storeEmail: body.storeEmail,
          storePhone: body.storePhone,
          storeAddress: body.storeAddress,
          standardShipping: body.standardShipping,
          expressShipping: body.expressShipping,
          overnightShipping: body.overnightShipping,
          freeShippingThreshold: body.freeShippingThreshold,
          taxRate: body.taxRate,
          taxInclusive: body.taxInclusive,
        })
        .where(eq(settings.id, existing.id))
        .returning();

      return NextResponse.json(result[0]);
    } else {
      const result = await db
        .insert(settings)
        .values({
          storeName: body.storeName,
          storeEmail: body.storeEmail,
          storePhone: body.storePhone,
          storeAddress: body.storeAddress,
          standardShipping: body.standardShipping,
          expressShipping: body.expressShipping,
          overnightShipping: body.overnightShipping,
          freeShippingThreshold: body.freeShippingThreshold,
          taxRate: body.taxRate,
          taxInclusive: body.taxInclusive,
        })
        .returning();

      return NextResponse.json(result[0]);
    }
  } catch (error) {
    console.error('Error saving settings:', error);
    return NextResponse.json(
      { error: 'Failed to save settings. The settings table may not exist in your database. Run: npx drizzle-kit push' },
      { status: 500 }
    );
  }
}
