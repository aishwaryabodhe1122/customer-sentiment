import express from 'express'
import { authenticate } from '../middleware/auth'

const router = express.Router()

// Get user alerts
router.get('/', authenticate, async (req, res) => {
  try {
    // Mock data for now
    const alerts = [
      {
        id: '1',
        name: 'Negative Sentiment Spike',
        type: 'sentiment_spike',
        isActive: true,
        lastTriggered: new Date(Date.now() - 3600000).toISOString(),
        triggerCount: 5
      }
    ]
    
    res.json({
      success: true,
      data: alerts
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to fetch alerts'
    })
  }
})

// Create new alert
router.post('/', authenticate, async (req, res) => {
  try {
    const alertConfig = req.body
    
    // Mock creation
    const newAlert = {
      id: Date.now().toString(),
      ...alertConfig,
      triggerCount: 0,
      createdAt: new Date().toISOString()
    }
    
    res.status(201).json({
      success: true,
      data: newAlert
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Failed to create alert'
    })
  }
})

export { router as alertRoutes }
