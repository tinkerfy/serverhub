'use server';

import { db } from '@/app/db';
import { quotes } from '@/app/db/schema';
import { sendEmail } from '@/app/lib/email';

export async function submitQuoteAction(prevState: { success: boolean; quoteNumber: string } | null, formData: FormData) {
  const firstName = formData.get('firstName') as string;
  const lastName = formData.get('lastName') as string;
  const email = formData.get('email') as string;
  const phone = formData.get('phone') as string;
  const company = formData.get('company') as string;
  const category = formData.get('category') as string;
  const specificInterest = formData.get('specificInterest') as string;
  const quantity = parseInt(formData.get('quantity') as string) || 1;
  const budgetRange = formData.get('budgetRange') as string;
  const message = formData.get('message') as string;

  if (!firstName || !lastName || !email || !category) {
    return { success: false, quoteNumber: '' };
  }

  const year = new Date().getFullYear();
  const randomNum = Math.floor(Math.random() * 9000) + 1000;
  const quoteNumber = `QO-${year}-${randomNum}`;

  await db.insert(quotes).values({
    quoteNumber,
    firstName,
    lastName,
    email,
    phone: phone || null,
    company: company || null,
    category,
    specificInterest: specificInterest || null,
    quantity,
    budgetRange: budgetRange || null,
    message: message || null,
    status: 'pending',
  });

  try {
    await sendEmail(
      adminEmail,
      `New Quote Request: ${quoteNumber}`,
      `
        <h2>New Quote Request Received</h2>
        <table style="border-collapse: collapse; width: 100%; margin-bottom: 20px;">
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Quote #</td><td style="padding: 8px; border: 1px solid #ddd;">${quoteNumber}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Name</td><td style="padding: 8px; border: 1px solid #ddd;">${firstName} ${lastName}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Email</td><td style="padding: 8px; border: 1px solid #ddd;">${email}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Phone</td><td style="padding: 8px; border: 1px solid #ddd;">${phone || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Company</td><td style="padding: 8px; border: 1px solid #ddd;">${company || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Category</td><td style="padding: 8px; border: 1px solid #ddd;">${category}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Specific Interest</td><td style="padding: 8px; border: 1px solid #ddd;">${specificInterest || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Quantity</td><td style="padding: 8px; border: 1px solid #ddd;">${quantity}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Budget Range</td><td style="padding: 8px; border: 1px solid #ddd;">${budgetRange || 'N/A'}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd; font-weight: bold;">Message</td><td style="padding: 8px; border: 1px solid #ddd;">${message || 'N/A'}</td></tr>
        </table>
        <p><a href="http://localhost:3000/admin/quotes" style="display: inline-block; padding: 10px 20px; background: #2563eb; color: white; text-decoration: none; border-radius: 6px;">View in Admin Dashboard</a></p>
      `
    );
  } catch (e) {
    console.error('[Email] Failed to send admin notification:', e);
  }

  return { success: true, quoteNumber };
}
