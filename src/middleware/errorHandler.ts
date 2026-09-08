import { Request, Response, NextFunction } from 'express';
import { ENV } from '../config/env.js';

export function errorHandler(err: any, req: Request, res: Response, next: NextFunction): void {
  console.error('Server error intercepted:', err);

  const statusCode = err.status || err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    success: false,
    message,
    errorCode: err.code || 'SERVER_ERROR',
    ...(ENV.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  });
}
