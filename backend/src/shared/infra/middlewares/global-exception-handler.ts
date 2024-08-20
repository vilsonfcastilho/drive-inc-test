import { AppError } from '@/shared/errors/app-error'
import { NextFunction, Request, Response } from 'express'
import { ZodError } from 'zod'

export const globalExceptionHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction,
): Response => {
  if (err instanceof AppError) {
    return res.status(err.statusCode ?? 400).json({
      status: 'error',
      message: err.message,
    })
  }

  if (err instanceof ZodError) {
    return res.status(400).json({
      status: 'error',
      message: 'Zod validation error.',
      data: err.errors,
    })
  }

  console.log('Unhandled Error: ', err)

  return res.status(500).json({
    status: 'error',
    message: 'Internal server error.',
  })
}
