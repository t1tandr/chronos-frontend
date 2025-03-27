import { ICalendar } from '@/types/calendar.types'
import { Plus, Settings } from 'lucide-react'
import { useState } from 'react'
import { CalendarInfoModal } from './CalendarInfoModal'
import { CreateEventModal } from '../events/CreateEventModal'
import { useCalendarPermissions } from '@/hooks/useCalendarPermission'

interface CalendarsListProps {
  title: string
  calendars: ICalendar[]
  isLoading: boolean
  onSelect: (id: string) => void
  selectedId: string | null
}

export function CalendarsList({
  title,
  calendars,
  isLoading,
  onSelect,
  selectedId
}: CalendarsListProps) {
  const [selectedCalendar, setSelectedCalendar] = useState<ICalendar | null>(
    null
  )
  const [showEventModal, setShowEventModal] = useState(false)
  const currentCalendar = calendars.find(cal => cal.id === selectedId)
  const { canEdit, canEditOwn } = useCalendarPermissions(currentCalendar)

  if (isLoading) return <div>Loading...</div>

  return (
    <>
      <div>
        <h2 className='text-lg font-semibold mb-3'>{title}</h2>
        <div className='space-y-2'>
          {calendars.map(calendar => (
            <div
              key={calendar.id}
              className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-white/5 group ${
                selectedId === calendar.id ? 'bg-white/10' : ''
              }`}
              onClick={() => onSelect(calendar.id)}
            >
              <div className='flex items-center gap-2'>
                <div
                  className='w-3 h-3 rounded-full'
                  style={{ backgroundColor: calendar.color || '#3788d8' }}
                />
                <span className='truncate'>{calendar.name}</span>
              </div>

              <div className='flex items-center gap-1'>
                {selectedId === calendar.id && (canEdit || canEditOwn) && (
                  <button
                    onClick={e => {
                      e.stopPropagation()
                      setShowEventModal(true)
                    }}
                    className='p-1.5 hover:bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                    title='Create event'
                  >
                    <Plus className='w-4 h-4' />
                  </button>
                )}
                <button
                  onClick={e => {
                    e.stopPropagation()
                    setSelectedCalendar(calendar)
                  }}
                  className='p-1.5 hover:bg-white/5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity'
                  title='Calendar settings'
                >
                  <Settings className='w-4 h-4' />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedCalendar && (
        <CalendarInfoModal
          calendar={selectedCalendar}
          isOpen={!!selectedCalendar}
          onClose={() => setSelectedCalendar(null)}
        />
      )}

      {showEventModal && selectedId && (
        <CreateEventModal
          calendarId={selectedId}
          isOpen={showEventModal}
          onClose={() => setShowEventModal(false)}
        />
      )}
    </>
  )
}
