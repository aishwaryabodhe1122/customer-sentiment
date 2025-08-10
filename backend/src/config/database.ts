import mongoose from 'mongoose'
import { logger } from '@/utils/logger'

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sentiment-tracker'

export async function connectDatabase(): Promise<void> {
  try {
    const options = {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      bufferMaxEntries: 0,
    }

    await mongoose.connect(MONGODB_URI, options)
    
    mongoose.connection.on('connected', () => {
      logger.info('MongoDB connected successfully')
    })

    mongoose.connection.on('error', (err) => {
      logger.error('MongoDB connection error:', err)
    })

    mongoose.connection.on('disconnected', () => {
      logger.warn('MongoDB disconnected')
    })

    // Graceful shutdown
    process.on('SIGINT', async () => {
      await mongoose.connection.close()
      logger.info('MongoDB connection closed through app termination')
      process.exit(0)
    })

  } catch (error) {
    logger.error('Database connection failed:', error)
    throw error
  }
}

export { mongoose }
