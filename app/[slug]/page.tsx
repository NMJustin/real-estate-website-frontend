import { notFound } from 'next/navigation';
import { api } from '@/services/api';
import PageView from '@/components/public/PageView';

interface PageData {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  isPublished: boolean;
}

async function getPage(slug: string): Promise<PageData | null> {
  try {
    const response = await api.getPageBySlug(slug);
    const data = (response as { data?: PageData }).data;
    return data || null;
  } catch (error) {
    console.error('Failed to fetch page:', error);
    return null;
  }
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) {
    return {
      title: 'Page Not Found',
    };
  }

  return {
    title: page.metaTitle || page.title,
    description: page.metaDescription || `Ingata Real Estate - ${page.title}`,
  };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPage(slug);

  if (!page) {
    notFound();
  }

  return <PageView page={page} />;
}
