import apiClient from './client'

export interface User {
  id: number
  full_name: string
  email: string
  is_active: boolean
  created_at: string
}

export interface LoginResponse {
  access_token: string
  token_type: string
}

export interface RegisterData {
  full_name: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

/**
 * Register a new user.
 */
export async function registerUser(data: RegisterData): Promise<User> {
  const response = await apiClient.post<User>('/auth/register', data)
  return response.data
}

/**
 * Login and receive a JWT access token.
 */
export async function loginUser(data: LoginData): Promise<LoginResponse> {
  const response = await apiClient.post<LoginResponse>('/auth/login', data)
  return response.data
}

/**
 * Fetch the currently authenticated user.
 */
export async function getCurrentUser(token: string): Promise<User> {
  const response = await apiClient.get<User>('/auth/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
  return response.data
}