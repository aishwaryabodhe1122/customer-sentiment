'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

interface User {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
}

interface Subscriber {
  email: string
  subscribedAt: string
}

interface Analytics {
  visitors: {
    total: number
    today: number
    thisWeek: number
    thisMonth: number
  }
  totalUsers: number
  totalSubscribers: number
  totalContactRequests: number
  scheduledReports: number
  recentUserRegistrations: User[]
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [users, setUsers] = useState<any[]>([])
  const [subscribers, setSubscribers] = useState<any[]>([])
  const [contactRequests, setContactRequests] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>({})
  const [toast, setToast] = useState({ show: false, type: 'success', message: '' })
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState('')
  const [showLogin, setShowLogin] = useState(true)
  const [blogSubject, setBlogSubject] = useState('')
  const [blogContent, setBlogContent] = useState('')
  const [blogUrl, setBlogUrl] = useState('')
  const [isSendingBlog, setIsSendingBlog] = useState(false)

  const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'aishwaryabodhe1122@gmail.com'
  const adminPassword = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'Aishu@11'
  const isAdmin = user?.email === adminEmail

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ show: true, type, message })
    setTimeout(() => setToast({ show: false, type: 'success', message: '' }), 4000)
  }

  // Initialize analytics with default structure to prevent undefined errors
  useEffect(() => {
    if (!analytics || Object.keys(analytics).length === 0) {
      setAnalytics({
        visitors: { total: 0, today: 0, thisWeek: 0, thisMonth: 0 },
        users: { total: 0, active: 0, newThisMonth: 0, recentRegistrations: [] },
        subscribers: { total: 0, growth: '+0%' },
        totalUsers: 0,
        totalSubscribers: 0,
        totalContactRequests: 0,
        scheduledReports: 0,
        recentUserRegistrations: []
      })
    }
  }, [])

  const handleLogin = async () => {
    if (password === adminPassword) {
      setIsAuthenticated(true)
      setShowLogin(false)
      showToast('success', 'Admin login successful!')
    } else {
      showToast('error', 'Invalid password')
    }
  }

  useEffect(() => {
    if (!isAdmin || !isAuthenticated) return

    const loadAdminData = async () => {
      try {
        const headers = { 
          'admin-email': user?.email || '',
          'admin-password': adminPassword
        }
        
        // Load all admin data in parallel
        const [usersRes, subscribersRes, analyticsRes, contactRes] = await Promise.all([
          fetch('http://localhost:5000/api/admin/users', { headers }),
          fetch('http://localhost:5000/api/admin/subscribers', { headers }),
          fetch('http://localhost:5000/api/admin/analytics', { headers }),
          fetch('http://localhost:5000/api/contact/admin', { headers })
        ])

        const [usersData, subscribersData, analyticsData, contactData] = await Promise.all([
          usersRes.json(),
          subscribersRes.json(),
          analyticsRes.json(),
          contactRes.json()
        ])

        if (usersData.success) setUsers(usersData.users)
        if (subscribersData.success) {
          console.log('Subscribers data received:', subscribersData)
          setSubscribers(subscribersData.subscribers || [])
        }
        if (analyticsData.success) {
          console.log('Analytics data received:', analyticsData)
          setAnalytics(analyticsData.analytics)
        }
        if (contactData.success) setContactRequests(contactData.contacts || [])
      } catch (error) {
        console.error('Failed to load admin data:', error)
        showToast('error', 'Failed to load admin data')
      } finally {
        setLoading(false)
      }
    }

    loadAdminData()
  }, [user, isAdmin, isAuthenticated])

  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { 
          'admin-email': user?.email || '',
          'admin-password': adminPassword
        }
      })
      
      const data = await response.json()
      if (data.success) {
        setUsers(users.filter(u => u.id !== userId))
        showToast('success', 'User deleted successfully')
      } else {
        showToast('error', data.message)
      }
    } catch (error) {
      showToast('error', 'Failed to delete user')
    }
  }

  const handleSendBlogUpdate = async () => {
    if (!blogSubject.trim() || !blogContent.trim()) {
      showToast('error', 'Please fill in both subject and content')
      return
    }

    setIsSendingBlog(true)
    try {
      const response = await fetch('http://localhost:5000/api/admin/blog-update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'admin-email': user?.email || '',
          'admin-password': adminPassword
        },
        body: JSON.stringify({ subject: blogSubject, content: blogContent, blogUrl })
      })
      
      const data = await response.json()
      if (data.success) {
        setBlogSubject('')
        setBlogContent('')
        setBlogUrl('')
        showToast('success', data.message)
      } else {
        showToast('error', data.message)
      }
    } catch (error) {
      showToast('error', 'Failed to send blog update')
    } finally {
      setIsSendingBlog(false)
    }
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600">You don't have permission to access the admin dashboard.</p>
        </div>
      </div>
    )
  }

  if (showLogin) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Admin Login</h1>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter admin password"
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8 animate-fade-in">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, subscribers, and site analytics</p>
        </div>

        {/* Analytics Overview */}
        {analytics && (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8 animate-slide-up">
            <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{analytics.visitors.total.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Total Visitors</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">{analytics?.totalUsers || users?.length || 0}</p>
                <p className="text-sm text-gray-500">Total Users</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">{analytics?.totalSubscribers || subscribers?.length || 0}</p>
                <p className="text-sm text-gray-500">Subscribers</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">{analytics?.totalContactRequests || contactRequests?.length || 0}</p>
                <p className="text-sm text-gray-500">Contact Requests</p>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">{analytics?.scheduledReports || 0}</p>
                <p className="text-sm text-gray-500">Scheduled Reports</p>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow mb-8 animate-fade-in">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'overview', name: 'Overview', icon: '📊' },
                { id: 'users', name: 'Users', icon: '👥' },
                { id: 'subscribers', name: 'Subscribers', icon: '📧' },
                { id: 'contacts', name: 'Contact Requests', icon: '💬' },
                { id: 'blog', name: 'Send Blog Update', icon: '✍️' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 hover:scale-105 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.name}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'overview' && analytics && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Analytics Overview</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 hover:shadow-lg transition-all duration-300">
                    <h3 className="text-lg font-semibold text-blue-900 mb-4">Visitor Statistics</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-blue-700">Today:</span>
                        <span className="font-semibold text-blue-900">{analytics?.visitors?.today || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">This Week:</span>
                        <span className="font-semibold text-blue-900">{analytics?.visitors?.thisWeek || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-700">This Month:</span>
                        <span className="font-semibold text-blue-900">{analytics?.visitors?.thisMonth || 0}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 hover:shadow-lg transition-all duration-300">
                    <h3 className="text-lg font-semibold text-green-900 mb-4">Recent User Registrations</h3>
                    <div className="space-y-2">
                      {(analytics?.recentUserRegistrations || analytics?.users?.recentRegistrations || users?.slice(0, 3) || []).map((user: any, index: number) => (
                        <div key={index} className="flex justify-between items-center">
                          <span className="text-green-700 truncate">{user.name || user.email}</span>
                          <span className="text-xs text-green-600">{new Date(user.createdAt || Date.now()).toLocaleDateString()}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold text-gray-900 mb-4">User Management</h2>
                
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Joined</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user, index) => (
                          <tr key={user.id} className="hover:bg-gray-50 transition-colors duration-200 animate-slide-in" style={{animationDelay: `${index * 100}ms`}}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center">
                                    <span className="text-white font-semibold text-sm">{user.name.charAt(0)}</span>
                                  </div>
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {user.role}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(user.createdAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              {user.role !== 'admin' && (
                                <button
                                  onClick={() => handleDeleteUser(user.id)}
                                  className="text-red-600 hover:text-red-900 hover:bg-red-50 px-3 py-1 rounded-md transition-all duration-200 transform hover:scale-105"
                                >
                                  Delete
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'subscribers' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Newsletter Subscribers ({subscribers.length})</h2>
                {(() => { console.log('Current subscribers state:', subscribers); return null; })()}
                
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribed Date</th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {subscribers.map((subscriber, index) => (
                          <tr key={index} className="hover:bg-gray-50 transition-colors duration-200 animate-slide-in" style={{animationDelay: `${index * 50}ms`}}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{subscriber.email}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {new Date(subscriber.subscribedAt).toLocaleDateString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'contacts' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Contact Requests</h2>
                
                <div className="space-y-4">
                  {contactRequests.map((contact, index) => (
                    <div key={index} className="bg-white rounded-lg shadow border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 animate-slide-in" style={{animationDelay: `${index * 100}ms`}}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-4 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{contact.name}</h3>
                            <span className="text-sm text-gray-500">{contact.email}</span>
                          </div>
                          <p className="text-gray-600 mb-2">{contact.message}</p>
                          <p className="text-xs text-gray-400">
                            Submitted: {new Date(contact.submittedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'blog' && (
              <div className="space-y-6 animate-fade-in">
                <h2 className="text-xl font-bold text-gray-900 mb-4">Send Blog Update</h2>
                
                <div className="bg-white rounded-lg shadow border border-gray-200 p-6">
                  <form onSubmit={handleSendBlogUpdate} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                      <input
                        type="text"
                        value={blogSubject}
                        onChange={(e) => setBlogSubject(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter email subject..."
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                      <textarea
                        value={blogContent}
                        onChange={(e) => setBlogContent(e.target.value)}
                        rows={6}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="Enter your blog update content..."
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Blog URL (Optional)</label>
                      <input
                        type="url"
                        value={blogUrl}
                        onChange={(e) => setBlogUrl(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                        placeholder="https://yourblog.com/article"
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-600">
                        This will be sent to {subscribers.length} subscriber{subscribers.length !== 1 ? 's' : ''}
                      </p>
                      <button
                        type="submit"
                        disabled={isSendingBlog}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isSendingBlog ? (
                          <span className="flex items-center">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Sending...
                          </span>
                        ) : (
                          'Send Update'
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Custom Toast Notification */}
      {toast.show && (
        <div className="fixed top-4 right-4 z-50 animate-slide-in-right">
          <div className={`px-6 py-4 rounded-lg shadow-lg flex items-center space-x-3 max-w-sm transition-all duration-300 ${
            toast.type === 'success' 
              ? 'bg-green-500 text-white' 
              : 'bg-red-500 text-white'
          }`}>
            <div className="flex-shrink-0">
              {toast.type === 'success' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <div>
              <p className="font-medium">{toast.type === 'success' ? 'Success!' : 'Error!'}</p>
              <p className="text-sm opacity-90">{toast.message}</p>
            </div>
            <button
              onClick={() => setToast({ show: false, type: 'success', message: '' })}
              className="flex-shrink-0 hover:opacity-75 transition-opacity duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes slide-in {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slide-in-right {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }
        
        .animate-slide-up {
          animation: slide-up 0.8s ease-out;
        }
        
        .animate-slide-in {
          animation: slide-in 0.5s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
      `}</style>
      </div>
    </ProtectedRoute>
  )
}
