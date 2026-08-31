import type { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler } from 'express'

type AsyncHandler = (req: Request, res: Response, next: NextFunction) => Promise<unknown>

// Express 4 does not automatically forward rejected handler promises.
export function asyncRoute(handler: AsyncHandler): RequestHandler {
  return (req, res, next) => {
    Promise.resolve().then(() => handler(req, res, next)).catch(next)
  }
}

export const handleApiError: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) return next(error)
  if (error?.type === 'entity.parse.failed') {
    res.status(400).json({ error: 'Invalid JSON request body' })
    return
  }
  if (error?.type === 'entity.too.large') {
    res.status(413).json({ error: 'Request body is too large' })
    return
  }
  console.error('API request failed')
  res.status(500).json({ error: 'Unable to complete the request. Please try again.' })
}
