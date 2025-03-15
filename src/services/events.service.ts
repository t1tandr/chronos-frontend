import { axiosWithAuth } from '@/api/interceptors'
import { IEventDto } from '@/types/event.types'

class EventService {
  private BASE_URL = `/events`

  async createEvent(dto: IEventDto) {
    return await axiosWithAuth.post(`${this.BASE_URL}/create`, dto)
  }

  async updateEvent(id: string, dto: IEventDto) {
    return await axiosWithAuth.put(`${this.BASE_URL}/${id}`, dto)
  }

  async deleteEvent(id: string) {
    return await axiosWithAuth.delete(`${this.BASE_URL}/${id}`)
  }

  async getEvent(id: string) {
    return await axiosWithAuth.get(`${this.BASE_URL}/${id}`)
  }
}

export const eventService = new EventService()
