export function StatsSection() {
  const stats = [
    {
      number: '10M+',
      label: 'Reviews Analyzed',
      description: 'Across all platforms'
    },
    {
      number: '95%',
      label: 'Accuracy Rate',
      description: 'AI sentiment detection'
    },
    {
      number: '500+',
      label: 'Happy Customers',
      description: 'Growing every day'
    },
    {
      number: '24/7',
      label: 'Real-Time Monitoring',
      description: 'Never miss a moment'
    }
  ]

  return (
    <section className="py-20 bg-blue-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Trusted by businesses worldwide
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Join thousands of companies using SentimentTracker to understand their customers better
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-white mb-2">
                {stat.number}
              </div>
              <div className="text-lg font-semibold text-blue-100 mb-1">
                {stat.label}
              </div>
              <div className="text-blue-200 text-sm">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        {/* Customer Logos */}
        <div className="mt-16 pt-16 border-t border-blue-500">
          <p className="text-center text-blue-100 mb-8">Trusted by leading brands</p>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            {/* Placeholder for customer logos */}
            <div className="bg-white bg-opacity-20 px-6 py-3 rounded-lg">
              <span className="text-white font-semibold">TechCorp</span>
            </div>
            <div className="bg-white bg-opacity-20 px-6 py-3 rounded-lg">
              <span className="text-white font-semibold">RetailPlus</span>
            </div>
            <div className="bg-white bg-opacity-20 px-6 py-3 rounded-lg">
              <span className="text-white font-semibold">ServicePro</span>
            </div>
            <div className="bg-white bg-opacity-20 px-6 py-3 rounded-lg">
              <span className="text-white font-semibold">EcomGiant</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
