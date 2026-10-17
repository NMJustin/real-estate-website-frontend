import { Suspense } from 'react'
import { Metadata } from 'next'
import PropertyDetails from '@/legacy-pages/PropertyDetails'
import { CategoryListing } from '@/components/property/CategoryListing'
import { generatePropertyMetadata } from '@/utils/metadata'

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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ propertySlug: string }>
}): Promise<Metadata> {
  const { propertySlug } = await params

  // Check if it's a category route
  const category = propertyCategoryRoutes[propertySlug.toLowerCase()]
  if (category) {
    return {
      title: `${category.title} | Ingata Real Estate`,
      description: `Browse ${category.title.toLowerCase()} available in Rwanda. Find your perfect property with Ingata Real Estate.`,
    }
  }

  // Fetch property data for dynamic metadata
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'
    const response = await fetch(`${apiUrl}/properties/${propertySlug}`, {
      next: { revalidate: 3600 },
    })

    if (response.ok) {
      const data = await response.json()
      const property = data.data

      if (property) {
        const primaryImage = property.propertyImages?.find((img: any) => img.isPrimary)?.imageUrl || property.propertyImages?.[0]?.imageUrl

        return generatePropertyMetadata({
          title: property.title,
          description: property.description,
          imageUrl: primaryImage,
          price: property.price,
          location: property.location || property.district,
          propertyType: property.propertyType,
          transactionType: property.transactionType,
          slug: property.slug,
        })
      }
    }
  } catch (error) {
    console.error('Error fetching property for metadata:', error)
  }

  // Fallback metadata
  return {
    title: 'Property Details | Ingata Real Estate',
    description: 'View property details on Ingata Real Estate.',
  }
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
