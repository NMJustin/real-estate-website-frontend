import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import { CategoryListing } from '@/components/property/CategoryListing'

export const metadata: Metadata = generatePageMetadata({
  title: 'Warehouses & Industrial Properties | Ingata Real Estate Rwanda',
  description: 'Browse warehouses, storage facilities, and industrial properties in Rwanda.',
  path: '/properties/warehouses',
  keywords: [
    'warehouses',
    'industrial properties',
    'storage facilities',
    'warehouse for rent',
    'industrial space',
  ],
})

export default function WarehousesPage() {
  return <CategoryListing title="Warehouses" query={{ propertyType: 'WAREHOUSES' }} />
}
