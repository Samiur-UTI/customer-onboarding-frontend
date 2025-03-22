import axios, { type AxiosInstance, type AxiosError } from "axios"
import { getCookie, deleteCookie } from "cookies-next"

// API base URL
const API_URL = "http://34.174.59.17:5000"

export interface Customer {
  id: string | number
  name: string
  email: string
  phone?: string
  company?: string
  [key: string]: any
}

export interface User {
  id: string | number
  name: string
  email: string
}

export interface LoginResponse {
  access_token: string
}

export interface SignupData {
  name: string
  email: string
  password: string
}

export interface ApiError {
  message: string
  error?: string
  statusCode?: number
}

class ApiClient {
  private client: AxiosInstance
  private static instance: ApiClient

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
    })

    // Add request interceptor to include auth token
    this.client.interceptors.request.use((config) => {
      const token = getCookie("auth-token")
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ApiError>) => {
        if (error.response?.status === 401) {
          // Force logout on 401 Unauthorized
          this.forceLogout()
        }
        return Promise.reject(error)
      },
    )
  }

  // Force logout and redirect to login
  private forceLogout() {
    if (typeof window !== "undefined" && window.location.pathname !== "/login") {
      // Clear auth token
      deleteCookie("auth-token")

      // Redirect to login page
      window.location.href = "/login"
    }
  }

  // Auth methods
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await this.client.post<LoginResponse>("/auth/login", {
        email,
        password,
      })
      return response.data
    } catch (error) {
      throw error
    }
  }

  async signup(data: SignupData): Promise<LoginResponse> {
    try {
      const response = await this.client.post<LoginResponse>("/auth/signup", data)
      return response.data
    } catch (error) {
      throw error
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!getCookie("auth-token")
  }

  // Customer methods
  async getCustomers(): Promise<Customer[]> {
    const response = await this.client.get<Customer[]>("/customers")
    return response.data
  }

  async addCustomer(customerData: Omit<Customer, "id">): Promise<Customer> {
    const response = await this.client.post<Customer>("/customers", customerData)
    return response.data
  }

  async syncCustomers(): Promise<void> {
    await this.client.post("/customers/sync")
  }
}

// Export as singleton
const apiClient = new ApiClient()
export default apiClient

