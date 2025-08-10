import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { User } from '../models/User'
import { CustomError } from '../middleware/errorHandler'
import { AuthRequest } from '../middleware/auth'

const generateToken = (id: string): string => {
  const secret = process.env.JWT_SECRET || 'fallback-secret-key-for-development'
  return jwt.sign({ id }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d'
  } as jwt.SignOptions)
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return next(new CustomError('User already exists with this email', 400))
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
    })

    // Generate token
    const token = generateToken(user._id.toString())

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body

    // Find user and include password
    const user = await User.findOne({ email }).select('+password')
    if (!user) {
      return next(new CustomError('Invalid credentials', 401))
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password)
    if (!isPasswordValid) {
      return next(new CustomError('Invalid credentials', 401))
    }

    // Update last login
    user.lastLogin = new Date()
    await user.save()

    // Generate token
    const token = generateToken(user._id.toString())

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const getCurrentUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user!

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferences: user.preferences,
        apiUsage: user.apiUsage,
        lastLogin: user.lastLogin,
        createdAt: user.createdAt,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const updateProfile = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user!
    const { name, email, preferences } = req.body

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email })
      if (existingUser) {
        return next(new CustomError('Email already in use', 400))
      }
      user.email = email
    }

    if (name) user.name = name
    if (preferences) {
      user.preferences = { ...user.preferences, ...preferences }
    }

    await user.save()

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        preferences: user.preferences,
        updatedAt: user.updatedAt,
      },
    })
  } catch (error) {
    next(error)
  }
}

export const changePassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user!._id.toString()).select('+password')
    if (!user) {
      return next(new CustomError('User not found', 404))
    }

    const { currentPassword, newPassword } = req.body

    // Verify current password
    const isCurrentPasswordValid = await user.comparePassword(currentPassword)
    if (!isCurrentPasswordValid) {
      return next(new CustomError('Current password is incorrect', 400))
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.json({
      success: true,
      message: 'Password updated successfully',
    })
  } catch (error) {
    next(error)
  }
}

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email })
    if (!user) {
      return next(new CustomError('No user found with this email', 404))
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString('hex')
    user.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex')
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    await user.save()

    // In production, send email with reset token
    // For now, just return success message
    res.json({
      success: true,
      message: 'Password reset token sent to email',
      // In development, include the token
      ...(process.env.NODE_ENV === 'development' && { resetToken }),
    })
  } catch (error) {
    next(error)
  }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body

    // Hash the token to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    })

    if (!user) {
      return next(new CustomError('Invalid or expired reset token', 400))
    }

    // Update password and clear reset token
    user.password = password
    user.passwordResetToken = undefined as any
    user.passwordResetExpires = undefined as any
    await user.save()

    // Generate new JWT token
    const jwtToken = generateToken(user._id.toString())

    res.json({
      success: true,
      message: 'Password reset successful',
      token: jwtToken,
    })
  } catch (error) {
    next(error)
  }
}

export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.params

    const user = await User.findOne({ emailVerificationToken: token })
    if (!user) {
      return next(new CustomError('Invalid verification token', 400))
    }

    user.isEmailVerified = true
    user.emailVerificationToken = undefined as any
    await user.save()

    res.json({
      success: true,
      message: 'Email verified successfully',
    })
  } catch (error) {
    next(error)
  }
}

export const resendVerification = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const user = req.user!

    if (user.isEmailVerified) {
      return next(new CustomError('Email is already verified', 400))
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex')
    user.emailVerificationToken = verificationToken
    await user.save()

    // In production, send verification email
    res.json({
      success: true,
      message: 'Verification email sent',
      // In development, include the token
      ...(process.env.NODE_ENV === 'development' && { verificationToken }),
    })
  } catch (error) {
    next(error)
  }
}
