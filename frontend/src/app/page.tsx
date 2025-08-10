'use client'

import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { LoginModal } from '@/components/auth/LoginModal'

export default function LandingPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [animationLoaded, setAnimationLoaded] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [isSignupMode, setIsSignupMode] = useState(false)

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (!loading && user) {
      router.push('/dashboard')
    }
  }, [user, loading, router])

  useEffect(() => {
    setAnimationLoaded(true)
  }, [])

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  // If user is logged in, they'll be redirected to dashboard
  if (user) {
    return null
  }

  return (
    <>
      {/* Hide navbar and footer for landing page */}
      <style dangerouslySetInnerHTML={{
        __html: `
          nav { display: none !important; }
          footer { display: none !important; }
          main { padding: 0 !important; }
          body > div > div { background: none !important; }
        `
      }} />
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full opacity-20 animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-indigo-400 to-pink-500 rounded-full opacity-20 animate-pulse" style={{animationDelay: '1s'}}></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full opacity-10 animate-ping" style={{animationDuration: '3s'}}></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col">
          {/* Header */}
          <header className="px-6 py-4">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              <div className={`flex items-center space-x-2 transition-all duration-1000 ${animationLoaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'}`}>
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">AI</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  SentimentTracker
                </span>
              </div>
              
              <div className={`flex space-x-4 transition-all duration-1000 delay-300 ${animationLoaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'}`}>
                <button 
                  onClick={() => {
                    setIsSignupMode(false)
                    setShowLoginModal(true)
                  }}
                  className="px-6 py-2 text-blue-600 hover:text-blue-700 font-medium transition-all duration-200 hover:scale-105"
                >
                  Login
                </button>
                <button 
                  onClick={() => {
                    setIsSignupMode(true)
                    setShowLoginModal(true)
                  }}
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-medium transition-all duration-200 transform hover:scale-105 hover:shadow-lg"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </header>

          {/* Hero Section */}
          <main className="flex-1 flex items-center justify-center px-6 py-12">
            <div className="max-w-4xl mx-auto text-center">
              {/* Main Headline */}
              <div className={`transition-all duration-1000 delay-500 ${animationLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  AI-Powered
                  <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent block">
                    Customer Sentiment
                  </span>
                  <span className="text-gray-700">Tracking</span>
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
                  Transform customer feedback into actionable insights with advanced AI. Get 
                  real-time monitoring, and predictive analytics for e-commerce brands.
                </p>
              </div>

              {/* Feature Highlights */}
              <div className={`transition-all duration-1000 delay-900 ${animationLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <span className="text-white text-xl">🧠</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">AI-Powered Analysis</h3>
                    <p className="text-gray-600">Advanced NLP models analyze sentiment, emotions, and topics from customer feedback</p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2" style={{animationDelay: '200ms'}}>
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <span className="text-white text-xl">📊</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Real-Time Dashboard</h3>
                    <p className="text-gray-600">Monitor sentiment trends, track performance, and get instant insights</p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2" style={{animationDelay: '400ms'}}>
                    <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto">
                      <span className="text-white text-xl">🔮</span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Predictive Insights</h3>
                    <p className="text-gray-600">Forecast trends and predict sales impact with machine learning</p>
                  </div>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className={`transition-all duration-1000 delay-1100 ${animationLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <button 
                    onClick={() => {
                      setIsSignupMode(true)
                      setShowLoginModal(true)
                    }}
                    className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl animate-pulse"
                  >
                    Get Started Free
                  </button>
                  <button 
                    onClick={() => {
                      setIsSignupMode(false)
                      setShowLoginModal(true)
                    }}
                    className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-900 rounded-xl font-semibold text-lg border-2 border-gray-200 hover:border-blue-300 hover:bg-white transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            </div>
          </main>

          {/* Footer Section */}
          <footer className="px-6 py-8">
            <div className="max-w-4xl mx-auto text-center">
              <div className={`transition-all duration-1000 delay-1300 ${animationLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <p className="text-gray-500 mb-4">
                  Trusted by 10,000+ e-commerce brands worldwide
                </p>
                <div className="flex justify-center items-center space-x-8 opacity-60">
                  <div className="text-2xl">🛍️</div>
                  <div className="text-2xl">📱</div>
                  <div className="text-2xl">💬</div>
                  <div className="text-2xl">📈</div>
                  <div className="text-2xl">🎯</div>
                </div>
              </div>
            </div>
          </footer>
        </div>

        {/* Custom Styles */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-20px); }
            }
            
            @keyframes glow {
              0%, 100% { box-shadow: 0 0 20px rgba(59, 130, 246, 0.3); }
              50% { box-shadow: 0 0 30px rgba(59, 130, 246, 0.6); }
            }
            
            .animate-glow {
              animation: glow 2s ease-in-out infinite;
            }
          `
        }} />

        {/* Login Modal */}
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          isSignupMode={isSignupMode}
        />
      </div>
    </>
  )
}
