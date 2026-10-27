import PropertyFeatureForm from '@/components/admin/PropertyFeatureForm';

export default async function EditFeature({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  return <PropertyFeatureForm featureId={id} />;
}
