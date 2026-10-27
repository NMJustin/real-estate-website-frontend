import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import { CategoryListing } from '@/components/property/CategoryListing'

export const metadata: Metadata = generatePageMetadata({
  title: 'Residential Properties | Ingata Real Estate Rwanda',
  description: 'Browse residential properties including homes, apartments, and villas in Rwanda.',
  path: '/properties/residential',
  keywords: [
    'residential properties',
    'homes',
    'residential real estate',
    'family homes',
    'residential apartments',
  ],
})

export default function ResidentialPage() {
  return <CategoryListing title="Residential Properties" query={{ propertyType: 'RESIDENTIAL' }} />
}
