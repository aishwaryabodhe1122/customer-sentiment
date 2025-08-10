'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('sentiment-summary')
  const [dateRange, setDateRange] = useState('30d')
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportData, setReportData] = useState<Record<string, any>>({})

  // Function to generate dynamic report data based on date range
  const generateReportData = (reportType: string, dateRange: string) => {
    const dateMultiplier = dateRange === '7d' ? 0.25 : dateRange === '30d' ? 1 : dateRange === '90d' ? 3 : dateRange === '1y' ? 12 : 1
    
    const baseData = {
      'sentiment-summary': {
        title: 'Sentiment Analysis Summary Report',
        description: 'Comprehensive overview of customer sentiment across all platforms',
        data: {
          totalMentions: Math.floor((Math.random() * 5000 + 10000) * dateMultiplier),
          positiveRate: Math.floor(Math.random() * 20 + 60), // 60-80%
          negativeRate: Math.floor(Math.random() * 15 + 10), // 10-25%
          neutralRate: Math.floor(Math.random() * 10 + 10), // 10-20%
          averageScore: (Math.random() * 2 + 6).toFixed(1), // 6.0-8.0
          topKeywords: ['excellent', 'quality', 'fast delivery', 'helpful', 'satisfied'],
          bottomKeywords: ['slow', 'expensive', 'confusing', 'delayed', 'poor']
        }
      },
      'platform-analysis': {
        title: 'Platform Performance Analysis',
        description: 'Detailed breakdown of sentiment across different social media platforms',
        data: {
          platforms: [
            { 
              name: 'Twitter', 
              mentions: Math.floor((Math.random() * 2000 + 3000) * dateMultiplier), 
              positive: Math.floor(Math.random() * 20 + 60), 
              negative: Math.floor(Math.random() * 15 + 15), 
              neutral: Math.floor(Math.random() * 10 + 10) 
            },
            { 
              name: 'Instagram', 
              mentions: Math.floor((Math.random() * 1500 + 2500) * dateMultiplier), 
              positive: Math.floor(Math.random() * 25 + 65), 
              negative: Math.floor(Math.random() * 10 + 10), 
              neutral: Math.floor(Math.random() * 8 + 8) 
            },
            { 
              name: 'Facebook', 
              mentions: Math.floor((Math.random() * 1200 + 2000) * dateMultiplier), 
              positive: Math.floor(Math.random() * 20 + 55), 
              negative: Math.floor(Math.random() * 15 + 18), 
              neutral: Math.floor(Math.random() * 12 + 12) 
            },
            { 
              name: 'Reviews', 
              mentions: Math.floor((Math.random() * 800 + 1500) * dateMultiplier), 
              positive: Math.floor(Math.random() * 25 + 70), 
              negative: Math.floor(Math.random() * 12 + 12), 
              neutral: Math.floor(Math.random() * 6 + 6) 
            }
          ]
        }
      },
      'trend-analysis': {
        title: 'Sentiment Trend Analysis',
        description: 'Historical sentiment trends and pattern analysis',
        data: {
          trends: generateTrendData(dateRange)
        }
      }
    }
    
    return baseData[reportType as keyof typeof baseData]
  }

  // Function to generate trend data based on date range
  const generateTrendData = (dateRange: string) => {
    const days = dateRange === '7d' ? 7 : dateRange === '30d' ? 30 : dateRange === '90d' ? 90 : dateRange === '1y' ? 365 : 30
    const interval = dateRange === '1y' ? 30 : dateRange === '90d' ? 7 : 1 // Show every 30 days for year, every 7 days for 90d, daily for others
    const dataPoints = Math.ceil(days / interval)
    
    const trends = []
    const today = new Date()
    
    for (let i = dataPoints - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - (i * interval))
      
      trends.push({
        date: date.toISOString().split('T')[0],
        positive: Math.floor(Math.random() * 20 + 60), // 60-80%
        negative: Math.floor(Math.random() * 15 + 10), // 10-25%
        neutral: Math.floor(Math.random() * 10 + 10)   // 10-20%
      })
    }
    
    return trends
  }

  // Update report data when dropdowns change
  useEffect(() => {
    const newReportData = generateReportData(selectedReport, dateRange)
    setReportData(prev => ({
      ...prev,
      [selectedReport]: newReportData
    }))
    console.log('Updated report data for:', selectedReport, 'with date range:', dateRange)
  }, [selectedReport, dateRange])

  const currentReport = reportData[selectedReport as keyof typeof reportData]

  // Show loading state if report data is not yet available
  if (!currentReport) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  const handleGenerateReport = async () => {
    setIsGenerating(true)
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    try {
      // Generate actual PDF content
      const pdfContent = generatePDFContent(currentReport, selectedReport, dateRange)
      
      // Create PDF blob
      const blob = new Blob([pdfContent], { type: 'application/pdf' })
      
      // Create download link
      const element = document.createElement('a')
      element.href = URL.createObjectURL(blob)
      element.download = `${selectedReport}-${dateRange}-report.pdf`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
      
      // Clean up
      URL.revokeObjectURL(element.href)
    } catch (error) {
      console.error('Error generating PDF:', error)
      // Fallback to simple text-based PDF-like content
      const fallbackContent = generateFallbackPDFContent(currentReport, selectedReport, dateRange)
      const blob = new Blob([fallbackContent], { type: 'text/plain' })
      
      const element = document.createElement('a')
      element.href = URL.createObjectURL(blob)
      element.download = `${selectedReport}-${dateRange}-report.txt`
      document.body.appendChild(element)
      element.click()
      document.body.removeChild(element)
    }
    
    setIsGenerating(false)
  }

  // Generate PDF-like content (simplified PDF format)
  const generatePDFContent = (report: any, reportType: string, dateRange: string) => {
    const date = new Date().toLocaleDateString()
    const title = report.title || 'Sentiment Analysis Report'
    
    // Create a simple PDF-like structure using PDF format basics
    const pdfHeader = `%PDF-1.4
1 0 obj
<<
/Type /Catalog
/Pages 2 0 R
>>
endobj

2 0 obj
<<
/Type /Pages
/Kids [3 0 R]
/Count 1
>>
endobj

3 0 obj
<<
/Type /Page
/Parent 2 0 R
/MediaBox [0 0 612 792]
/Contents 4 0 R
/Resources <<
/Font <<
/F1 5 0 R
>>
>>
>>
endobj

4 0 obj
<<
/Length 1000
>>
stream
BT
/F1 18 Tf
50 750 Td
(${title}) Tj
0 -30 Td
/F1 12 Tf
(Generated: ${date}) Tj
0 -20 Td
(Date Range: ${dateRange}) Tj
0 -40 Td
(Report Type: ${reportType.replace('-', ' ').toUpperCase()}) Tj
`

    let contentStream = pdfHeader

    // Add report-specific content
    if (reportType === 'sentiment-summary' && report.data) {
      contentStream += `
0 -40 Td
(SENTIMENT SUMMARY) Tj
0 -30 Td
(Total Mentions: ${report.data.totalMentions?.toLocaleString() || 'N/A'}) Tj
0 -20 Td
(Positive Rate: ${report.data.positiveRate || 'N/A'}%) Tj
0 -20 Td
(Negative Rate: ${report.data.negativeRate || 'N/A'}%) Tj
0 -20 Td
(Neutral Rate: ${report.data.neutralRate || 'N/A'}%) Tj
0 -20 Td
(Average Score: ${report.data.averageScore || 'N/A'}/10) Tj`
    } else if (reportType === 'platform-analysis' && report.data?.platforms) {
      contentStream += `
0 -40 Td
(PLATFORM ANALYSIS) Tj`
      report.data.platforms.forEach((platform: any, index: number) => {
        contentStream += `
0 -30 Td
(${platform.name}: ${platform.mentions?.toLocaleString() || 'N/A'} mentions) Tj
0 -15 Td
(  Positive: ${platform.positive || 'N/A'}% | Negative: ${platform.negative || 'N/A'}% | Neutral: ${platform.neutral || 'N/A'}%) Tj`
      })
    } else if (reportType === 'trend-analysis' && report.data?.trends) {
      contentStream += `
0 -40 Td
(TREND ANALYSIS) Tj
0 -30 Td
(Data Points: ${report.data.trends.length || 'N/A'}) Tj
0 -20 Td
(Period: ${dateRange}) Tj`
    }

    const pdfFooter = `
ET
endstream
endobj

5 0 obj
<<
/Type /Font
/Subtype /Type1
/BaseFont /Helvetica
>>
endobj

xref
0 6
0000000000 65535 f 
0000000010 00000 n 
0000000079 00000 n 
0000000173 00000 n 
0000000301 00000 n 
0000001500 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
1600
%%EOF`

    return contentStream + pdfFooter
  }

  // Fallback content for when PDF generation fails
  const generateFallbackPDFContent = (report: any, reportType: string, dateRange: string) => {
    const date = new Date().toLocaleDateString()
    const title = report.title || 'Sentiment Analysis Report'
    
    let content = `${title}
Generated: ${date}
Date Range: ${dateRange}
Report Type: ${reportType.replace('-', ' ').toUpperCase()}

`

    if (reportType === 'sentiment-summary' && report.data) {
      content += `SENTIMENT SUMMARY
================
Total Mentions: ${report.data.totalMentions?.toLocaleString() || 'N/A'}
Positive Rate: ${report.data.positiveRate || 'N/A'}%
Negative Rate: ${report.data.negativeRate || 'N/A'}%
Neutral Rate: ${report.data.neutralRate || 'N/A'}%
Average Score: ${report.data.averageScore || 'N/A'}/10

Top Keywords: ${report.data.topKeywords?.join(', ') || 'N/A'}
Bottom Keywords: ${report.data.bottomKeywords?.join(', ') || 'N/A'}
`
    } else if (reportType === 'platform-analysis' && report.data?.platforms) {
      content += `PLATFORM ANALYSIS
================
`
      report.data.platforms.forEach((platform: any) => {
        content += `${platform.name}: ${platform.mentions?.toLocaleString() || 'N/A'} mentions
  Positive: ${platform.positive || 'N/A'}% | Negative: ${platform.negative || 'N/A'}% | Neutral: ${platform.neutral || 'N/A'}%

`
      })
    } else if (reportType === 'trend-analysis' && report.data?.trends) {
      content += `TREND ANALYSIS
==============
Data Points: ${report.data.trends.length || 'N/A'}
Period: ${dateRange}

Recent Trends:
`
      report.data.trends.slice(-5).forEach((trend: any) => {
        content += `${trend.date}: Positive ${trend.positive}%, Negative ${trend.negative}%, Neutral ${trend.neutral}%
`
      })
    }

    return content
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
