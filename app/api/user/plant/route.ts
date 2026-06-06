import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '../../../../lib/serverAuth';
import { pool } from '../../../../lib/db';

export async function PATCH(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: 'No token' }, { status: 401 });

  const { plantName, matchPct } = await req.json();
  if (!plantName) return NextResponse.json({ error: 'plantName required' }, { status: 400 });

  try {
    await pool.query('UPDATE users SET matched_plant = $1, match_pct = $2 WHERE id = $3', [plantName, matchPct ?? null, user.id]);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
