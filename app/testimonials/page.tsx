import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import TestimonialsContent from '@/components/content/TestimonialsContent'

export const metadata: Metadata = generatePageMetadata({
  title: 'Client Testimonials - Ingata Real Estate Rwanda',
  description: 'Read what our clients say about their experience with Ingata Real Estate. Genuine testimonials from satisfied customers across Rwanda.',
  path: '/testimonials',
  keywords: [
    'client testimonials Rwanda',
    'real estate reviews Rwanda',
    'customer feedback',
    'property testimonials',
  ],
})

export default function TestimonialsPage() {
  return <TestimonialsContent />
}
