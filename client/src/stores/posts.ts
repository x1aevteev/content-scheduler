import { defineStore } from 'pinia'

export interface Post {
  id: number
  title: string
  content: string
  platform: string
  status: 'draft' | 'scheduled' | 'published'
  scheduled_at: string | null
  created_at: string
}

export const usePostsStore = defineStore('posts', {
  state: () => ({ posts: [] as Post[], loading: false }),
  getters: {
    byStatus: (s) => (status: string) => s.posts.filter(p => p.status === status),
  },
  actions: {
    async fetch() {
      this.loading = true
      const res = await fetch('/api/posts')
      this.posts = await res.json()
      this.loading = false
    },
    async create(data: Omit<Post, 'id' | 'created_at'>) {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const post = await res.json()
      this.posts.unshift(post)
      return post
    },
    async update(id: number, data: Partial<Post>) {
      const res = await fetch(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const updated = await res.json()
      const idx = this.posts.findIndex(p => p.id === id)
      if (idx !== -1) this.posts[idx] = updated
    },
    async remove(id: number) {
      await fetch(`/api/posts/${id}`, { method: 'DELETE' })
      this.posts = this.posts.filter(p => p.id !== id)
    },
    async generate(topic: string, platform: string): Promise<string> {
      const res = await fetch('/api/posts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform }),
      })
      const { content } = await res.json()
      return content
    },
  },
})
