import { userService } from '@/services/user.service'
import { IUser } from '@/types/user.types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Field } from '../ui/fields/Field'
import { Button } from '../ui/buttons/Button'
import { SubmitHandler, useForm } from 'react-hook-form'
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

  const { mutate } = useMutation<any>({
    mutationFn: (data: any) => userService.updateUser(user.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profile', user.id] })
      toast.success('Profile updated')
      onClose()
    }
  })

  const onSubmit: SubmitHandler<any> = data => {
    mutate(data)
  }

  return (
    <div className='fixed inset-0 bg-black/90 flex items-center justify-center'>
      <div className='bg-sidebar p-6 rounded-lg w-[400px]'>
        <h2 className='text-xl font-bold mb-4'>Edit Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Field
            {...register('name')}
            id='name'
            label='Name'
            placeholder='Name'
          />
          <Field
            {...register('email')}
            label='Email'
            id='email'
            placeholder='Email'
            type='email'
          />
          <Field
            {...register('country')}
            id='country'
            placeholder='Country'
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
