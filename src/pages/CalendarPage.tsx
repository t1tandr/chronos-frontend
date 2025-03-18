'use client'

import { CreateEventModal } from '@/components/events/CreateEventModal'
import { eventService } from '@/services/events.service'
import { calendarService } from '@/services/calendar.service'
import { useQuery } from '@tanstack/react-query'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/buttons/Button'
import { useState } from 'react'
import { useParams } from 'next/navigation'
import { IEvent } from '@/types/event.types'

export default function CalendarPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<IEvent | null>(null)

  const params = useParams()
  const id = params?.['id']

  const { data: calendar } = useQuery({
    queryKey: ['calendar', id],
    queryFn: () => calendarService.getCalendarById(id as string)
  })

  const { data: events } = useQuery<any, any>({
    queryKey: ['events', id],
    queryFn: () => calendarService.getCalendarEvents(id as string),
    select: (events: IEvent[]) =>
      events.map(event => ({
        id: event.id,
        title: event.name,
        start: new Date(event.date),
        end: new Date(new Date(event.date).getTime() + event.duration * 60000),
        backgroundColor: event.color || '#3788d8',
        extendedProps: {
          description: event.description,
          category: event.category,
          creator: event.creator,
          duration: event.duration
        }
      }))
  })

  const handleEventClick = (info: any) => {
    const event = events?.find((e: { id: any }) => e.id === info.event.id)
    if (event) {
      setSelectedEvent(event)
    }
  }

  return (
    <div className='container p-layout'>
      <div className='flex justify-between items-center mb-8'>
        <div>
          <h1 className='text-2xl font-bold'>{calendar?.data.name}</h1>
          {calendar?.data.description && (
            <p className='text-gray-400 mt-1'>{calendar.data.description}</p>
          )}
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className='w-4 h-4 mr-2' />
          Add Event
        </Button>
      </div>

      <div className='bg-sidebar border border-border rounded-lg p-4'>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView='dayGridMonth'
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay'
          }}
          events={events || []}
          height='80vh'
          editable={true}
          selectable={true}
          selectMirror={true}
          dayMaxEvents={true}
          eventClick={handleEventClick}
          eventContent={renderEventContent}
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
            hour12: false
          }}
        />
      </div>

      {isModalOpen && (
        <CreateEventModal
          calendarId={id as string}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}

function renderEventContent(eventInfo: any) {
  return (
    <div className='p-1'>
      <div className='font-semibold'>{eventInfo.event.title}</div>
      {eventInfo.event.extendedProps.category && (
        <div className='text-xs opacity-75'>
          {eventInfo.event.extendedProps.category}
        </div>
      )}
      <div className='text-xs'>
        Created by: {eventInfo.event.extendedProps.creator.name}
      </div>
    </div>
  )
}
