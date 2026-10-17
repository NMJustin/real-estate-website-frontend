import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'

export const metadata: Metadata = generatePageMetadata({
  title: 'Properties - Browse Real Estate Listings in Rwanda',
  description: 'Browse all available properties in Rwanda including houses, apartments, commercial spaces, and land. Find your perfect property with Ingata Real Estate.',
  path: '/properties',
  keywords: [
    'properties Rwanda',
    'real estate listings Rwanda',
    'houses for sale Rwanda',
    'apartments for rent Rwanda',
    'commercial property Rwanda',
    'land for sale Rwanda',
  ],
})

export default function PropertiesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
