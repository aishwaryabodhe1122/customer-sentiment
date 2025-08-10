'use client'

import { useState } from 'react'

export default function CookiePolicyPage() {
  const [showModal, setShowModal] = useState(false)
  const [showToast, setShowToast] = useState(false)
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true, // Always required
    analytics: true,
    functional: true,
    marketing: false
  })

  const handlePreferenceChange = (category: string, value: boolean) => {
    if (category === 'essential') return // Essential cookies cannot be disabled
    setCookiePreferences(prev => ({
      ...prev,
      [category]: value
    }))
  }

  const savePreferences = () => {
    // Save preferences to localStorage
    localStorage.setItem('cookiePreferences', JSON.stringify(cookiePreferences))
    setShowModal(false)
    
    // Show custom toast notification
    setShowToast(true)
    setTimeout(() => setShowToast(false), 3000) // Hide after 3 seconds
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
          <p className="text-sm text-gray-500 mb-8">Last updated: January 8, 2024</p>

          <div className="prose max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">What Are Cookies</h2>
              <p className="text-gray-600 mb-4">
                Cookies are small text files that are placed on your computer or mobile device when you visit our website. 
                They help us provide you with a better experience by remembering your preferences and improving our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">How We Use Cookies</h2>
              <p className="text-gray-600 mb-4">We use cookies for several purposes:</p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                <li><strong>Analytics Cookies:</strong> Help us understand how visitors use our website</li>
                <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                <li><strong>Security Cookies:</strong> Protect against fraud and maintain security</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Types of Cookies We Use</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Strictly Necessary Cookies</h3>
                <p className="text-gray-600 mb-2">
                  These cookies are essential for the website to function and cannot be switched off.
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-1">
                  <li>Authentication cookies</li>
                  <li>Security cookies</li>
                  <li>Session management</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Cookies</h3>
                <p className="text-gray-600 mb-2">
                  These cookies collect information about how visitors use our website.
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-1">
                  <li>Google Analytics</li>
                  <li>Page load times</li>
                  <li>Error tracking</li>
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Functional Cookies</h3>
                <p className="text-gray-600 mb-2">
                  These cookies remember choices you make to improve your experience.
                </p>
                <ul className="list-disc pl-6 text-gray-600 space-y-1">
                  <li>Language preferences</li>
                  <li>Theme settings</li>
                  <li>Dashboard layout</li>
                </ul>
              </div>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Managing Cookies</h2>
              <p className="text-gray-600 mb-4">
                You can control and manage cookies in several ways:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li>Use our cookie consent banner to adjust your preferences</li>
                <li>Configure your browser settings to block or delete cookies</li>
                <li>Use browser extensions that manage cookies</li>
                <li>Opt out of analytics tracking through our settings</li>
              </ul>
              <p className="text-gray-600 mt-4">
                Please note that blocking certain cookies may affect the functionality of our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Third-Party Cookies</h2>
              <p className="text-gray-600 mb-4">
                We may use third-party services that set their own cookies:
              </p>
              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                <li><strong>Google Analytics:</strong> Website analytics and performance tracking</li>
                <li><strong>Intercom:</strong> Customer support and messaging</li>
                <li><strong>Stripe:</strong> Payment processing (if applicable)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Updates to This Policy</h2>
              <p className="text-gray-600 mb-4">
                We may update this Cookie Policy from time to time. We will notify you of any changes 
                by posting the new policy on this page with an updated "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Us</h2>
              <p className="text-gray-600">
                If you have any questions about our use of cookies, please contact us at 
                privacy@sentimenttracker.com or through our contact page.
              </p>
            </section>
          </div>

          {/* Cookie Preferences Button */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Cookie Preferences</h3>
                <p className="text-sm text-gray-600">Manage your cookie settings and preferences</p>
              </div>
              <button 
                onClick={() => setShowModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors"
              >
                Manage Preferences
              </button>
            </div>
          </div>
        </div>

        {/* Cookie Preferences Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">Cookie Preferences</h2>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-gray-400 hover:text-gray-600 text-2xl"
                  >
                    ×
                  </button>
                </div>
                <p className="text-gray-600 mt-2">
                  Manage your cookie preferences. You can enable or disable different types of cookies below.
                </p>
              </div>

              <div className="p-6 space-y-6">
                {/* Essential Cookies */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Essential Cookies</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      These cookies are necessary for the website to function and cannot be switched off.
                    </p>
                    <p className="text-xs text-gray-500">
                      Includes: Authentication, security, session management
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={cookiePreferences.essential}
                        disabled={true}
                        className="sr-only"
                      />
                      <div className="w-12 h-6 bg-green-500 rounded-full shadow-inner">
                        <div className="w-6 h-6 bg-white rounded-full shadow transform translate-x-6 transition-transform"></div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 text-center">Always On</p>
                  </div>
                </div>

                {/* Analytics Cookies */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Cookies</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      These cookies help us understand how visitors interact with our website.
                    </p>
                    <p className="text-xs text-gray-500">
                      Includes: Google Analytics, page views, user behavior
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={cookiePreferences.analytics}
                        onChange={(e) => handlePreferenceChange('analytics', e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        onClick={() => handlePreferenceChange('analytics', !cookiePreferences.analytics)}
                        className={`w-12 h-6 rounded-full shadow-inner cursor-pointer transition-colors ${
                          cookiePreferences.analytics ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform ${
                            cookiePreferences.analytics ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Functional Cookies */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Functional Cookies</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      These cookies remember your preferences and improve your experience.
                    </p>
                    <p className="text-xs text-gray-500">
                      Includes: Language settings, theme preferences, dashboard layout
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={cookiePreferences.functional}
                        onChange={(e) => handlePreferenceChange('functional', e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        onClick={() => handlePreferenceChange('functional', !cookiePreferences.functional)}
                        className={`w-12 h-6 rounded-full shadow-inner cursor-pointer transition-colors ${
                          cookiePreferences.functional ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform ${
                            cookiePreferences.functional ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Marketing Cookies */}
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Marketing Cookies</h3>
                    <p className="text-sm text-gray-600 mb-2">
                      These cookies are used to track visitors and display relevant advertisements.
                    </p>
                    <p className="text-xs text-gray-500">
                      Includes: Ad targeting, social media pixels, remarketing
                    </p>
                  </div>
                  <div className="ml-4">
                    <div className="relative">
                      <input
                        type="checkbox"
                        checked={cookiePreferences.marketing}
                        onChange={(e) => handlePreferenceChange('marketing', e.target.checked)}
                        className="sr-only"
                      />
                      <div
                        onClick={() => handlePreferenceChange('marketing', !cookiePreferences.marketing)}
                        className={`w-12 h-6 rounded-full shadow-inner cursor-pointer transition-colors ${
                          cookiePreferences.marketing ? 'bg-blue-500' : 'bg-gray-300'
                        }`}
                      >
                        <div
                          className={`w-6 h-6 bg-white rounded-full shadow transform transition-transform ${
                            cookiePreferences.marketing ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex flex-col sm:flex-row gap-3 justify-end">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={savePreferences}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                >
                  Save Preferences
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Custom Toast Notification */}
        {showToast && (
          <div className="fixed top-4 right-4 z-50 animate-slide-in">
            <div className="bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="font-medium">Success!</p>
                <p className="text-sm text-green-100">Cookie preferences saved successfully</p>
              </div>
              <button
                onClick={() => setShowToast(false)}
                className="flex-shrink-0 text-green-200 hover:text-white transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Custom Styles */}
      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
