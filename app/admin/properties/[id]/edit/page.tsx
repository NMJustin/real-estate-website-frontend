import PropertyForm from '@/components/admin/PropertyForm';

export default async function EditProperty({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  return <PropertyForm propertyId={id} />;
}
