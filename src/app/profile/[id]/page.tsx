import { Header } from '@/components/header/Header'
import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import ProfilePage from '@/pages/ProfilePage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Main | Chronos',
  description: 'Authentication page',
  robots: NO_INDEX_PAGE
}
export default function Profile() {
  return (
    <>
      <Header />
      <ProfilePage />
    </>
  )
}
