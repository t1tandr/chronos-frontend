'use client'

import { SearchIcon } from 'lucide-react'
import { useState } from 'react'

export function Search() {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className='relative'>
      <SearchIcon className='absolute left-3 top-1/4 h-4 w-4 text-gray-400' />
      <input
        type='text'
        placeholder='Search users or calendars'
        value={searchQuery}
        onChange={e => setSearchQuery(e.target.value)}
        className='w-full pl-10 pr-4 py-2 rounded-lg bg-white/5 border border-border focus:outline-none focus:border-primary'
      />
    </div>
  )
}
