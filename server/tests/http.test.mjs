import assert from 'node:assert/strict'
import { test } from 'node:test'
import { asyncRoute, handleApiError } from '../dist/http.js'

test('async handlers forward rejected promises to Express', async () => {
  const error = new Error('database unavailable')
  const forwarded = await new Promise(resolve => {
    asyncRoute(async () => { throw error })({}, {}, resolve)
  })
  assert.equal(forwarded, error)
})

test('sync throws also reach the error middleware', async () => {
  const error = new Error('bad handler')
  const forwarded = await new Promise(resolve => {
    asyncRoute(() => { throw error })({}, {}, resolve)
  })
  assert.equal(forwarded, error)
})

test('error responses are JSON and do not expose internal details', (t) => {
  t.mock.method(console, 'error', () => {})
  let status, body
  const response = {
    status(value) { status = value; return this },
    json(value) { body = value; return this },
  }
  handleApiError(new Error('secret connection string'), {}, response, assert.fail)
  assert.equal(status, 500)
  assert.equal(body.error, 'Unable to complete the request. Please try again.')
  handleApiError({ type: 'entity.parse.failed' }, {}, response, assert.fail)
  assert.equal(status, 400)
  handleApiError({ type: 'entity.too.large' }, {}, response, assert.fail)
  assert.equal(status, 413)
})

test('already-started responses delegate to the next error handler', () => {
  const error = new Error('stream failed')
  let forwarded
  handleApiError(error, {}, { headersSent: true }, value => { forwarded = value })
  assert.equal(forwarded, error)
})
