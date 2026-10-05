import { LegacyPublicRoute } from '@/components/routing/LegacyPublicRoute'

export default async function LegacyPublicPage({
  params,
}: {
  params: Promise<{ segments: string[] }>
}) {
  const { segments } = await params
  return <LegacyPublicRoute segments={segments} />
}
