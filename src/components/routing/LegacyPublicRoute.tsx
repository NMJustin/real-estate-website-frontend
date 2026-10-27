import type { ComponentType } from 'react'
import { notFound } from 'next/navigation'
import DynamicPage from '@/components/content/DynamicPage'

const staticRoutes: Record<string, ComponentType> = {}

export function LegacyPublicRoute({ segments }: { segments: string[] }) {
  const path = `/${segments.join('/')}`
  const Page = staticRoutes[path]

  if (Page) return <Page />

  // Check for dynamic pages from database
  if (segments.length === 1) {
    return <DynamicPage slug={segments[0]} />
  }

  notFound()
}
