'use client'

import { CategoryListing } from '../../../components/property/CategoryListing'

export default function Warehouses() {
  return <CategoryListing title="Warehouses" query={{ propertyType: 'WAREHOUSES' }} />
}
