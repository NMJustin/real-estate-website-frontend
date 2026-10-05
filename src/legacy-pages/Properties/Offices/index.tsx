'use client'

import { CategoryListing } from '../../../components/property/CategoryListing'

export default function Offices() {
  return <CategoryListing title="Offices" query={{ propertyType: 'OFFICES' }} />
}
