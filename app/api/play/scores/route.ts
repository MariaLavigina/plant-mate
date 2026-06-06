import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '../../../../lib/serverAuth';
import { pool } from '../../../../lib/db';

export async function GET(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: 'No token' }, { status: 401 });

  try {
    const result = await pool.query(
      'SELECT score, badge_earned, created_at FROM play_scores WHERE user_id = $1 ORDER BY created_at DESC',
      [user.id]
    );
    return NextResponse.json({ scores: result.rows });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
