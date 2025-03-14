import { axiosClassic } from '@/api/interceptors'
import { removeTokenStorage, saveTokenStorage } from './auth-token.service'

export const authService = {
  async main(type: 'login' | 'registration', data: any) {
    const response = await axiosClassic.post(`/auth/${type}`, data)

    if (response.data.accessToken) {
      saveTokenStorage(response.data.accessToken)
    }
    console.log(response.status)
    return response
  },

  async getNewTokens() {
    const response = await axiosClassic.post('auth/login/access-token')

    if (response.data.accessToken) {
      saveTokenStorage(response.data.accessToken)
    }

    return response
  },

  async logout() {
    const response = await axiosClassic.post('auth/logout')

    if (response.status === 200) {
      removeTokenStorage()
    }
    return response
  }
}
