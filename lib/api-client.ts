import axios, { type AxiosInstance } from "axios"
import { getCookie } from "cookies-next"

// API base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL

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
  token: string
  user: User
}

export interface SignupData {
  name: string
  email: string
  password: string
}

class ApiClient {
  private client: AxiosInstance

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
      (error) => {
        if (error.response?.status === 401) {
          // Redirect to login page if unauthorized
          if (typeof window !== "undefined") {
            window.location.href = "/login"
          }
        }
        return Promise.reject(error)
      },
    )
  }

  // Auth methods
  async login(email: string, password: string): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>("/auth/login", {
      email,
      password,
    })
    return response.data
  }

  async signup(data: SignupData): Promise<LoginResponse> {
    const response = await this.client.post<LoginResponse>("/auth/signup", data)
    return response.data
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

