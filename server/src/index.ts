import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { initDb } from './db/index.js'
import postsRouter from './routes/posts.js'

const app = express()
app.use(cors())
app.use(express.json())

app.use('/api/posts', postsRouter)

app.get('/api/health', (_req, res) => res.json({ ok: true }))

const PORT = process.env.PORT || 3001

initDb().then(() => {
  app.listen(PORT, () => console.log(`Server running on :${PORT}`))
})
