'use client'

import { CategoryListing } from '../../../components/property/CategoryListing'

export default function Apartments() {
  return <CategoryListing title="Apartments" query={{ propertyType: 'APARTMENTS' }} />
}
