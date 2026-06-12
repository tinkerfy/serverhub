'use server';

import { db } from '@/app/db';
import { users } from '@/app/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, generateToken } from '@/app/lib/auth';

export async function registerAction(name: string, email: string, password: string) {
  const existing = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (existing[0]) return { error: 'Email already registered' };

  const passwordHash = await hashPassword(password);
  const result = await db.insert(users).values({ name, email, passwordHash, role: 'user' }).returning();

  const token = generateToken({ id: result[0].id, email: result[0].email, role: 'user' });
  return { token, user: { id: result[0].id, email: result[0].email, role: result[0].role } };
}
