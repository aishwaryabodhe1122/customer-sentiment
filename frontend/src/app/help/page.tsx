'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function HelpCenterPage() {
  const router = useRouter()
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' })

  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    setToast({ show: true, type, message })
    setTimeout(() => setToast({ show: false, type: 'success', message: '' }), 4000)
  }

  const handleLiveChat = () => {
    showToast('info', '🤖 Live Chat Bot functionality is releasing soon! Stay tuned for AI-powered instant support.')
  }

  const handleEmailSupport = () => {
    const subject = encodeURIComponent('Support Request - SentimentTracker')
    const body = encodeURIComponent('Hi,\n\nI need help with:\n\n[Please describe your issue here]\n\nThank you!')
    window.open(`https://mail.google.com/mail/?view=cm&to=aishwaryabodhe1122@gmail.com&su=${subject}&body=${body}`, '_blank')
  }

  const handleScheduleCall = () => {
    window.open('tel:+919998887776', '_self')
  }

  const handleArticleClick = (article: string) => {
    // Create URL-friendly slug from article title
    const slug = article.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    router.push(`/help/articles/${slug}`)
  }

  const handleContactSupport = () => {
    router.push('/contact')
  }

  const handleJoinCommunity = () => {
    router.push('/status#subscribe')
  }
  const faqs = [
    {
      question: "How accurate is the sentiment analysis?",
      answer: "Our AI models achieve 94% accuracy on standard sentiment analysis tasks. We use state-of-the-art BERT-based models trained on millions of social media posts and reviews."
    },
    {
      question: "What data sources can I connect?",
      answer: "You can connect Twitter, Instagram, Facebook, Google Reviews, Amazon Reviews, Shopify, and custom data sources via our API or CSV upload."
    },
    {
      question: "How often is data updated?",
      answer: "Data is updated in real-time for connected social media accounts. Review platforms are synced every 15 minutes, and you can trigger manual updates anytime."
    },
    {
      question: "Can I export my data?",
      answer: "Yes! You can export all your data in CSV, Excel, or JSON formats. Premium plans include automated report delivery via email."
    },
    {
      question: "Is there an API available?",
      answer: "Yes, we provide a comprehensive REST API and WebSocket API for real-time data streaming. Full documentation is available in our docs section."
    },
    {
      question: "How do you handle data privacy?",
      answer: "We follow GDPR and CCPA compliance. All data is encrypted in transit and at rest. We never share your data with third parties without explicit consent."
    }
  ]

  const categories = [
    {
      title: "Getting Started",
      icon: "🚀",
      articles: [
        "Setting up your first project",
        "Connecting data sources",
        "Understanding the dashboard",
        "Configuring alerts"
      ]
    },
    {
      title: "Analytics & Reports",
      icon: "📊",
      articles: [
        "Reading sentiment scores",
        "Understanding emotion analysis",
        "Creating custom reports",
        "Exporting data"
      ]
    },
    {
      title: "Integrations",
      icon: "🔗",
      articles: [
        "Social media setup",
        "E-commerce integrations",
        "API documentation",
        "Webhook configuration"
      ]
    },
    {
      title: "Account & Billing",
      icon: "💳",
      articles: [
        "Managing your subscription",
        "Usage limits and pricing",
        "Team management",
        "Security settings"
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Help Center</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Find answers to common questions and get the most out of SentimentTracker.
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help articles..."
              className="w-full pl-12 pr-4 py-4 text-lg border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent shadow-sm"
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div 
            onClick={handleLiveChat}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
          >
            <div className="text-3xl mb-4">💬</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Live Chat</h3>
            <p className="text-gray-600 text-sm">Get instant help from our support team</p>
          </div>
          <div 
            onClick={handleEmailSupport}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
          >
            <div className="text-3xl mb-4">📧</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email Support</h3>
            <p className="text-gray-600 text-sm">Send us a detailed message</p>
          </div>
          <div 
            onClick={handleScheduleCall}
            className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow cursor-pointer hover:bg-gray-50"
          >
            <div className="text-3xl mb-4">📞</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Schedule Call</h3>
            <p className="text-gray-600 text-sm">Book a one-on-one session</p>
          </div>
        </div>

        {/* Help Categories */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="text-3xl mb-4">{category.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">{category.title}</h3>
                <ul className="space-y-2">
                  {category.articles.map((article, articleIndex) => (
                    <li key={articleIndex}>
                      <button 
                        onClick={() => handleArticleClick(article)}
                        className="text-sm text-blue-600 hover:text-blue-800 hover:underline text-left"
                      >
                        {article}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200">
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Support */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Still Need Help?</h2>
          <p className="text-blue-100 mb-6">
            Our support team is available 24/7 to help you succeed with SentimentTracker.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleContactSupport}
              className="bg-white text-blue-600 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
            >
              Contact Support
            </button>
            <button 
              onClick={handleJoinCommunity}
              className="border border-white text-white px-6 py-3 rounded-md font-medium hover:bg-white hover:text-blue-600 transition-colors"
            >
              Join Community Forum
            </button>
          </div>
        </div>
      </div>

      {/* Custom Toast Notification */}
      {toast.show && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out ${
          toast.type === 'success' 
            ? 'bg-green-500 text-white' 
            : toast.type === 'error'
            ? 'bg-red-500 text-white'
            : 'bg-blue-500 text-white'
        } animate-slide-in-right`}>
          <div className="flex items-center">
            {toast.type === 'success' ? (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : toast.type === 'error' ? (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
            <span className="font-medium">{toast.message}</span>
            <button
              onClick={() => setToast({ show: false, type: 'success', message: '' })}
              className="ml-4 text-white hover:text-gray-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
