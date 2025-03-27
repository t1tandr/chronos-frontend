export enum EventCategory {
  ARRANGEMENT = 'ARRANGEMENT',
  REMINDER = 'REMINDER',
  TASK = 'TASK'
}

export interface IEvent {
  id: string
  name: string
  description?: string
  date: string
  duration: number
  color?: string
  category?: 'ARRANGMENT' | 'TASK' | 'REMINDER'
  calendarId: string
  creatorId?: string
}

export interface IEventResponse {
  id: string
  title: string
  start: string
  end: string
  backgroundColor: string
  extendedProps: {
    description?: string
    category?: 'ARRANGMENT' | 'TASK' | 'REMINDER'
    creator: {
      id: string
      name: string
    }
  }
}

export interface IEventDto {
  name: string
  description?: string
  date: string // ISO string
  duration: number
  color?: string
  category?: 'ARRANGMENT' | 'TASK' | 'REMINDER'
  calendarId: string
}

export interface IUpdateEventDto extends Partial<IEventDto> {}
