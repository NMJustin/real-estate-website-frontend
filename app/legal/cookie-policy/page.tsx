import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import CookiePolicyContent from '@/components/legal/CookiePolicyContent'

export const metadata: Metadata = generatePageMetadata({
  title: 'Cookie Policy | Ingata Real Estate Rwanda',
  description: 'Learn how Ingata Real Estate uses cookies and similar tracking technologies on our website.',
  path: '/legal/cookie-policy',
  keywords: [
    'cookie policy',
    'privacy',
    'data protection',
  ],
})

export default function CookiePolicyPage() {
  return <CookiePolicyContent />
}
