import assert from 'node:assert/strict'
import { test } from 'node:test'
import { parseGenerationInput, MAX_TOPIC_LENGTH } from '../dist/generation.js'

test('accepts the supported platforms and trims the topic', () => {
  for (const platform of ['twitter', 'linkedin', 'instagram', 'facebook']) {
    assert.deepEqual(parseGenerationInput({ topic: '  Launch news  ', platform }), { topic: 'Launch news', platform })
  }
})

test('rejects malformed or empty inputs', () => {
  for (const body of [null, {}, [], 'text', { topic: 42, platform: 'twitter' },
    { topic: '  ', platform: 'twitter' }, { topic: 'News', platform: 'unknown' }]) {
    assert.equal(parseGenerationInput(body), null)
  }
})

test('enforces the topic length boundary', () => {
  assert.ok(parseGenerationInput({ topic: 'x'.repeat(MAX_TOPIC_LENGTH), platform: 'twitter' }))
  assert.equal(parseGenerationInput({ topic: 'x'.repeat(MAX_TOPIC_LENGTH + 1), platform: 'twitter' }), null)
})
