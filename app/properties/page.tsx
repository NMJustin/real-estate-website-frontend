import { Suspense } from 'react'
import PropertiesPage from '@/components/property/PropertiesPage'

export const dynamic = 'force-dynamic'

export default function PropertiesRoute() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-7xl px-4 py-16 text-slate-500">Loading properties…</main>}>
      <PropertiesPage />
    </Suspense>
  )
}
