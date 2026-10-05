import { LegacyAdminRoute } from '@/components/routing/LegacyAdminRoute'

export default async function LegacyAdminPage({
  params,
}: {
  params: Promise<{ segments: string[] }>
}) {
  const { segments } = await params
  return <LegacyAdminRoute segments={segments} />
}
