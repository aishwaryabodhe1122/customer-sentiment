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

// Sentiment trends endpoint
app.get('/api/sentiment/trends', (req, res) => {
  const range = req.query['range'] || '7d'
  
  // Generate mock trend data for the specified range (default 7 days)
  const mockTrends = []
  const today = new Date()
  const days = range === '30d' ? 30 : range === '90d' ? 90 : 7
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today)
    date.setDate(date.getDate() - i)
    
    mockTrends.push({
      date: date.toISOString().split('T')[0], // YYYY-MM-DD format
      positive: Math.floor(Math.random() * 50) + 30, // 30-80
      neutral: Math.floor(Math.random() * 30) + 10,  // 10-40
      negative: Math.floor(Math.random() * 20) + 5,  // 5-25
      total: Math.floor(Math.random() * 100) + 50    // 50-150
    })
  }
  
  res.json(mockTrends)
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
    message: 'Login successful',
    token: 'mock-jwt-token',
    user: { 
      id: '123', 
      email: req.body.email || 'aishwaryabodhe1122@gmail.com', 
      name: 'Aishwarya Bodhe',
      role: 'admin'
    }
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
      email: 'aishwaryabodhe1122@gmail.com', 
      name: 'Aishwarya Bodhe',
      role: 'admin',
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

// Contact form submission endpoint
app.post('/api/contact/submit', (req, res) => {
  const { name, email, company, subject, message, priority } = req.body
  
  if (!name || !email || !subject || !message) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, subject, and message are required'
    })
  }
  
  if (!email.includes('@')) {
    return res.status(400).json({
      success: false,
      message: 'Valid email address is required'
    })
  }
  
  // Initialize global storage for contact submissions
  if (!global.contactSubmissions) {
    global.contactSubmissions = []
  }
  
  // Create contact submission record
  const contactSubmission = {
    id: Date.now().toString(),
    name,
    email,
    company: company || '',
    subject,
    message,
    priority: priority || 'medium',
    submittedAt: new Date().toISOString(),
    status: 'new',
    userAgent: req.headers['user-agent'] || 'unknown',
    ip: req.ip
  }
  
  global.contactSubmissions.push(contactSubmission)
  
  console.log(`New contact form submission from ${name} (${email}):`)
  console.log(`Subject: ${subject}`)
  console.log(`Priority: ${priority}`)
  console.log(`Total contact submissions: ${global.contactSubmissions.length}`)
  
  res.json({
    success: true,
    message: 'Your message has been sent successfully! We\'ll get back to you within 24 hours.',
    data: { id: contactSubmission.id }
  })
})

// Get contact submissions (admin endpoint)
app.get('/api/contact/submissions', (req, res) => {
  if (!global.contactSubmissions) {
    global.contactSubmissions = []
  }
  
  res.json({
    success: true,
    data: {
      submissions: global.contactSubmissions,
      total: global.contactSubmissions.length
    }
  })
})

// Import email service
import emailService from './services/emailService'

// Report Actions Endpoints

// Email Report endpoint
app.post('/api/reports/email', async (req, res) => {
  const { email, reportType, dateRange, reportData } = req.body
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      message: 'Valid email address is required'
    })
  }
  
  if (!reportType || !reportData) {
    return res.status(400).json({
      success: false,
      message: 'Report type and data are required'
    })
  }
  
  // Initialize global storage for email reports
  if (!global.emailReports) {
    global.emailReports = []
  }
  
  try {
    // Send actual email using email service
    const emailSent = await emailService.sendReportEmail(
      email,
      reportType,
      dateRange || '30d',
      reportData
    )
    
    // Create email report record
    const emailReport = {
      id: Date.now().toString(),
      email,
      reportType,
      dateRange: dateRange || '30d',
      reportData,
      sentAt: new Date().toISOString(),
      status: emailSent ? 'sent' : 'failed',
      userAgent: req.headers['user-agent'] || 'unknown'
    }
    
    global.emailReports.push(emailReport)
    
    console.log(`Report email attempt to ${email}:`)
    console.log(`Report Type: ${reportType}`)
    console.log(`Date Range: ${dateRange}`)
    console.log(`Status: ${emailSent ? 'SUCCESS' : 'FAILED'}`)
    console.log(`Total email reports: ${global.emailReports.length}`)
    
    if (emailSent) {
      res.json({
        success: true,
        message: 'Report has been sent successfully to your email inbox!',
        data: { id: emailReport.id, sentAt: emailReport.sentAt }
      })
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to send email. Please check email configuration.',
        data: { id: emailReport.id }
      })
    }
  } catch (error) {
    console.error('Error in email report endpoint:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error while sending email'
    })
  }
})

