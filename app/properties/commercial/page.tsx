import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import { CategoryListing } from '@/components/property/CategoryListing'

export const metadata: Metadata = generatePageMetadata({
  title: 'Commercial Properties | Ingata Real Estate Rwanda',
  description: 'Browse commercial properties, office spaces, and business locations in Rwanda.',
  path: '/properties/commercial',
  keywords: [
    'commercial properties',
    'office space',
    'business properties',
    'commercial real estate',
  ],
})

export default function CommercialPage() {
  return <CategoryListing title="Commercial Properties" query={{ propertyType: 'COMMERCIAL' }} />
}
