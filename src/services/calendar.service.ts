import { axiosWithAuth } from '@/api/interceptors'
import { ICalendar, ICalendarDto } from '@/types/calendar.types'
import { IEvent } from '@/types/event.types'

class CalendarService {
  private BASE_URL = `/calendars`

  async createCalendar(dto: ICalendarDto) {
    return await axiosWithAuth.post(`${this.BASE_URL}/create`, dto)
  }

  async getMyCalendars() {
    return await axiosWithAuth.get<ICalendar[]>(`${this.BASE_URL}`)
  }

  async leaveCalendar(calendarId: string, userId: string) {
    const { data } = await axiosWithAuth.delete(
      `${this.BASE_URL}/${calendarId}/members/${userId}`
    )
    return data
  }

  async getCalendarEvents(calendarId: string) {
    const { data } = await axiosWithAuth.get<IEvent[]>(
      `/calendars/${calendarId}/events`
    )

    return data.map(event => ({
      id: event.id,
      title: event.name,
      start: new Date(event.date),
      end: new Date(new Date(event.date).getTime() + event.duration * 60000),
      backgroundColor: event.color,
      extendedProps: {
        description: event.description,
        category: event.category,
        creator: event.creator
      }
    }))
  }

  async joinCalendar(id: string) {
    const { data } = await axiosWithAuth.post(`${this.BASE_URL}/${id}/join`)
    return data
  }

  async deleteCalendar(id: string) {
    const { data } = await axiosWithAuth.delete(`${this.BASE_URL}/${id}`)
    return data
  }

  async getUserCalendars(userId: string) {
    return await axiosWithAuth.get(`${this.BASE_URL}/user/${userId}`)
  }

  async getParticipantCalendars() {
    return await axiosWithAuth.get<ICalendar[]>(`${this.BASE_URL}/participants`)
  }

  async updateCalendar(id: string, dto: ICalendarDto) {
    const { data } = await axiosWithAuth.patch(`${this.BASE_URL}/${id}`, dto)
    return data
  }

  async getCalendarsByUserId(userId: string) {
    return await axiosWithAuth.get(`${this.BASE_URL}/user/${userId}`)
  }

  getCalendarById(id: string) {
    return axiosWithAuth.get(`${this.BASE_URL}/${id}`)
  }

  async searchCalendars(query: string) {
    if (!query || query.length < 3) return []
    const { data } = await axiosWithAuth.get(`${this.BASE_URL}/search`, {
      params: { query }
    })
    return data
  }

  async updateMemberRole(
    calendarId: string,
    userId: string,
    role: 'EDITOR' | 'VIEWER'
  ) {
    const { data } = await axiosWithAuth.patch(
      `${this.BASE_URL}/${calendarId}/members/${userId}/role`,
      {
        role
      }
    )
    return data
  }

  async removeMember(calendarId: string, userId: string) {
    const { data } = await axiosWithAuth.delete(
      `${this.BASE_URL}/${calendarId}/members/${userId}`
    )
    return data
  }
}

export const calendarService = new CalendarService()
