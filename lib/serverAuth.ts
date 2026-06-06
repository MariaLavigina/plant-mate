import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

export function getUser(req: NextRequest): { id: number } | null {
  const header = req.headers.get('authorization');
  if (!header) return null;
  const token = header.split(' ')[1];
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { id: number };
  } catch {
    return null;
  }
}
