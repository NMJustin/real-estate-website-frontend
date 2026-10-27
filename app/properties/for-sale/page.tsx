import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import { CategoryListing } from '@/components/property/CategoryListing'

export const metadata: Metadata = generatePageMetadata({
  title: 'Properties for Sale | Ingata Real Estate Rwanda',
  description: 'Browse properties for sale in Rwanda. Find your perfect property with Ingata Real Estate.',
  path: '/properties/for-sale',
  keywords: [
    'properties for sale',
    'houses for sale',
    'real estate for sale',
    'buy property',
  ],
})

export default function ForSalePage() {
  return <CategoryListing title="Properties for Sale" query={{ transactionType: 'SALE' }} />
}
