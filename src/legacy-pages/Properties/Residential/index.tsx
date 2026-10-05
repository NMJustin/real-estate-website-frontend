'use client'

import { CategoryListing } from '../../../components/property/CategoryListing'

export default function Residential() {
  return <CategoryListing title="Residential Properties" query={{ propertyType: 'RESIDENTIAL' }} />
}
