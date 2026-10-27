import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import TermsAndConditionsContent from '@/components/legal/TermsAndConditionsContent'

export const metadata: Metadata = generatePageMetadata({
  title: 'Terms & Conditions | Ingata Real Estate Rwanda',
  description: 'Terms and conditions for using the Ingata Real Estate website and services.',
  path: '/legal/terms-and-conditions',
  keywords: [
    'terms and conditions',
    'terms of use',
    'website terms',
  ],
})

export default function TermsAndConditionsPage() {
  return <TermsAndConditionsContent />
}
