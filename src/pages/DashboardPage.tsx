'use client'

import { CalendarList } from '@/components/calendar/CalendarList'
import { CreateCalendarModal } from '@/components/calendar/CreateCalendarModal'
import { Button } from '@/components/ui/buttons/Button'
import { calendarService } from '@/services/calendar.service'
import { useQuery } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useState } from 'react'

export default function DashboardPage() {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const { data: myCalendars, isLoading: isLoadingMy } = useQuery({
    queryKey: ['my-calendars'],
    queryFn: () => calendarService.getMyCalendars()
  })

  const { data: participatingCalendars, isLoading: isLoadingParticipating } =
    useQuery({
      queryKey: ['participating-calendars'],
      queryFn: () => calendarService.getParticipantCalendars()
    })

  return (
    <div className='container p-layout px-6'>
      <div className='flex gap-20 mt-10 items-center mb-8'>
        <h1 className='text-2xl font-bold'>My Calendars</h1>
        <Button
          className='flex items-center cursor-pointer'
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className='w-4 h-4 mr-2' />
          Create Calendar
        </Button>
      </div>

      <div className='grid gap-8'>
        <section>
          <h2 className='text-xl font-semibold mb-4'>My Calendars</h2>
          <CalendarList
            calendars={myCalendars?.data || []}
            isLoading={isLoadingMy}
          />
        </section>

        <section>
          <h2 className='text-xl font-semibold mb-4'>
            Participating Calendars
          </h2>
          <CalendarList
            calendars={participatingCalendars?.data || []}
            isLoading={isLoadingParticipating}
          />
        </section>
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
