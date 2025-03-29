import { Button } from '@/components/ui/buttons/Button'
import { IEvent } from '@/types/event.types'
import { X, Edit, Trash } from 'lucide-react'
import { useState } from 'react'
import { CreateEventModal } from './CreateEventModal'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { eventService } from '@/services/events.service'
import { toast } from 'sonner'
import { ICalendar } from '@/types/calendar.types'
import { useCalendarPermissions } from '@/hooks/useCalendarPermission'
import { userStore } from '@/store/userStore'

interface EventDetailsModalProps {
  event: IEvent
  onClose: () => void
  calendar: ICalendar
}

export function EventDetailsModal({
  event,
  onClose,
  calendar
}: EventDetailsModalProps) {
  const [showEditModal, setShowEditModal] = useState(false)
  const { canEdit, canEditOwn } = useCalendarPermissions(calendar)
  const queryClient = useQueryClient()
  const { user } = userStore()

  const canEditEvent =
    canEdit ||
    (canEditOwn && event.creatorId === user?.id) ||
    (calendar.members?.find(m => m.user.id === user?.id)?.role ===
      'SELF_EDITOR' &&
      event.creatorId === user?.id)

  const { mutate: deleteEvent } = useMutation({
    mutationFn: () => eventService.deleteEvent(event.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', calendar.id] })
      toast.success('Event deleted successfully')
      onClose()
    },
    onError: () => {
      toast.error('Failed to delete event')
    }
  })

  return (
    <>
      <div className='fixed inset-0 bg-black/90 flex items-center justify-center z-50'>
        <div className='bg-sidebar p-6 rounded-lg w-[400px] relative'>
          <button
            onClick={onClose}
            className='absolute right-4 top-4 hover:opacity-70 transition-opacity'
          >
            <X size={24} />
          </button>

          <h2 className='text-xl font-bold mb-4'>{event.name}</h2>

          <div className='space-y-4'>
            {event.description && (
              <div>
                <h3 className='text-sm text-gray-400'>Description</h3>
                <p>{event.description}</p>
              </div>
            )}

            <div>
              <h3 className='text-sm text-gray-400'>Date & Time</h3>
              <p>
                {new Date(event.date).toLocaleDateString()},{' '}
                {new Date(event.date).toLocaleTimeString()}
              </p>
              <p>Duration: {event.duration} minutes</p>
            </div>

            {event.category && (
              <div>
                <h3 className='text-sm text-gray-400'>Category</h3>
                <p>{event.category}</p>
              </div>
            )}

            {canEditEvent && (
              <div className='flex justify-end gap-2 mt-6'>
                <Button
                  onClick={() => setShowEditModal(true)}
                  className='bg-blue-500/10 hover:bg-blue-500/20'
                >
                  <Edit className='w-4 h-4 mr-2' />
                  Edit
                </Button>
                <Button
                  onClick={() => deleteEvent()}
                  className='bg-red-500/10 hover:bg-red-500/20'
                >
                  <Trash className='w-4 h-4 mr-2' />
                  Delete
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showEditModal && (
        <CreateEventModal
          calendarId={calendar.id}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          event={event}
        />
      )}
    </>
  )
}
