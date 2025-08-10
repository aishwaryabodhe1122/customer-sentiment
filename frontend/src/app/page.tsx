'use client'

import { useState } from 'react'
import { Hero } from '@/components/home/Hero'
import { FeatureGrid } from '@/components/home/FeatureGrid'
import { DemoSection } from '@/components/home/DemoSection'
import { StatsSection } from '@/components/home/StatsSection'
import { CTASection } from '@/components/home/CTASection'
import { SentimentAnalyzer } from '@/components/home/SentimentAnalyzer'

export default function HomePage() {
  const [showDemo, setShowDemo] = useState(false)

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <Hero onStartDemo={() => setShowDemo(true)} />
      
      {/* Demo Section - Conditionally rendered */}
      {showDemo && (
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                Try Our AI Sentiment Analyzer
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Experience real-time sentiment analysis powered by advanced NLP models
              </p>
            </div>
            <SentimentAnalyzer />
          </div>
        </section>
      )}

      {/* Features Grid */}
      <FeatureGrid />

      {/* Stats Section */}
      <StatsSection />

      {/* Demo Preview */}
      <DemoSection />

      {/* Call to Action */}
      <CTASection />
    </div>
  )
}
