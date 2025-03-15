'use client'

import { IUser } from '@/types/user.types'
import { LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth.service'
import { userStore } from '@/store/userStore'

interface ProfileSectionProps {
  user: IUser | null
}

export function ProfileSection({ user }: ProfileSectionProps) {
  const router = useRouter()
  const logout = userStore(state => state.logout)

  const handleLogout = async () => {
    await authService.logout()
    logout()
    router.push('/auth')
  }

  if (!user) return null

  return (
    <div className='flex items-center gap-3'>
      <p
        onClick={() => router.push(`/profile/${user.id}`)}
        className='text-sm font-medium'
      >
        {user.name}
      </p>
      <button
        onClick={handleLogout}
        className='p-2 hover:bg-white/5 rounded-full'
      >
        <LogOut className='h-5 w-5' />
      </button>
    </div>
  )
}
