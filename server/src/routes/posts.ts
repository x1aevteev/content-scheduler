import { Router } from 'express'
import { pool } from '../db/index.js'
import OpenAI from 'openai'
import { asyncRoute } from '../http.js'
import { parseGenerationInput, MAX_TOPIC_LENGTH } from '../generation.js'

const router = Router()

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
  const input = parseGenerationInput(req.body)
  if (!input) {
    return res.status(400).json({ error: `Provide a topic of 1–${MAX_TOPIC_LENGTH} characters and a supported platform.` })
  }
  if (!process.env.OPENAI_API_KEY?.trim()) {
    return res.status(503).json({ error: 'AI generation is not configured on this server.' })
  }
  const { topic, platform } = input
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [{
      role: 'user',
      content: `Write a ${platform} post about: ${topic}. Keep it engaging, use appropriate length for ${platform}. Return only the post text, no explanations.`
    }],
    max_tokens: 300,
  })
  const content = completion.choices[0]?.message.content
  if (!content?.trim()) return res.status(502).json({ error: 'No content was generated. Please try again.' })
  res.json({ content })
}))

export default router
