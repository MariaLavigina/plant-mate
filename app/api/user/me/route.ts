import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '../../../../lib/serverAuth';
import { pool } from '../../../../lib/db';

export async function GET(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: 'No token' }, { status: 401 });

  try {
    const result = await pool.query(
      'SELECT id, first_name, last_name, email, badge, matched_plant, match_pct FROM users WHERE id = $1',
      [user.id]
    );
    if (!result.rows.length) return NextResponse.json({ error: 'User not found' }, { status: 404 });
    return NextResponse.json({ user: result.rows[0] });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
