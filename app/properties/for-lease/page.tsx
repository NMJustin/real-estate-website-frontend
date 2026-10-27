import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import { CategoryListing } from '@/components/property/CategoryListing'

export const metadata: Metadata = generatePageMetadata({
  title: 'Properties for Lease | Ingata Real Estate Rwanda',
  description: 'Browse properties available for long-term lease in Rwanda.',
  path: '/properties/for-lease',
  keywords: [
    'properties for lease',
    'long-term lease',
    'commercial lease',
    'lease properties',
  ],
})

export default function ForLeasePage() {
  return <CategoryListing title="Properties for Lease" query={{ transactionType: 'LEASE' }} />
}
