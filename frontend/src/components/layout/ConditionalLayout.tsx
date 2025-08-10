'use client'

import { usePathname } from 'next/navigation'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

interface ConditionalLayoutProps {
  children: React.ReactNode
}

export function ConditionalLayout({ children }: ConditionalLayoutProps) {
  const pathname = usePathname()
  
  // Hide navbar and footer on landing page only
  const isLandingPage = pathname === '/'
  
  if (isLandingPage) {
    return <>{children}</>
  }
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
    </div>
  )
}
