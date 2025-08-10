import mongoose, { Document, Schema } from 'mongoose'

export interface IDataSource extends Document {
  userId: mongoose.Types.ObjectId
  name: string
  type: 'twitter' | 'instagram' | 'reviews' | 'csv'
  status: 'active' | 'inactive' | 'error' | 'pending'
  configuration: {
    // Twitter specific
    keywords?: string[]
    hashtags?: string[]
    usernames?: string[]
    // Instagram specific
    accounts?: string[]
    // Reviews specific
    productIds?: string[]
    platforms?: string[]
    // CSV specific
    fileName?: string
    columns?: {
      text: string
      sentiment?: string
      timestamp?: string
      author?: string
    }
  }
  credentials?: {
    apiKey?: string
    apiSecret?: string
    accessToken?: string
    accessTokenSecret?: string
  }
  lastFetch: Date
  nextFetch?: Date
  fetchInterval: number // in minutes
  totalRecords: number
  errorCount: number
  lastError?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

const dataSourceSchema = new Schema<IDataSource>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: [true, 'Data source name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  type: {
    type: String,
    enum: ['twitter', 'instagram', 'reviews', 'csv'],
    required: true,
    index: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive', 'error', 'pending'],
    default: 'pending',
    index: true
  },
  configuration: {
    keywords: [{ type: String, trim: true }],
    hashtags: [{ type: String, trim: true }],
    usernames: [{ type: String, trim: true }],
    accounts: [{ type: String, trim: true }],
    productIds: [{ type: String, trim: true }],
    platforms: [{ type: String, trim: true }],
    fileName: String,
    columns: {
      text: { type: String, required: true },
      sentiment: String,
      timestamp: String,
      author: String
    }
  },
  credentials: {
    apiKey: { type: String, select: false },
    apiSecret: { type: String, select: false },
    accessToken: { type: String, select: false },
    accessTokenSecret: { type: String, select: false }
  },
  lastFetch: {
    type: Date,
    default: Date.now
  },
  nextFetch: {
    type: Date,
    index: true
  },
  fetchInterval: {
    type: Number,
    default: 60, // 1 hour
    min: 15 // minimum 15 minutes
  },
  totalRecords: {
    type: Number,
    default: 0
  },
  errorCount: {
    type: Number,
    default: 0
  },
  lastError: {
    type: String
  },
  isActive: {
    type: Boolean,
    default: true,
    index: true
  }
}, {
  timestamps: true
})

// Compound indexes
dataSourceSchema.index({ userId: 1, type: 1 })
dataSourceSchema.index({ status: 1, nextFetch: 1 })
dataSourceSchema.index({ isActive: 1, nextFetch: 1 })

// Pre-save middleware to calculate next fetch time
dataSourceSchema.pre('save', function(next) {
  if (this.isModified('lastFetch') || this.isModified('fetchInterval')) {
    this.nextFetch = new Date(this.lastFetch.getTime() + (this.fetchInterval * 60 * 1000))
  }
  next()
})

export const DataSource = mongoose.model<IDataSource>('DataSource', dataSourceSchema)
