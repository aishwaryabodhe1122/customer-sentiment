'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface SharedReportData {
  shareId: string
  reportType: string
  dateRange: string
  reportData: any
  createdAt: string
  expiresAt: string
  accessCount: number
  status: string
}

export default function SharedReportPage() {
  const params = useParams()
  const shareId = params.shareId as string
  const [reportData, setReportData] = useState<SharedReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchSharedReport = async () => {
      try {
        const response = await fetch(`/api/reports/shared/${shareId}`)
        
        if (response.ok) {
          const data = await response.json()
          setReportData(data.data)
        } else if (response.status === 404) {
          setError('Report not found or has expired')
        } else if (response.status === 410) {
          setError('This shared report has expired')
        } else {
          setError('Failed to load shared report')
        }
      } catch (err) {
        console.error('Error fetching shared report:', err)
        setError('Failed to load shared report')
      } finally {
        setLoading(false)
      }
    }

    if (shareId) {
      fetchSharedReport()
    }
  }, [shareId])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading shared report...</p>
        </div>
      </div>
    )
  }

  if (error || !reportData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Report Not Available</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <a 
              href="/reports" 
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Go to Reports
            </a>
          </div>
        </div>
      </div>
    )
  }

  const isExpired = new Date(reportData.expiresAt) < new Date()
  const daysUntilExpiry = Math.ceil((new Date(reportData.expiresAt).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Shared Report</h1>
              <p className="text-sm text-gray-600 mt-1">
                {reportData.reportData.title} • {reportData.dateRange} • 
                Created {new Date(reportData.createdAt).toLocaleDateString()}
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500">
                {isExpired ? (
                  <span className="text-red-600 font-medium">Expired</span>
                ) : (
                  <span>Expires in {daysUntilExpiry} days</span>
                )}
              </div>
              <div className="text-xs text-gray-400">
                Viewed {reportData.accessCount} times
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Report Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isExpired ? (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <div className="text-red-500 text-4xl mb-4">⏰</div>
            <h2 className="text-xl font-semibold text-red-800 mb-2">Report Expired</h2>
            <p className="text-red-700">This shared report expired on {new Date(reportData.expiresAt).toLocaleDateString()}</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">{reportData.reportData.title}</h2>
              <p className="text-gray-600 mt-1">{reportData.reportData.description}</p>
            </div>

            <div className="p-6">
              {reportData.reportType === 'sentiment-summary' && (
                <div className="space-y-8">
                  {/* Key Metrics */}
                  <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600">{reportData.reportData.data.totalMentions.toLocaleString()}</div>
                      <div className="text-sm text-gray-500">Total Mentions</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600">{reportData.reportData.data.positiveRate}%</div>
                      <div className="text-sm text-gray-500">Positive Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-600">{reportData.reportData.data.negativeRate}%</div>
                      <div className="text-sm text-gray-500">Negative Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-600">{reportData.reportData.data.neutralRate}%</div>
                      <div className="text-sm text-gray-500">Neutral Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-purple-600">{reportData.reportData.data.averageScore}/10</div>
                      <div className="text-sm text-gray-500">Average Score</div>
                    </div>
                  </div>

                  {/* Keywords */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {reportData.reportData.data.topKeywords.map((keyword: string, index: number) => (
                          <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">Bottom Keywords</h3>
                      <div className="flex flex-wrap gap-2">
                        {reportData.reportData.data.bottomKeywords.map((keyword: string, index: number) => (
                          <span key={index} className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {reportData.reportType === 'platform-analysis' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Platform Performance</h3>
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Platform</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mentions</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Positive</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Negative</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Neutral</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {reportData.reportData.data.platforms.map((platform: any, index: number) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{platform.name}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{platform.mentions.toLocaleString()}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">{platform.positive}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">{platform.negative}%</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-600">{platform.neutral}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {reportData.reportType === 'trend-analysis' && (
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold text-gray-900">Trend Data</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-4">
                      Showing {reportData.reportData.data.trends.length} data points over {reportData.dateRange}
                    </p>
                    <div className="space-y-2">
                      {reportData.reportData.data.trends.slice(-10).map((trend: any, index: number) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-b-0">
                          <span className="text-sm font-medium text-gray-900">{trend.date}</span>
                          <div className="flex space-x-4 text-sm">
                            <span className="text-green-600">+{trend.positive}%</span>
                            <span className="text-red-600">-{trend.negative}%</span>
                            <span className="text-yellow-600">~{trend.neutral}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
              <div className="flex justify-between items-center text-sm text-gray-500">
                <div>
                  This is a read-only shared report • Generated from AI-Powered Customer Sentiment Tracker
                </div>
                <div>
                  Share ID: {reportData.shareId}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
