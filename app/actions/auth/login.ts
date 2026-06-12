'use server';

import { db } from '@/app/db';
import { users } from '@/app/db/schema';
import { comparePassword, generateToken } from '@/app/lib/auth';
import { eq } from 'drizzle-orm';

export async function loginAction(email: string, password: string) {
  const user = await db.select().from(users).where(eq(users.email, email)).limit(1);
  if (!user[0]) return { error: 'Invalid credentials' };

  const valid = await comparePassword(password, user[0].passwordHash);
  if (!valid) return { error: 'Invalid credentials' };

  const token = generateToken({ id: user[0].id, email: user[0].email, role: user[0].role });
  return { token };
}
