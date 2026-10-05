import { Suspense } from 'react'
import PropertySearch from '@/legacy-pages/PropertySearch'

export default function PropertySearchPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-7xl px-4 py-16 text-slate-500">Loading property search…</main>}>
      <PropertySearch />
    </Suspense>
  )
}
