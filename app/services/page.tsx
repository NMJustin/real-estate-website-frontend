import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import Services from '@/legacy-pages/Services'

export const metadata: Metadata = generatePageMetadata({
  title: 'Our Services - Real Estate Solutions in Rwanda',
  description: 'Explore comprehensive real estate services from Ingata Real Estate including property sales, rentals, management, and valuation across Rwanda.',
  path: '/services',
  keywords: [
    'real estate services Rwanda',
    'property sales Rwanda',
    'property rentals Rwanda',
    'property management Rwanda',
    'property valuation Rwanda',
  ],
})

export default function ServicesPage() {
  return <Services />
}
