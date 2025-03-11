import type { Metadata } from 'next'
import { Montserrat } from 'next/font/google'
import './globals.scss'
import { SITE_NAME } from '@/constants/seo.constants'
import { Providers } from './provider'
import { Toaster } from 'sonner'

export const metadata: Metadata = {
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`
  },
  description: 'Chronos is a time management app'
}

const montserrat = Montserrat({
  subsets: ['cyrillic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-montserrat',
  style: 'normal'
})

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang='en'>
      <body className={`${montserrat.className}`}>
        <Providers>
          {children}
          <Toaster
            theme='dark'
            position='top-right'
            duration={5000}
          />
        </Providers>
      </body>
    </html>
  )
}
