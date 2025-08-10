import Link from 'next/link'

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-purple-600 to-blue-600">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
          Ready to understand your customers better?
        </h2>
        <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
          Start your free trial today and see how SentimentTracker can transform your customer insights
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link 
            href="/auth/register"
            className="bg-white hover:bg-gray-100 text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
          >
            Start Free Trial
          </Link>
          <Link 
            href="/contact"
            className="border-2 border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-200"
          >
            Contact Sales
          </Link>
        </div>

        <div className="mt-8 text-purple-100 text-sm">
          No credit card required • 14-day free trial • Cancel anytime
        </div>
      </div>
    </section>
  )
}
