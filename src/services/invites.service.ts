import { axiosWithAuth } from '@/api/interceptors'
import { IInviteDto } from '@/types/invite.types'

class InviteService {
  private BASE_URL = `${process.env.VUE_APP_API_URL}/invites`

  async createInvite(dto: IInviteDto) {
    return await axiosWithAuth.post(`${this.BASE_URL}/create`, dto)
  }

  async acceptInvite(id: string) {
    return await axiosWithAuth.post(`${this.BASE_URL}/${id}/accept`)
  }

  async rejectInvite(id: string) {
    return await axiosWithAuth.post(`${this.BASE_URL}/${id}/reject`)
  }

  async getInvitesForUser() {
    return await axiosWithAuth.get(`${this.BASE_URL}/user`)
  }

  async getInvitesForCalendar(calendarId: string) {
    return await axiosWithAuth.get(`${this.BASE_URL}/calendar/${calendarId}`)
  }

  async deleteInvite(id: string) {
    return await axiosWithAuth.delete(`${this.BASE_URL}/${id}`)
  }
}

export const inviteService = new InviteService()
