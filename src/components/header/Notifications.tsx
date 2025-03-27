'use client'

import { inviteService } from '@/services/invites.service'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Bell, Check, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { userStore } from '@/store/userStore'
import { toast } from 'sonner'
import { Button } from '../ui/buttons/Button'
import { IInvite } from '@/types/invite.types'
import { useRouter } from 'next/navigation'

export function Notifications() {
  const [isOpen, setIsOpen] = useState(false)
  const { user } = userStore()
  const queryClient = useQueryClient()

  const { data: invites, isLoading } = useQuery<IInvite[]>({
    queryKey: ['invites', user?.id],
    queryFn: () => inviteService.getInvitesForUser(),
    enabled: !!user && isOpen
  })

  useEffect(() => {
    if (user) {
      queryClient.prefetchQuery({
        queryKey: ['invites', user.id],
        queryFn: async () => {
          const response = await inviteService.getInvitesForUser()
          return response.filter(invite => invite.status === 'PENDING')
        }
      })
    }
  }, [user, queryClient])

  const { mutate: acceptInvite, isPending: isAccepting } = useMutation({
    mutationFn: (inviteId: string) => inviteService.acceptInvite(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invites'] })
      queryClient.invalidateQueries({ queryKey: ['my-calendars'] })
      queryClient.invalidateQueries({ queryKey: ['public-calendars'] })
      queryClient.invalidateQueries({ queryKey: ['participant-calendars'] })

      toast.success('Invite accepted')
      if (invites?.length === 1) {
        setIsOpen(false)
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to accept invite')
    }
  })

  const { mutate: rejectInvite, isPending: isRejecting } = useMutation({
    mutationFn: (inviteId: string) => inviteService.rejectInvite(inviteId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invites'] })
      toast.success('Invite rejected')
      if (invites?.length === 1) {
        setIsOpen(false)
      }
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to reject invite')
    }
  })

  const handleOpenModal = () => {
    setIsOpen(true)
    if (user) {
      queryClient.invalidateQueries({
        queryKey: ['invites', user.id],
        exact: true
      })
    }
  }

  if (!user) return null

  return (
    <>
      <button
        onClick={handleOpenModal}
        className='p-2 hover:bg-white/5 rounded-full relative'
      >
        <Bell className='h-5 w-5' />
        {invites && invites.length > 0 && (
          <span className='absolute -top-1 -right-1 h-4 w-4 bg-primary rounded-full text-xs flex items-center justify-center'>
            {invites.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className='fixed inset-0 bg-black/90 flex items-center justify-center z-50'>
          <div className='bg-sidebar p-6 rounded-lg w-[400px] relative'>
            <h1 className='text-xl '>Invites</h1>
            <button
              onClick={() => setIsOpen(false)}
              className='absolute right-4 top-4 p-1 hover:opacity-70 transition-opacity'
              aria-label='Close notifications'
            >
              <X className='w-5 h-5' />
            </button>
            {isLoading ? (
              <div className='text-center py-4 text-gray-400'>Loading...</div>
            ) : !invites?.length ? (
              <div className='text-center py-4 text-gray-400'>
                No new invites
              </div>
            ) : (
              <div className='space-y-4 max-h-[60vh] overflow-y-auto'>
                {invites.map(invite => (
                  <div
                    key={invite.id}
                    className='flex items-center justify-between p-4 bg-white/5 rounded-lg'
                  >
                    <div>
                      <p className='font-medium'>{invite.calendar.name}</p>
                      <p className='text-sm text-gray-400'>
                        from {invite.calendar.owner.name}
                      </p>
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        type='button'
                        onClick={() => {
                          if (!isAccepting && !isRejecting) {
                            acceptInvite(invite.id)
                          }
                        }}
                        disabled={isAccepting || isRejecting}
                        className='bg-green-500/10 hover:bg-green-500/20 disabled:opacity-50'
                      >
                        <Check className='w-4 h-4' />
                      </Button>
                      <Button
                        type='button'
                        onClick={() => {
                          if (!isAccepting && !isRejecting) {
                            rejectInvite(invite.id)
                          }
                        }}
                        disabled={isAccepting || isRejecting}
                        className='bg-red-500/10 hover:bg-red-500/20 disabled:opacity-50'
                      >
                        <X className='w-4 h-4' />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
