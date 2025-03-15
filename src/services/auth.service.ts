import { axiosClassic } from '@/api/interceptors'
import { removeTokenStorage, saveTokenStorage } from './auth-token.service'
import { IAuthResponse } from '@/types/user.types'

export const authService = {
  async main(type: 'login' | 'registration', data: any) {
    try {
      const response = await axiosClassic.post<IAuthResponse>(
        `/auth/${type}`,
        data
      )

      if (response.data.accessToken) {
        saveTokenStorage(response.data.accessToken)
      }
      return response.data
    } catch (e: any) {
      throw new Error(e.response.data.message)
    }
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
