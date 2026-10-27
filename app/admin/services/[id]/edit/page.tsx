import ServiceForm from '@/components/admin/ServiceForm';

export default async function EditService({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  return <ServiceForm serviceId={id} />;
}
