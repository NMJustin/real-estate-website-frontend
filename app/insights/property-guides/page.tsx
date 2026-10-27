import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import ArticlesContent from '@/components/insights/ArticlesContent'

export const metadata: Metadata = generatePageMetadata({
  title: 'Property Guides | Ingata Real Estate Rwanda',
  description: 'Comprehensive property guides for buying, selling, renting, and investing in real estate in Rwanda.',
  path: '/insights/property-guides',
  keywords: [
    'property guides',
    'buying guides',
    'selling guides',
    'renting guides',
    'real estate education',
  ],
})

export default function PropertyGuidesPage() {
  return <ArticlesContent />
}
