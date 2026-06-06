import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { pool } from '../../../lib/db';

const PASSWORD_RULE = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
const UK_PHONE_RULE = /^(\+44|0)[1-9]\d{9}$/;

export async function POST(req: NextRequest) {
  const { firstName, lastName, email, password, phone } = await req.json();

  if (!firstName) return NextResponse.json({ error: 'Please enter your first name' }, { status: 400 });
  if (!lastName)  return NextResponse.json({ error: 'Please enter your last name' }, { status: 400 });
  if (!email)     return NextResponse.json({ error: 'Please enter your email' }, { status: 400 });
  if (!password)  return NextResponse.json({ error: 'Please enter your password' }, { status: 400 });
  if (!PASSWORD_RULE.test(password))
    return NextResponse.json({ error: 'Password must be at least 8 characters and include uppercase, lowercase, a number, and a special character (!@#$%^&*)' }, { status: 400 });
  if (!phone) return NextResponse.json({ error: 'Please enter your phone number' }, { status: 400 });
  if (!UK_PHONE_RULE.test(phone.replace(/\s/g, '')))
    return NextResponse.json({ error: 'Please enter a valid UK phone number (e.g. 07911123456 or +447911123456)' }, { status: 400 });

  try {
    const hash = await bcrypt.hash(password, 10);
    const result = await pool.query(
      'INSERT INTO users (first_name, last_name, email, password_hash, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, first_name, last_name, email, badge',
      [firstName, lastName, email, hash, phone]
    );
    const user = result.rows[0];
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET!, { expiresIn: '8h' });
    return NextResponse.json({ user, token });
  } catch (err: unknown) {
    console.error('Register error:', err);
    if ((err as { code?: string }).code === '23505')
      return NextResponse.json({ error: 'Email already in use' }, { status: 409 });
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
