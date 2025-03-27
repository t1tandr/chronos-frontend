import { ICalendar } from '@/types/calendar.types'
import { X, Mail, Trash, AlertTriangle, LogOut } from 'lucide-react'
import { Button } from '../ui/buttons/Button'
import { Field } from '../ui/fields/Field'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { calendarService } from '@/services/calendar.service'
import { toast } from 'sonner'
import { userStore } from '@/store/userStore'
import { inviteService } from '@/services/invites.service'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'

const editCalendarSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  color: z.string(),
  isPublic: z.boolean()
})

type EditCalendarFormData = z.infer<typeof editCalendarSchema>

interface CalendarInfoModalProps {
  calendar: ICalendar
  isOpen: boolean
  onClose: () => void
}

interface InviteFormData {
  email: string
}

export function CalendarInfoModal({
  calendar,
  isOpen,
  onClose
}: CalendarInfoModalProps) {
  const [inviteError, setInviteError] = useState<string | null>(null)
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const { user } = userStore()
  const queryClient = useQueryClient()
  const { push } = useRouter()

  const { register, handleSubmit, reset } = useForm<InviteFormData>()

  const [isEditing, setIsEditing] = useState(false)

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    formState: { errors: editErrors }
  } = useForm<EditCalendarFormData>({
    resolver: zodResolver(editCalendarSchema),
    defaultValues: {
      name: calendar.name,
      description: calendar.description || '',
      color: calendar.color || '#3788d8',
      isPublic: calendar.isPublic
    }
  })

  const { mutate: leaveCalendar } = useMutation({
    mutationFn: () => calendarService.leaveCalendar(calendar.id, user.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-calendars'] })
      queryClient.invalidateQueries({ queryKey: ['participant-calendars'] })
      toast.success('Successfully left calendar')
      onClose()
      push('/')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to leave calendar')
    }
  })

  const { mutate: updateCalendar } = useMutation({
    mutationFn: (data: EditCalendarFormData) => {
      console.log('Updating calendar with data:', data)
      return calendarService.updateCalendar(calendar.id, data)
    },
    onSuccess: data => {
      console.log('Update successful:', data)
      queryClient.invalidateQueries({ queryKey: ['my-calendars'] })
      queryClient.invalidateQueries({ queryKey: ['participant-calendars'] })
      queryClient.invalidateQueries({
        queryKey: ['calendar', calendar.id],
        exact: true
      })
      toast.success('Calendar updated successfully')
      setIsEditing(false)
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update calendar')
    }
  })

  const { data: invites } = useQuery({
    queryKey: ['invites', calendar.id],
    queryFn: () => inviteService.getInvitesForCalendar(calendar.id)
  })

  const [updatingRoles, setUpdatingRoles] = useState<Record<string, boolean>>(
    {}
  )

  const handleRoleChange = async (userId: string, newRole: string) => {
    setUpdatingRoles(prev => ({ ...prev, [userId]: true }))
    await updateRole({ userId, role: newRole })
    setUpdatingRoles(prev => ({ ...prev, [userId]: false }))
  }

  const { mutate: sendInvite } = useMutation({
    mutationFn: (data: InviteFormData) =>
      inviteService.createInvite(calendar.id, { email: data.email }),
    onSuccess: () => {
      toast.success('Invitation sent')
      queryClient.invalidateQueries({ queryKey: ['invites', calendar.id] })
      setShowInviteForm(false)
      setInviteError(null)
      reset()
    },
    onError: (error: any) => {
      if (error.response?.data?.message === 'User not found') {
        setInviteError('User with this email does not exist')
      } else {
        toast.error(error.response?.data?.message || 'Failed to send invite')
      }
    }
  })

  const { mutate: updateRole } = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) =>
      calendarService.updateMemberRole(calendar.id, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['calendar', calendar.id],
        exact: true,
        refetchType: 'active'
      })
      queryClient.invalidateQueries({
        queryKey: ['my-calendars'],
        refetchType: 'active'
      })
      queryClient.invalidateQueries({
        queryKey: ['participant-calendars'],
        refetchType: 'active'
      })
      toast.success('Role updated')
    }
  })

  const { mutate: deleteCalendar } = useMutation({
    mutationFn: () => calendarService.deleteCalendar(calendar.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-calendars'] })
      queryClient.invalidateQueries({ queryKey: ['participant-calendars'] })
      toast.success('Calendar deleted successfully')
      onClose()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to delete calendar')
    }
  })

  const { mutate: removeMember } = useMutation({
    mutationFn: (userId: string) =>
      calendarService.removeMember(calendar.id, userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['calendar'] })
      queryClient.invalidateQueries({ queryKey: ['my-calendars'] })
      queryClient.invalidateQueries({ queryKey: ['participant-calendars'] })
      toast.success('Member removed')
    }
  })

  const isOwner = user?.id === calendar.ownerId

  return (
    <div className='fixed inset-0 bg-black/90 flex items-center justify-center z-50'>
      <div className='bg-sidebar p-6 rounded-lg w-[500px] relative max-h-[90vh] overflow-y-auto'>
        <button
          onClick={onClose}
          className='absolute right-4 top-4 hover:opacity-70 transition-opacity'
        >
          <X size={24} />
        </button>

        <div className='flex items-center justify-between mb-6'>
          <div>
            <h2 className='text-xl font-bold'>{calendar.name}</h2>
            {calendar.description && (
              <p className='text-gray-400 mt-1'>{calendar.description}</p>
            )}
            <div className='flex items-center gap-2 mt-2'>
              <div
                className='w-4 h-4 rounded-full'
                style={{ backgroundColor: calendar.color || '#3788d8' }}
              />
              <span className='text-sm text-gray-400'>
                {calendar.isPublic ? 'Public' : 'Private'} Calendar
              </span>
            </div>
          </div>
          <div className='flex gap-2'>
            {isOwner ? (
              <>
                <Button
                  onClick={() => setIsEditing(true)}
                  className='bg-blue-500/10 hover:bg-blue-500/20 text-blue-500'
                >
                  Edit
                </Button>
                <Button
                  onClick={() => setShowDeleteConfirm(true)}
                  className='bg-red-500/10 hover:bg-red-500/20 text-red-500'
                >
                  <Trash className='w-4 h-4' />
                </Button>
              </>
            ) : (
              <Button
                onClick={() => leaveCalendar()}
                className='bg-red-500/10 hover:bg-red-500/20 text-red-500'
                title='Leave Calendar'
              >
                <LogOut className='w-4 h-4' />
              </Button>
            )}
          </div>
        </div>

        {isEditing && (
          <form onSubmit={handleEditSubmit(data => updateCalendar(data))}>
            <div className='space-y-4 mb-6'>
              <Field
                id='name'
                placeholder='Name'
                label='Name'
                {...registerEdit('name')}
                error={editErrors.name?.message}
              />
              <Field
                id='description'
                placeholder='Description'
                label='Description'
                {...registerEdit('description')}
                error={editErrors.description?.message}
              />
              <div className='flex gap-4'>
                <Field
                  placeholder='Color'
                  id='color'
                  type='color'
                  label='Color'
                  {...registerEdit('color')}
                  error={editErrors.color?.message}
                />
                <label className='flex items-center gap-2'>
                  <input
                    type='checkbox'
                    {...registerEdit('isPublic')}
                    className='rounded border-border'
                  />
                  Public Calendar
                </label>
              </div>
            </div>
            <div className='flex justify-end gap-2'>
              <Button
                type='button'
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button type='submit'>Save Changes</Button>
            </div>
          </form>
        )}
        <div className='mt-6 border-t border-border pt-4'>
          <div className='flex justify-between items-center mb-4'>
            <h3 className='text-lg font-semibold'>Members</h3>

            {isOwner && (
              <Button
                className='flex items-center'
                onClick={() => setShowInviteForm(true)}
              >
                <Mail className='w-4 h-4 mr-2' />
                Invite Member
              </Button>
            )}
          </div>

          {showDeleteConfirm && (
            <div className='fixed inset-0 bg-black/90 flex items-center justify-center z-[60]'>
              <div className='bg-sidebar p-6 rounded-lg w-[400px]'>
                <div className='flex items-center gap-2 text-red-500 mb-4'>
                  <AlertTriangle className='w-5 h-5' />
                  <h3 className='text-lg font-semibold'>Delete Calendar</h3>
                </div>

                <p className='text-gray-400 mb-6'>
                  Are you sure you want to delete "{calendar.name}"? This action
                  cannot be undone and will remove all events and member access.
                </p>

                <div className='flex justify-end gap-2'>
                  <Button onClick={() => setShowDeleteConfirm(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={() => deleteCalendar()}
                    className='bg-red-500/10 hover:bg-red-500/20 text-red-500'
                  >
                    Delete Calendar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {showInviteForm && (
            <form
              onSubmit={handleSubmit(data => sendInvite(data))}
              className='mb-4 p-4 border border-border rounded-lg'
            >
              <Field
                id='email'
                {...register('email', { required: 'Email is required' })}
                type='email'
                label='Email'
                placeholder='Enter email to invite'
              />
              {inviteError && (
                <p className='mt-1 text-sm text-red-500'>{inviteError}</p>
              )}
              <div className='flex justify-end gap-2 mt-4'>
                <Button
                  type='button'
                  onClick={() => {
                    setShowInviteForm(false)
                    setInviteError(null)
                  }}
                >
                  Cancel
                </Button>
                <Button type='submit'>Send Invite</Button>
              </div>
            </form>
          )}

          <div className='space-y-2'>
            {calendar.members?.map(member => (
              <div
                key={member.id}
                className='flex items-center justify-between p-2 rounded bg-white/5'
              >
                <div>
                  <p>{member.user.name}</p>
                  <p className='text-sm text-gray-400'>{member.user.email}</p>
                </div>
                <div className='flex items-center gap-2'>
                  {isOwner && member.user.id !== user?.id && (
                    <>
                      <select
                        value={member.role}
                        onChange={e =>
                          handleRoleChange(member.user.id, e.target.value)
                        }
                        disabled={updatingRoles[member.user.id]}
                        className='bg-transparent border border-border rounded p-1 disabled:opacity-50'
                      >
                        <option value='VIEWER'>Viewer</option>
                        <option value='EDITOR'>Editor</option>
                        <option value='SELF_EDITOR'>Self Editor</option>
                      </select>
                      <button
                        onClick={() => removeMember(member.user.id)}
                        className='p-1 hover:text-red-500 transition-colors'
                      >
                        <Trash className='w-4 h-4' />
                      </button>
                    </>
                  )}
                  {!isOwner && <span className='text-sm'>{member.role}</span>}
                </div>
              </div>
            ))}
          </div>

          {invites && invites.length > 0 && (
            <div className='mt-4'>
              <h3 className='text-lg font-semibold mb-2'>Pending Invites</h3>
              <div className='space-y-2'>
                {invites.map((invite: any) => (
                  <div
                    key={invite.id}
                    className='flex justify-between items-center p-2 rounded bg-white/5'
                  >
                    <span>{invite.email}</span>
                    <span className='text-sm text-gray-400'>Pending</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
