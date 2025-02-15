import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import '../styles/globals.css'
import AnalyticsInitializer from '../components/AnalyticsInitializer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Huynh Analytics Dashboard',
  description: 'Analytics and A/B Testing Dashboard',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AnalyticsInitializer />
        {children}
      </body>
    </html>
  )
} 