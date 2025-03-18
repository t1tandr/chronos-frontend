import { Button } from '@/components/ui/buttons/Button'
import { Field } from '@/components/ui/fields/Field'
import { calendarService } from '@/services/calendar.service'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { X } from 'lucide-react'

const createCalendarSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  color: z.string().optional(),
  isPublic: z.boolean().default(false)
})

type CreateCalendarFormType = z.infer<typeof createCalendarSchema>

interface CreateCalendarModalProps {
  isOpen: boolean
  onClose: () => void
}

export function CreateCalendarModal({
  isOpen,
  onClose
}: CreateCalendarModalProps) {
  const queryClient = useQueryClient()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<CreateCalendarFormType>({
    resolver: zodResolver(createCalendarSchema)
  })

  const { mutate, isPending } = useMutation({
    mutationFn: (data: CreateCalendarFormType) =>
      calendarService.createCalendar(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['my-calendars'] })
      toast.success('Calendar created successfully')
      reset()
      onClose()
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to create calendar')
    }
  })

  const onSubmit: SubmitHandler<any> = data => {
    mutate(data)
  }

  return (
    <div className='fixed inset-0 bg-black/90 flex items-center justify-center z-50'>
      <div className='bg-sidebar p-6 rounded-lg w-[400px] relative'>
        <button
          onClick={onClose}
          className='absolute cursor-pointer right-4 top-4 hover:opacity-70 transition-opacity'
        >
          <X size={24} />
        </button>

        <h2 className='text-xl font-bold mb-4'>Create Calendar</h2>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Field
            {...register('name')}
            id='name'
            label='Name'
            placeholder='Enter calendar name'
            error={errors.name?.message}
          />

          <Field
            {...register('description')}
            id='description'
            label='Description'
            placeholder='Enter calendar description'
            error={errors.description?.message}
          />

          <Field
            {...register('color')}
            id='color'
            label='Color'
            placeholder='Enter calendar color'
            error={errors.color?.message}
          />

          <div className='flex items-center mt-4 gap-2 mb-4'>
            <input
              type='checkbox'
              {...register('isPublic')}
              className='w-4 h-4'
            />
            <label className='text-sm'>Make calendar public</label>
          </div>

          <div className='flex justify-end gap-2'>
            <Button
              type='button'
              onClick={onClose}
              className='bg-transparent hover:bg-white/5'
            >
              Cancel
            </Button>
            <Button
              type='submit'
              disabled={isPending}
            >
              {isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
