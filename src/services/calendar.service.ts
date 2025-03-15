import { axiosWithAuth } from '@/api/interceptors'
import { ICalendar, ICalendarDto } from '@/types/calendar.types'

class CalendarService {
  private BASE_URL = `/calendars`

  async createCalendar(dto: ICalendarDto) {
    return await axiosWithAuth.post(`${this.BASE_URL}/create`, dto)
  }

  async getMyCalendars() {
    return await axiosWithAuth.get<ICalendar[]>(`${this.BASE_URL}`)
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
