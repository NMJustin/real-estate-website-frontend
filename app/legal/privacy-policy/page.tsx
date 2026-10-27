import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import PrivacyPolicyContent from '@/components/legal/PrivacyPolicyContent'

export const metadata: Metadata = generatePageMetadata({
  title: 'Privacy Policy | Ingata Real Estate Rwanda',
  description: 'Learn how Ingata Real Estate collects, uses, and protects your personal data in compliance with Rwandan data protection laws.',
  path: '/legal/privacy-policy',
  keywords: [
    'privacy policy',
    'data protection',
    'personal data',
    'Rwanda privacy law',
  ],
})

export default function PrivacyPolicyPage() {
  return <PrivacyPolicyContent />
}
