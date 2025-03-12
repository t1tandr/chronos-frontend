import { axiosWithAuth } from '@/api/interceptors'
import { ICalendarDto } from '@/types/calendar.types'

class CalendarService {
  private BASE_URL = `${process.env.BACKEND_URL}/calendars`

  async createCalendar(userId: string, dto: ICalendarDto) {
    return await axiosWithAuth.post(`${this.BASE_URL}/create`, dto)
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
