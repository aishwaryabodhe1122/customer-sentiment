import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import rateLimit from 'express-rate-limit'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const app = express()

// Basic middleware
app.use(helmet())
app.use(morgan('combined'))
app.use(compression())

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))

// Rate limiting - Disabled for development
if (process.env.NODE_ENV === 'production') {
  const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS!) || 15 * 60 * 1000, // 15 minutes
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS!) || 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  })
  app.use('/api/', limiter)
}

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

// Basic health check route
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Backend server is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  })
})

// Basic sentiment routes (mock data for now)
app.get('/api/sentiment/trends', (_req, res) => {
  const mockTrends = [
    { date: '2024-01-01', positive: 65, negative: 20, neutral: 15, total: 100 },
    { date: '2024-01-02', positive: 70, negative: 18, neutral: 12, total: 120 },
    { date: '2024-01-03', positive: 68, negative: 22, neutral: 10, total: 110 },
    { date: '2024-01-04', positive: 72, negative: 16, neutral: 12, total: 130 },
    { date: '2024-01-05', positive: 69, negative: 19, neutral: 12, total: 125 },
    { date: '2024-01-06', positive: 74, negative: 15, neutral: 11, total: 140 },
    { date: '2024-01-07', positive: 71, negative: 17, neutral: 12, total: 135 }
  ]
  
  res.json({
    success: true,
    data: mockTrends
  })
})

app.get('/api/sentiment/topics', (_req, res) => {
  const mockTopics = [
    {
      topic: 'Product Quality',
      count: 245,
      sentiment_distribution: { positive: 70, negative: 20, neutral: 10 }
    },
    {
      topic: 'Customer Service',
      count: 189,
      sentiment_distribution: { positive: 65, negative: 25, neutral: 10 }
    },
    {
      topic: 'Shipping',
      count: 156,
      sentiment_distribution: { positive: 60, negative: 30, neutral: 10 }
    },
    {
      topic: 'Pricing',
      count: 134,
      sentiment_distribution: { positive: 45, negative: 40, neutral: 15 }
    },
    {
      topic: 'User Experience',
      count: 98,
      sentiment_distribution: { positive: 75, negative: 15, neutral: 10 }
    }
  ]
  
  res.json({
    success: true,
    data: mockTopics
  })
})

app.get('/api/data/sources', (_req, res) => {
  const mockDataSources = [
    {
      id: '1',
      name: 'Twitter API',
      type: 'twitter',
      status: 'active',
      lastFetch: new Date().toISOString(),
      totalRecords: 1247
    },
    {
      id: '2',
      name: 'Instagram API',
      type: 'instagram',
      status: 'active',
      lastFetch: new Date().toISOString(),
      totalRecords: 892
    },
    {
      id: '3',
      name: 'Product Reviews',
      type: 'reviews',
      status: 'active',
      lastFetch: new Date().toISOString(),
      totalRecords: 2156
    },
    {
      id: '4',
      name: 'CSV Upload',
      type: 'csv',
      status: 'inactive',
      lastFetch: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
      totalRecords: 456
    }
  ]
  
  res.json({
    success: true,
    data: mockDataSources
  })
})

// ML Service fallback endpoints (when ML service is not running)
app.post('/api/ml/analyze', (req, res) => {
  const { text } = req.body
  
  // Mock sentiment analysis
  const mockSentiment = {
    text,
    sentiment: Math.random() > 0.6 ? 'positive' : Math.random() > 0.3 ? 'neutral' : 'negative',
    confidence: Math.random() * 0.4 + 0.6, // 0.6 to 1.0
    emotions: {
      joy: Math.random() * 0.8,
      anger: Math.random() * 0.3,
      sadness: Math.random() * 0.3,
      surprise: Math.random() * 0.5,
      fear: Math.random() * 0.2,
      disgust: Math.random() * 0.2
    },
    topics: ['product', 'service', 'experience'],
    timestamp: new Date().toISOString()
  }
  
  res.json(mockSentiment)
})

app.post('/api/ml/analyze/batch', (req, res) => {
  const { texts } = req.body
  
  const results = texts.map((text: string) => ({
    text,
    sentiment: Math.random() > 0.6 ? 'positive' : Math.random() > 0.3 ? 'neutral' : 'negative',
    confidence: Math.random() * 0.4 + 0.6,
    emotions: {
      joy: Math.random() * 0.8,
      anger: Math.random() * 0.3,
      sadness: Math.random() * 0.3,
      surprise: Math.random() * 0.5,
      fear: Math.random() * 0.2,
      disgust: Math.random() * 0.2
    },
    topics: ['product', 'service', 'experience'],
    timestamp: new Date().toISOString()
  }))
  
  res.json(results)
})

