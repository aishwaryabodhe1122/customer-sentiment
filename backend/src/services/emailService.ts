import nodemailer from 'nodemailer'

interface EmailOptions {
  to: string
  subject: string
  html: string
  attachments?: Array<{
    filename: string
    content: Buffer | string
    contentType?: string
  }>
}

class EmailService {
  private transporter: nodemailer.Transporter

  constructor() {
    // Configure email transporter
    // For development, we'll use Gmail SMTP
    // In production, you should use environment variables for credentials
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env['EMAIL_USER'] || 'aishwaryabodhe7007@gmail.com', // Your email
        pass: process.env['EMAIL_PASS'] || 'REPLACE-WITH-YOUR-16-CHAR-APP-PASSWORD' // Replace with Gmail App Password
      }
    })

    // Verify connection configuration
    this.transporter.verify((error) => {
      if (error) {
        console.log('Email service configuration error:', error)
        console.log('📧 Email service not configured. Emails will be logged only.')
        console.log('To enable real emails:')
        console.log('1. Set EMAIL_USER and EMAIL_PASS environment variables')
        console.log('2. Or update the credentials in emailService.ts')
      } else {
        console.log('📧 Email service ready to send emails!')
      }
    })
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      const mailOptions = {
        from: process.env['EMAIL_USER'] || 'AI Sentiment Tracker <noreply@sentimenttracker.com>',
        to: options.to,
        subject: options.subject,
        html: options.html,
        attachments: options.attachments || []
      }

      const info = await this.transporter.sendMail(mailOptions)
      console.log('✅ Email sent successfully:', info.messageId)
      console.log('📧 Email sent to:', options.to)
      return true
    } catch (error) {
      console.error('❌ Email sending failed:', error)
      return false
    }
  }

  async sendReportEmail(
    recipientEmail: string, 
    reportType: string, 
    dateRange: string, 
    reportData: any
  ): Promise<boolean> {
    try {
      // Generate PDF content for attachment
      const pdfContent = this.generatePDFContent(reportData, reportType, dateRange)
      
      // Create email HTML content
      const emailHtml = this.generateEmailHTML(reportType, dateRange, reportData)
      
      const emailOptions: EmailOptions = {
        to: recipientEmail,
        subject: `Sentiment Analysis Report - ${reportType.replace('-', ' ').toUpperCase()} (${dateRange})`,
        html: emailHtml,
        attachments: [
          {
            filename: `${reportType}-${dateRange}-report.pdf`,
            content: pdfContent,
            contentType: 'application/pdf'
          }
        ]
      }

      return await this.sendEmail(emailOptions)
    } catch (error) {
      console.error('Error sending report email:', error)
      return false
    }
  }

  async sendScheduleConfirmationEmail(
    recipientEmail: string,
    reportType: string,
    frequency: string,
    nextRunAt: string
  ): Promise<boolean> {
    try {
      const emailHtml = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Report Scheduled Successfully</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #007bff; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
            .info-box { background: white; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #007bff; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
            .button { display: inline-block; background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📅 Report Scheduled Successfully!</h1>
            </div>
            <div class="content">
              <h2>Your automated report is now active</h2>
              
              <div class="info-box">
                <h3>Schedule Details:</h3>
                <p><strong>Report Type:</strong> ${reportType.replace('-', ' ').toUpperCase()}</p>
                <p><strong>Frequency:</strong> ${frequency}</p>
                <p><strong>Next Delivery:</strong> ${new Date(nextRunAt).toLocaleString()}</p>
                <p><strong>Delivery Email:</strong> ${recipientEmail}</p>
              </div>

              <p>You will automatically receive your sentiment analysis reports according to the schedule above. Each report will include:</p>
              
              <ul>
                <li>📊 Latest sentiment metrics and trends</li>
                <li>📈 Platform-specific analysis</li>
                <li>📄 Professional PDF attachment</li>
                <li>🔍 Key insights and recommendations</li>
              </ul>

              <p>You can manage or cancel your scheduled reports anytime from your dashboard.</p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="http://localhost:3000/reports" class="button">View Reports Dashboard</a>
              </div>
            </div>
            <div class="footer">
              <p>AI-Powered Customer Sentiment Tracker</p>
              <p>This is an automated message. Please do not reply to this email.</p>
            </div>
          </div>
        </body>
        </html>
      `

      const emailOptions: EmailOptions = {
        to: recipientEmail,
        subject: `Report Scheduled: ${frequency} ${reportType.replace('-', ' ').toUpperCase()} Reports`,
        html: emailHtml
      }

      return await this.sendEmail(emailOptions)
    } catch (error) {
      console.error('Error sending schedule confirmation email:', error)
      return false
    }
  }

  private generateEmailHTML(reportType: string, dateRange: string, reportData: any): string {
    const reportTitle = reportData.title || 'Sentiment Analysis Report'
    const currentDate = new Date().toLocaleDateString()

    let reportContent = ''

    if (reportType === 'sentiment-summary' && reportData.data) {
      reportContent = `
        <div class="metrics-grid">
          <div class="metric">
            <h3>${reportData.data.totalMentions?.toLocaleString() || 'N/A'}</h3>
            <p>Total Mentions</p>
          </div>
          <div class="metric">
            <h3 style="color: #28a745;">${reportData.data.positiveRate || 'N/A'}%</h3>
            <p>Positive Rate</p>
          </div>
          <div class="metric">
            <h3 style="color: #dc3545;">${reportData.data.negativeRate || 'N/A'}%</h3>
            <p>Negative Rate</p>
          </div>
          <div class="metric">
            <h3 style="color: #ffc107;">${reportData.data.neutralRate || 'N/A'}%</h3>
            <p>Neutral Rate</p>
          </div>
        </div>
        
        <div class="keywords-section">
          <h3>Top Keywords</h3>
          <p>${reportData.data.topKeywords?.join(', ') || 'N/A'}</p>
          
          <h3>Areas for Improvement</h3>
          <p>${reportData.data.bottomKeywords?.join(', ') || 'N/A'}</p>
        </div>
      `
    } else if (reportType === 'platform-analysis' && reportData.data?.platforms) {
      reportContent = `
        <div class="platform-analysis">
          <h3>Platform Performance</h3>
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
            <thead>
              <tr style="background: #f8f9fa;">
                <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Platform</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Mentions</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Positive</th>
                <th style="padding: 12px; text-align: left; border: 1px solid #dee2e6;">Negative</th>
              </tr>
            </thead>
            <tbody>
              ${reportData.data.platforms.map((platform: any) => `
                <tr>
                  <td style="padding: 12px; border: 1px solid #dee2e6;">${platform.name}</td>
                  <td style="padding: 12px; border: 1px solid #dee2e6;">${platform.mentions?.toLocaleString() || 'N/A'}</td>
                  <td style="padding: 12px; border: 1px solid #dee2e6; color: #28a745;">${platform.positive || 'N/A'}%</td>
                  <td style="padding: 12px; border: 1px solid #dee2e6; color: #dc3545;">${platform.negative || 'N/A'}%</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      `
    } else if (reportType === 'trend-analysis' && reportData.data?.trends) {
      reportContent = `
        <div class="trend-analysis">
          <h3>Recent Trends (${dateRange})</h3>
          <p>Data points: ${reportData.data.trends.length || 'N/A'}</p>
          <div style="background: #f8f9fa; padding: 15px; border-radius: 6px; margin: 15px 0;">
            ${reportData.data.trends.slice(-5).map((trend: any) => `
              <div style="margin: 10px 0; padding: 8px; background: white; border-radius: 4px;">
                <strong>${trend.date}:</strong> 
                <span style="color: #28a745;">+${trend.positive}%</span> | 
                <span style="color: #dc3545;">-${trend.negative}%</span> | 
                <span style="color: #ffc107;">~${trend.neutral}%</span>
              </div>
            `).join('')}
          </div>
        </div>
      `
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>${reportTitle}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 800px; margin: 0 auto; padding: 20px; }
          .header { background: #007bff; color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 8px 8px; }
          .metrics-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin: 20px 0; }
          .metric { background: white; padding: 20px; text-align: center; border-radius: 6px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .metric h3 { margin: 0; font-size: 2em; }
          .metric p { margin: 10px 0 0 0; color: #666; }
          .keywords-section { margin: 30px 0; }
          .keywords-section h3 { color: #007bff; border-bottom: 2px solid #007bff; padding-bottom: 5px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>📊 ${reportTitle}</h1>
            <p>Generated on ${currentDate} • Period: ${dateRange}</p>
          </div>
          <div class="content">
            ${reportContent}
            
            <div style="background: white; padding: 20px; border-radius: 6px; margin: 30px 0; border-left: 4px solid #007bff;">
              <h3>📎 PDF Report Attached</h3>
              <p>A detailed PDF version of this report is attached to this email for your records and further analysis.</p>
            </div>
          </div>
          <div class="footer">
            <p>AI-Powered Customer Sentiment Tracker</p>
            <p>This report was automatically generated based on your latest data.</p>
          </div>
        </div>
      </body>
      </html>
    `
  }

  private generatePDFContent(reportData: any, reportType: string, dateRange: string): string {
    // This generates a simple PDF-like content
    // For production, you might want to use a proper PDF library like puppeteer or jsPDF
    const date = new Date().toLocaleDateString()
    const title = reportData.title || 'Sentiment Analysis Report'
    
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
/Length 2000
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
    if (reportType === 'sentiment-summary' && reportData.data) {
      contentStream += `
0 -40 Td
(SENTIMENT SUMMARY) Tj
0 -30 Td
(Total Mentions: ${reportData.data.totalMentions?.toLocaleString() || 'N/A'}) Tj
0 -20 Td
(Positive Rate: ${reportData.data.positiveRate || 'N/A'}%) Tj
0 -20 Td
(Negative Rate: ${reportData.data.negativeRate || 'N/A'}%) Tj
0 -20 Td
(Neutral Rate: ${reportData.data.neutralRate || 'N/A'}%) Tj
0 -20 Td
(Average Score: ${reportData.data.averageScore || 'N/A'}/10) Tj
0 -40 Td
(Top Keywords: ${reportData.data.topKeywords?.join(', ') || 'N/A'}) Tj
0 -20 Td
(Bottom Keywords: ${reportData.data.bottomKeywords?.join(', ') || 'N/A'}) Tj`
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
0000002500 00000 n 
trailer
<<
/Size 6
/Root 1 0 R
>>
startxref
2600
%%EOF`

    return contentStream + pdfFooter
  }
}

export default new EmailService()
