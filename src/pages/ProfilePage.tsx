'use client'

import { ProfileInfo } from '@/components/profile/ProfileInfo'
import { ProfileCalendars } from '@/components/profile/ProfileCalendars'
import { userService } from '@/services/user.service'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'next/navigation'

export default function ProfilePage() {
  const { id } = useParams()

  const { data: profile, isLoading } = useQuery({
    queryKey: ['profile', id],
    queryFn: () => userService.getUserWithCalendars(id as string)
  })

  if (isLoading) return <div>Loading...</div>
  if (!profile) return <div>User not found</div>

  return (
    <div className='p-layout'>
      <ProfileInfo user={profile.user} />
      <ProfileCalendars calendars={profile.calendars} />
    </div>
  )
}
