import type { NextFunction, Request, Response } from 'express';

export function notFound(req: Request, res: Response) {
  res.status(404).json({ message: 'Not Found', code: 'NOT_FOUND' });
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  const status = err.status || err.statusCode || 500;
  const code = err.code || 'INTERNAL_ERROR';
  const message = err.message || 'Internal Server Error';
  const details = err.details;
  res.status(status).json({ message, code, ...(details ? { details } : {}) });
}
