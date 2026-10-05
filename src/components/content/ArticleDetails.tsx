'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '@/services/api'

type Article = {
  title: string
  slug: string
  excerpt?: string | null
  content: string
  featuredImage?: string | null
  publicationStatus: string
  publishedAt?: string | null
  category?: { name: string } | null
  author?: { name: string } | null
}

export default function ArticleDetails({ slug }: { slug: string }) {
  const [article, setArticle] = useState<Article | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getArticle(slug)
      .then((response) => {
        const result = response as { data: Article }
        if (result.data.publicationStatus !== 'PUBLISHED') {
          setError('This article is not available.')
          return
        }
        setArticle(result.data)
      })
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load this article.')
      })
  }, [slug])

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <article className="mx-auto max-w-3xl px-4 sm:px-6">
        <Link href="/insights/articles" className="text-emerald-700 hover:underline">
          ← Back to articles
        </Link>
        {error ? (
          <p role="alert" className="mt-8 text-red-700">{error}</p>
        ) : !article ? (
          <p className="mt-8 text-slate-600">Loading article…</p>
        ) : (
          <>
            {article.featuredImage && (
              <img src={article.featuredImage} alt="" className="mt-8 w-full rounded-xl object-cover" />
            )}
            <header className="mt-8">
              {article.category && <p className="font-medium text-emerald-700">{article.category.name}</p>}
              <h1 className="mt-2 text-4xl font-bold text-slate-900">{article.title}</h1>
              {article.excerpt && <p className="mt-4 text-xl text-slate-600">{article.excerpt}</p>}
              <p className="mt-4 text-sm text-slate-500">
                {[article.author?.name, article.publishedAt && new Date(article.publishedAt).toLocaleDateString()]
                  .filter(Boolean)
                  .join(' · ')}
              </p>
            </header>
            <div className="prose prose-slate mt-8 max-w-none whitespace-pre-wrap">{article.content}</div>
          </>
        )}
      </article>
    </main>
  )
}
