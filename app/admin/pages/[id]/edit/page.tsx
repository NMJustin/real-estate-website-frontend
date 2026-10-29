import PageForm from '@/components/admin/PageForm';

export default async function EditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <PageForm pageId={id} />;
}
