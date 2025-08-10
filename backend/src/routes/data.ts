import express from 'express'
import multer from 'multer'
import { authenticate } from '../middleware/auth'

const router = express.Router()

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv' || file.originalname.endsWith('.csv')) {
      cb(null, true)
    } else {
      cb(new Error('Only CSV files are allowed'))
    }
  }
})

// Get data sources
router.get('/sources', authenticate, async (req, res) => {
  try {
    // Mock data for now
    const sources = [
      {
        id: '1',
        name: 'Twitter Feed',
        type: 'twitter',
        status: 'active',
        lastFetch: new Date().toISOString(),
        totalRecords: 1250
      },
      {
        id: '2',
        name: 'Instagram Posts',
        type: 'instagram',
        status: 'inactive',
        lastFetch: new Date(Date.now() - 86400000).toISOString(),
        totalRecords: 850
      }
    ]
    
    res.json({
      success: true,
      data: sources
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch data sources'
    })
  }
})

// Upload CSV data
router.post('/upload', authenticate, upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'No file uploaded'
      })
    }

    // Mock processing for now
    const recordsProcessed = Math.floor(Math.random() * 1000) + 100
    
    res.json({
      success: true,
      message: 'CSV file uploaded and processed successfully',
      recordsProcessed
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to process CSV file'
    })
  }
})

// Trigger data fetch
router.post('/fetch', authenticate, async (req, res) => {
  try {
    const { source } = req.body
    
    if (!source) {
      return res.status(400).json({
        success: false,
        error: 'Source parameter is required'
      })
    }
    
    // Mock fetch trigger
    res.json({
      success: true,
      message: `Data fetch triggered for ${source}`
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to trigger data fetch'
    })
  }
})

export { router as dataRoutes }
