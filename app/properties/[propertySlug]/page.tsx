import { Suspense } from 'react'
import PropertyDetails from '@/legacy-pages/PropertyDetails'

export default async function PropertyDetailsPage({
  params,
}: {
  params: Promise<{ propertySlug: string }>
}) {
  const { propertySlug } = await params
  return (
    <Suspense fallback={<main className="mx-auto max-w-7xl px-4 py-16 text-slate-500">Loading property…</main>}>
      <PropertyDetails propertySlug={propertySlug} />
    </Suspense>
  )
}
