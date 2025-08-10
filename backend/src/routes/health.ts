import express from 'express'
import { mongoose } from '../config/database'
import { getRedisClient } from '../config/redis'

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
      version: '1.0.0',
      services: {
        database: 'unknown',
        redis: 'unknown'
      }
    }

    // Check MongoDB connection
    try {
      if (mongoose.connection.readyState === 1) {
        health.services.database = 'connected'
      } else {
        health.services.database = 'disconnected'
      }
    } catch (error) {
      health.services.database = 'error'
    }

    // Check Redis connection
    try {
      const redisClient = getRedisClient()
      await redisClient.ping()
      health.services.redis = 'connected'
    } catch (error) {
      health.services.redis = 'error'
    }

    const statusCode = health.services.database === 'connected' && health.services.redis === 'connected' ? 200 : 503

    res.status(statusCode).json(health)
  } catch (error) {
    res.status(503).json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: 'Health check failed'
    })
  }
})

export { router as healthRoutes }
