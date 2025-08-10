'use client'

export default function CookiePolicyPage() {
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
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium hover:bg-blue-700 transition-colors">
                Manage Preferences
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
