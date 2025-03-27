import { calendarService } from '@/services/calendar.service'
import { useQuery } from '@tanstack/react-query'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { IEvent } from '@/types/event.types'
import { ICalendar } from '@/types/calendar.types'
import { useState } from 'react'
import { EventDetailsModal } from '../events/EventDetailsModal'
import { EventClickArg } from '@fullcalendar/core/index.js'
import { useCalendarPermissions } from '@/hooks/useCalendarPermission'
import { CreateEventModal } from '../events/CreateEventModal'
import { userStore } from '@/store/userStore'

interface MainCalendarProps {
  selectedCalendarId: string | null
  calendar: ICalendar | null
}

export function MainCalendar({
  selectedCalendarId,
  calendar
}: MainCalendarProps) {
  const { canEdit, canEditOwn } = useCalendarPermissions(calendar)
  const { user } = userStore()
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState<{
    date: string
    time?: string
  } | null>(null)
  const { data: events } = useQuery({
    queryKey: ['events', selectedCalendarId],
    queryFn: () =>
      selectedCalendarId
        ? calendarService.getCalendarEvents(selectedCalendarId)
        : Promise.resolve([]),
    enabled: !!selectedCalendarId
  })

  const handleDateSelect = (selectInfo: any) => {
    if (!canEdit && !canEditOwn) return

    const date = selectInfo.start
    setSelectedDate({
      date: date.toISOString().split('T')[0],
      time: date.toTimeString().slice(0, 5)
    })
    setShowCreateModal(true)
  }

  const handleEventClick = (clickInfo: EventClickArg) => {
    console.log('Event clicked:', clickInfo.event)

    const clickedEvent = clickInfo.event
    if (!clickedEvent) return

    const eventData: IEvent = {
      id: clickedEvent.id,
      name: clickedEvent.title,
      description: clickedEvent.extendedProps?.description || '',
      date: clickedEvent.start!.toISOString(),
      duration: Math.round(
        (clickedEvent.end!.getTime() - clickedEvent.start!.getTime()) / 60000
      ),
      color: clickedEvent.backgroundColor,
      category: clickedEvent.extendedProps?.category,
      calendarId: selectedCalendarId!,
      creatorId: clickedEvent.extendedProps?.creator?.id
    }

    setSelectedEvent(eventData)
  }

  return (
    <div className='bg-sidebar border border-border rounded-lg p-4 h-full'>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView='dayGridMonth'
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        events={events || []}
        height='100%'
        editable={canEdit}
        selectable={canEdit || canEditOwn}
        selectMirror={true}
        dayMaxEvents={true}
        eventClick={handleEventClick}
        select={handleDateSelect}
      />

      {selectedEvent && calendar && (
        <EventDetailsModal
          event={selectedEvent}
          calendar={calendar}
          onClose={() => {
            console.log('Closing modal')
            setSelectedEvent(null)
          }}
        />
      )}
      {showCreateModal && selectedCalendarId && (
        <CreateEventModal
          calendarId={selectedCalendarId}
          isOpen={showCreateModal}
          onClose={() => {
            setShowCreateModal(false)
            setSelectedDate(null)
          }}
          initialDate={selectedDate}
        />
      )}
    </div>
  )
}
