import { Suspense } from 'react'
import PropertyDetails from '@/legacy-pages/PropertyDetails'
import { CategoryListing } from '@/components/property/CategoryListing'

const propertyCategoryRoutes: Record<string, { title: string; query: Record<string, string> }> = {
  apartments: { title: 'Apartments', query: { propertyType: 'APARTMENTS' } },
  commercial: { title: 'Commercial Properties', query: { propertyType: 'COMMERCIAL' } },
  'for-lease': { title: 'Properties for Lease', query: { transactionType: 'LEASE' } },
  'for-rent': { title: 'Properties for Rent', query: { transactionType: 'RENT' } },
  'for-sale': { title: 'Properties for Sale', query: { transactionType: 'SALE' } },
  houses: { title: 'Houses', query: { propertyType: 'HOUSES' } },
  land: { title: 'Land', query: { propertyType: 'LAND' } },
  'new-developments': { title: 'New Developments', query: { newDevelopment: 'true' } },
  offices: { title: 'Offices', query: { propertyType: 'OFFICES' } },
  residential: { title: 'Residential Properties', query: { propertyType: 'RESIDENTIAL' } },
  warehouses: { title: 'Warehouses', query: { propertyType: 'WAREHOUSES' } },
}

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ propertySlug: string }>
}) {
  const { propertySlug } = await params

  const category = propertyCategoryRoutes[propertySlug.toLowerCase()]
  if (category) {
    return <CategoryListing title={category.title} query={category.query} />
  }

  return (
    <Suspense fallback={<main className="mx-auto max-w-7xl px-4 py-16 text-slate-500">Loading property…</main>}>
      <PropertyDetails propertySlug={propertySlug} />
    </Suspense>
  )
}
