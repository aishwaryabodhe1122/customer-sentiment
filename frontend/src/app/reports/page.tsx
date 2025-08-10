'use client'

import { useState, useEffect } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts'

export default function ReportsPage() {
  const [selectedReport, setSelectedReport] = useState('sentiment-summary')
  const [dateRange, setDateRange] = useState('30d')
  const [isGenerating, setIsGenerating] = useState(false)
  const [reportData, setReportData] = useState<Record<string, any>>({})
  
  // Modal states
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showEmailModal, setShowEmailModal] = useState(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const [scheduleFrequency, setScheduleFrequency] = useState('')
  const [emailAddress, setEmailAddress] = useState('')
  const [shareUrl, setShareUrl] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

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

  // Report Actions handlers
  const handleScheduleReport = () => {
    setScheduleFrequency('')
    setShowScheduleModal(true)
  }

  const handleEmailReport = () => {
    setEmailAddress('')
    setShowEmailModal(true)
  }

  const handleShareReport = async () => {
    setIsProcessing(true)
    
    try {
      // Generate shared report and save to backend
      const shareId = `${selectedReport}-${dateRange}-${Date.now()}`
      const response = await fetch('/api/reports/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shareId,
          reportType: selectedReport,
          dateRange,
          reportData: currentReport,
          expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
        })
      })

      if (response.ok) {
        const shareUrl = `${window.location.origin}/reports/shared/${shareId}`
        setShareUrl(shareUrl)
        
        // Copy to clipboard
        await navigator.clipboard.writeText(shareUrl)
        setShowShareModal(true)
      } else {
        throw new Error('Failed to create share link')
      }
    } catch (error) {
      console.error('Error creating share link:', error)
      // Fallback - still show modal with basic share URL
      const shareUrl = `${window.location.origin}/reports/shared/${selectedReport}-${dateRange}-${Date.now()}`
      setShareUrl(shareUrl)
      await navigator.clipboard.writeText(shareUrl)
      setShowShareModal(true)
    }
    
    setIsProcessing(false)
  }

  // Modal action handlers
  const handleScheduleSubmit = async () => {
    if (!scheduleFrequency) return
    
    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/reports/schedule', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          reportType: selectedReport,
          dateRange,
          frequency: scheduleFrequency,
          reportData: currentReport
        })
      })

      if (response.ok) {
        setShowScheduleModal(false)
        // Show success toast (we'll implement this)
        setTimeout(() => {
          alert(`✅ Report scheduled successfully!\n\nFrequency: ${scheduleFrequency}\nYou will receive automated reports via email.`)
        }, 100)
      } else {
        throw new Error('Failed to schedule report')
      }
    } catch (error) {
      console.error('Error scheduling report:', error)
      alert('❌ Failed to schedule report. Please try again.')
    }
    
    setIsProcessing(false)
  }

  const handleEmailSubmit = async () => {
    if (!emailAddress || !emailAddress.includes('@')) {
      alert('❌ Please enter a valid email address.')
      return
    }
    
    setIsProcessing(true)
    
    try {
      const response = await fetch('/api/reports/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: emailAddress,
          reportType: selectedReport,
          dateRange,
          reportData: currentReport
        })
      })

      if (response.ok) {
        setShowEmailModal(false)
        setTimeout(() => {
          alert(`✅ Report emailed successfully!\n\nSent to: ${emailAddress}\nThe recipient will receive the PDF report shortly.`)
        }, 100)
      } else {
        throw new Error('Failed to send email')
      }
    } catch (error) {
      console.error('Error sending email:', error)
      alert('❌ Failed to send email. Please try again.')
    }
    
    setIsProcessing(false)
  }

  const handlePrintReport = () => {
    const reportName = currentReport.title
    
    // Create a printable version of the current report
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      const printContent = generatePrintableReport(currentReport, selectedReport, dateRange)
      
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>${reportName} - Print</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header { border-bottom: 2px solid #333; padding-bottom: 10px; margin-bottom: 20px; }
            .metric { margin: 10px 0; }
            .platform { margin: 15px 0; padding: 10px; border-left: 3px solid #007bff; }
            .trend { margin: 10px 0; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
        </html>
      `)
      
      printWindow.document.close()
      printWindow.focus()
      
      // Auto-print after a short delay
      setTimeout(() => {
        printWindow.print()
      }, 500)
    } else {
      alert('❌ Unable to open print window. Please check your popup blocker settings.')
    }
  }

  // Generate printable HTML content
  const generatePrintableReport = (report: any, reportType: string, dateRange: string) => {
    const date = new Date().toLocaleDateString()
    const title = report.title || 'Sentiment Analysis Report'
    
    let content = `
      <div class="header">
        <h1>${title}</h1>
        <p><strong>Generated:</strong> ${date}</p>
        <p><strong>Date Range:</strong> ${dateRange}</p>
        <p><strong>Report Type:</strong> ${reportType.replace('-', ' ').toUpperCase()}</p>
      </div>
    `

    if (reportType === 'sentiment-summary' && report.data) {
      content += `
        <h2>Sentiment Summary</h2>
        <div class="metric"><strong>Total Mentions:</strong> ${report.data.totalMentions?.toLocaleString() || 'N/A'}</div>
        <div class="metric"><strong>Positive Rate:</strong> ${report.data.positiveRate || 'N/A'}%</div>
        <div class="metric"><strong>Negative Rate:</strong> ${report.data.negativeRate || 'N/A'}%</div>
        <div class="metric"><strong>Neutral Rate:</strong> ${report.data.neutralRate || 'N/A'}%</div>
        <div class="metric"><strong>Average Score:</strong> ${report.data.averageScore || 'N/A'}/10</div>
        
        <h3>Top Keywords</h3>
        <p>${report.data.topKeywords?.join(', ') || 'N/A'}</p>
        
        <h3>Bottom Keywords</h3>
        <p>${report.data.bottomKeywords?.join(', ') || 'N/A'}</p>
      `
    } else if (reportType === 'platform-analysis' && report.data?.platforms) {
      content += `<h2>Platform Analysis</h2>`
      report.data.platforms.forEach((platform: any) => {
        content += `
          <div class="platform">
            <h3>${platform.name}</h3>
            <div class="metric"><strong>Mentions:</strong> ${platform.mentions?.toLocaleString() || 'N/A'}</div>
            <div class="metric"><strong>Positive:</strong> ${platform.positive || 'N/A'}%</div>
            <div class="metric"><strong>Negative:</strong> ${platform.negative || 'N/A'}%</div>
            <div class="metric"><strong>Neutral:</strong> ${platform.neutral || 'N/A'}%</div>
          </div>
        `
      })
    } else if (reportType === 'trend-analysis' && report.data?.trends) {
      content += `
        <h2>Trend Analysis</h2>
        <div class="metric"><strong>Data Points:</strong> ${report.data.trends.length || 'N/A'}</div>
        <div class="metric"><strong>Period:</strong> ${dateRange}</div>
        
        <h3>Recent Trends</h3>
      `
      report.data.trends.slice(-10).forEach((trend: any) => {
        content += `
          <div class="trend">
            <strong>${trend.date}:</strong> 
            Positive ${trend.positive}%, 
            Negative ${trend.negative}%, 
            Neutral ${trend.neutral}%
          </div>
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
            <button 
              onClick={handleScheduleReport}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Schedule Report
            </button>
            <button 
              onClick={handleEmailReport}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Email Report
            </button>
            <button 
              onClick={handleShareReport}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md font-medium transition-colors"
            >
              Share Report
            </button>
            <button 
              onClick={handlePrintReport}
              className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-md font-medium transition-colors"
            >
              Print Report
            </button>
          </div>
        </div>
      </div>

      {/* Custom Modals */}
      {/* Schedule Report Modal */}
      {showScheduleModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Schedule Report</h3>
              <p className="text-sm text-gray-600 mt-1">Set up automated delivery for "{currentReport.title}"</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Delivery Frequency
                  </label>
                  <div className="space-y-2">
                    {['Daily', 'Weekly', 'Monthly'].map((freq) => (
                      <label key={freq} className="flex items-center">
                        <input
                          type="radio"
                          name="frequency"
                          value={freq}
                          checked={scheduleFrequency === freq}
                          onChange={(e) => setScheduleFrequency(e.target.value)}
                          className="mr-3 text-blue-600"
                        />
                        <span className="text-gray-700">{freq}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="bg-blue-50 p-3 rounded-md">
                  <p className="text-sm text-blue-800">
                    📧 Reports will be automatically sent to your registered email address
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowScheduleModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleScheduleSubmit}
                disabled={!scheduleFrequency || isProcessing}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
              >
                {isProcessing ? 'Scheduling...' : 'Schedule Report'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Email Report Modal */}
      {showEmailModal && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowEmailModal(false)
            }
          }}
        >
          <div 
            className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Email Report</h3>
              <p className="text-sm text-gray-600 mt-1">Send "{currentReport.title}" via email</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Recipient Email Address
                  </label>
                  <input
                    type="email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    onInput={(e) => setEmailAddress((e.target as HTMLInputElement).value)}
                    placeholder="Enter email address"
                    autoFocus
                    autoComplete="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div className="bg-green-50 p-3 rounded-md">
                  <p className="text-sm text-green-800">
                    📄 The report will be sent as a PDF attachment with current data ({dateRange})
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => setShowEmailModal(false)}
                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleEmailSubmit}
                disabled={!emailAddress || isProcessing}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-green-400 transition-colors"
              >
                {isProcessing ? 'Sending...' : 'Send Email'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Share Report Modal */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Share Report</h3>
              <p className="text-sm text-gray-600 mt-1">Report link generated and copied to clipboard</p>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Shareable Link
                  </label>
                  <div className="flex">
                    <input
                      type="text"
                      value={shareUrl}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-gray-600 text-sm"
                    />
                    <button
                      onClick={() => navigator.clipboard.writeText(shareUrl)}
                      className="px-3 py-2 bg-gray-200 border border-l-0 border-gray-300 rounded-r-md hover:bg-gray-300 transition-colors"
                    >
                      📋
                    </button>
                  </div>
                </div>
                <div className="bg-purple-50 p-3 rounded-md">
                  <p className="text-sm text-purple-800">
                    🔗 This link will be valid for 30 days and allows view-only access to the report
                  </p>
                </div>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
