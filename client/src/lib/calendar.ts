import type { Post } from '../stores/posts'

export function getCalendarDays(year: number, month: number): Array<number | null> {
  const firstWeekday = new Date(year, month, 1).getDay()
  const dayCount = new Date(year, month + 1, 0).getDate()
  return [...Array(firstWeekday).fill(null), ...Array.from({ length: dayCount }, (_, i) => i + 1)]
}

export function getScheduledPostsForMonth(posts: readonly Post[], year: number, month: number): Post[] {
  return posts.filter(post => {
    if (post.status !== 'scheduled' || !post.scheduled_at) return false
    const date = new Date(post.scheduled_at)
    return date.getFullYear() === year && date.getMonth() === month
  }).sort((a, b) => new Date(a.scheduled_at!).getTime() - new Date(b.scheduled_at!).getTime())
}
