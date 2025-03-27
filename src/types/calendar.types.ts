export interface ICalendarDto {
  name: string
  description?: string
  color?: string
  isPublic: boolean
}

export interface ICalendar {
  id: string
  name: string
  description?: string
  slug: string
  color?: string
  isPublic: boolean
  ownerId: string
  owner: {
    id: string
    name: string
    email: string
  }
  members?: {
    id: string
    role: 'OWNER' | 'VIEWER' | 'EDITOR' | 'SELF_EDITOR'
    user: {
      id: string
      name: string
      email: string
    }
  }[]
}
