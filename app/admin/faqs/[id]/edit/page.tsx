import FaqForm from '@/components/admin/FaqForm';

export default async function EditFAQ({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  return <FaqForm faqId={id} />;
}
