import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import PropertyDisclaimerContent from '@/components/legal/PropertyDisclaimerContent'

export const metadata: Metadata = generatePageMetadata({
  title: 'Property Listing Disclaimer | Ingata Real Estate Rwanda',
  description: 'Disclaimer regarding property information accuracy and verification on Ingata Real Estate listings.',
  path: '/legal/property-listing-disclaimer',
  keywords: [
    'property disclaimer',
    'listing terms',
    'property information',
  ],
})

export default function PropertyDisclaimerPage() {
  return <PropertyDisclaimerContent />
}
