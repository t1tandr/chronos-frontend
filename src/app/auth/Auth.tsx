'use client'

import { Field } from '@/components/ui/fields/Field'
import { Heading } from '@/components/ui/Heading'
import { authService } from '@/services/auth.service'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

export function Auth() {
  const { register, handleSubmit, reset } = useForm({
    mode: 'onBlur'
  })

  const [isLogin, setIsLogin] = useState(true)

  const { push } = useRouter()

  const { mutate } = useMutation({
    mutationKey: ['auth'],
    mutationFn: data =>
      authService.main(isLogin ? 'login' : 'registration', data),
    onSuccess() {
      toast.success('Success')
      reset()
      push('/')
    }
  })

  const osSubmit: SubmitHandler<any> = data => {
    mutate(data)
  }

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <form className='w-1/4 m-auto shadow bg-sidebar rounded-xl p-layout'>
        <Heading title='Auth' />

        <Field
          {...register('email', { required: 'Email is required' })}
          id='email'
          label='Email'
          placeholder='Email'
          type='email'
          extra='mb-4'
        />
      </form>
    </div>
  )
}
