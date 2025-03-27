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

  const isOwner = user.id === calendar.ownerId
  const member = calendar.members?.find(m => m.user.id === user.id)
  const role = member?.role

  return {
    isOwner,
    canEdit: isOwner || role === 'EDITOR',
    canEditOwn: isOwner || role === 'EDITOR' || role === 'SELF_EDITOR',
    canView:
      isOwner ||
      role === 'EDITOR' ||
      role === 'VIEWER' ||
      role === 'SELF_EDITOR' ||
      calendar.isPublic,
    role
  }
}
