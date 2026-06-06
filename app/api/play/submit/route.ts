import { NextRequest, NextResponse } from 'next/server';
import { getUser } from '../../../../lib/serverAuth';
import { pool } from '../../../../lib/db';

export async function POST(req: NextRequest) {
  const user = getUser(req);
  if (!user) return NextResponse.json({ error: 'No token' }, { status: 401 });

  const { score } = await req.json();
  if (score == null) return NextResponse.json({ error: 'Score required' }, { status: 400 });

  const badge = score >= 8 ? 'gold' : score >= 5 ? 'silver' : 'bronze';

  try {
    await pool.query('INSERT INTO play_scores (user_id, score, badge_earned) VALUES ($1, $2, $3)', [user.id, score, badge]);

    const badgeRank: Record<string, number> = { gold: 3, silver: 2, bronze: 1 };
    const userResult = await pool.query('SELECT badge FROM users WHERE id = $1', [user.id]);
    const currentBadge = userResult.rows[0]?.badge;
    if (!currentBadge || badgeRank[badge] > (badgeRank[currentBadge] ?? 0)) {
      await pool.query('UPDATE users SET badge = $1 WHERE id = $2', [badge, user.id]);
    }

    return NextResponse.json({ badge });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
