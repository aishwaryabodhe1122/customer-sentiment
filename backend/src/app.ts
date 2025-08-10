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

// Initialize global data stores with some sample data for development
if (!global.newsletterSubscribers) {
  global.newsletterSubscribers = [
    {
      id: '1',
      email: 'test.subscriber@example.com',
      subscribedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      status: 'active'
    }
  ]
}

if (!global.users) {
  global.users = [
    {
      id: '1',
      email: 'john.doe@example.com',
      name: 'John Doe',
      role: 'user',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
    },
    {
      id: '2', 
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      role: 'user',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
    }
  ]
}

if (!global.contactRequests) {
  global.contactRequests = [
    {
      id: '1',
      name: 'Alice Johnson',
      email: 'alice@example.com',
      subject: 'Feature Request',
      message: 'Would love to see more detailed analytics for social media sentiment.',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
    }
  ]
}

if (!global.scheduledReports) {
  global.scheduledReports = []
}

// Basic middleware
app.use(helmet())
app.use(morgan('combined'))
app.use(compression())

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'admin-email', 'admin-password'],
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
// Helper functions for dynamic data
function getRelativeTime(minutes: number): string {
  if (minutes < 60) {
    return `${minutes} minute${minutes === 1 ? '' : 's'} ago`
  } else if (minutes < 1440) {
    const hours = Math.floor(minutes / 60)
    return `${hours} hour${hours === 1 ? '' : 's'} ago`
  } else {
    const days = Math.floor(minutes / 1440)
    return `${days} day${days === 1 ? '' : 's'} ago`
  }
}

function getRecentDate(daysAgo: number): string {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split('T')[0]
}

// Get recent activity for dashboard
app.get('/api/dashboard/activity', (_req, res) => {
  const activities = [
    { text: "Customer review analysis completed", time: getRelativeTime(2), sentiment: "positive" },
    { text: "Social media monitoring updated", time: getRelativeTime(15), sentiment: "neutral" },
    { text: "Weekly report generated", time: getRelativeTime(60), sentiment: "positive" },
    { text: "Alert: Negative sentiment spike detected", time: getRelativeTime(180), sentiment: "negative" },
    { text: "Data source integration successful", time: getRelativeTime(240), sentiment: "positive" },
    { text: "Scheduled analysis completed", time: getRelativeTime(360), sentiment: "neutral" }
  ]
  
  res.json({ success: true, activities })
})

// Get system status incidents
app.get('/api/system/incidents', (_req, res) => {
  const incidents = [
    {
      date: getRecentDate(3),
      title: 'Scheduled Maintenance - Notification System',
      status: 'ongoing',
      description: 'We are performing scheduled maintenance on our notification system to improve reliability.',
      updates: [
        { time: '14:30 UTC', message: 'Maintenance started - Email notifications may be delayed' },
        { time: '14:00 UTC', message: 'Maintenance window begins' }
      ]
    },
    {
      date: getRecentDate(6),
      title: 'API Response Time Degradation',
      status: 'resolved',
      description: 'Some users experienced slower API response times due to increased traffic.',
      updates: [
        { time: '16:45 UTC', message: 'Issue fully resolved - All systems operating normally' },
        { time: '16:20 UTC', message: 'Implementing fix - Response times improving' },
        { time: '15:30 UTC', message: 'Investigating elevated response times' }
      ]
    },
    {
      date: getRecentDate(10),
      title: 'Database Connection Issues',
      status: 'resolved',
      description: 'Brief database connectivity issues affecting data retrieval.',
      updates: [
        { time: '09:15 UTC', message: 'All database connections restored' },
        { time: '08:45 UTC', message: 'Investigating connection timeouts' }
      ]
    }
  ]
  
  res.json({ success: true, incidents })
})

// Admin Dashboard Endpoints

// Check if user is admin with password
function isAdmin(email: string, password?: string): boolean {
  const adminEmail = process.env['ADMIN_EMAIL'] || 'aishwaryabodhe1122@gmail.com'
  const adminPassword = process.env['ADMIN_PASSWORD'] || 'Aishu@11'
  return email === adminEmail && (!password || password === adminPassword)
}

// Admin login endpoint
app.post('/api/admin/login', (req, res) => {
  const { email, password } = req.body
  
  if (isAdmin(email, password)) {
    res.json({ success: true, message: 'Admin login successful', isAdmin: true })
  } else {
    res.status(401).json({ success: false, message: 'Invalid admin credentials' })
  }
})

// Get all users (admin only)
app.get('/api/admin/users', (req, res) => {
  const adminEmail = req.headers['admin-email'] as string
  const adminPassword = req.headers['admin-password'] as string
  
  if (!isAdmin(adminEmail, adminPassword)) {
    return res.status(403).json({ success: false, message: 'Admin access required' })
  }
  
  if (!global.users) {
    global.users = []
  }
  
  res.json({ success: true, users: global.users })
})

