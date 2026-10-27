import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import ArticlesContent from '@/components/insights/ArticlesContent'

export const metadata: Metadata = generatePageMetadata({
  title: 'Real Estate Articles & Education | Ingata Real Estate Rwanda',
  description: 'Comprehensive guides, market analysis, and expert insights to help you make informed real estate decisions in Rwanda.',
  path: '/insights/articles',
  keywords: [
    'real estate articles',
    'property guides',
    'real estate education',
    'market analysis',
    'investment tips',
  ],
})

export default function ArticlesPage() {
  return <ArticlesContent />
}
