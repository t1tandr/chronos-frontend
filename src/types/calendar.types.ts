export interface ICalendarDto {
  name: string
  description?: string
  color?: string
  isPublic: boolean
}

export interface ICalendar {
  id: string
  name: string
  slug: string
  description?: string
  color?: string
  ownerId: string
  isPublic: boolean
}
