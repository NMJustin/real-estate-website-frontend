import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import { CategoryListing } from '@/components/property/CategoryListing'

export const metadata: Metadata = generatePageMetadata({
  title: 'Properties for Rent | Ingata Real Estate Rwanda',
  description: 'Browse rental properties and homes for rent in Rwanda.',
  path: '/properties/for-rent',
  keywords: [
    'properties for rent',
    'rental properties',
    'homes for rent',
    'rental homes',
  ],
})

export default function ForRentPage() {
  return <CategoryListing title="Properties for Rent" query={{ transactionType: 'RENT' }} />
}
