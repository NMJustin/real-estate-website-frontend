import CategoryForm from '@/components/admin/CategoryForm';

export default async function EditCategory({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  return <CategoryForm categoryId={id} />;
}