// Delete user (admin only)
app.delete('/api/admin/users/:userId', (req, res) => {
  const adminEmail = req.headers['admin-email'] as string
  const adminPassword = req.headers['admin-password'] as string
  const { userId } = req.params
  
  if (!isAdmin(adminEmail, adminPassword)) {
    return res.status(403).json({ success: false, message: 'Admin access required' })
  }
  
  if (!global.users) {
    global.users = []
  }
  
  const userIndex = global.users.findIndex((user: any) => user.id === userId)
  if (userIndex === -1) {
    return res.status(404).json({ success: false, message: 'User not found' })
  }
  
  const deletedUser = global.users.splice(userIndex, 1)[0]
  
  res.json({ success: true, message: 'User deleted successfully', user: deletedUser })
})

// Get newsletter subscribers (admin only)
app.get('/api/admin/subscribers', (req, res) => {
  const adminEmail = req.headers['admin-email'] as string
  const adminPassword = req.headers['admin-password'] as string
  
  if (!isAdmin(adminEmail, adminPassword)) {
    return res.status(403).json({ success: false, message: 'Admin access required' })
  }
  
  if (!global.newsletterSubscribers) {
    global.newsletterSubscribers = []
  }
  
  res.json({ success: true, subscribers: global.newsletterSubscribers })
})

// Send blog update to all subscribers (admin only)
app.post('/api/admin/send-blog-update', async (req, res) => {
  const adminEmail = req.headers['admin-email'] as string
  const { subject, content, blogUrl } = req.body
  
  if (!isAdmin(adminEmail)) {
    return res.status(403).json({ success: false, message: 'Admin access required' })
  }
  
  if (!subject || !content) {
    return res.status(400).json({ success: false, message: 'Subject and content are required' })
  }
  
  if (!global.newsletterSubscribers) {
    global.newsletterSubscribers = []
  }
  
  try {
    let successCount = 0
    let failCount = 0
    
    for (const subscriber of global.newsletterSubscribers) {
      // Mock email sending for now (emailService not available)
      const emailSent = true
      
      if (emailSent) {
        successCount++
      } else {
        failCount++
      }
    }
    
    res.json({
      success: true,
      message: `Blog update sent! Success: ${successCount}, Failed: ${failCount}`,
      data: { successCount, failCount, totalSubscribers: global.newsletterSubscribers.length }
    })
  } catch (error) {
    console.error('Error sending blog update:', error)
    res.status(500).json({ success: false, message: 'Failed to send blog update' })
  }
})

// Get contact requests for admin (admin only)
app.get('/api/contact/admin', (req, res) => {
  const adminEmail = req.headers['admin-email'] as string
  const adminPassword = req.headers['admin-password'] as string
  
  if (!isAdmin(adminEmail, adminPassword)) {
    return res.status(403).json({ success: false, message: 'Admin access required' })
  }
  
  if (!global.contactRequests) {
    global.contactRequests = []
  }
  
  res.json({ success: true, contacts: global.contactRequests })
})

// Get visitor analytics (admin only)
app.get('/api/admin/analytics', (req, res) => {
  const adminEmail = req.headers['admin-email'] as string
  const adminPassword = req.headers['admin-password'] as string
  
  if (!isAdmin(adminEmail, adminPassword)) {
    return res.status(403).json({ success: false, message: 'Admin access required' })
  }
  
  // Remove static visitor data - use dynamic generation only
  
  if (!global.scheduledReports) {
    global.scheduledReports = []
  }
  
  const currentTime = new Date()
  const baseVisitors = Math.floor(Math.random() * 500) + 800
  const todayVisitors = Math.floor(Math.random() * 100) + 50
  const weekVisitors = Math.floor(baseVisitors * 0.4) + todayVisitors
  
  const analytics = {
    visitors: {
      total: baseVisitors,
      today: todayVisitors,
      thisWeek: weekVisitors,
      thisMonth: baseVisitors
    },
    users: {
      total: global.users ? global.users.length : 0,
      active: Math.floor((global.users ? global.users.length : 0) * 0.7),
      newThisMonth: Math.floor((global.users ? global.users.length : 0) * 0.2),
      recentRegistrations: global.users ? global.users.slice(-5) : []
    },
    subscribers: {
      total: global.newsletterSubscribers ? global.newsletterSubscribers.length : 0,
      growth: '+12%'
    },
    totalUsers: global.users ? global.users.length : 0,
    totalSubscribers: global.newsletterSubscribers ? global.newsletterSubscribers.length : 0,
    totalContactRequests: global.contactRequests ? global.contactRequests.length : 0,
    scheduledReports: global.scheduledReports ? global.scheduledReports.length : 0,
    recentUserRegistrations: global.users ? global.users.slice(-5) : []
  }
  
  res.json({ success: true, analytics })
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
