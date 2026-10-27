import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import VisionContent from '@/components/about/VisionContent'

export const metadata: Metadata = generatePageMetadata({
  title: 'Our Vision - Ingata Real Estate Rwanda',
  description: 'Discover Ingata Real Estate\'s vision to become a trusted and respected real estate partner known for professional service and customer satisfaction.',
  path: '/about/vision',
  keywords: [
    'vision',
    'future goals',
    'real estate vision',
    'trusted partner',
    'customer satisfaction',
  ],
})

export default function VisionPage() {
  return <VisionContent />
}
