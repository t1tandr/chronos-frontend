'use client'

import { Button } from '@/components/ui/buttons/Button'
import { Field } from '@/components/ui/fields/Field'
import { Heading } from '@/components/ui/Heading'
import { authService } from '@/services/auth.service'
import { useMutation } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { userStore } from '@/store/userStore'
import { IAuthResponse } from '@/types/user.types'

const loginScheme = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters long')
})

const registerScheme = loginScheme.extend({
  name: z.string().min(3, 'Name must be at least 3 characters long')
})

type LoginFormType = z.infer<typeof loginScheme>
type RegisterFormType = z.infer<typeof registerScheme>

export function Auth() {
  const { setUser } = userStore()

  const [isLogin, setIsLogin] = useState(true)

  const {
    register,
    handleSubmit,
    reset,
    unregister,
    formState: { errors }
  } = useForm<LoginFormType | RegisterFormType>({
    resolver: zodResolver(isLogin ? loginScheme : registerScheme),
    mode: 'onBlur'
  })

  const { push } = useRouter()

  const { mutate } = useMutation<IAuthResponse>({
    mutationKey: ['auth'],
    mutationFn: data =>
      authService.main(isLogin ? 'login' : 'registration', data),
    onSuccess: data => {
      setUser(data.user)
      toast.success('Success')
      reset()
      push('/')
    },
    onError: e => {
      toast.error(e.message)
    }
  })

  const osSubmit: SubmitHandler<any> = data => {
    mutate(data)
  }

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <form className='w-1/3 m-auto shadow bg-sidebar rounded-xl p-layout'>
        <Heading title='Auth' />

        <Field
          {...register('email', { required: 'Email is required' })}
          id='email'
          label='Email'
          placeholder='Email'
          type='email'
          extra='mb-4'
          error={errors.email?.message}
        />

        {isLogin ? null : (
          <Field
            {...register('name', { required: 'Name is required' })}
            id='name'
            label='Name'
            placeholder='Name'
            extra='mb-4'
          />
        )}

        <Field
          {...register('password', { required: 'Password is required' })}
          id='password'
          label='Password'
          placeholder='Password'
          type='password'
          extra='mb-10'
          error={errors.password?.message}
        />

        <div className='flex items-center gap-5 justify-center '>
          {isLogin ? (
            <div className='flex items-center gap-5'>
              <Button
                type='submit'
                onClick={handleSubmit(osSubmit)}
              >
                Login
              </Button>
              <Button
                type='button'
                onClick={() => setIsLogin(false)}
                className='bg-primary text-sm outline-none border-none'
              >
                Switch to registration
              </Button>
            </div>
          ) : (
            <div>
              <Button
                type='submit'
                onClick={handleSubmit(osSubmit)}
              >
                Registration
              </Button>
              <Button
                type='button'
                onClick={() => {
                  setIsLogin(true)
                  unregister('name')
                }}
                className='bg-primary text-sm outline-none border-none'
              >
                Switch to login
              </Button>
            </div>
          )}
        </div>
      </form>
    </div>
  )
}
