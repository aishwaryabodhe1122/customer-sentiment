'use client'

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('sentiment-summary')
  const [dateRange, setDateRange] = useState('30d')
  const [isGenerating, setIsGenerating] = useState(false)

  // Mock report data
  const reportData = {
    'sentiment-summary': {
      title: 'Sentiment Analysis Summary Report',
      description: 'Comprehensive overview of customer sentiment across all platforms',
      data: {
        totalMentions: 15847,
        positiveRate: 68.2,
        negativeRate: 17.8,
        neutralRate: 14.0,
        averageScore: 7.3,
        topKeywords: ['excellent', 'quality', 'fast delivery', 'helpful', 'satisfied'],
        bottomKeywords: ['slow', 'expensive', 'confusing', 'delayed', 'poor']
      }
    },
    'platform-analysis': {
      title: 'Platform Performance Analysis',
      description: 'Detailed breakdown of sentiment across different social media platforms',
      data: {
        platforms: [
          { name: 'Twitter', mentions: 5432, positive: 65, negative: 20, neutral: 15 },
          { name: 'Instagram', mentions: 4321, positive: 72, negative: 15, neutral: 13 },
          { name: 'Facebook', mentions: 3876, positive: 61, negative: 22, neutral: 17 },
          { name: 'Reviews', mentions: 2218, positive: 74, negative: 18, neutral: 8 }
        ]
      }
    },
    'trend-analysis': {
      title: 'Sentiment Trend Analysis',
      description: 'Historical sentiment trends and pattern analysis',
      data: {
        trends: [
          { date: '2024-01-01', positive: 65, negative: 20, neutral: 15 },
          { date: '2024-01-08', positive: 68, negative: 18, neutral: 14 },
          { date: '2024-01-15', positive: 71, negative: 16, neutral: 13 },
          { date: '2024-01-22', positive: 69, negative: 19, neutral: 12 },
          { date: '2024-01-29', positive: 73, negative: 15, neutral: 12 }
        ]
      }
    }
  }

  const currentReport = reportData[selectedReport as keyof typeof reportData]

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsGenerating(false)
    
    // Create and download a mock PDF
    const element = document.createElement('a')
    const file = new Blob(['Mock PDF Report Content'], { type: 'text/plain' })
    element.href = URL.createObjectURL(file)
    element.download = `${selectedReport}-${dateRange}-report.pdf`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleExportData = () => {
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Date,Positive,Negative,Neutral\n"
      + "2024-01-01,65,20,15\n"
      + "2024-01-08,68,18,14\n"
      + "2024-01-15,71,16,13\n"
      + "2024-01-22,69,19,12\n"
      + "2024-01-29,73,15,12\n"

    const encodedUri = encodeURI(csvContent)
    const link = document.createElement("a")
    link.setAttribute("href", encodedUri)
    link.setAttribute("download", `${selectedReport}-${dateRange}-data.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="mt-2 text-gray-600">
            Generate comprehensive reports and export your sentiment analysis data
          </p>
        </div>

        {/* Report Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select
                value={selectedReport}
                onChange={(e) => setSelectedReport(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="sentiment-summary">Sentiment Summary</option>
                <option value="platform-analysis">Platform Analysis</option>
                <option value="trend-analysis">Trend Analysis</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="90d">Last 90 Days</option>
                <option value="1y">Last Year</option>
              </select>
            </div>

            <div className="flex items-end space-x-3">
              <button
                onClick={handleGenerateReport}
                disabled={isGenerating}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                {isGenerating ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Generating...
                  </div>
                ) : (
                  'Generate PDF'
                )}
              </button>
              <button
                onClick={handleExportData}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
              >
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Report Preview */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{currentReport.title}</h2>
            <p className="text-gray-600 mt-1">{currentReport.description}</p>
          </div>

          <div className="p-6">
            {selectedReport === 'sentiment-summary' && (
              <div className="space-y-8">
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{(currentReport.data as any).totalMentions.toLocaleString()}</div>
                    <div className="text-sm text-gray-500">Total Mentions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">{(currentReport.data as any).positiveRate}%</div>
                    <div className="text-sm text-gray-500">Positive Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">{(currentReport.data as any).negativeRate}%</div>
                    <div className="text-sm text-gray-500">Negative Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-600">{(currentReport.data as any).neutralRate}%</div>
                    <div className="text-sm text-gray-500">Neutral Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-purple-600">{(currentReport.data as any).averageScore}/10</div>
                    <div className="text-sm text-gray-500">Avg Score</div>
                  </div>
                </div>

                {/* Keywords Analysis */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Positive Keywords</h3>
                    <div className="space-y-2">
                      {(currentReport.data as any).topKeywords.map((keyword: string, index: number) => (
                        <div key={index} className="flex items-center justify-between bg-green-50 px-3 py-2 rounded">
                          <span className="text-green-800">{keyword}</span>
                          <span className="text-green-600 text-sm">{Math.floor(Math.random() * 500) + 100} mentions</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Negative Keywords</h3>
                    <div className="space-y-2">
                      {(currentReport.data as any).bottomKeywords.map((keyword: string, index: number) => (
                        <div key={index} className="flex items-center justify-between bg-red-50 px-3 py-2 rounded">
                          <span className="text-red-800">{keyword}</span>
                          <span className="text-red-600 text-sm">{Math.floor(Math.random() * 200) + 50} mentions</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedReport === 'platform-analysis' && (
              <div className="space-y-8">
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={(currentReport.data as any).platforms}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="positive" stackId="a" fill="#10b981" />
                    <Bar dataKey="neutral" stackId="a" fill="#f59e0b" />
                    <Bar dataKey="negative" stackId="a" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Platform</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Mentions</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Positive %</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Neutral %</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Negative %</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {(currentReport.data as any).platforms.map((platform: any, index: number) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{platform.name}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-500">{platform.mentions.toLocaleString()}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-green-600">{platform.positive}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-yellow-600">{platform.neutral}%</td>
                          <td className="px-6 py-4 whitespace-nowrap text-red-600">{platform.negative}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {selectedReport === 'trend-analysis' && (
              <div className="space-y-8">
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={(currentReport.data as any).trends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="positive" stroke="#10b981" strokeWidth={3} />
                    <Line type="monotone" dataKey="neutral" stroke="#f59e0b" strokeWidth={3} />
                    <Line type="monotone" dataKey="negative" stroke="#ef4444" strokeWidth={3} />
                  </LineChart>
                </ResponsiveContainer>

                <div className="bg-gray-50 p-6 rounded-lg">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Trend Insights</h3>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Positive sentiment has increased by 8% over the selected period</li>
                    <li>• Negative sentiment shows a declining trend, down 5% from peak</li>
                    <li>• Overall sentiment score improved from 6.5 to 7.3</li>
                    <li>• Peak positive sentiment occurred on January 29th (73%)</li>
                    <li>• Most stable period was mid-January with consistent positive trends</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Report Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Report Actions</h3>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
              Schedule Report
            </button>
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
              Email Report
            </button>
            <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition-colors">
              Share Report
            </button>
            <button className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors">
              Print Report
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
