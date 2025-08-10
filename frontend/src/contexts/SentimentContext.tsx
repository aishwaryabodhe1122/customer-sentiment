'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { sentimentService } from '@/services/sentiment'
import toast from 'react-hot-toast'

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

interface SentimentContextType {
  currentAnalysis: SentimentData | null
  trends: TrendData[]
  loading: boolean
  analyzeSentiment: (text: string) => Promise<SentimentData>
  analyzeMultiple: (texts: string[]) => Promise<SentimentData[]>
  getTrends: (dateRange: string) => Promise<TrendData[]>
  clearAnalysis: () => void
}

const SentimentContext = createContext<SentimentContextType | undefined>(undefined)

export function SentimentProvider({ children }: { children: React.ReactNode }) {
  const [currentAnalysis, setCurrentAnalysis] = useState<SentimentData | null>(null)
  const [trends, setTrends] = useState<TrendData[]>([])
  const [loading, setLoading] = useState(false)

  const analyzeSentiment = async (text: string): Promise<SentimentData> => {
    try {
      setLoading(true)
      const result = await sentimentService.analyzeSentiment(text)
      setCurrentAnalysis(result)
      return result
    } catch (error: any) {
      toast.error(error.message || 'Sentiment analysis failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const analyzeMultiple = async (texts: string[]): Promise<SentimentData[]> => {
    try {
      setLoading(true)
      const results = await sentimentService.analyzeMultiple(texts)
      return results
    } catch (error: any) {
      toast.error(error.message || 'Batch analysis failed')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const getTrends = useCallback(async (dateRange: string): Promise<TrendData[]> => {
    try {
      setLoading(true)
      const trendData = await sentimentService.getTrends(dateRange)
      setTrends(trendData)
      return trendData
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch trends')
      throw error
    } finally {
      setLoading(false)
    }
  }, [])

  const clearAnalysis = () => {
    setCurrentAnalysis(null)
  }

  const value: SentimentContextType = {
    currentAnalysis,
    trends,
    loading,
    analyzeSentiment,
    analyzeMultiple,
    getTrends,
    clearAnalysis,
  }

  return (
    <SentimentContext.Provider value={value}>
      {children}
    </SentimentContext.Provider>
  )
}

export function useSentiment() {
  const context = useContext(SentimentContext)
  if (context === undefined) {
    throw new Error('useSentiment must be used within a SentimentProvider')
  }
  return context
}
