import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { User, IUser } from '../models/User'
import { CustomError } from './errorHandler'

export interface AuthRequest extends Request {
  user?: IUser
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return next(new CustomError('Access denied. No token provided.', 401))
    }

    const secret = process.env.JWT_SECRET || 'fallback-secret-key-for-development'
    const decoded = jwt.verify(token, secret) as { id: string }
    const user = await User.findById(decoded.id).select('+password')

    if (!user) {
      return next(new CustomError('Invalid token.', 401))
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Reset API usage if needed (commented out for now)
    // user.resetApiUsage()

    req.user = user
    next()
  } catch (error) {
    next(new CustomError('Invalid token.', 401))
  }
}

export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new CustomError('Access denied. Please authenticate.', 401))
    }

    if (!roles.includes(req.user.role)) {
      return next(new CustomError('Access denied. Insufficient permissions.', 403))
    }

    next()
  }
}

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '')

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string }
      const user = await User.findById(decoded.id)
      
      if (user) {
        req.user = user
      }
    }

    next()
  } catch (error) {
    // Continue without authentication if token is invalid
    next()
  }
}

export const checkApiLimit = async (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user) {
    return next()
  }

  const user = req.user
  const limit = user.role === 'admin' ? 10000 : 1000 // requests per month

  if (user.apiUsage.requestsThisMonth >= limit) {
    return next(new CustomError('API limit exceeded. Please upgrade your plan.', 429))
  }

  // Increment usage
  user.apiUsage.requestsThisMonth += 1
  await user.save()

  next()
}
