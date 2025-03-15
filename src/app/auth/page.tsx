import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import { Auth } from '@/pages/Auth'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Auth',
  description: 'Authentication page',
  robots: NO_INDEX_PAGE
}

export default function AuthPage() {
  return <Auth />
}
