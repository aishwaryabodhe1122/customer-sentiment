import mongoose, { Document, Schema } from 'mongoose'

export interface ISentimentAnalysis extends Document {
  userId?: mongoose.Types.ObjectId
  text: string
  sentiment: 'positive' | 'negative' | 'neutral'
  confidence: number
  emotions?: {
    joy: number
    anger: number
    sadness: number
    surprise: number
    fear: number
    disgust: number
  }
  topics?: string[]
  source: 'manual' | 'twitter' | 'instagram' | 'reviews' | 'csv'
  sourceId?: string
  metadata?: {
    platform?: string
    author?: string
    location?: string
    timestamp?: Date
    likes?: number
    shares?: number
    comments?: number
  }
  processed: boolean
  processingTime: number
  modelVersion: string
  createdAt: Date
  updatedAt: Date
}

const sentimentAnalysisSchema = new Schema<ISentimentAnalysis>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true
  },
  text: {
    type: String,
    required: [true, 'Text is required for analysis'],
    maxlength: [10000, 'Text cannot exceed 10,000 characters']
  },
  sentiment: {
    type: String,
    enum: ['positive', 'negative', 'neutral'],
    required: true,
    index: true
  },
  confidence: {
    type: Number,
    required: true,
    min: 0,
    max: 1
  },
  emotions: {
    joy: { type: Number, min: 0, max: 1 },
    anger: { type: Number, min: 0, max: 1 },
    sadness: { type: Number, min: 0, max: 1 },
    surprise: { type: Number, min: 0, max: 1 },
    fear: { type: Number, min: 0, max: 1 },
    disgust: { type: Number, min: 0, max: 1 }
  },
  topics: [{
    type: String,
    trim: true
  }],
  source: {
    type: String,
    enum: ['manual', 'twitter', 'instagram', 'reviews', 'csv'],
    required: true,
    index: true
  },
  sourceId: {
    type: String,
    index: true
  },
  metadata: {
    platform: String,
    author: String,
    location: String,
    timestamp: Date,
    likes: Number,
    shares: Number,
    comments: Number
  },
  processed: {
    type: Boolean,
    default: true
  },
  processingTime: {
    type: Number,
    required: true
  },
  modelVersion: {
    type: String,
    required: true,
    default: '1.0.0'
  }
}, {
  timestamps: true
})

// Compound indexes for efficient queries
sentimentAnalysisSchema.index({ userId: 1, createdAt: -1 })
sentimentAnalysisSchema.index({ sentiment: 1, createdAt: -1 })
sentimentAnalysisSchema.index({ source: 1, createdAt: -1 })
sentimentAnalysisSchema.index({ 'metadata.platform': 1, createdAt: -1 })

// Text search index for topics and content
sentimentAnalysisSchema.index({ 
  text: 'text', 
  topics: 'text' 
})

export const SentimentAnalysis = mongoose.model<ISentimentAnalysis>('SentimentAnalysis', sentimentAnalysisSchema)
