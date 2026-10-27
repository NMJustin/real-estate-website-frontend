import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import { CategoryListing } from '@/components/property/CategoryListing'

export const metadata: Metadata = generatePageMetadata({
  title: 'New Developments | Ingata Real Estate Rwanda',
  description: 'Discover new-build homes and upcoming real estate developments in Rwanda.',
  path: '/properties/new-developments',
  keywords: [
    'new developments',
    'new builds',
    'off-plan properties',
    'upcoming projects',
    'new construction',
  ],
})

export default function NewDevelopmentsPage() {
  return <CategoryListing title="New Developments" query={{ newDevelopment: 'true' }} />
}
