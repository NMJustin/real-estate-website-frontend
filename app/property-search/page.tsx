import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import PropertySearch from '@/components/content/PropertySearch'

export const metadata: Metadata = generatePageMetadata({
  title: 'Property Search - Ingata Real Estate Rwanda',
  description: 'Search for properties in Rwanda with advanced filters. Find homes, apartments, commercial spaces, and land for sale or rent.',
  path: '/property-search',
  keywords: [
    'property search Rwanda',
    'find property Rwanda',
    'real estate search',
    'property filters',
  ],
})

export default function PropertySearchPage() {
  return <PropertySearch />
}
