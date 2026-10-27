import { Metadata } from 'next'
import { generatePageMetadata } from '@/utils/metadata'
import ArticleDetails from '@/components/content/ArticleDetails'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params

  return generatePageMetadata({
    title: 'Article | Ingata Real Estate Rwanda',
    description: 'Read this article on Ingata Real Estate.',
    path: `/insights/articles/${slug}`,
  })
}

export default async function ArticleDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params

  return <ArticleDetails slug={slug} />
}
