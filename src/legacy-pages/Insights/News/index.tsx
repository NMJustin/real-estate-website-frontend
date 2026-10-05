'use client'

import { useEffect, useState } from 'react';
import { Link } from '@/navigation/legacy-router';
import api from '../../../services/api';

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  content?: string;
  featuredImage?: string;
  category?: string;
  publicationStatus?: string;
  publishedAt?: string;
  createdAt?: string;
};

export default function News() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');

  const categories = [
    'Property Market Updates',
    'Buying Guides',
    'Renting Guides',
    'Selling Guides',
    'Property Investment',
    'Property Management',
    'Homeownership',
    'Real Estate Trends',
    'Company Announcements',
    'New Developments'
  ];

  useEffect(() => {
    api.getArticles(selectedCategory)
      .then((response) => {
        const data = (response as { data: Article[] }).data || [];
        // Filter for published articles only
        const publishedArticles = data.filter(
          (article) => article.publicationStatus === 'PUBLISHED'
        );
        setArticles(publishedArticles);
      })
      .catch((err) => {
        setError('Unable to load news articles.');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <main className="bg-slate-50 py-12 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-64">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">Real Estate News & Insights</h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Stay informed with the latest property market updates, buying guides, investment tips, and company announcements.
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            <button
              onClick={() => setSelectedCategory('')}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === ''
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              All News
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-emerald-600 text-white'
                    : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800 text-sm text-center">{error}</p>
          </div>
        )}

        {/* Articles Grid */}
        {articles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <article
                key={article.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                {article.featuredImage ? (
                  <img
                    src={article.featuredImage}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-slate-200 flex items-center justify-center">
                    <span className="text-slate-400">No image</span>
                  </div>
                )}
                <div className="p-6">
                  {article.category && (
                    <span className="inline-block text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded mb-3">
                      {article.category}
                    </span>
                  )}
                  <h2 className="text-xl font-bold text-slate-900 mb-2 line-clamp-2">
                    <Link to={`/insights/articles/${article.slug}`} className="hover:text-emerald-600">
                      {article.title}
                    </Link>
                  </h2>
                  {article.excerpt && (
                    <p className="text-slate-600 text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                  )}
                  {article.publishedAt && (
                    <p className="text-slate-500 text-xs">{formatDate(article.publishedAt)}</p>
                  )}
                  <Link
                    to={`/insights/articles/${article.slug}`}
                    className="inline-block mt-4 text-emerald-600 font-medium text-sm hover:underline"
                  >
                    Read More →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-slate-600 mb-4">
              {selectedCategory
                ? `No news articles found in "${selectedCategory}"`
                : 'No news articles available at this time.'}
            </p>
            {selectedCategory && (
              <button
                onClick={() => setSelectedCategory('')}
                className="text-emerald-600 hover:underline text-sm font-medium"
              >
                View all news
              </button>
            )}
          </div>
        )}
      </div>
    </main>
  );
}
