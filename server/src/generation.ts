const PLATFORMS = ['twitter', 'linkedin', 'instagram', 'facebook']
export const MAX_TOPIC_LENGTH = 2000

export function parseGenerationInput(body: unknown): { topic: string; platform: string } | null {
  if (!body || typeof body !== 'object') return null
  const { topic, platform } = body as Record<string, unknown>
  if (typeof topic !== 'string' || !topic.trim() || topic.trim().length > MAX_TOPIC_LENGTH) return null
  if (typeof platform !== 'string' || !PLATFORMS.includes(platform)) return null
  return { topic: topic.trim(), platform }
}
