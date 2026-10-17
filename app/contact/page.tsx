import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import Contact from '@/legacy-pages/Contact'

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact Us - Get in Touch with Ingata Real Estate',
  description: 'Contact Ingata Real Estate for property inquiries, listings, valuations, and real estate services in Rwanda. Our team is ready to help you find your perfect property.',
  path: '/contact',
  keywords: [
    'contact Ingata Real Estate',
    'real estate contact Rwanda',
    'property inquiry Rwanda',
    'real estate agents Rwanda',
  ],
})

export default function ContactPage() {
  return <Contact />
}
