import ArticleForm from '@/components/admin/ArticleForm';

export default async function EditArticle({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  return <ArticleForm articleId={id} />;
}
