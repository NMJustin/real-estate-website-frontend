import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import OurCompany from '@/legacy-pages/About/OurCompany'

export const metadata: Metadata = generatePageMetadata({
  title: 'About Our Company - Ingata Real Estate Rwanda',
  description: 'Learn about Ingata Real Estate, Rwanda\'s premier real estate company. We provide property sales, rentals, management, and valuation services across the country.',
  path: '/about/our-company',
  keywords: [
    'about Ingata Real Estate',
    'real estate company Rwanda',
    'property management Rwanda',
    'real estate services Rwanda',
  ],
})

export default function OurCompanyPage() {
  return <OurCompany />
}
