import { RequestHandler, ErrorRequestHandler } from 'express';

export const notFound: RequestHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};

export const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  const details = err.details || null;

  res.status(status).json({
    success: false,
    message,
    ...(details && { details }),
  });
};
