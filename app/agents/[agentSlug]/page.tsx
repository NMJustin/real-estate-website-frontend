import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import AgentProfileContent from '@/components/agents/AgentProfileContent'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ agentSlug: string }>
}): Promise<Metadata> {
  const { agentSlug } = await params

  return generatePageMetadata({
    title: 'Agent Profile | Ingata Real Estate Rwanda',
    description: `View agent profile and their property listings on Ingata Real Estate.`,
    path: `/agents/${agentSlug}`,
  })
}

export default async function AgentProfilePage({
  params,
}: {
  params: Promise<{ agentSlug: string }>
}) {
  const { agentSlug } = await params

  return <AgentProfileContent agentSlug={agentSlug} />
}
