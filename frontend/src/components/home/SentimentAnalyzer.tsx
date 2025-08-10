'use client'

import { useState } from 'react'
import { useSentiment } from '@/contexts/SentimentContext'

export function SentimentAnalyzer() {
  const [text, setText] = useState('')
  const { analyzeSentiment, loading } = useSentiment()
  const [result, setResult] = useState<any>(null)

  const handleAnalyze = async () => {
    if (!text.trim()) return
    
    try {
      const analysis = await analyzeSentiment(text)
      setResult(analysis)
    } catch (error) {
      console.error('Analysis failed:', error)
    }
  }

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return 'text-green-600 bg-green-50'
      case 'negative': return 'text-red-600 bg-red-50'
      case 'neutral': return 'text-yellow-600 bg-yellow-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  const getSentimentEmoji = (sentiment: string) => {
    switch (sentiment?.toLowerCase()) {
      case 'positive': return '😊'
      case 'negative': return '😞'
      case 'neutral': return '😐'
      default: return '🤔'
    }
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Try Our Sentiment Analyzer
          </h2>
          <p className="text-xl text-gray-600">
            Enter any text and see our AI analyze the sentiment in real-time
          </p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8">
          <div className="space-y-6">
            {/* Text Input */}
            <div>
              <label htmlFor="sentiment-text" className="block text-sm font-medium text-gray-700 mb-2">
                Enter text to analyze
              </label>
              <textarea
                id="sentiment-text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type or paste any customer feedback, review, or social media post..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                rows={4}
              />
            </div>

            {/* Analyze Button */}
            <div className="text-center">
              <button
                onClick={handleAnalyze}
                disabled={!text.trim() || loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:cursor-not-allowed"
              >
                {loading ? 'Analyzing...' : 'Analyze Sentiment'}
              </button>
            </div>

            {/* Results */}
            {result && (
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis Results</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Overall Sentiment */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Overall Sentiment</h4>
                      <span className="text-2xl">{getSentimentEmoji(result.sentiment)}</span>
                    </div>
                    <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getSentimentColor(result.sentiment)}`}>
                      {result.sentiment || 'Unknown'}
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      Confidence: {result.confidence ? `${Math.round(result.confidence * 100)}%` : 'N/A'}
                    </div>
                  </div>

                  {/* Sentiment Scores */}
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-3">Sentiment Breakdown</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Positive</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-green-500 h-2 rounded-full" 
                              style={{ width: `${(result.scores?.positive || 0) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {Math.round((result.scores?.positive || 0) * 100)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Neutral</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-yellow-500 h-2 rounded-full" 
                              style={{ width: `${(result.scores?.neutral || 0) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {Math.round((result.scores?.neutral || 0) * 100)}%
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Negative</span>
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-red-500 h-2 rounded-full" 
                              style={{ width: `${(result.scores?.negative || 0) * 100}%` }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {Math.round((result.scores?.negative || 0) * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Key Phrases */}
                {result.keyPhrases && result.keyPhrases.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium text-gray-900 mb-3">Key Phrases</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.keyPhrases.map((phrase: string, index: number) => (
                        <span 
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {phrase}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Sample Texts */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">Try these sample texts:</p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setText("I absolutely love this product! The quality is amazing and customer service was fantastic.")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Positive Review
            </button>
            <button
              onClick={() => setText("The product was okay, nothing special but it does what it's supposed to do.")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Neutral Review
            </button>
            <button
              onClick={() => setText("Terrible experience! The product broke after one day and customer support was unhelpful.")}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Negative Review
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
