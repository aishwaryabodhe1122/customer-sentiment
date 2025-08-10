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

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS!) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS!) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
})
app.use('/api/', limiter)

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
  res.json({
    success: true,
    data: {
      trends: [
        { date: '2024-01-01', positive: 65, negative: 20, neutral: 15 },
        { date: '2024-01-02', positive: 70, negative: 18, neutral: 12 },
        { date: '2024-01-03', positive: 68, negative: 22, neutral: 10 }
      ]
    }
  })
})

app.get('/api/sentiment/topics', (_req, res) => {
  res.json({
    success: true,
    data: {
      topics: [
        { topic: 'Product Quality', sentiment: 0.8, mentions: 150 },
        { topic: 'Customer Service', sentiment: 0.6, mentions: 120 },
        { topic: 'Pricing', sentiment: -0.2, mentions: 80 }
      ]
    }
  })
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
