'use client'

import { CalendarsList } from '@/components/calendar/CalendarList'
import { CreateCalendarModal } from '@/components/calendar/CreateCalendarModal'
import { MainCalendar } from '@/components/calendar/MainCalendar'
import { Button } from '@/components/ui/buttons/Button'
import { calendarService } from '@/services/calendar.service'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCalendar, setSelectedCalendar] = useState<string | null>(null)

  const { data: myCalendars, isLoading: isLoadingMy } = useQuery({
    queryKey: ['my-calendars'],
    queryFn: () => calendarService.getMyCalendars()
  })

  const { data: publicCalendars, isLoading: isLoadingPublic } = useQuery({
    queryKey: ['public-calendars'],
    queryFn: () => calendarService.getParticipantCalendars()
  })

  return (
    <div className='flex h-[calc(100vh-64px)]'>
      <div className='w-80 border-r border-border bg-sidebar p-4'>
        <Button
          className='w-full flex items-center justify-center mb-6'
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className='w-4 h-4 mr-2' />
          Create Calendar
        </Button>

        <div className='space-y-6'>
          <CalendarsList
            title='My Calendars'
            calendars={myCalendars?.data || []}
            isLoading={isLoadingMy}
            onSelect={setSelectedCalendar}
            selectedId={selectedCalendar}
          />

          <CalendarsList
            title='Public Calendars'
            calendars={publicCalendars?.data || []}
            isLoading={isLoadingPublic}
            onSelect={setSelectedCalendar}
            selectedId={selectedCalendar}
          />
        </div>
      </div>

      <div className='flex-1 p-6'>
        <MainCalendar
          calendar={
            [
              ...(myCalendars?.data || []),
              ...(publicCalendars?.data || [])
            ].find(cal => cal.id === selectedCalendar) || null
          }
          selectedCalendarId={selectedCalendar}
        />
      </div>

      {isModalOpen && (
        <CreateCalendarModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  )
}
