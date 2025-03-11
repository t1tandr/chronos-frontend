import {
  getAccessToken,
  removeTokenStorage
} from '@/services/auth-token.service'
import axios, { type CreateAxiosDefaults } from 'axios'
import { errorCatch } from './error'
import { Original_Surfer } from 'next/font/google'
import { authService } from '@/services/auth.service'

const options: CreateAxiosDefaults = {
  baseURL: process.env.BACKEND_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
}

const axiosClassic = axios.create(options)

const axiosWithAuth = axios.create(options)

axiosWithAuth.interceptors.request.use(config => {
  const accessToken = getAccessToken()
  if (config?.headers && accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

axiosWithAuth.interceptors.response.use(
  config => config,
  async error => {
    const originalRequest = error.config

    if (
      (error.response?.status === 401 ||
        errorCatch(error) === 'Token has expired' ||
        errorCatch(error) === 'Token is invalid') &&
      error.config &&
      !error.config.__isRetryRequest
    ) {
      originalRequest._isRetry = true
      try {
        await authService.getNewTokens()
        return axiosWithAuth(originalRequest)
      } catch (e) {
        if (errorCatch(e) === 'Token has expired') {
          removeTokenStorage()
        }
      }
    }
    throw error
  }
)

export { axiosClassic, axiosWithAuth }
