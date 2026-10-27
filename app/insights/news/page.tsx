import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import NewsContent from '@/components/insights/NewsContent'

export const metadata: Metadata = generatePageMetadata({
  title: 'Real Estate News & Insights | Ingata Real Estate Rwanda',
  description: 'Stay informed with the latest property market updates, buying guides, investment tips, and company announcements in Rwanda.',
  path: '/insights/news',
  keywords: [
    'real estate news',
    'property market updates',
    'buying guides',
    'renting guides',
    'investment tips',
  ],
})

export default function NewsPage() {
  return <NewsContent />
}
