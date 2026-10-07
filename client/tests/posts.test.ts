import assert from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import { createPinia, setActivePinia } from 'pinia'
import { usePostsStore, type Post } from '../src/stores/posts'
import { apiRequest } from '../src/lib/api'

const post: Post = {
  id: 1, title: 'Draft', content: 'Keep my work', platform: 'twitter',
  status: 'draft', scheduled_at: null, created_at: '2026-10-01T10:00:00Z',
}
beforeEach(() => setActivePinia(createPinia()))

test('failed loading clears the spinner and preserves existing posts', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response('Unavailable', { status: 503 }))
  const store = usePostsStore()
  store.posts = [post]
  await store.fetch()
  assert.equal(store.loading, false)
  assert.match(store.error, /503/)
  assert.deepEqual(store.posts, [post])
})

test('failed create rejects without inserting an error object', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ error: 'Invalid post' }, { status: 400 }))
  const store = usePostsStore()
  await assert.rejects(store.create(post), /Invalid post/)
  assert.equal(store.posts.length, 0)
})

test('failed deletion preserves the post in the UI', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json({ error: 'Forbidden' }, { status: 403 }))
  const store = usePostsStore()
  store.posts = [post]
  await store.remove(1)
  assert.equal(store.posts.length, 1)
  assert.equal(store.error, 'Forbidden')
})

test('successful deletion accepts an empty 204 response', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => new Response(null, { status: 204 }))
  const store = usePostsStore()
  store.posts = [post]
  await store.remove(1)
  assert.equal(store.posts.length, 0)
  assert.equal(store.error, '')
})

test('successful create stores the returned post', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => Response.json(post, { status: 201 }))
  const store = usePostsStore()
  assert.deepEqual(await store.create(post), post)
  assert.deepEqual(store.posts, [post])
})

test('network failures propagate to the form error handler', async (t) => {
  t.mock.method(globalThis, 'fetch', async () => { throw new Error('Offline') })
  await assert.rejects(apiRequest('/api/posts'), /Offline/)
})
