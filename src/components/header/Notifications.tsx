'use client'

import { Bell } from 'lucide-react'
import { useState } from 'react'

export function Notifications() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='p-2 hover:bg-white/5 rounded-full relative'
      >
        <Bell className='h-5 w-5' />
        <span className='absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full text-xs flex items-center justify-center'>
          2
        </span>
      </button>
      {isOpen && (
        <div className='absolute right-0 mt-2 w-80 bg-sidebar border border-border rounded-lg shadow-lg'>
          <div className='p-4'>
            <h3 className='text-sm font-medium mb-2'>Notifications</h3>
            {/* Add notification items here */}
          </div>
        </div>
      )}
    </div>
  )
}
