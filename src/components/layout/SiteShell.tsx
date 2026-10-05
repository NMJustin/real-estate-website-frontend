'use client'

import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { Footer } from './Footer'
import { Header } from './Header'

export function SiteShell({ children }: { children: ReactNode }) {
  const isAdminRoute = usePathname().startsWith('/admin')

  if (isAdminRoute) return <>{children}</>

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Header />
      <main className="flex-1 w-full flex flex-col">{children}</main>
      <Footer />
    </div>
  )
}
