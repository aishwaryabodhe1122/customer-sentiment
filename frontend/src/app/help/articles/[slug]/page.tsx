'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

export default function ArticlePage() {
  const params = useParams()
  const router = useRouter()
  const [article, setArticle] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const articles = {
    'setting-up-your-first-project': {
      title: 'Setting up your first project',
      category: 'Getting Started',
      readTime: '5 min read',
      lastUpdated: '2024-01-08',
      content: `
        <h2>Welcome to SentimentTracker!</h2>
        <p>This guide will help you set up your first sentiment analysis project in just a few minutes.</p>
        
        <h3>Step 1: Create Your Project</h3>
        <p>Navigate to your dashboard and click the "New Project" button. Give your project a descriptive name that reflects your brand or campaign.</p>
        
        <h3>Step 2: Connect Data Sources</h3>
        <p>Choose from our supported platforms:</p>
        <ul>
          <li>Twitter - Monitor mentions and hashtags</li>
          <li>Instagram - Track comments and stories</li>
          <li>Google Reviews - Analyze customer feedback</li>
          <li>Amazon Reviews - Monitor product sentiment</li>
        </ul>
        
        <h3>Step 3: Configure Analysis Settings</h3>
        <p>Set up your sentiment analysis preferences, including keywords to track, languages to analyze, and alert thresholds.</p>
        
        <h3>Step 4: Start Monitoring</h3>
        <p>Once configured, your dashboard will begin displaying real-time sentiment data within minutes!</p>
      `
    },
    'connecting-data-sources': {
      title: 'Connecting data sources',
      category: 'Getting Started',
      readTime: '7 min read',
      lastUpdated: '2024-01-08',
      content: `
        <h2>Connect Your Data Sources</h2>
        <p>SentimentTracker supports multiple data sources to give you comprehensive sentiment insights.</p>
        
        <h3>Social Media Platforms</h3>
        <h4>Twitter Integration</h4>
        <p>Connect your Twitter account to monitor:</p>
        <ul>
          <li>Brand mentions and hashtags</li>
          <li>Tweet replies and comments</li>
          <li>Direct messages (with permission)</li>
        </ul>
        
        <h4>Instagram Integration</h4>
        <p>Monitor Instagram content including:</p>
        <ul>
          <li>Post comments and reactions</li>
          <li>Story mentions and tags</li>
          <li>Direct message sentiment</li>
        </ul>
        
        <h3>Review Platforms</h3>
        <p>Connect review platforms to track customer feedback:</p>
        <ul>
          <li>Google My Business reviews</li>
          <li>Amazon product reviews</li>
          <li>Yelp business reviews</li>
          <li>Trustpilot reviews</li>
        </ul>
      `
    },
    'understanding-the-dashboard': {
      title: 'Understanding the dashboard',
      category: 'Getting Started',
      readTime: '6 min read',
      lastUpdated: '2024-01-08',
      content: `
        <h2>Dashboard Overview</h2>
        <p>Your SentimentTracker dashboard provides a comprehensive view of your brand's sentiment across all connected platforms.</p>
        
        <h3>Key Metrics</h3>
        <h4>Sentiment Score</h4>
        <p>The overall sentiment score ranges from -100 (very negative) to +100 (very positive). This is calculated using our advanced AI models.</p>
        
        <h4>Emotion Analysis</h4>
        <p>Beyond positive/negative sentiment, we detect specific emotions:</p>
        <ul>
          <li>Joy and excitement</li>
          <li>Anger and frustration</li>
          <li>Fear and anxiety</li>
          <li>Surprise and curiosity</li>
        </ul>
        
        <h3>Trend Analysis</h3>
        <p>View sentiment trends over time to identify:</p>
        <ul>
          <li>Seasonal patterns</li>
          <li>Campaign impact</li>
          <li>Crisis detection</li>
          <li>Improvement opportunities</li>
        </ul>
      `
    }
  }

  useEffect(() => {
    const slug = params.slug as string
    const foundArticle = articles[slug as keyof typeof articles]
    
    if (foundArticle) {
      setArticle(foundArticle)
    }
    setLoading(false)
  }, [params.slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <p className="text-xl text-gray-600 mb-8">The article you're looking for doesn't exist.</p>
          <button
            onClick={() => router.push('/help')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Help Center
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li>
              <button onClick={() => router.push('/help')} className="hover:text-blue-600">
                Help Center
              </button>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <span className="text-gray-900">{article.category}</span>
            </li>
            <li>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </li>
            <li>
              <span className="text-gray-900">{article.title}</span>
            </li>
          </ol>
        </nav>

        {/* Article Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {article.category}
            </span>
            <div className="flex items-center text-sm text-gray-500 space-x-4">
              <span>{article.readTime}</span>
              <span>•</span>
              <span>Updated {article.lastUpdated}</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{article.title}</h1>
        </div>

        {/* Article Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: article.content }}
          />
        </div>

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/help')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            ← Back to Help Center
          </button>
        </div>
      </div>
    </div>
  )
}
