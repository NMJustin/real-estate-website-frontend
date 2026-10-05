'use client'

import { CategoryListing } from '../../../components/property/CategoryListing'

export default function Houses() {
  return <CategoryListing title="Houses" query={{ propertyType: 'HOUSES' }} />
}
