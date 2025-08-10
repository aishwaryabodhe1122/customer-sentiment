'use client'

export default function DocumentationPage() {
  const sections = [
    {
      title: 'Getting Started',
      items: [
        { title: 'Quick Start Guide', description: 'Get up and running in 5 minutes' },
        { title: 'Installation', description: 'Step-by-step setup instructions' },
        { title: 'Authentication', description: 'API keys and authentication methods' },
        { title: 'First Analysis', description: 'Run your first sentiment analysis' }
      ]
    },
    {
      title: 'API Reference',
      items: [
        { title: 'REST API', description: 'Complete REST API documentation' },
        { title: 'WebSocket API', description: 'Real-time data streaming' },
        { title: 'Webhooks', description: 'Event-driven integrations' },
        { title: 'Rate Limits', description: 'API usage limits and best practices' }
      ]
    },
    {
      title: 'Features',
      items: [
        { title: 'Sentiment Analysis', description: 'Advanced NLP sentiment detection' },
        { title: 'Emotion Detection', description: 'Multi-emotion classification' },
        { title: 'Topic Modeling', description: 'Automatic topic extraction' },
        { title: 'Trend Analysis', description: 'Historical trend tracking' }
      ]
    },
    {
      title: 'Integrations',
      items: [
        { title: 'Social Media', description: 'Twitter, Instagram, Facebook APIs' },
        { title: 'E-commerce', description: 'Shopify, Amazon, review platforms' },
        { title: 'Custom Webhooks', description: 'Build your own integrations' },
        { title: 'Third-party Tools', description: 'Slack, Teams, and more' }
      ]
    }
  ]

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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg p-6 text-white">
            <div className="text-2xl mb-2">🚀</div>
            <h3 className="text-lg font-semibold mb-2">Quick Start</h3>
            <p className="text-blue-100 text-sm">Get started in minutes</p>
          </div>
          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg p-6 text-white">
            <div className="text-2xl mb-2">📚</div>
            <h3 className="text-lg font-semibold mb-2">API Reference</h3>
            <p className="text-green-100 text-sm">Complete API docs</p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg p-6 text-white">
            <div className="text-2xl mb-2">🔧</div>
            <h3 className="text-lg font-semibold mb-2">Integrations</h3>
            <p className="text-purple-100 text-sm">Connect your tools</p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg p-6 text-white">
            <div className="text-2xl mb-2">💡</div>
            <h3 className="text-lg font-semibold mb-2">Examples</h3>
            <p className="text-orange-100 text-sm">Code samples</p>
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {sections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white rounded-lg shadow">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <div key={itemIndex} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                      </div>
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  ))}
                </div>
              </div>
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
              <span className="text-blue-600 text-sm font-medium">Read more →</span>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Setting Up Alerts</h3>
              <p className="text-gray-600 text-sm mb-4">Configure intelligent alerts to stay informed about important sentiment changes.</p>
              <span className="text-blue-600 text-sm font-medium">Read more →</span>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <div className="text-3xl mb-4">🔗</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">API Best Practices</h3>
              <p className="text-gray-600 text-sm mb-4">Optimize your API usage with these proven best practices and tips.</p>
              <span className="text-blue-600 text-sm font-medium">Read more →</span>
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
            <button className="bg-blue-600 text-white px-6 py-3 rounded-md font-medium hover:bg-blue-700 transition-colors">
              Contact Support
            </button>
            <button className="border border-gray-600 text-gray-300 px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors">
              Join Community
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
