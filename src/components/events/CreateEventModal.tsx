import { Button } from '@/components/ui/buttons/Button'
import { Field } from '@/components/ui/fields/Field'
import { eventService } from '@/services/events.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { X } from 'lucide-react'

const createEventSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  date: z.string(),
  duration: z.number().min(1, 'Duration must be at least 1 minute'),
  color: z.string().optional(),
  category: z.enum(['MEETING', 'TASK', 'REMINDER']).optional()
})

type CreateEventFormType = z.infer<typeof createEventSchema>

interface CreateEventModalProps {
  calendarId: string
  isOpen: boolean
  onClose: () => void
}

export function CreateEventModal({
  calendarId,
  isOpen,
  onClose
}: CreateEventModalProps) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<CreateEventFormType>({
    resolver: zodResolver(createEventSchema)
  })

  const { mutate } = useMutation({
    mutationFn: (data: CreateEventFormType) =>
      eventService.createEvent({ ...data, calendarId }),
    onSuccess: () => {
      queryClient.invalidateQueries(['events', calendarId])
      toast.success('Event created successfully')
      onClose()
    }
  })

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

        <form onSubmit={handleSubmit(data => mutate(data))}>
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

          <Field
            {...register('date')}
            placeholder='Select Date and Time'
            id='date'
            type='datetime-local'
            label='Date and Time'
            error={errors.date?.message}
          />

          <Field
            {...register('duration', { valueAsNumber: true })}
            placeholder='Enter Duration'
            id='duration'
            type='number'
            label='Duration (minutes)'
            error={errors.duration?.message}
          />

          <Field
            {...register('color')}
            id='color'
            placeholder='Select Color'
            type='color'
            label='Color'
          />

          <select
            {...register('category')}
            className='w-full mb-4 p-2 rounded'
          >
            <option value=''>Select Category</option>
            <option value='MEETING'>Meeting</option>
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
            <Button type='submit'>Create</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
