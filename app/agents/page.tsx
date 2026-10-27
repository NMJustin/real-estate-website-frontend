import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import AgentsContent from '@/components/agents/AgentsContent'

export const metadata: Metadata = generatePageMetadata({
  title: 'Our Team - Real Estate Agents | Ingata Real Estate Rwanda',
  description: 'Meet our experienced real estate agents. Connect with professionals for local expertise and personalized service in Rwanda.',
  path: '/agents',
  keywords: [
    'real estate agents',
    'our team',
    'property agents Rwanda',
    'real estate professionals',
  ],
})

export default function AgentsPage() {
  return <AgentsContent />
}
