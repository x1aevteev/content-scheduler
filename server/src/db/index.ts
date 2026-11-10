import pg from 'pg'
import 'dotenv/config'
import { newDb } from 'pg-mem'

const { Pool } = pg

export const localPreview = process.env.DEMO_MODE === '1'
const DemoPool = localPreview ? newDb().adapters.createPg().Pool : null
export const pool: pg.Pool = DemoPool
  ? new DemoPool()
  : new Pool({ connectionString: process.env.DATABASE_URL })

export async function initDb() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS posts (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      platform TEXT NOT NULL DEFAULT 'twitter',
      status TEXT NOT NULL DEFAULT 'draft',
      scheduled_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
  `)
  console.log('DB initialized')
}
