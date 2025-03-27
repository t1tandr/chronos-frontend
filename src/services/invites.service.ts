import { axiosWithAuth } from '@/api/interceptors'
import { IInvite, IInviteDto } from '@/types/invite.types'

class InviteService {
  private BASE_URL = `/invites`

  async createInvite(calendarId: string, dto: IInviteDto) {
    const { data } = await axiosWithAuth.post(
      `${this.BASE_URL}/${calendarId}/create`,
      dto
    )
    return data
  }

  async getInvitesForCalendar(calendarId: string) {
    const { data } = await axiosWithAuth.get(
      `${this.BASE_URL}/calendar/${calendarId}`
    )
    return data
  }

  async acceptInvite(id: string) {
    return await axiosWithAuth.post(`${this.BASE_URL}/${id}/accept`)
  }

  async rejectInvite(id: string) {
    return await axiosWithAuth.post(`${this.BASE_URL}/${id}/reject`)
  }

  async getInvitesForUser() {
    const { data } = await axiosWithAuth.get<IInvite[]>(`${this.BASE_URL}/user`)
    return data
  }

  async deleteInvite(id: string) {
    return await axiosWithAuth.delete(`${this.BASE_URL}/${id}`)
  }
}

export const inviteService = new InviteService()
