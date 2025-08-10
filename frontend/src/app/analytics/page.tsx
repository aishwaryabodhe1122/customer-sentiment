'use client'

import { useState, useEffect } from 'react'
import { useSentiment } from '@/contexts/SentimentContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, AreaChart, Area, ScatterChart, Scatter } from 'recharts'

export default function AnalyticsPage() {
  const { trends, getTrends } = useSentiment()
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('7d')
  const [selectedMetric, setSelectedMetric] = useState('sentiment')

  // Mock data for advanced analytics
  const [analyticsData, setAnalyticsData] = useState({
    emotionBreakdown: [
      { emotion: 'Joy', value: 45, color: '#10b981' },
      { emotion: 'Anger', value: 12, color: '#ef4444' },
      { emotion: 'Sadness', value: 8, color: '#3b82f6' },
      { emotion: 'Surprise', value: 15, color: '#f59e0b' },
      { emotion: 'Fear', value: 6, color: '#8b5cf6' },
      { emotion: 'Disgust', value: 4, color: '#ec4899' },
      { emotion: 'Neutral', value: 10, color: '#6b7280' }
    ],
    topicTrends: [
      { topic: 'Product Quality', positive: 78, negative: 22, mentions: 1247 },
      { topic: 'Customer Service', positive: 65, negative: 35, mentions: 892 },
      { topic: 'Pricing', positive: 45, negative: 55, mentions: 634 },
      { topic: 'Delivery', positive: 82, negative: 18, mentions: 567 },
      { topic: 'User Experience', positive: 71, negative: 29, mentions: 445 }
    ],
    platformComparison: [
      { platform: 'Twitter', positive: 68, neutral: 18, negative: 14, total: 2341 },
      { platform: 'Instagram', positive: 75, neutral: 15, negative: 10, total: 1876 },
      { platform: 'Facebook', positive: 62, neutral: 22, negative: 16, total: 1543 },
      { platform: 'Reviews', positive: 71, neutral: 12, negative: 17, total: 987 }
    ],
    hourlyActivity: Array.from({ length: 24 }, (_, i) => ({
      hour: i,
      mentions: Math.floor(Math.random() * 100) + 20,
      sentiment: Math.random() * 2 - 1 // -1 to 1 scale
    }))
  })

  useEffect(() => {
    const loadAnalyticsData = async () => {
      try {
        await getTrends(timeRange)
        // Simulate loading time
        setTimeout(() => setLoading(false), 1000)
      } catch (error) {
        console.error('Failed to load analytics data:', error)
        setLoading(false)
      }
    }
    loadAnalyticsData()
  }, [timeRange])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Advanced Analytics</h1>
          <p className="mt-2 text-gray-600">
            Deep insights into customer sentiment patterns and trends
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Time Range:</label>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="1d">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-4">
              <label className="text-sm font-medium text-gray-700">Metric:</label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sentiment">Sentiment</option>
                <option value="emotion">Emotion</option>
                <option value="topics">Topics</option>
                <option value="platforms">Platforms</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sentiment Trends Over Time */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Trends</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={trends && Array.isArray(trends) ? trends : []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="positive" stackId="1" stroke="#10b981" fill="#10b981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="neutral" stackId="1" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.6} />
                <Area type="monotone" dataKey="negative" stackId="1" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Emotion Breakdown */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Emotion Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.emotionBreakdown}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="emotion" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Topic Analysis */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Topic Sentiment Analysis</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Topic</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mentions</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Positive %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Negative %</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Sentiment Score</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {analyticsData.topicTrends.map((topic, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{topic.topic}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{topic.mentions.toLocaleString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{topic.positive}%</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{topic.negative}%</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                          <div 
                            className={`h-2 rounded-full ${topic.positive > 60 ? 'bg-green-500' : topic.positive > 40 ? 'bg-yellow-500' : 'bg-red-500'}`}
                            style={{ width: `${topic.positive}%` }}
                          ></div>
                        </div>
                        <span className="text-sm text-gray-600">{topic.positive > 60 ? 'Positive' : topic.positive > 40 ? 'Mixed' : 'Negative'}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Platform Comparison & Hourly Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Platform Comparison */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Comparison</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analyticsData.platformComparison}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="platform" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="positive" stackId="a" fill="#10b981" />
                <Bar dataKey="neutral" stackId="a" fill="#f59e0b" />
                <Bar dataKey="negative" stackId="a" fill="#ef4444" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Hourly Activity Pattern */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Hourly Activity Pattern</h3>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart data={analyticsData.hourlyActivity}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" domain={[0, 23]} />
                <YAxis dataKey="mentions" />
                <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                <Scatter dataKey="mentions" fill="#3b82f6" />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
