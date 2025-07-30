import { NextFunction, Request, Response } from 'express';

interface CustomError extends Error {
  status?: number;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const errorHandler = (err: CustomError, req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);

  const status = err.status || 500;

  res.status(status).send({
    status: 'error',
    message: err.message,
  });
};

export default errorHandler;
