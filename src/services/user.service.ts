import { axiosWithAuth } from '@/api/interceptors'
import { IUpdateUserDto } from '@/types/user.types'

class UserService {
  private BASE_URL = `/user`

  async getUserById(id: string) {
    return await axiosWithAuth.get(`${this.BASE_URL}/${id}`)
  }

  async getUserWithCalendars() {
    return await axiosWithAuth.get<any>(`${this.BASE_URL}/calendars`)
  }

  async updateUser(id: string, data: IUpdateUserDto) {
    return await axiosWithAuth.post(`${this.BASE_URL}/${id}`, data)
  }
}

export const userService = new UserService()
