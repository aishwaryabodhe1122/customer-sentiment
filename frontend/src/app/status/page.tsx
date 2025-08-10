'use client'

export default function StatusPage() {
  const services = [
    {
      name: 'API Gateway',
      status: 'operational',
      uptime: '99.98%',
      responseTime: '45ms',
      description: 'Main API endpoint for all requests'
    },
    {
      name: 'Sentiment Analysis Engine',
      status: 'operational',
      uptime: '99.95%',
      responseTime: '120ms',
      description: 'AI-powered sentiment analysis processing'
    },
    {
      name: 'Data Ingestion',
      status: 'operational',
      uptime: '99.92%',
      responseTime: '78ms',
      description: 'Social media and review data collection'
    },
    {
      name: 'Dashboard & Analytics',
      status: 'operational',
      uptime: '99.97%',
      responseTime: '32ms',
      description: 'Web dashboard and reporting system'
    },
    {
      name: 'Database',
      status: 'operational',
      uptime: '99.99%',
      responseTime: '12ms',
      description: 'Primary data storage and retrieval'
    },
    {
      name: 'Notification System',
      status: 'maintenance',
      uptime: '99.89%',
      responseTime: '156ms',
      description: 'Email and webhook notifications'
    }
  ]

  const incidents = [
    {
      date: '2024-01-08',
      title: 'Scheduled Maintenance - Notification System',
      status: 'ongoing',
      description: 'We are performing scheduled maintenance on our notification system to improve reliability.',
      updates: [
        { time: '14:30 UTC', message: 'Maintenance started - Email notifications may be delayed' },
        { time: '14:00 UTC', message: 'Maintenance window begins' }
      ]
    },
    {
      date: '2024-01-05',
      title: 'API Response Time Degradation',
      status: 'resolved',
      description: 'Some users experienced slower API response times due to increased traffic.',
      updates: [
        { time: '16:45 UTC', message: 'Issue fully resolved - All systems operating normally' },
        { time: '16:20 UTC', message: 'Implementing fix - Response times improving' },
        { time: '15:30 UTC', message: 'Investigating elevated response times' }
      ]
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'operational': return 'text-green-600 bg-green-100'
      case 'maintenance': return 'text-yellow-600 bg-yellow-100'
      case 'degraded': return 'text-orange-600 bg-orange-100'
      case 'outage': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'operational': return '✅'
      case 'maintenance': return '🔧'
      case 'degraded': return '⚠️'
      case 'outage': return '❌'
      default: return '❓'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">System Status</h1>
          <p className="text-xl text-gray-600">
            Real-time status and uptime information for all SentimentTracker services.
          </p>
        </div>

        {/* Overall Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
              <h2 className="text-2xl font-bold text-gray-900">All Systems Operational</h2>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Last updated</p>
              <p className="text-lg font-semibold text-gray-900">2 minutes ago</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-600">99.96%</p>
              <p className="text-sm text-gray-500">Overall Uptime (30 days)</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-blue-600">52ms</p>
              <p className="text-sm text-gray-500">Average Response Time</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-purple-600">0</p>
              <p className="text-sm text-gray-500">Active Incidents</p>
            </div>
          </div>
        </div>

        {/* Service Status */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Service Status</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {services.map((service, index) => (
              <div key={index} className="p-6 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-2xl">{getStatusIcon(service.status)}</span>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                    <p className="text-sm text-gray-500">{service.description}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{service.uptime}</p>
                    <p className="text-xs text-gray-500">Uptime</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{service.responseTime}</p>
                    <p className="text-xs text-gray-500">Response Time</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${getStatusColor(service.status)}`}>
                    {service.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Incidents */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Recent Incidents</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {incidents.map((incident, index) => (
              <div key={index} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{incident.title}</h3>
                    <p className="text-sm text-gray-500">{incident.date}</p>
                  </div>
                  <span className={`px-3 py-1 text-xs font-medium rounded-full capitalize ${
                    incident.status === 'resolved' ? 'text-green-600 bg-green-100' : 
                    incident.status === 'ongoing' ? 'text-yellow-600 bg-yellow-100' : 
                    'text-gray-600 bg-gray-100'
                  }`}>
                    {incident.status}
                  </span>
                </div>
                <p className="text-gray-600 mb-4">{incident.description}</p>
                <div className="space-y-2">
                  {incident.updates.map((update, updateIndex) => (
                    <div key={updateIndex} className="flex items-start space-x-3 text-sm">
                      <span className="text-gray-400 font-mono">{update.time}</span>
                      <span className="text-gray-600">{update.message}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subscribe to Updates */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Stay Updated</h2>
          <p className="text-blue-100 mb-6">
            Subscribe to get notified about service updates and maintenance windows.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-2 rounded-md text-gray-900"
            />
            <button className="bg-white text-blue-600 px-6 py-2 rounded-md font-medium hover:bg-gray-100 transition-colors">
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
