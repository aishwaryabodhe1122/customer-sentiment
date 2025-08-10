const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

interface LoginResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
    role: 'user' | 'admin'
    createdAt: string
  }
}

interface RegisterResponse {
  token: string
  user: {
    id: string
    email: string
    name: string
    role: 'user' | 'admin'
    createdAt: string
  }
}

class AuthService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token')
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    }
  }

  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }

    return response.json()
  }

  async register(name: string, email: string, password: string): Promise<RegisterResponse> {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Registration failed')
    }

    return response.json()
  }

  async getCurrentUser() {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      headers: this.getAuthHeaders(),
    })

    if (!response.ok) {
      throw new Error('Failed to get user data')
    }

    return response.json()
  }

  async updateProfile(data: { name?: string; email?: string }) {
    const response = await fetch(`${API_URL}/api/auth/profile`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(data),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Profile update failed')
    }

    return response.json()
  }

  async changePassword(currentPassword: string, newPassword: string) {
    const response = await fetch(`${API_URL}/api/auth/change-password`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ currentPassword, newPassword }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Password change failed')
    }

    return response.json()
  }

  async requestPasswordReset(email: string) {
    const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Password reset request failed')
    }

    return response.json()
  }

  async resetPassword(token: string, newPassword: string) {
    const response = await fetch(`${API_URL}/api/auth/reset-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token, newPassword }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Password reset failed')
    }

    return response.json()
  }
}

export const authService = new AuthService()
