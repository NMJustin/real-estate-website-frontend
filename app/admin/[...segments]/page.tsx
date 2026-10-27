import { redirect } from 'next/navigation'

export default async function LegacyAdminPage({
  params,
}: {
  params: Promise<{ segments: string[] }>
}) {
  const { segments } = await params
  // Redirect legacy admin routes to the admin dashboard
  redirect('/admin/dashboard')
}
