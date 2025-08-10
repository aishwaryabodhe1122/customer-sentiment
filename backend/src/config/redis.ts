import { createClient, RedisClientType } from 'redis'
import { logger } from '@/utils/logger'

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379'

let redisClient: RedisClientType

export async function connectRedis(): Promise<RedisClientType> {
  try {
    redisClient = createClient({
      url: REDIS_URL,
      socket: {
        connectTimeout: 5000,
        lazyConnect: true,
      },
    })

    redisClient.on('error', (err) => {
      logger.error('Redis Client Error:', err)
    })

    redisClient.on('connect', () => {
      logger.info('Redis connected successfully')
    })

    redisClient.on('reconnecting', () => {
      logger.info('Redis reconnecting...')
    })

    redisClient.on('ready', () => {
      logger.info('Redis ready to accept commands')
    })

    await redisClient.connect()
    
    // Test connection
    await redisClient.ping()
    
    return redisClient
  } catch (error) {
    logger.error('Redis connection failed:', error)
    throw error
  }
}

export function getRedisClient(): RedisClientType {
  if (!redisClient) {
    throw new Error('Redis client not initialized. Call connectRedis() first.')
  }
  return redisClient
}

// Cache utilities
export class CacheService {
  private client: RedisClientType

  constructor() {
    this.client = getRedisClient()
  }

  async get(key: string): Promise<string | null> {
    try {
      return await this.client.get(key)
    } catch (error) {
      logger.error('Cache get error:', error)
      return null
    }
  }

  async set(key: string, value: string, ttl?: number): Promise<boolean> {
    try {
      if (ttl) {
        await this.client.setEx(key, ttl, value)
      } else {
        await this.client.set(key, value)
      }
      return true
    } catch (error) {
      logger.error('Cache set error:', error)
      return false
    }
  }

  async del(key: string): Promise<boolean> {
    try {
      await this.client.del(key)
      return true
    } catch (error) {
      logger.error('Cache delete error:', error)
      return false
    }
  }

  async exists(key: string): Promise<boolean> {
    try {
      const result = await this.client.exists(key)
      return result === 1
    } catch (error) {
      logger.error('Cache exists error:', error)
      return false
    }
  }

  async increment(key: string, value: number = 1): Promise<number> {
    try {
      return await this.client.incrBy(key, value)
    } catch (error) {
      logger.error('Cache increment error:', error)
      return 0
    }
  }

  async expire(key: string, ttl: number): Promise<boolean> {
    try {
      await this.client.expire(key, ttl)
      return true
    } catch (error) {
      logger.error('Cache expire error:', error)
      return false
    }
  }

  async getJson<T>(key: string): Promise<T | null> {
    try {
      const value = await this.get(key)
      return value ? JSON.parse(value) : null
    } catch (error) {
      logger.error('Cache getJson error:', error)
      return null
    }
  }

  async setJson<T>(key: string, value: T, ttl?: number): Promise<boolean> {
    try {
      return await this.set(key, JSON.stringify(value), ttl)
    } catch (error) {
      logger.error('Cache setJson error:', error)
      return false
    }
  }
}

export const cacheService = new CacheService()
