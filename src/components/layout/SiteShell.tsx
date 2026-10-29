'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'
import { PageViewTracker } from '../analytics/PageViewTracker'
import { ConsentManager } from '../consent/ConsentManager'
import PropertyComparisonBar from '../property/PropertyComparisonBar'

export function SiteShell({ children }: { children: ReactNode }) {
  const isAdminRoute = usePathname().startsWith('/admin')

  return (
    <div className="min-h-screen flex flex-col font-sans">
      {!isAdminRoute && <PageViewTracker />}
      {!isAdminRoute && <ConsentManager />}
      {!isAdminRoute && <Header />}
      <main className="flex-1 w-full flex flex-col">{children}</main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <PropertyComparisonBar />}
    </div>
  )
}
