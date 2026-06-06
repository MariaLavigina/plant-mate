import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '../../../../../lib/serverAuth';
import { pool } from '../../../../../lib/db';

export async function GET(req: NextRequest, { params }: { params: Promise<{ userId: string }> }) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: 'No token' }, { status: 401 });

  const { userId } = await params;
  try {
    const result = await pool.query('SELECT badge FROM users WHERE id = $1', [userId]);
    if (!result.rows.length) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ badge: result.rows[0].badge });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
