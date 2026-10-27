import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import WhyChooseUsContent from '@/components/about/WhyChooseUsContent'

export const metadata: Metadata = generatePageMetadata({
  title: 'Why Choose Us - Ingata Real Estate Rwanda',
  description: 'Discover why customers trust Ingata Real Estate: professional expertise, local market knowledge, verified listings, customer focus, and transparent service.',
  path: '/about/why-choose-us',
  keywords: [
    'why choose us',
    'real estate benefits',
    'professional expertise',
    'local market knowledge',
    'verified listings',
  ],
})

export default function WhyChooseUsPage() {
  return <WhyChooseUsContent />
}
