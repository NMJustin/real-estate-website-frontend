import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: 'Ingata Real Estate - Find Your Dream Property in Rwanda',
  description: 'Discover residential, commercial, and investment properties across Rwanda. Expert real estate services including property sales, rentals, management, and valuation.',
  path: '/',
  keywords: [
    'real estate Rwanda',
    'properties for sale Rwanda',
    'houses for sale Kigali',
    'apartments for rent Rwanda',
    'commercial property Rwanda',
    'land for sale Rwanda',
    'property management Rwanda',
    'real estate agents Rwanda',
  ],
})

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
