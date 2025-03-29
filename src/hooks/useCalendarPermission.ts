import { userStore } from '@/store/userStore'
import { ICalendar } from '@/types/calendar.types'

export const useCalendarPermissions = (calendar: ICalendar | null) => {
  const { user } = userStore()

  if (!calendar || !user) {
    return {
      isOwner: false,
      canEdit: false,
      canEditOwn: false,
      canView: false,
      role: null
    }
  }

  const isOwner = calendar.ownerId === user.id
  const member = calendar.members?.find(m => m.user.id === user.id)
  const role = member?.role

  return {
    isOwner,
    canEdit: isOwner || role === 'EDITOR',
    canEditOwn: isOwner || role === 'EDITOR' || role === 'SELF_EDITOR',
    canView: isOwner || !!role || calendar.isPublic,
    role
  }
}
