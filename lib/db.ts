import { Pool } from 'pg';

const g = global as typeof global & { _pgPool?: Pool };
if (!g._pgPool) {
  g._pgPool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
  });
}
export const pool = g._pgPool;
