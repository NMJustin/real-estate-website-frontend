import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import RequestViewing from '@/components/content/RequestViewing'

export const metadata: Metadata = generatePageMetadata({
  title: 'Request Property Viewing - Ingata Real Estate Rwanda',
  description: 'Schedule a property viewing in Rwanda. Request to visit properties of interest with our professional real estate agents.',
  path: '/request-viewing',
  keywords: [
    'property viewing Rwanda',
    'schedule property visit',
    'property tour Rwanda',
    'view real estate',
  ],
})

export default function RequestViewingPage() {
  return <RequestViewing />
}
