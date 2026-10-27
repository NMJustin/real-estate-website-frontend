import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import { CategoryListing } from '@/components/property/CategoryListing'

export const metadata: Metadata = generatePageMetadata({
  title: 'Office Spaces for Rent & Sale | Ingata Real Estate Rwanda',
  description: 'Browse office spaces and business premises available in Rwanda.',
  path: '/properties/offices',
  keywords: [
    'office spaces',
    'business premises',
    'offices for rent',
    'office for sale',
    'commercial office',
  ],
})

export default function OfficesPage() {
  return <CategoryListing title="Office Spaces" query={{ propertyType: 'OFFICES' }} />
}
