import { IUser } from '@/types/user.types'
import { Edit } from 'lucide-react'
import { useState } from 'react'
import { EditProfileModal } from './EditProfileModal'

interface ProfileInfoProps {
  user: IUser
}

export function ProfileInfo({ user }: ProfileInfoProps) {
  const [isEditing, setIsEditing] = useState(false)

  return (
    <div className='mb-8 p-6 border border-border rounded-lg'>
      <div className='flex justify-between items-center mb-4'>
        <h1 className='text-2xl font-bold'>{user.name}</h1>
        <button
          onClick={() => setIsEditing(true)}
          className='p-2 hover:bg-white/5 rounded-full'
        >
          <Edit className='w-5 h-5' />
        </button>
      </div>

      <div className='text-gray-400'>
        <p>{user.email}</p>
        {user.country && <p>{user.country}</p>}
      </div>

      {isEditing && (
        <EditProfileModal
          user={user}
          isOpen={isEditing}
          onClose={() => setIsEditing(false)}
        />
      )}
    </div>
  )
}
