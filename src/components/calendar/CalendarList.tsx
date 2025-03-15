import { ICalendar } from '@/types/calendar.types'
import { CalendarCard } from './CalendarCard'

interface CalendarListProps {
  calendars: ICalendar[]
  isLoading: boolean
}

export function CalendarList({ calendars, isLoading }: CalendarListProps) {
  if (isLoading) return <div>Loading...</div>

  if (!calendars.length) return <div>No calendars found</div>

  return (
    <div className='grid grid-cols-3 gap-4'>
      {calendars.map(calendar => (
        <CalendarCard
          key={calendar.id}
          calendar={calendar}
        />
      ))}
    </div>
  )
}
