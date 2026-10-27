import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import CoreValuesContent from '@/components/about/CoreValuesContent'

export const metadata: Metadata = generatePageMetadata({
  title: 'Our Core Values - Ingata Real Estate Rwanda',
  description: 'Learn about the core values that guide Ingata Real Estate: integrity, professionalism, transparency, customer focus, and more.',
  path: '/about/core-values',
  keywords: [
    'core values',
    'company values',
    'real estate ethics',
    'integrity',
    'professionalism',
  ],
})

export default function CoreValuesPage() {
  return <CoreValuesContent />
}
