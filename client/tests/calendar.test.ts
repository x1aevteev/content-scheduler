import assert from 'node:assert/strict'
import { test } from 'node:test'
import { getCalendarDays, getScheduledPostsForMonth } from '../src/lib/calendar'
import type { Post } from '../src/stores/posts'

test('calendar aligns the first day and handles leap years', () => {
  const leap = getCalendarDays(2024, 1)
  assert.deepEqual(leap.slice(0, 5), [null, null, null, null, 1])
  assert.equal(leap.filter(day => day !== null).length, 29)
  assert.equal(getCalendarDays(2025, 1).filter(day => day !== null).length, 28)
})

test('calendar supports year boundaries', () => {
  assert.deepEqual(getCalendarDays(2026, 12), getCalendarDays(2027, 0))
  assert.deepEqual(getCalendarDays(2026, -1), getCalendarDays(2025, 11))
})

function post(id: number, scheduled_at: string | null, status: Post['status'] = 'scheduled'): Post {
  return { id, scheduled_at, status, title: 'Post', content: '', platform: 'twitter', created_at: '' }
}

test('monthly agenda sorts by schedule without mutating store order', () => {
  const late = new Date(2026, 9, 20, 12).toISOString()
  const early = new Date(2026, 9, 2, 9).toISOString()
  const posts = Object.freeze([post(1, late), post(2, early)])
  assert.deepEqual(getScheduledPostsForMonth(posts, 2026, 9).map(p => p.id), [2, 1])
  assert.deepEqual(posts.map(p => p.id), [1, 2])
})

test('monthly agenda excludes drafts, published posts, other months and invalid dates', () => {
  const date = new Date(2026, 9, 1, 12).toISOString()
  const posts = [post(1, date), post(2, date, 'draft'), post(3, date, 'published'),
    post(4, new Date(2026, 10, 1, 12).toISOString()), post(5, null), post(6, 'invalid'),
    post(7, new Date(2025, 9, 1, 12).toISOString())]
  assert.deepEqual(getScheduledPostsForMonth(posts, 2026, 9).map(p => p.id), [1])
})
