import { Button } from '@/components/ui/buttons/Button'
import { Field } from '@/components/ui/fields/Field'
import { eventService } from '@/services/events.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { X } from 'lucide-react'
import { IEvent } from '@/types/event.types'

const createEventSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  startDate: z.string(),
  startTime: z.string(),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  color: z.string().optional(),
  category: z.enum(['ARRANGEMENT', 'TASK', 'REMINDER']).optional()
})

type CreateEventFormType = z.infer<typeof createEventSchema>

interface CreateEventModalProps {
  calendarId: string
  isOpen: boolean
  onClose: () => void
  event?: IEvent
  initialDate?: {
    date: string
    time?: string
  } | null
}

export function CreateEventModal({
  calendarId,
  isOpen,
  onClose,
  event,
  initialDate
}: CreateEventModalProps) {
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<CreateEventFormType>({
    resolver: zodResolver(createEventSchema),
    defaultValues: event
      ? {
          name: event.name,
          description: event.description,
          startDate: new Date(event.date).toISOString().split('T')[0],
          startTime: new Date(event.date).toTimeString().slice(0, 5),
          duration: event.duration,
          color: event.color,
          category: event.category
        }
      : initialDate
        ? {
            startDate: initialDate.date,
            startTime: initialDate.time || '00:00',
            duration: 60,
            color: '#3788d8'
          }
        : undefined
  })

  const { mutate: createMutation } = useMutation({
    mutationFn: (data: CreateEventFormType) => {
      const dateTime = new Date(`${data.startDate}T${data.startTime}`)
      return eventService.createEvent({
        name: data.name,
        description: data.description,
        date: dateTime.toISOString(),
        duration: data.duration,
        color: data.color,
        category: data.category,
        calendarId
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', calendarId] })
      toast.success('Event created successfully')
      reset()
      onClose()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to create event')
    }
  })

  const { mutate: updateMutation } = useMutation({
    mutationFn: (data: CreateEventFormType) => {
      const dateTime = new Date(`${data.startDate}T${data.startTime}`)
      return eventService.updateEvent(event!.id, {
        name: data.name,
        description: data.description,
        date: dateTime.toISOString(),
        duration: data.duration,
        color: data.color,
        category: data.category,
        calendarId
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events', calendarId] })
      toast.success('Event updated successfully')
      onClose()
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update event')
    }
  })

  const onSubmit = (data: CreateEventFormType) => {
    if (event) {
      updateMutation(data)
    } else {
      createMutation(data)
    }
  }

  return (
    <div className='fixed inset-0 bg-black/90 flex items-center justify-center z-50'>
      <div className='bg-sidebar p-6 rounded-lg w-[400px] relative'>
        <button
          onClick={onClose}
          className='absolute right-4 top-4 hover:opacity-70 transition-opacity'
        >
          <X size={24} />
        </button>

        <h2 className='text-xl font-bold mb-4'>Create Event</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Field
            {...register('name')}
            id='name'
            type='text'
            label='Name'
            placeholder='Enter event name'
            error={errors.name?.message}
          />

          <Field
            {...register('description')}
            id='description'
            type='text'
            label='Description'
            placeholder='Enter event description'
          />

          <div className='grid grid-cols-2 gap-4'>
            <Field
              {...register('startDate')}
              placeholder='Date'
              id='startDate'
              type='date'
              label='Date'
              error={errors.startDate?.message}
            />

            <Field
              {...register('startTime')}
              placeholder='Time'
              id='startTime'
              type='time'
              label='Time'
              error={errors.startTime?.message}
            />
          </div>

          <Field
            {...register('duration', { valueAsNumber: true })}
            placeholder='Duration'
            id='duration'
            type='number'
            label='Duration (minutes)'
            error={errors.duration?.message}
          />

          <Field
            {...register('color')}
            placeholder='Color'
            id='color'
            type='color'
            label='Color'
          />

          <select
            {...register('category')}
            className='w-full mb-4 p-2 rounded bg-transparent border border-border'
          >
            <option value='ARRANGEMENT'>Arrangement</option>
            <option value='TASK'>Task</option>
            <option value='REMINDER'>Reminder</option>
          </select>

          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type='submit'>{event ? 'Update' : 'Create'}</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
