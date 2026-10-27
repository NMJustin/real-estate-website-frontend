import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import { CategoryListing } from '@/components/property/CategoryListing'

export const metadata: Metadata = generatePageMetadata({
  title: 'Apartments for Sale & Rent | Ingata Real Estate Rwanda',
  description: 'Browse apartments and flats available in Rwanda. Find your perfect apartment with Ingata Real Estate.',
  path: '/properties/apartments',
  keywords: [
    'apartments',
    'flats',
    'apartments Rwanda',
    'apartments for sale',
    'apartments for rent',
  ],
})

export default function ApartmentsPage() {
  return <CategoryListing title="Apartments" query={{ propertyType: 'APARTMENTS' }} />
}
