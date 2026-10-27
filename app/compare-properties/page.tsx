import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import ComparePropertiesContent from '@/components/tools/ComparePropertiesContent'

export const metadata: Metadata = generatePageMetadata({
  title: 'Compare Properties | Ingata Real Estate Rwanda',
  description: 'Compare multiple properties side by side to make informed real estate decisions.',
  path: '/compare-properties',
  keywords: [
    'compare properties',
    'property comparison',
    'real estate comparison',
  ],
})

export default function ComparePropertiesPage() {
  return <ComparePropertiesContent />
}
