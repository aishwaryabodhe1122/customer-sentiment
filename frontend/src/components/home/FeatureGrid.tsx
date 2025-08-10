export function FeatureGrid() {
  const features = [
    {
      icon: '🤖',
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning models analyze sentiment with 95% accuracy across multiple languages and contexts.'
    },
    {
      icon: '📊',
      title: 'Real-Time Monitoring',
      description: 'Track customer sentiment as it happens across social media, reviews, and support channels.'
    },
    {
      icon: '🎯',
      title: 'Multi-Platform Integration',
      description: 'Connect Twitter, Instagram, Facebook, Google Reviews, and more in one unified dashboard.'
    },
    {
      icon: '📈',
      title: 'Predictive Analytics',
      description: 'Forecast sentiment trends and identify potential issues before they impact your business.'
    },
    {
      icon: '🔔',
      title: 'Smart Alerts',
      description: 'Get notified instantly when sentiment drops or spikes, allowing for rapid response.'
    },
    {
      icon: '📋',
      title: 'Detailed Reports',
      description: 'Generate comprehensive reports with actionable insights for stakeholders and teams.'
    }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to understand your customers
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Our comprehensive suite of tools helps you track, analyze, and act on customer sentiment data
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-white p-8 rounded-xl border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all duration-200">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
