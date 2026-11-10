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
  if (localPreview) {
    const examples = [
      ['Behind the scenes: spring collection', 'Share three photos from the studio and ask followers which color they would pick.', 'instagram', 'draft', null],
      ['Customer spotlight', 'Tell the story of a customer who simplified their weekly workflow.', 'linkedin', 'draft', null],
      ['Product tips: first five minutes', 'Show how to set up a workspace and invite a teammate in five minutes.', 'twitter', 'scheduled', 0],
      ['Friday studio update', 'A quick look at what we shipped and what we are working on next.', 'facebook', 'scheduled', 2],
      ['Meet the team', 'Introduce the people behind the product and share their favorite workflow tips.', 'instagram', 'scheduled', 4],
      ['Release notes: calendar view', 'The new calendar view makes it easier to see what is going live this week.', 'linkedin', 'published', -1],
      ['Community Q&A recap', 'Thanks for joining our Q&A. Here are the three questions we heard most often.', 'twitter', 'published', -3],
    ] as const

    for (const [title, content, platform, status, offset] of examples) {
      const date = new Date()
      date.setHours(12, 0, 0, 0)
      if (offset !== null) date.setDate(date.getDate() + offset)
      await pool.query(
        'INSERT INTO posts (title, content, platform, status, scheduled_at) VALUES ($1, $2, $3, $4, $5)',
        [title, content, platform, status, offset === null ? null : date.toISOString()],
      )
    }
  }
  console.log('DB initialized')
}
