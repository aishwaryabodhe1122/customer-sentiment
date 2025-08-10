import mongoose, { Document, Schema } from 'mongoose'

export interface IAlert extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  type: 'sentiment_spike' | 'volume_spike' | 'keyword_mention' | 'negative_trend'
  configuration: {
    threshold: number
    timeWindow: number // in minutes
    keywords?: string[]
    sentimentType?: 'positive' | 'negative' | 'neutral'
    platforms?: string[]
    comparison?: 'greater_than' | 'less_than' | 'equal_to'
  }
  isActive: boolean
  lastTriggered?: Date
  triggerCount: number
  notifications: {
    email: boolean
    webhook?: string
    slack?: string
  }
  createdAt: Date
  updatedAt: Date
}

const alertSchema = new Schema<IAlert>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Alert name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  type: {
    type: String,
    enum: ['sentiment_spike', 'volume_spike', 'keyword_mention', 'negative_trend'],
    required: true,
    index: true
  },
  configuration: {
    threshold: {
      type: Number,
      required: true,
      min: 0
    },
    timeWindow: {
      type: Number,
      required: true,
      min: 5,
      default: 60 // 1 hour
    },
    keywords: [{ type: String, trim: true }],
    sentimentType: {
      type: String,
      enum: ['positive', 'negative', 'neutral']
    },
    platforms: [{ type: String, trim: true }],
    comparison: {
      type: String,
      enum: ['greater_than', 'less_than', 'equal_to'],
      default: 'greater_than'
    }
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  },
  lastTriggered: {
    type: Date,
    index: true
  },
  triggerCount: {
    type: Number,
    default: 0
  },
  notifications: {
    email: {
      type: Boolean,
      default: true
    },
    webhook: String,
    slack: String
  }
}, {
  timestamps: true
})

// Compound indexes
alertSchema.index({ userId: 1, isActive: 1 })
alertSchema.index({ type: 1, isActive: 1 })

export const Alert = mongoose.model<IAlert>('Alert', alertSchema)
