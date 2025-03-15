import { ICalendar } from '@/types/calendar.types'
import { CalendarCard } from '../calendar/CalendarCard'

interface ProfileCalendarsProps {
  calendars: ICalendar[]
}

export function ProfileCalendars({ calendars }: ProfileCalendarsProps) {
  if (!calendars.length) {
    return <div>No calendars found</div>
  }

  return (
    <div>
      <h2 className='text-xl font-semibold mb-4'>Calendars</h2>
      <div className='grid grid-cols-3 gap-4'>
        {calendars.map(calendar => (
          <CalendarCard
            key={calendar.id}
            calendar={calendar}
          />
        ))}
      </div>
    </div>
  )
}
