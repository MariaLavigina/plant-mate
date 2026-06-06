import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { pool } from '../../../lib/db';

export async function POST(req: NextRequest) {
  const { token, newPassword } = await req.json();
  if (!token || !newPassword) return NextResponse.json({ error: 'All fields required' }, { status: 400 });

  try {
    const result = await pool.query(
      'SELECT user_id FROM password_reset_tokens WHERE token = $1 AND expires_at > NOW()',
      [token]
    );
    if (!result.rows.length)
      return NextResponse.json({ error: 'This link has expired or is invalid. Please request a new one.' }, { status: 400 });

    const userId = result.rows[0].user_id;
    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = $1 WHERE id = $2', [hash, userId]);
    await pool.query('DELETE FROM password_reset_tokens WHERE token = $1', [token]);

    return NextResponse.json({ message: 'Password updated successfully.' });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
