import { redirect } from 'next/navigation'

export default async function LegacyAdminPage({
  params,
}: {
  params: Promise<{ segments: string[] }>
}) {
  const { segments } = await params
  const first = segments?.[0]?.toLowerCase()

  if (first === 'listings' || first === 'property-requests') {
    redirect('/admin/listing-requests')
  }

  // Redirect legacy admin routes to the admin dashboard
  redirect('/admin/dashboard')
}
