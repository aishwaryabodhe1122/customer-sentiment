'use client'

export default function IntegrationsPage() {
  const integrations = [
    {
      name: 'Twitter API',
      description: 'Connect to Twitter to analyze tweets and social sentiment',
      status: 'Connected',
      icon: '🐦',
      category: 'Social Media'
    },
    {
      name: 'Instagram API',
      description: 'Analyze Instagram posts and comments for brand sentiment',
      status: 'Connected',
      icon: '📷',
      category: 'Social Media'
    },
    {
      name: 'Facebook API',
      description: 'Monitor Facebook posts and reviews for customer feedback',
      status: 'Available',
      icon: '📘',
      category: 'Social Media'
    },
    {
      name: 'Google Reviews',
      description: 'Import and analyze Google Business reviews',
      status: 'Connected',
      icon: '⭐',
      category: 'Reviews'
    },
    {
      name: 'Amazon Reviews',
      description: 'Track product reviews and ratings from Amazon',
      status: 'Available',
      icon: '📦',
      category: 'Reviews'
    },
    {
      name: 'Shopify',
      description: 'Integrate with your Shopify store for product reviews',
      status: 'Available',
      icon: '🛍️',
      category: 'E-commerce'
    },
    {
      name: 'Slack',
      description: 'Get sentiment alerts and reports in your Slack channels',
      status: 'Available',
      icon: '💬',
      category: 'Communication'
    },
    {
      name: 'Webhook',
      description: 'Custom webhook integration for real-time data streaming',
      status: 'Available',
      icon: '🔗',
      category: 'Custom'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Integrations</h1>
          <p className="text-lg text-gray-600">
            Connect SentimentTracker with your favorite platforms and tools to streamline your sentiment analysis workflow.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
                  <span className="text-green-600 font-semibold">✓</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">4</p>
                <p className="text-sm text-gray-500">Connected</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">⚡</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">4</p>
                <p className="text-sm text-gray-500">Available</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-md flex items-center justify-center">
                  <span className="text-purple-600 font-semibold">📊</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">12.5K</p>
                <p className="text-sm text-gray-500">Data Points/Day</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
                  <span className="text-yellow-600 font-semibold">⏱️</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-2xl font-semibold text-gray-900">5min</p>
                <p className="text-sm text-gray-500">Sync Interval</p>
              </div>
            </div>
          </div>
        </div>

        {/* Integrations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {integrations.map((integration, index) => (
            <div key={index} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{integration.icon}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                      {integration.category}
                    </span>
                  </div>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  integration.status === 'Connected' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-blue-100 text-blue-800'
                }`}>
                  {integration.status}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-4">{integration.description}</p>
              
              <button className={`w-full py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                integration.status === 'Connected'
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}>
                {integration.status === 'Connected' ? 'Configure' : 'Connect'}
              </button>
            </div>
          ))}
        </div>

        {/* Custom Integration CTA */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Need a Custom Integration?</h2>
          <p className="text-blue-100 mb-6">
            Our API allows you to build custom integrations with any platform or service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
              View API Documentation
            </button>
            <button className="border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white hover:text-blue-600 transition-colors">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
