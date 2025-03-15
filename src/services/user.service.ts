import { axiosWithAuth } from '@/api/interceptors'
import { IUpdateUserDto } from '@/types/user.types'

class UserService {
  private BASE_URL = `/users`

  async getUserById(id: string) {
    return await axiosWithAuth.get(`${this.BASE_URL}/${id}`)
  }

  async getUserWithCalendars(id: string) {
    return await axiosWithAuth.get<any>(`${this.BASE_URL}/${id}/calendars`)
  }

  async updateUser(id: string, data: IUpdateUserDto) {
    return await axiosWithAuth.post(`${this.BASE_URL}/${id}`, data)
  }
}

export const userService = new UserService()
