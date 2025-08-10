const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
const ML_API_URL = process.env.NEXT_PUBLIC_ML_SERVICE_URL || 'http://localhost:8000'

interface SentimentData {
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
  timestamp: string
}

interface TrendData {
  date: string
  positive: number
  negative: number
  neutral: number
  total: number
}

interface TopicData {
  topic: string
  count: number
  sentiment_distribution: {
    positive: number
    negative: number
    neutral: number
  }
}

interface DataSource {
  id: string
  name: string
  type: 'twitter' | 'instagram' | 'reviews' | 'csv'
  status: 'active' | 'inactive' | 'error'
  lastFetch: string
  totalRecords: number
}

class SentimentService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async analyzeSentiment(text: string): Promise<SentimentData> {
    // Try ML service first, fallback to backend mock
    try {
      const response = await fetch(`${ML_API_URL}/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      })

      if (response.ok) {
        return response.json()
      }
    } catch (error) {
      console.log('ML service unavailable, using backend fallback')
    }

    // Fallback to backend mock endpoint
    const response = await fetch(`${API_URL}/api/ml/analyze`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ text }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Sentiment analysis failed')
    }

    return response.json()
  }

  async analyzeMultiple(texts: string[]): Promise<SentimentData[]> {
    // Try ML service first, fallback to backend mock
    try {
      const response = await fetch(`${ML_API_URL}/analyze/batch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ texts }),
      })

      if (response.ok) {
        return response.json()
      }
    } catch (error) {
      console.log('ML service unavailable, using backend fallback')
    }

    // Fallback to backend mock endpoint
    const response = await fetch(`${API_URL}/api/ml/analyze/batch`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ texts }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Batch analysis failed')
    }

    return response.json()
  }

  async getTrends(dateRange: string = '7d'): Promise<TrendData[]> {
    const response = await fetch(`${API_URL}/api/sentiment/trends?range=${dateRange}`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch sentiment trends')
    }

    return response.json()
  }

  async getTopics(limit: number = 10): Promise<TopicData[]> {
    const response = await fetch(`${API_URL}/api/sentiment/topics?limit=${limit}`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch trending topics')
    }

    return response.json()
  }

  async getDataSources(): Promise<DataSource[]> {
    const response = await fetch(`${API_URL}/api/data/sources`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch data sources')
    }

    return response.json()
  }

  async uploadCSV(file: File): Promise<{ message: string; recordsProcessed: number }> {
    const formData = new FormData()
    formData.append('file', file)

    const token = localStorage.getItem('token')
    const response = await fetch(`${API_URL}/api/data/upload`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'CSV upload failed')
    }

    return response.json()
  }

  async triggerDataFetch(source: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/api/data/fetch`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ source }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Data fetch failed')
    }

    return response.json()
  }

  async getSentimentHistory(page: number = 1, limit: number = 20) {
    const response = await fetch(`${API_URL}/api/sentiment/history?page=${page}&limit=${limit}`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch sentiment history')
    }

    return response.json()
  }

  async getAlerts() {
    const response = await fetch(`${API_URL}/api/alerts`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch alerts')
    }

    return response.json()
  }

  async createAlert(config: {
    name: string
    type: 'sentiment_spike' | 'volume_spike' | 'keyword_mention'
    threshold: number
    keywords?: string[]
    enabled: boolean
  }) {
    const response = await fetch(`${API_URL}/api/alerts`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(config),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Alert creation failed')
    }

    return response.json()
  }

  async generateReport(config: {
    dateRange: string
    format: 'pdf' | 'excel'
    includeCharts: boolean
    includeTrends: boolean
    includeTopics: boolean
  }) {
    const response = await fetch(`${API_URL}/api/reports/generate`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(config),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Report generation failed')
    }

    // Return blob for file download
    return response.blob()
  }

  async getPredictions(timeframe: string = '30d') {
    const response = await fetch(`${API_URL}/api/predictions?timeframe=${timeframe}`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to fetch predictions')
    }

    return response.json()
  }
}

export const sentimentService = new SentimentService()
