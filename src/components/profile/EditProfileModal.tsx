import { userService } from '@/services/user.service'
import { IUser } from '@/types/user.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Field } from '../ui/fields/Field'
import { Button } from '../ui/buttons/Button'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface EditProfileModalProps {
  user: IUser
  isOpen: boolean
  onClose: () => void
}

export function EditProfileModal({
  user,
  isOpen,
  onClose
}: EditProfileModalProps) {
  const queryClient = useQueryClient()
  const { register, handleSubmit } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email,
      country: user.country || ''
    }
  })

  const { mutate } = useMutation({
    mutationFn: (data: any) => userService.updateUser(user.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['profile', user.id])
      toast.success('Profile updated')
      onClose()
    }
  })

  return (
    <div className='fixed inset-0 bg-black/50 flex items-center justify-center'>
      <div className='bg-sidebar p-6 rounded-lg w-[400px]'>
        <h2 className='text-xl font-bold mb-4'>Edit Profile</h2>
        <form onSubmit={handleSubmit(mutate)}>
          <Field
            {...register('name')}
            label='Name'
          />
          <Field
            {...register('email')}
            label='Email'
            type='email'
          />
          <Field
            {...register('country')}
            label='Country'
          />

          <div className='flex justify-end gap-2 mt-4'>
            <Button
              type='button'
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type='submit'>Save</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
