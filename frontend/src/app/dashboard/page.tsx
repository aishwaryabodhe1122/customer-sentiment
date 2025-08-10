'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useSentiment } from '@/contexts/SentimentContext'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

const COLORS = ['#10b981', '#f59e0b', '#ef4444']

export default function DashboardPage() {
  const { user } = useAuth()
  const { trends, getTrends } = useSentiment()
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalAnalyses: 1247,
    positiveRate: 68,
    negativeRate: 18,
    neutralRate: 14,
    avgSentimentScore: 7.2
  })
  const [activities, setActivities] = useState<any[]>([])

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const trendsData = await getTrends('7d')
        console.log('Dashboard trends data:', trendsData)
        console.log('Trends from context:', trends)
        
        // Load recent activities from API
        const activityResponse = await fetch('http://localhost:5000/api/dashboard/activity')
        const activityData = await activityResponse.json()
        if (activityData.success) {
          setActivities(activityData.activities)
        }
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardData()
  }, []) // Remove getTrends dependency to prevent infinite loop

  const sentimentDistribution = [
    { name: 'Positive', value: stats.positiveRate, color: '#10b981' },
    { name: 'Neutral', value: stats.neutralRate, color: '#f59e0b' },
    { name: 'Negative', value: stats.negativeRate, color: '#ef4444' }
  ]

  // Fallback data for trends chart if no data is available
  const fallbackTrends = [
    { date: '2025-08-04', positive: 45, neutral: 25, negative: 15 },
    { date: '2025-08-05', positive: 52, neutral: 22, negative: 12 },
    { date: '2025-08-06', positive: 48, neutral: 28, negative: 18 },
    { date: '2025-08-07', positive: 55, neutral: 20, negative: 10 },
    { date: '2025-08-08', positive: 42, neutral: 30, negative: 20 },
    { date: '2025-08-09', positive: 58, neutral: 25, negative: 8 },
    { date: '2025-08-10', positive: 50, neutral: 27, negative: 15 }
  ]

  const chartData = trends && trends.length > 0 ? trends : fallbackTrends
  console.log('Chart data being used:', chartData)

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
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 animate-slide-down">Dashboard</h1>
          <p className="text-gray-600 animate-slide-up">
            Welcome back{user?.name ? `, ${user.name}` : ''}! Here's your sentiment analysis overview.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8 animate-stagger-in">
          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Total Analyses</dt>
                  <dd className="text-sm sm:text-lg font-medium text-gray-900">{stats.totalAnalyses.toLocaleString()}</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Positive Rate</dt>
                  <dd className="text-sm sm:text-lg font-medium text-gray-900">{stats.positiveRate}%</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Negative Rate</dt>
                  <dd className="text-sm sm:text-lg font-medium text-gray-900">{stats.negativeRate}%</dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-4 sm:p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
              <div className="ml-3 sm:ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-xs sm:text-sm font-medium text-gray-500 truncate">Avg Score</dt>
                  <dd className="text-sm sm:text-lg font-medium text-gray-900">{stats.avgSentimentScore}/10</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 mb-8 animate-fade-in-up">
          {/* Sentiment Trends */}
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
              <h3 className="text-base sm:text-lg font-semibold text-gray-900">Sentiment Trends</h3>
            </div>
            <div className="p-4 sm:p-6">
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trends && trends.length > 0 ? trends : fallbackTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Tooltip />
                    <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={2} />
                    <Line type="monotone" dataKey="neutral" stroke="#f59e0b" strokeWidth={2} />
                    <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Sentiment Distribution Pie Chart */}
          <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 transform hover:scale-105">
            <div className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sentiment Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={sentimentDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {sentimentDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow hover:shadow-lg transition-all duration-300 animate-slide-in-left">
          <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Recent Activity</h3>
          </div>
          <div className="p-4 sm:p-6">
            <div className="space-y-3 sm:space-y-4">
              {activities.length > 0 ? activities.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${
                    activity.sentiment === 'positive' ? 'bg-green-500' :
                    activity.sentiment === 'negative' ? 'bg-red-500' : 'bg-yellow-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-900 break-words">{activity.text}</p>
                    <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              )) : (
                <div className="text-center text-gray-500 py-4">
                  <p className="text-sm">Loading recent activities...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-down {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slide-in-left {
          from { transform: translateX(-30px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes scale-in {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        
        @keyframes fade-in-up {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-down {
          animation: slide-down 0.8s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out 0.2s both;
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 1s ease-out 0.8s both;
        }
        
        .animate-scale-in {
          animation: scale-in 0.6s ease-out;
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 1s ease-out 0.4s both;
        }
        
        .animate-stagger-in > * {
          animation: scale-in 0.6s ease-out;
        }
        
        .animate-stagger-in > *:nth-child(1) { animation-delay: 0.1s; }
        .animate-stagger-in > *:nth-child(2) { animation-delay: 0.2s; }
        .animate-stagger-in > *:nth-child(3) { animation-delay: 0.3s; }
        .animate-stagger-in > *:nth-child(4) { animation-delay: 0.4s; }
      `}</style>
    </div>
  )
}
