import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import db from './db';

export interface User {
  id: number;
  email: string;
  name: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createUser(email: string, password: string, name: string) {
  const hashedPassword = await hashPassword(password);
  
  try {
    const stmt = db.prepare('INSERT INTO users (email, password, name) VALUES (?, ?, ?)');
    const result = stmt.run(email, hashedPassword, name);
    return { success: true, userId: result.lastInsertRowid };
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT') {
      return { success: false, error: 'Email already exists' };
    }
    return { success: false, error: 'Failed to create user' };
  }
}

export async function authenticateUser(email: string, password: string) {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.get(email) as any;

  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }

  const isValid = await verifyPassword(password, user.password);
  
  if (!isValid) {
    return { success: false, error: 'Invalid credentials' };
  }

  return { 
    success: true, 
    user: { 
      id: user.id, 
      email: user.email, 
      name: user.name 
    } 
  };
}

export async function setUserSession(userId: number) {
  const cookieStore = await cookies();
  cookieStore.set('userId', userId.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7, // 1 week
  });
}

export async function getUserSession(): Promise<User | null> {
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value;

  if (!userId) {
    return null;
  }

  const stmt = db.prepare('SELECT id, email, name FROM users WHERE id = ?');
  const user = stmt.get(userId) as User | undefined;

  return user || null;
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete('userId');
}
