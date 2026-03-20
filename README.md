# Content Scheduler

Social media post scheduler with AI content generation. Plan posts in a calendar view, generate content with GPT-4o, manage drafts/scheduled/published queue.

## Stack

- **Vue 3** + **TypeScript** + **Pinia** — frontend
- **Node.js** + **Express** — REST API
- **PostgreSQL** — database
- **OpenAI GPT-4o** — AI post generation
- **Tailwind CSS** — styling

## Features

- Calendar view with post indicators per day
- Post queue with draft/scheduled/published filters
- AI content generation by topic + platform
- CRUD for posts via REST API
- Auto-create DB table on startup

## Getting Started

```bash
# Install deps
cd server && npm install
cd ../client && npm install

# Configure env
cp .env.example server/.env
# Edit server/.env with your DB URL and OpenAI key

# Run
cd server && npm run dev   # API on :3001
cd client && npm run dev   # UI on :5173
```

## API Endpoints

```
GET    /api/posts            List all posts
POST   /api/posts            Create post
PUT    /api/posts/:id        Update post
DELETE /api/posts/:id        Delete post
POST   /api/posts/generate   Generate content with AI
```

## Environment Variables

```
DATABASE_URL=postgresql://user:pass@localhost:5432/content_scheduler
OPENAI_API_KEY=sk-...
PORT=3001
```
