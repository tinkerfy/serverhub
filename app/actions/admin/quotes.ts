'use server';

import { db } from '@/app/db';
import { quotes, quoteStatusEnum } from '@/app/db/schema';
import { eq, desc, asc, like, or, sql, and } from 'drizzle-orm';
import { sendEmail } from '@/app/lib/email';

export async function getQuotes(filters: { status?: string; page?: number; search?: string } = {}) {
  const page = filters.page || 1;
  const limit = 15;
  const offset = (page - 1) * limit;

  let whereClause: any = undefined;

  if (filters.status && filters.status !== 'all') {
    whereClause = eq(quotes.status, filters.status as 'pending' | 'quoted' | 'converted' | 'expired');
  }

  if (filters.search) {
    const searchClause = or(
      like(quotes.quoteNumber, `%${filters.search}%`),
      like(quotes.firstName, `%${filters.search}%`),
      like(quotes.lastName, `%${filters.search}%`),
      like(quotes.email, `%${filters.search}%`),
      like(quotes.company, `%${filters.search}%`),
    );
    whereClause = whereClause ? and(whereClause, searchClause) : searchClause;
  }

  const result = await db
    .select()
    .from(quotes)
    .orderBy(desc(quotes.createdAt))
    .limit(limit)
    .offset(offset)
    .where(whereClause);

  const countResult = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(quotes)
    .where(whereClause);

  const total = countResult[0]?.count || 0;

  return {
    quotes: result,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  };
}

export async function getQuoteById(id: number) {
  const result = await db
    .select()
    .from(quotes)
    .where(eq(quotes.id, id))
    .limit(1);

  return result[0] || null;
}

export async function updateQuoteStatus(id: number, data: { status?: string; finalPrice?: string; adminNotes?: string }) {
  const updates: any = {};

  if (data.status) {
    updates.status = data.status;
  }
  if (data.finalPrice !== undefined) {
    updates.finalPrice = data.finalPrice || null;
  }
  if (data.adminNotes !== undefined) {
    updates.adminNotes = data.adminNotes || null;
  }

  await db.update(quotes).set({ ...updates, updatedAt: new Date() }).where(eq(quotes.id, id));
}

export async function sendQuoteToCustomer(id: number) {
  const quote = await getQuoteById(id);

  if (!quote) {
    throw new Error('Quote not found');
  }

  const quoteHtml = `
    <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
      <h1 style="color: #2563eb; border-bottom: 2px solid #2563eb; padding-bottom: 10px;">ServerHub Quote</h1>
      <p>Dear ${quote.firstName} ${quote.lastName},</p>
      <p>Thank you for your interest in our server equipment. Please find your custom quote below:</p>
      
      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f9fafb;">Quote Number</td><td style="padding: 8px; border: 1px solid #ddd;">${quote.quoteNumber}</td></tr>
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f9fafb;">Category</td><td style="padding: 8px; border: 1px solid #ddd;">${quote.category}</td></tr>
        ${quote.specificInterest ? `<tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f9fafb;">Specific Interest</td><td style="padding: 8px; border: 1px solid #ddd;">${quote.specificInterest}</td></tr>` : ''}
        <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f9fafb;">Quantity</td><td style="padding: 8px; border: 1px solid #ddd;">${quote.quantity}</td></tr>
        ${quote.budgetRange ? `<tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f9fafb;">Budget Range</td><td style="padding: 8px; border: 1px solid #ddd;">${quote.budgetRange}</td></tr>` : ''}
        ${quote.finalPrice ? `<tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f9fafb;">Final Price</td><td style="padding: 8px; border: 1px solid #ddd; color: #059669; font-weight: bold;">₱${parseFloat(quote.finalPrice).toLocaleString()}</td></tr>` : ''}
        ${quote.message ? `<tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold; background: #f9fafb;">Your Requirements</td><td style="padding: 8px; border: 1px solid #ddd;">${quote.message}</td></tr>` : ''}
      </table>
      
      ${quote.adminNotes ? `<div style="background: #f3f4f6; padding: 12px; border-radius: 6px; margin: 15px 0;"><strong>Admin Notes:</strong><br/>${quote.adminNotes}</div>` : ''}
      
      <p>This quote is valid for 30 days from the date of issue. If you have any questions or would like to proceed with your order, please don&apos;t hesitate to contact us.</p>
      
      <p style="margin-top: 30px;">Best regards,<br/><strong>ServerHub Team</strong><br/>sales@serverhub.com</p>
    </div>
  `;

  await sendEmail(
    quote.email,
    `Your ServerHub Quote - ${quote.quoteNumber}`,
    quoteHtml
  );

  await sendEmail(
    'nadrolf01@gmail.com',
    `Quote ${quote.quoteNumber} sent to ${quote.email}`,
    `Quote ${quote.quoteNumber} was successfully sent to ${quote.email}.`
  );

  await db.update(quotes).set({
    status: 'quoted' as const,
    updatedAt: new Date(),
  }).where(eq(quotes.id, id));
}
