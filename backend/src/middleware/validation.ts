import { Request, Response, NextFunction } from 'express'
import { validationResult } from 'express-validator'
import { CustomError } from './errorHandler'

export const validateRequest = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req)
  
  if (!errors.isEmpty()) {
    const errorMessages = errors.array().map(error => error.msg).join(', ')
    return next(new CustomError(errorMessages, 400))
  }
  
  next()
}
