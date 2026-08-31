import { Router } from 'express'
import { pool } from '../db/index.js'
import OpenAI from 'openai'
import { asyncRoute } from '../http.js'

const router = Router()
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

router.get('/', asyncRoute(async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM posts ORDER BY created_at DESC')
  res.json(rows)
}))

router.post('/', asyncRoute(async (req, res) => {
  const { title, content, platform, status, scheduled_at } = req.body
  const { rows } = await pool.query(
    'INSERT INTO posts (title, content, platform, status, scheduled_at) VALUES ($1,$2,$3,$4,$5) RETURNING *',
    [title, content, platform, status || 'draft', scheduled_at || null]
  )
  res.status(201).json(rows[0])
}))

router.put('/:id', asyncRoute(async (req, res) => {
  const { title, content, platform, status, scheduled_at } = req.body
  const { rows } = await pool.query(
    'UPDATE posts SET title=$1,content=$2,platform=$3,status=$4,scheduled_at=$5,updated_at=NOW() WHERE id=$6 RETURNING *',
    [title, content, platform, status, scheduled_at, req.params.id]
  )
  if (!rows.length) return res.status(404).json({ error: 'Not found' })
  res.json(rows[0])
}))

router.delete('/:id', asyncRoute(async (req, res) => {
  await pool.query('DELETE FROM posts WHERE id=$1', [req.params.id])
  res.status(204).send()
}))

router.post('/generate', asyncRoute(async (req, res) => {
  const { topic, platform } = req.body
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{
      role: 'user',
      content: `Write a ${platform} post about: ${topic}. Keep it engaging, use appropriate length for ${platform}. Return only the post text, no explanations.`
    }],
    max_tokens: 300,
  })
  res.json({ content: completion.choices[0].message.content })
}))

export default router
