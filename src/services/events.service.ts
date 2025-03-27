import { axiosWithAuth } from '@/api/interceptors'
import { IEvent, IEventDto } from '@/types/event.types'

class EventService {
  private BASE_URL = '/events'

  async createEvent(dto: IEventDto) {
    const { data } = await axiosWithAuth.post<IEvent>(
      `${this.BASE_URL}/create`,
      dto
    )
    return data
  }

  async updateEvent(id: string, dto: IEventDto) {
    const { data } = await axiosWithAuth.put<IEvent>(
      `${this.BASE_URL}/${id}`,
      dto
    )
    return data
  }

  async deleteEvent(id: string) {
    const { data } = await axiosWithAuth.delete<IEvent>(
      `${this.BASE_URL}/${id}`
    )
    return data
  }

  async getEvent(id: string) {
    const { data } = await axiosWithAuth.get<IEvent>(`${this.BASE_URL}/${id}`)
    return data
  }
}

export const eventService = new EventService()
