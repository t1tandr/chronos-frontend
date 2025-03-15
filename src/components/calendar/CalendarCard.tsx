import { ICalendar } from '@/types/calendar.types'
import Link from 'next/link'

interface CalendarCardProps {
  calendar: ICalendar
}

export function CalendarCard({ calendar }: CalendarCardProps) {
  return (
    <Link
      href={`/calendar/${calendar.id}`}
      className='block p-4 rounded-lg border border-border hover:border-primary transition-colors'
    >
      <h3 className='text-lg font-semibold mb-2'>{calendar.name}</h3>
      {calendar.description && (
        <p className='text-sm text-gray-400 mb-4'>{calendar.description}</p>
      )}
      {/* <div className='text-xs text-gray-500'>
        {calendar.participants.length} participants
      </div> */}
    </Link>
  )
}
