export enum EventCategory {
  ARRANGEMENT = 'ARRANGEMENT',
  REMINDER = 'REMINDER',
  TASK = 'TASK'
}

export interface IEventDto {
  name: string
  description?: string
  startDate: Date
  duration: number
  category?: EventCategory
  calendarId: string
  color?: string
}

export interface IEvent {
  id: string
  name: string
  description?: string
  date: string
  duration: number
  category?: 'ARRANGEMENT' | 'REMINDER' | 'TASK'
  color: string
  creator: {
    id: string
    name: string
  }
}

export interface IUpdateEventDto extends Partial<IEventDto> {}
