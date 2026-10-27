import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import { CategoryListing } from '@/components/property/CategoryListing'

export const metadata: Metadata = generatePageMetadata({
  title: 'Houses for Sale & Rent | Ingata Real Estate Rwanda',
  description: 'Browse houses and villas available in Rwanda. Find your perfect home with Ingata Real Estate.',
  path: '/properties/houses',
  keywords: [
    'houses',
    'villas',
    'houses for sale',
    'houses for rent',
    'detached houses',
  ],
})

export default function HousesPage() {
  return <CategoryListing title="Houses" query={{ propertyType: 'HOUSES' }} />
}
