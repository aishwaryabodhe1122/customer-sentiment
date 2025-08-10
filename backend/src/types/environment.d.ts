declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test'
      PORT: string
      MONGODB_URI: string
      REDIS_URL: string
      JWT_SECRET: string
      JWT_EXPIRES_IN: string
      FRONTEND_URL: string
      RATE_LIMIT_WINDOW_MS: string
      RATE_LIMIT_MAX_REQUESTS: string
      LOG_LEVEL: string
      LOG_FILE: string
      SMTP_HOST: string
      SMTP_PORT: string
      SMTP_USER: string
      SMTP_PASS: string
      TWITTER_API_KEY: string
      TWITTER_API_SECRET: string
      TWITTER_ACCESS_TOKEN: string
      TWITTER_ACCESS_TOKEN_SECRET: string
      TWITTER_BEARER_TOKEN: string
      INSTAGRAM_ACCESS_TOKEN: string
      INSTAGRAM_APP_ID: string
      INSTAGRAM_APP_SECRET: string
      ML_SERVICE_URL: string
    }
  }
}

export {}
