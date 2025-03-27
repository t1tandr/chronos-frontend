import { useState, useRef, useEffect } from 'react'
import { Search } from 'lucide-react'
import { useDebounce } from '@/hooks/useDebounce'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { calendarService } from '@/services/calendar.service'
import { Button } from '@/components/ui/buttons/Button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'

export function SearchCalendars() {
  const [searchQuery, setSearchQuery] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const debouncedSearch = useDebounce(searchQuery, 300)
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: searchResults } = useQuery({
    queryKey: ['calendar-search', debouncedSearch],
    queryFn: () => calendarService.searchCalendars(debouncedSearch),
    enabled: debouncedSearch.length > 2
  })

  const { mutate: joinCalendar } = useMutation({
    mutationFn: (calendarId: string) =>
      calendarService.joinCalendar(calendarId),
    onSuccess: async data => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ['participant-calendars'] }),
        queryClient.invalidateQueries({ queryKey: ['my-calendars'] }),
        queryClient.invalidateQueries({ queryKey: ['calendars'] })
      ])

      queryClient.setQueryData(['participant-calendars'], (old: any[]) => {
        if (!old) return [data]
        return [...old, data]
      })

      toast.success('Successfully joined calendar')
      setIsOpen(false)
      setSearchQuery('')
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to join calendar')
    }
  })

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      {isOpen && searchResults?.length > 0 && (
        <div className='fixed inset-0 bg-black/90 z-40' />
      )}

      <div
        className='relative z-50'
        ref={searchRef}
      >
        <div className='flex items-center px-3 h-10 bg-white/5 rounded-lg'>
          <Search className='w-4 h-4 text-gray-400' />
          <input
            type='text'
            placeholder='Search calendars...'
            className='bg-transparent border-none outline-none px-2 w-64'
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value)
              setIsOpen(true)
            }}
          />
        </div>

        {isOpen && searchResults && searchResults.length > 0 && (
          <div className='absolute top-full mt-2 w-[400px] -right-20 bg-sidebar rounded-lg shadow-lg border border-border p-2 max-h-[300px] overflow-y-auto'>
            {searchResults.map((calendar: any) => (
              <div
                key={calendar.id}
                className='flex items-center justify-between p-2 hover:bg-white/5 rounded group'
              >
                <div className='flex items-center gap-2'>
                  <div
                    className='w-3 h-3 rounded-full'
                    style={{ backgroundColor: calendar.color || '#3788d8' }}
                  />
                  <div>
                    <div className='font-medium'>{calendar.name}</div>
                    {calendar.description && (
                      <div className='text-sm text-gray-400 truncate max-w-[250px]'>
                        {calendar.description}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  onClick={() => joinCalendar(calendar.id)}
                  className='opacity-0 group-hover:opacity-100 transition-opacity'
                >
                  Join
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  )
}
