import { IUser } from '@/types/user.types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UserState {
  user: IUser | null
  isLoading: boolean
  setUser: (user: IUser) => void
  logout: () => void
}

export const userStore = create<UserState>()(
  persist(
    set => ({
      user: null,
      isLoading: false,
      setUser: (user: IUser) => set({ user }),
      logout: () =>
        set({
          user: null,
          isLoading: false
        })
    }),
    {
      name: 'user-storage'
    }
  )
)
