'use client'

import { userStore } from '@/store/userStore'
import Link from 'next/link'
import { Search } from '../ui/fields/Search'
import { Notifications } from './Notifications'
import { ProfileSection } from './ProfileSection'
import { SearchCalendars } from './SearchCalendar'

export function Header() {
  const { user } = userStore()

  return (
    <header className='w-full border-b border-b-border bg-sidebar'>
      <div className='container mx-auto px-4'>
        <div className='flex items-center justify-between h-16'>
          <Link
            href='/'
            className='text-2xl font-bold text-white hover:text-primary/90 transition-colors'
          >
            CHRONOS
          </Link>

          <SearchCalendars />

          <div className='flex items-center gap-4'>
            <Notifications />
            <ProfileSection user={user} />
          </div>
        </div>
      </div>
    </header>
  )
}
