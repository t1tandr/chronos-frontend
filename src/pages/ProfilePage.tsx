'use client'

import { ProfileInfo } from '@/components/profile/ProfileInfo'
import { ProfileCalendars } from '@/components/profile/ProfileCalendars'
import { userService } from '@/services/user.service'
import { useQueries } from '@tanstack/react-query'
import { useParams } from 'next/navigation'
import { calendarService } from '@/services/calendar.service'

export default function ProfilePage() {
  const params = useParams()
  const id = params?.['id']

  const [
    { data: user, isLoading: isUserLoading },
    { data: calendars, isLoading: isCalendarsLoading }
  ] = useQueries({
    queries: [
      {
        queryKey: ['user', id],
        queryFn: () => userService.getUserById(id as string)
      },
      {
        queryKey: ['calendars', id],
        queryFn: () => calendarService.getUserCalendars(id as string)
      }
    ]
  })

  if (isUserLoading || isCalendarsLoading) {
    return <div>Loading...</div>
  }

  if (!user || !calendars) {
    return <div>User not found</div>
  }

  return (
    <div className='p-layout p-8'>
      <ProfileInfo user={user.data} />
      <ProfileCalendars calendars={calendars.data} />
    </div>
  )
}
