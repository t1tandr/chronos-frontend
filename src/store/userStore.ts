import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type UserType = {
  id: number
  name: string
  email: string
  country?: string | null
} | null

interface UserState {
  user: UserType
  isLoading: boolean
  setUser: (user: UserType) => void
  logout: () => void
}

export const userStore = create<UserState>()(
  persist(
    set => ({
      user: null,
      isLoading: false,
      setUser: (user: UserType) => set({ user }),
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
