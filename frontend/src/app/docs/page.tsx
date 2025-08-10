'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DocumentationPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({})
  const [expandedArticles, setExpandedArticles] = useState<{[key: string]: boolean}>({}) 
  const [filteredSections, setFilteredSections] = useState<any[]>([])

  const scrollToSection = (sectionTitle: string) => {
    const element = document.getElementById(sectionTitle.toLowerCase().replace(/\s+/g, '-'))
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const toggleSection = (sectionTitle: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionTitle]: !prev[sectionTitle]
    }))
  }

  const toggleArticle = (articleTitle: string) => {
    setExpandedArticles(prev => ({
      ...prev,
      [articleTitle]: !prev[articleTitle]
    }))
  }
  // Enhanced sections with detailed content
  const sections = [
    {
      title: 'Getting Started',
      items: [
        { 
          title: 'Quick Start Guide', 
          description: 'Get up and running in 5 minutes',
          content: `
            <h4>1. Create Your Account</h4>
            <p>Sign up for a free SentimentTracker account and verify your email address.</p>
            
            <h4>2. Get Your API Key</h4>
            <p>Navigate to Settings > API Keys and generate your first API key.</p>
            
            <h4>3. Make Your First Request</h4>
            <pre><code>curl -X POST https://api.sentimenttracker.com/v1/analyze \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"text": "I love this product!"}'</code></pre>
            
            <h4>4. View Results</h4>
            <p>Check your dashboard to see the sentiment analysis results and insights.</p>
          `
        },
        { 
          title: 'Installation', 
          description: 'Step-by-step setup instructions',
          content: `
            <h4>Node.js SDK</h4>
            <pre><code>npm install @sentimenttracker/sdk</code></pre>
            
            <h4>Python SDK</h4>
            <pre><code>pip install sentimenttracker</code></pre>
            
            <h4>JavaScript CDN</h4>
            <pre><code>&lt;script src="https://cdn.sentimenttracker.com/v1/sdk.js"&gt;&lt;/script&gt;</code></pre>
          `
        },
        { 
          title: 'Authentication', 
          description: 'API keys and authentication methods',
          content: `
            <h4>API Key Authentication</h4>
            <p>Include your API key in the Authorization header:</p>
            <pre><code>Authorization: Bearer YOUR_API_KEY</code></pre>
            
            <h4>OAuth 2.0</h4>
            <p>For server-side applications, use OAuth 2.0 flow for enhanced security.</p>
          `
        },
        { 
          title: 'First Analysis', 
          description: 'Run your first sentiment analysis',
          content: `
            <h4>Basic Sentiment Analysis</h4>
            <pre><code>const result = await sentimentTracker.analyze({
  text: "This product is amazing!",
  language: "en"
})

console.log(result.sentiment) // "positive"
console.log(result.score)     // 0.89</code></pre>
          `
        }
      ]
    },
    {
      title: 'API Reference',
      items: [
        { 
          title: 'REST API', 
          description: 'Complete REST API documentation',
          content: `
            <h4>Base URL</h4>
            <pre><code>https://api.sentimenttracker.com/v1</code></pre>
            
            <h4>Analyze Text</h4>
            <pre><code>POST /analyze
{
  "text": "Your text here",
  "language": "en",
  "options": {
    "emotions": true,
    "topics": true
  }
}</code></pre>
          `
        },
        { 
          title: 'WebSocket API', 
          description: 'Real-time data streaming',
          content: `
            <h4>Connect to WebSocket</h4>
            <pre><code>const ws = new WebSocket('wss://api.sentimenttracker.com/v1/stream')
ws.send(JSON.stringify({
  "auth": "YOUR_API_KEY",
  "subscribe": ["mentions", "reviews"]
}))</code></pre>
          `
        },
        { 
          title: 'Webhooks', 
          description: 'Event-driven integrations',
          content: `
            <h4>Setup Webhooks</h4>
            <p>Configure webhooks to receive real-time notifications when sentiment changes occur.</p>
            <pre><code>POST /webhooks
{
  "url": "https://yoursite.com/webhook",
  "events": ["sentiment_alert", "new_mention"]
}</code></pre>
          `
        },
        { 
          title: 'Rate Limits', 
          description: 'API usage limits and best practices',
          content: `
            <h4>Current Limits</h4>
            <ul>
              <li>Free Plan: 1,000 requests/month</li>
              <li>Pro Plan: 10,000 requests/month</li>
              <li>Enterprise: Unlimited</li>
            </ul>
            
            <h4>Best Practices</h4>
            <p>Implement exponential backoff for rate limit handling.</p>
          `
        }
      ]
    },
    {
      title: 'Features',
      items: [
        { 
          title: 'Sentiment Analysis', 
          description: 'Advanced NLP sentiment detection',
          content: `
            <h4>AI-Powered Analysis</h4>
            <p>Our sentiment analysis uses state-of-the-art BERT-based models trained on millions of social media posts and reviews.</p>
            
            <h4>Supported Languages</h4>
            <ul>
              <li>English, Spanish, French, German</li>
              <li>Portuguese, Italian, Dutch</li>
              <li>Japanese, Korean, Chinese</li>
            </ul>
            
            <h4>Accuracy</h4>
            <p>94% accuracy on standard sentiment benchmarks with continuous model improvements.</p>
          `
        },
        { 
          title: 'Emotion Detection', 
          description: 'Multi-emotion classification',
          content: `
            <h4>Detected Emotions</h4>
            <ul>
              <li><strong>Joy:</strong> Happiness, excitement, satisfaction</li>
              <li><strong>Anger:</strong> Frustration, annoyance, rage</li>
              <li><strong>Fear:</strong> Anxiety, worry, concern</li>
              <li><strong>Surprise:</strong> Amazement, shock, wonder</li>
              <li><strong>Sadness:</strong> Disappointment, grief, melancholy</li>
            </ul>
            
            <h4>Use Cases</h4>
            <p>Emotion detection helps identify specific customer pain points and positive experiences for targeted improvements.</p>
          `
        },
        { 
          title: 'Topic Modeling', 
          description: 'Automatic topic extraction',
          content: `
            <h4>Topic Discovery</h4>
            <p>Automatically identify key topics and themes in customer feedback using advanced NLP techniques.</p>
            
            <h4>Trending Topics</h4>
            <p>Track which topics are gaining or losing traction over time to stay ahead of customer concerns.</p>
            
            <h4>Topic Sentiment</h4>
            <p>Understand sentiment for specific topics to prioritize product improvements and marketing strategies.</p>
          `
        },
        { 
          title: 'Trend Analysis', 
          description: 'Historical trend tracking',
          content: `
            <h4>Time Series Analysis</h4>
            <p>Track sentiment changes over time with customizable date ranges from hours to years.</p>
            
            <h4>Seasonal Patterns</h4>
            <p>Identify recurring patterns in customer sentiment to optimize marketing campaigns and product launches.</p>
            
            <h4>Predictive Insights</h4>
            <p>AI-powered forecasting to predict future sentiment trends based on historical data.</p>
          `
        }
      ]
    },
    {
      title: 'Integrations',
      items: [
        { 
          title: 'Social Media', 
          description: 'Twitter, Instagram, Facebook APIs',
          content: `
            <h4>Twitter Integration</h4>
            <pre><code>// Monitor hashtags and mentions
const twitter = new TwitterConnector({
  apiKey: 'YOUR_TWITTER_API_KEY',
  keywords: ['#yourbrand', '@yourbrand']
})</code></pre>
            
            <h4>Instagram Integration</h4>
            <p>Connect Instagram Business accounts to monitor comments, mentions, and story interactions.</p>
            
            <h4>Facebook Integration</h4>
            <p>Analyze Facebook page comments, reviews, and post interactions for comprehensive social sentiment.</p>
          `
        },
        { 
          title: 'E-commerce', 
          description: 'Shopify, Amazon, review platforms',
          content: `
            <h4>Shopify Integration</h4>
            <pre><code>// Connect your Shopify store
const shopify = new ShopifyConnector({
  shopDomain: 'yourstore.myshopify.com',
  accessToken: 'YOUR_ACCESS_TOKEN'
})</code></pre>
            
            <h4>Amazon Reviews</h4>
            <p>Monitor product reviews and ratings from Amazon marketplace for competitive analysis.</p>
            
            <h4>Review Platforms</h4>
            <p>Connect Google Reviews, Yelp, Trustpilot, and other review platforms.</p>
          `
        },
        { 
          title: 'Custom Webhooks', 
          description: 'Build your own integrations',
          content: `
            <h4>Webhook Setup</h4>
            <pre><code>POST /api/webhooks
{
  "url": "https://yoursite.com/webhook",
  "events": ["sentiment_alert", "new_mention"],
  "secret": "your_webhook_secret"
}</code></pre>
            
            <h4>Event Types</h4>
            <ul>
              <li>sentiment_alert - Sentiment threshold breached</li>
              <li>new_mention - New mention detected</li>
              <li>volume_spike - Unusual activity detected</li>
            </ul>
          `
        },
        { 
          title: 'Third-party Tools', 
          description: 'Slack, Teams, and more',
          content: `
            <h4>Slack Integration</h4>
            <p>Receive sentiment alerts and reports directly in your Slack channels.</p>
            
            <h4>Microsoft Teams</h4>
            <p>Connect with Teams for enterprise collaboration and alert management.</p>
            
            <h4>Zapier Integration</h4>
            <p>Connect with 3,000+ apps through Zapier for automated workflows.</p>
          `
        }
      ]
    }
  ]

  // Search functionality
  useEffect(() => {
    if (!searchTerm) {
      setFilteredSections([])
      return
    }

    const filtered = sections.map(section => ({
      ...section,
      items: section.items.filter((item: any) => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.content && item.content.toLowerCase().includes(searchTerm.toLowerCase()))
      )
    })).filter(section => section.items.length > 0)

    setFilteredSections(filtered)
  }, [searchTerm])

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Documentation</h1>
          <p className="text-lg text-gray-600">
            Everything you need to know about using SentimentTracker effectively.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search documentation..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
          {searchTerm && (
            <div className="mt-2 text-sm text-gray-600">
              {filteredSections.length > 0 ? (
                `Found ${filteredSections.reduce((acc, section) => acc + section.items.length, 0)} results`
              ) : (
                'No results found'
              )}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div 
            onClick={() => scrollToSection('Getting Started')}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white cursor-pointer hover:from-blue-600 hover:to-blue-700 transition-all"
          >
            <div className="text-2xl mb-2">🚀</div>
            <h3 className="text-lg font-semibold mb-2">Quick Start</h3>
            <p className="text-blue-100 text-sm">Get started in minutes</p>
          </div>
          <div 
            onClick={() => scrollToSection('API Reference')}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white cursor-pointer hover:from-green-600 hover:to-green-700 transition-all"
          >
            <div className="text-2xl mb-2">📚</div>
            <h3 className="text-lg font-semibold mb-2">API Reference</h3>
            <p className="text-green-100 text-sm">Complete API docs</p>
          </div>
          <div 
            onClick={() => scrollToSection('Integrations')}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white cursor-pointer hover:from-purple-600 hover:to-purple-700 transition-all"
          >
            <div className="text-2xl mb-2">🔧</div>
            <h3 className="text-lg font-semibold mb-2">Integrations</h3>
            <p className="text-purple-100 text-sm">Connect your tools</p>
          </div>
          <div 
            onClick={() => scrollToSection('Features')}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white cursor-pointer hover:from-orange-600 hover:to-orange-700 transition-all"
          >
            <div className="text-2xl mb-2">💡</div>
            <h3 className="text-lg font-semibold mb-2">Examples</h3>
            <p className="text-orange-100 text-sm">Code samples</p>
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {(searchTerm ? filteredSections : sections).map((section, sectionIndex) => (
            <div key={sectionIndex} id={section.title.toLowerCase().replace(/\s+/g, '-')} className="bg-white rounded-lg shadow">
              <div 
                onClick={() => toggleSection(section.title)}
                className="p-6 border-b border-gray-200 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                  <svg 
                    className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                      expandedSections[section.title] ? 'rotate-90' : ''
                    }`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
              {expandedSections[section.title] && (
                <div className="p-6">
                  <div className="space-y-4">
                    {section.items.map((item: any, itemIndex: any) => (
                      <div key={itemIndex} className="border border-gray-200 rounded-lg">
                        <div 
                          onClick={() => toggleSection(`${section.title}-${item.title}`)}
                          className="flex items-start space-x-3 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
                        >
                          <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                          <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                            <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                          </div>
                          <svg 
                            className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${
                              expandedSections[`${section.title}-${item.title}`] ? 'rotate-90' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                        {expandedSections[`${section.title}-${item.title}`] && item.content && (
                          <div className="px-4 pb-4 border-t border-gray-100">
                            <div 
                              className="prose prose-sm max-w-none mt-4"
                              dangerouslySetInnerHTML={{ __html: item.content }}
                            />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Popular Articles */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Popular Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Understanding Sentiment Scores</h3>
              <p className="text-gray-600 text-sm mb-4">Learn how our AI models calculate sentiment scores and what they mean for your business.</p>
              {!expandedArticles['sentiment-scores'] ? (
                <button 
                  onClick={() => toggleArticle('sentiment-scores')}
                  className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
                >
                  Read more →
                </button>
              ) : (
                <div>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
                    <h4 className="font-semibold mb-2">Sentiment Score Range</h4>
                    <p className="mb-3">Our sentiment scores range from -1.0 (very negative) to +1.0 (very positive):</p>
                    <ul className="list-disc list-inside space-y-1 mb-3">
                      <li><strong>0.5 to 1.0:</strong> Positive sentiment</li>
                      <li><strong>-0.1 to 0.5:</strong> Neutral sentiment</li>
                      <li><strong>-1.0 to -0.1:</strong> Negative sentiment</li>
                    </ul>
                    <h4 className="font-semibold mb-2">Business Impact</h4>
                    <p>Scores above 0.7 typically indicate strong customer satisfaction, while scores below -0.3 may require immediate attention.</p>
                  </div>
                  <button 
                    onClick={() => toggleArticle('sentiment-scores')}
                    className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors mt-2"
                  >
                    ← Show less
                  </button>
                </div>
              )}
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Setting Up Alerts</h3>
              <p className="text-gray-600 text-sm mb-4">Configure intelligent alerts to stay informed about important sentiment changes.</p>
              {!expandedArticles['alerts'] ? (
                <button 
                  onClick={() => toggleArticle('alerts')}
                  className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
                >
                  Read more →
                </button>
              ) : (
                <div>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
                    <h4 className="font-semibold mb-2">Alert Types</h4>
                    <ul className="list-disc list-inside space-y-1 mb-3">
                      <li><strong>Sentiment Threshold:</strong> Trigger when sentiment drops below a certain level</li>
                      <li><strong>Volume Spike:</strong> Alert when mention volume increases significantly</li>
                      <li><strong>Keyword Mentions:</strong> Monitor specific terms or phrases</li>
                    </ul>
                    <h4 className="font-semibold mb-2">Delivery Options</h4>
                    <p>Receive alerts via email, SMS, Slack, or webhook to your systems.</p>
                  </div>
                  <button 
                    onClick={() => toggleArticle('alerts')}
                    className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors mt-2"
                  >
                    ← Show less
                  </button>
                </div>
              )}
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl mb-4">🔗</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">API Best Practices</h3>
              <p className="text-gray-600 text-sm mb-4">Optimize your API usage with these proven best practices and tips.</p>
              {!expandedArticles['api-practices'] ? (
                <button 
                  onClick={() => toggleArticle('api-practices')}
                  className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors"
                >
                  Read more →
                </button>
              ) : (
                <div>
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg text-sm text-gray-700">
                    <h4 className="font-semibold mb-2">Performance Tips</h4>
                    <ul className="list-disc list-inside space-y-1 mb-3">
                      <li><strong>Batch Requests:</strong> Analyze multiple texts in a single API call</li>
                      <li><strong>Caching:</strong> Cache results for frequently analyzed content</li>
                      <li><strong>Rate Limiting:</strong> Implement exponential backoff for retries</li>
                    </ul>
                    <h4 className="font-semibold mb-2">Error Handling</h4>
                    <p>Always implement proper error handling for network failures and API limits.</p>
                  </div>
                  <button 
                    onClick={() => toggleArticle('api-practices')}
                    className="text-blue-600 text-sm font-medium hover:text-blue-800 transition-colors mt-2"
                  >
                    ← Show less
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Support CTA */}
        <div className="mt-12 bg-gray-900 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Still Need Help?</h2>
          <p className="text-gray-300 mb-6">
            Our support team is here to help you succeed with SentimentTracker.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => router.push('/contact')}
              className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors"
            >
              Contact Support
            </button>
            <button 
              onClick={() => router.push('/help')}
              className="border border-gray-600 text-gray-300 px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
            >
              Join Community
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
