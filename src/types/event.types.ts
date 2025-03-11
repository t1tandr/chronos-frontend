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

export interface IUpdateEventDto extends Partial<IEventDto> {}