// Schedule Report endpoint
app.post('/api/reports/schedule', async (req, res) => {
  const { reportType, dateRange, frequency, reportData } = req.body
  
  if (!reportType || !frequency || !reportData) {
    return res.status(400).json({
      success: false,
      message: 'Report type, frequency, and data are required'
    })
  }
  
  if (!['Daily', 'Weekly', 'Monthly'].includes(frequency)) {
    return res.status(400).json({
      success: false,
      message: 'Frequency must be Daily, Weekly, or Monthly'
    })
  }
  
  // Initialize global storage for scheduled reports
  if (!global.scheduledReports) {
    global.scheduledReports = []
  }
  
  try {
    // Calculate next run time
    const nextRunAt = calculateNextRun(frequency)
    
    // Create scheduled report record
    const scheduledReport = {
      id: Date.now().toString(),
      reportType,
      dateRange: dateRange || '30d',
      frequency,
      reportData,
      scheduledAt: new Date().toISOString(),
      nextRunAt,
      status: 'active',
      userAgent: req.headers['user-agent'] || 'unknown'
    }
    
    global.scheduledReports.push(scheduledReport)
    
    // Send confirmation email to user
    const userEmail = 'aishwaryabodhe7007@gmail.com' // In production, get from authenticated user
    const emailSent = await emailService.sendScheduleConfirmationEmail(
      userEmail,
      reportType,
      frequency,
      nextRunAt
    )
    
    console.log(`Report scheduled:`)
    console.log(`Report Type: ${reportType}`)
    console.log(`Frequency: ${frequency}`)
    console.log(`Next Run: ${nextRunAt}`)
    console.log(`Confirmation email sent: ${emailSent ? 'SUCCESS' : 'FAILED'}`)
    console.log(`Total scheduled reports: ${global.scheduledReports.length}`)
    
    res.json({
      success: true,
      message: `Report scheduled successfully for ${frequency.toLowerCase()} delivery! Confirmation email sent to your inbox.`,
      data: { 
        id: scheduledReport.id, 
        nextRunAt: scheduledReport.nextRunAt,
        frequency: frequency,
        confirmationEmailSent: emailSent
      }
    })
  } catch (error) {
    console.error('Error in schedule report endpoint:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error while scheduling report'
    })
  }
})

// Share Report endpoint
app.post('/api/reports/share', (req, res) => {
  const { shareId, reportType, dateRange, reportData, expiresAt } = req.body
  
  if (!shareId || !reportType || !reportData) {
    return res.status(400).json({
      success: false,
      message: 'Share ID, report type, and data are required'
    })
  }
  
  // Initialize global storage for shared reports
  if (!global.sharedReports) {
    global.sharedReports = []
  }
  
  // Create shared report record
  const sharedReport = {
    id: Date.now().toString(),
    shareId,
    reportType,
    dateRange: dateRange || '30d',
    reportData,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    accessCount: 0,
    status: 'active',
    userAgent: req.headers['user-agent'] || 'unknown'
  }
  
  global.sharedReports.push(sharedReport)
  
  console.log(`Report shared:`)
  console.log(`Share ID: ${shareId}`)
  console.log(`Report Type: ${reportType}`)
  console.log(`Expires At: ${sharedReport.expiresAt}`)
  console.log(`Total shared reports: ${global.sharedReports.length}`)
  
  res.json({
    success: true,
    message: 'Report share link created successfully',
    data: { 
      shareId,
      shareUrl: `/reports/shared/${shareId}`,
      expiresAt: sharedReport.expiresAt
    }
  })
})

// Helper function to calculate next run time for scheduled reports
function calculateNextRun(frequency: string): string {
  const now = new Date()
  let nextRun = new Date(now)
  
  switch (frequency) {
    case 'Daily':
      nextRun.setDate(now.getDate() + 1)
      nextRun.setHours(9, 0, 0, 0) // 9 AM next day
      break
    case 'Weekly':
      nextRun.setDate(now.getDate() + 7)
      nextRun.setHours(9, 0, 0, 0) // 9 AM next week
      break
    case 'Monthly':
      nextRun.setMonth(now.getMonth() + 1)
      nextRun.setDate(1) // First day of next month
      nextRun.setHours(9, 0, 0, 0) // 9 AM
      break
    default:
      nextRun.setDate(now.getDate() + 1)
  }
  
  return nextRun.toISOString()
}

// Get Shared Report endpoint
app.get('/api/reports/shared/:shareId', (req, res) => {
  const { shareId } = req.params
  
  if (!global.sharedReports) {
    global.sharedReports = []
  }
  
  // Find the shared report
  const sharedReport = global.sharedReports.find((report: any) => report.shareId === shareId)
  
  if (!sharedReport) {
    return res.status(404).json({
      success: false,
      message: 'Shared report not found'
    })
  }
  
  // Check if report has expired
  const now = new Date()
  const expiresAt = new Date(sharedReport.expiresAt)
  
  if (now > expiresAt) {
    return res.status(410).json({
      success: false,
      message: 'Shared report has expired'
    })
  }
  
  // Increment access count
  sharedReport.accessCount = (sharedReport.accessCount || 0) + 1
  
  console.log(`Shared report accessed: ${shareId}`)
  console.log(`Access count: ${sharedReport.accessCount}`)
  
  res.json({
    success: true,
    data: sharedReport
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
