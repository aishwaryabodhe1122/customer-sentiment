'use client'

import { useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      // If no user is logged in, redirect to landing page
      if (!user) {
        router.push('/')
        return
      }

      // If admin access is required but user is not admin, redirect to dashboard
      if (requireAdmin && user.email !== (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'aishwaryabodhe1122@gmail.com')) {
        router.push('/dashboard')
        return
      }
    }
  }, [user, loading, router, requireAdmin])

  // Show loading spinner while checking auth
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  // If no user and not loading, don't render anything (redirect will happen)
  if (!user) {
    return null
  }

  // If admin required but user is not admin, don't render anything (redirect will happen)
  if (requireAdmin && user.email !== (process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'aishwaryabodhe1122@gmail.com')) {
    return null
  }

  // User is authenticated and authorized, render the protected content
  return <>{children}</>
}
