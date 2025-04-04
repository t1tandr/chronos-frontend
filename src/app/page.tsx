import { Header } from '@/components/header/Header'
import { NO_INDEX_PAGE } from '@/constants/seo.constants'
import DashboardPage from '@/pages/DashboardPage'
import { Metadata } from 'next'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Main | Chronos',
  description: 'Authentication page',
  robots: NO_INDEX_PAGE
}
export default function Home() {
  return (
    <>
      <Header />
      <DashboardPage />
    </>
  )
}
