import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import { CategoryListing } from '@/components/property/CategoryListing'

export const metadata: Metadata = generatePageMetadata({
  title: 'Land & Plots for Sale | Ingata Real Estate Rwanda',
  description: 'Browse land and plots available for development in Rwanda.',
  path: '/properties/land',
  keywords: [
    'land for sale',
    'plots',
    'land Rwanda',
    'development land',
    'land plots',
  ],
})

export default function LandPage() {
  return <CategoryListing title="Land & Plots" query={{ propertyType: 'LAND' }} />
}
