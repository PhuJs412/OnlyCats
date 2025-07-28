import { RequestHandler } from 'express';

export const notFound: RequestHandler = (req, res) => {
  res.status(404).json({
    status: 404,
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};
