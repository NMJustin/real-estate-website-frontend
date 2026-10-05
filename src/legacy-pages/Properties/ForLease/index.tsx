'use client'

import { CategoryListing } from '../../../components/property/CategoryListing'

export default function ForLease() {
  return <CategoryListing title="Properties for Lease" query={{ transactionType: 'LEASE' }} />
}
