'use client'

import { useState } from 'react'

export function DemoSection() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'alerts', label: 'Alerts', icon: '🔔' }
  ]

  const demoContent = {
    dashboard: {
      title: 'Real-Time Dashboard',
      description: 'Monitor sentiment across all your channels in one unified view',
      features: ['Live sentiment scores', 'Platform breakdown', 'Trending topics', 'Geographic insights']
    },
    analytics: {
      title: 'Advanced Analytics',
      description: 'Deep dive into sentiment patterns and customer behavior',
      features: ['Historical trends', 'Sentiment drivers', 'Customer segmentation', 'Predictive insights']
    },
    alerts: {
      title: 'Smart Alerts',
      description: 'Get notified when sentiment changes require your attention',
      features: ['Custom thresholds', 'Multi-channel notifications', 'Escalation rules', 'Team collaboration']
    }
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            See SentimentTracker in Action
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore our powerful features and see how easy it is to track and analyze customer sentiment
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 px-6 py-4 text-center font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-50 text-blue-600 border-b-2 border-blue-600'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <span className="text-2xl mr-2">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-8 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {demoContent[activeTab as keyof typeof demoContent].title}
                </h3>
                <p className="text-lg text-gray-600 mb-6">
                  {demoContent[activeTab as keyof typeof demoContent].description}
                </p>
                <ul className="space-y-3">
                  {demoContent[activeTab as keyof typeof demoContent].features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors">
                    Try Interactive Demo
                  </button>
                </div>
              </div>

              {/* Demo Visual */}
              <div className="bg-gray-100 rounded-xl p-6 h-80 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl mb-4">
                    {tabs.find(tab => tab.id === activeTab)?.icon}
                  </div>
                  <div className="text-gray-500">
                    Interactive {demoContent[activeTab as keyof typeof demoContent].title} Preview
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4">
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-sm text-gray-600">Positive</div>
                      <div className="text-lg font-bold text-green-600">78%</div>
                    </div>
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-sm text-gray-600">Negative</div>
                      <div className="text-lg font-bold text-red-600">12%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
