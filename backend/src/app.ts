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
