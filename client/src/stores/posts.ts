import { defineStore } from 'pinia'
import { apiRequest } from '../lib/api'

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
  state: () => ({ posts: [] as Post[], loading: false, error: '' }),
  getters: {
    byStatus: (s) => (status: string) => s.posts.filter(p => p.status === status),
  },
  actions: {
    async fetch() {
      this.loading = true
      this.error = ''
      try {
        this.posts = await apiRequest<Post[]>('/api/posts')
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unable to load posts.'
      } finally {
        this.loading = false
      }
    },
    async create(data: Omit<Post, 'id' | 'created_at'>) {
      const post = await apiRequest<Post>('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      this.posts.unshift(post)
      return post
    },
    async update(id: number, data: Partial<Post>) {
      const updated = await apiRequest<Post>(`/api/posts/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      const idx = this.posts.findIndex(p => p.id === id)
      if (idx !== -1) this.posts[idx] = updated
    },
    async remove(id: number) {
      this.error = ''
      try {
        await apiRequest<void>(`/api/posts/${id}`, { method: 'DELETE' })
        this.posts = this.posts.filter(p => p.id !== id)
      } catch (error) {
        this.error = error instanceof Error ? error.message : 'Unable to delete post.'
      }
    },
    async generate(topic: string, platform: string): Promise<string> {
      const { content } = await apiRequest<{ content: string }>('/api/posts/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic, platform }),
      })
      return content
    },
  },
})
