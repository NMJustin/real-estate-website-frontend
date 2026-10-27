import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import PropertyValuationRequest from '@/components/content/PropertyValuationRequest'

export const metadata: Metadata = generatePageMetadata({
  title: 'Property Valuation Request - Ingata Real Estate Rwanda',
  description: 'Request a professional property valuation in Rwanda. Our team provides accurate market-driven property appraisals for sales, purchases, refinancing, and investments.',
  path: '/property-valuation',
  keywords: [
    'property valuation Rwanda',
    'real estate appraisal Rwanda',
    'property assessment',
    'property value Rwanda',
  ],
})

export default function PropertyValuationPage() {
  return <PropertyValuationRequest />
}