// Basic auth routes (mock for now)
app.post('/api/auth/register', (req, res) => {
  res.json({
    success: true,
    message: 'Registration endpoint (mock)',
    data: { userId: '123', email: req.body.email }
  })
})

app.post('/api/auth/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login endpoint (mock)',
    token: 'mock-jwt-token',
    user: { id: '123', email: req.body.email, name: 'Test User' }
  })
})

app.get('/api/auth/me', (req, res) => {
  // Mock endpoint to get current user data
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'No token provided'
    })
  }
  
  // Mock user data - in real app, decode JWT and get user from database
  res.json({
    success: true,
    user: { 
      id: '123', 
      email: 'user@example.com', 
      name: 'Test User',
      createdAt: new Date().toISOString()
    }
  })
})

// Newsletter subscription endpoint
app.post('/api/newsletter/subscribe', (req, res) => {
  const { email } = req.body
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      message: 'Valid email address is required'
    })
  }
  
  // In a real app, save to database
  // For now, we'll simulate saving to a simple in-memory store
  if (!global.newsletterSubscribers) {
    global.newsletterSubscribers = []
  }
  
  // Check if email already exists
  const existingSubscriber = global.newsletterSubscribers.find((sub: any) => sub.email === email)
  if (existingSubscriber) {
    return res.status(409).json({
      success: false,
      message: 'Email is already subscribed to our newsletter'
    })
  }
  
  // Add new subscriber
  const subscriber = {
    id: Date.now().toString(),
    email,
    subscribedAt: new Date().toISOString(),
    status: 'active'
  }
  
  global.newsletterSubscribers.push(subscriber)
  
  console.log(`New newsletter subscription: ${email}`)
  console.log(`Total subscribers: ${global.newsletterSubscribers.length}`)
  
  res.json({
    success: true,
    message: 'Successfully subscribed to newsletter updates',
    data: { email, subscribedAt: subscriber.subscribedAt }
  })
})

// Get newsletter subscribers (admin endpoint)
app.get('/api/newsletter/subscribers', (req, res) => {
  if (!global.newsletterSubscribers) {
    global.newsletterSubscribers = []
  }
  
  res.json({
    success: true,
    data: {
      subscribers: global.newsletterSubscribers,
      total: global.newsletterSubscribers.length
    }
  })
})

// Cookie preferences endpoints
app.post('/api/preferences/cookies', (req, res) => {
  const { preferences, userEmail } = req.body
  
  if (!preferences) {
    return res.status(400).json({
      success: false,
      message: 'Cookie preferences are required'
    })
  }
  
  // Initialize global storage for cookie preferences
  if (!global.cookiePreferences) {
    global.cookiePreferences = []
  }
  
  // Find existing preferences for this user/session
  const sessionId = userEmail || req.ip || 'anonymous'
  const existingIndex = global.cookiePreferences.findIndex((pref: any) => pref.sessionId === sessionId)
  
  const cookiePreference: any = {
    sessionId,
    preferences,
    updatedAt: new Date().toISOString(),
    userAgent: req.headers['user-agent'] || 'unknown'
  }
  
  if (existingIndex >= 0) {
    // Update existing preferences
    global.cookiePreferences[existingIndex] = cookiePreference
  } else {
    // Add new preferences
    cookiePreference.id = Date.now().toString()
    cookiePreference.createdAt = new Date().toISOString()
    global.cookiePreferences.push(cookiePreference)
  }
  
  console.log(`Cookie preferences saved for ${sessionId}:`, preferences)
  console.log(`Total preference records: ${global.cookiePreferences.length}`)
  
  res.json({
    success: true,
    message: 'Cookie preferences saved successfully',
    data: { preferences, updatedAt: cookiePreference.updatedAt }
  })
})

// Get cookie preferences for a user/session
app.get('/api/preferences/cookies', (req, res) => {
  if (!global.cookiePreferences) {
    global.cookiePreferences = []
  }
  
  const sessionId = req.query['userEmail'] || req.ip || 'anonymous'
  const userPreferences = global.cookiePreferences.find((pref: any) => pref.sessionId === sessionId)
  
  if (userPreferences) {
    res.json({
      success: true,
      data: userPreferences
    })
  } else {
    // Return default preferences
    res.json({
      success: true,
      data: {
        preferences: {
          essential: true,
          analytics: true,
          functional: true,
          marketing: false
        }
      }
    })
  }
})

// Error handling middleware
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`
  })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 Backend server running on port ${PORT}`)
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`)
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`)
})

export default app
