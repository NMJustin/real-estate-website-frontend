import DevelopmentForm from '@/components/admin/DevelopmentForm';

export default async function EditDevelopment({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  return <DevelopmentForm developmentId={id} />;
}
