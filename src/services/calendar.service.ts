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

  async getUserCalendars(userId: string) {
    return await axiosWithAuth.get(`${this.BASE_URL}/user/${userId}`)
  }

  async getParticipantCalendars() {
    return await axiosWithAuth.get<ICalendar[]>(`${this.BASE_URL}/participants`)
  }

  async updateCalendar(id: string, dto: ICalendarDto) {
    return await axiosWithAuth.post(`${this.BASE_URL}/${id}/update`, dto)
  }

  async getCalendarsByUserId(userId: string) {
    return await axiosWithAuth.get(`${this.BASE_URL}/user/${userId}`)
  }

  getCalendarById(id: string) {
    return axiosWithAuth.get(`${this.BASE_URL}/${id}`)
  }
}

export const calendarService = new CalendarService()
