import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { initDb } from './db/index.js'
import postsRouter from './routes/posts.js'
import { handleApiError } from './http.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/posts', postsRouter)

app.get('/api/health', (_req, res) => res.json({ ok: true }))
app.use(handleApiError)

const PORT = process.env.PORT || 3001

initDb().then(() => {
  if (process.env.DEMO_MODE === '1') {
    app.listen(Number(PORT), '127.0.0.1', () => console.log(`Server running on :${PORT}`))
  } else {
    app.listen(PORT, () => console.log(`Server running on :${PORT}`))
  }
})
