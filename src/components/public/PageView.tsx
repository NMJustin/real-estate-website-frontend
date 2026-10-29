import React from 'react';

interface PageData {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  isPublished: boolean;
}

interface PageViewProps {
  page: PageData;
}

export default function PageView({ page }: PageViewProps) {
  return (
    <main className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <article className="mx-auto max-w-3xl rounded-2xl bg-white px-5 py-8 shadow-sm ring-1 ring-slate-200 sm:px-10 sm:py-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
          Ingata Real Estate
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
          {page.title}
        </h1>
        {page.content && (
          <div
            className="mt-10 prose prose-slate max-w-none text-sm leading-7 text-slate-700 sm:text-base"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        )}
      </article>
    </main>
  );
}
