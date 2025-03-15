'use client'

import { userStore } from '@/store/userStore'
import Link from 'next/link'
import { Search } from '../ui/fields/Search'
import { Notifications } from './Notifications'
import { ProfileSection } from './ProfileSection'

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

          <div className='flex-1 max-w-xl mx-4'>
            <Search />
          </div>

          <div className='flex items-center gap-4'>
            <Notifications />
            <ProfileSection user={user} />
          </div>
        </div>
      </div>
    </header>
  )
}
