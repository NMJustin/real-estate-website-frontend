'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { adminApi } from '@/services/api';

interface Page {
  id: string;
  title: string;
  slug: string;
  content: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  isPublished: boolean;
}

export default function PageForm({ pageId }: { pageId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!pageId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [isPublished, setIsPublished] = useState(true);

  const editing = Boolean(pageId);

  useEffect(() => {
    loadData();
  }, [pageId]);

  const loadData = async () => {
    try {
      setLoading(true);
      if (pageId) {
        const pageRes = await adminApi.getAdminPage(pageId);
        const page = (pageRes as { data: Page }).data;
        setTitle(page.title);
        setSlug(page.slug);
        setContent(page.content || '');
        setMetaTitle(page.metaTitle || '');
        setMetaDescription(page.metaDescription || '');
        setIsPublished(page.isPublished);
      }
    } catch (err) {
      console.error('Failed to load page:', err);
      setError(err instanceof Error ? err.message : 'Failed to load page');
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (value: string) => {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!editing) {
      setSlug(generateSlug(value));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const data = {
        title,
        slug: slug || generateSlug(title),
        content: content || null,
        metaTitle: metaTitle || null,
        metaDescription: metaDescription || null,
        isPublished,
      };

      if (editing) {
        await adminApi.updatePage(pageId!, data);
      } else {
        await adminApi.createPage(data);
      }
      router.push('/admin/pages');
    } catch (err) {
      setError(err instanceof Error ? err.message : editing ? 'Failed to update page' : 'Failed to create page');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/pages" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-emerald-600">
            <ArrowLeft className="h-4 w-4" />
            Back to Pages
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">{editing ? 'Edit Page' : 'Add Page'}</h1>
        </div>
      </div>

      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Error</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-slate-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
                required
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Page title"
              />
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-medium text-slate-700">
                Slug <span className="text-red-500">*</span>
              </label>
              <div className="mt-1 flex rounded-lg border border-slate-300 bg-white">
                <span className="flex items-center border-r border-slate-300 bg-slate-50 px-3 py-2 text-sm text-slate-500">
                  /
                </span>
                <input
                  type="text"
                  id="slug"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  required
                  className="flex-1 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="page-slug"
                />
              </div>
              <p className="mt-1 text-xs text-slate-500">
                The URL path for this page. Only lowercase letters, numbers, and hyphens.
              </p>
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-slate-700">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={12}
                className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="Page content (HTML or plain text)"
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="metaTitle" className="block text-sm font-medium text-slate-700">
                  SEO Title
                </label>
                <input
                  type="text"
                  id="metaTitle"
                  value={metaTitle}
                  onChange={(e) => setMetaTitle(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="Meta title for search engines"
                />
              </div>

              <div>
                <label htmlFor="metaDescription" className="block text-sm font-medium text-slate-700">
                  SEO Description
                </label>
                <input
                  type="text"
                  id="metaDescription"
                  value={metaDescription}
                  onChange={(e) => setMetaDescription(e.target.value)}
                  className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                  placeholder="Meta description for search engines"
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="isPublished"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label htmlFor="isPublished" className="text-sm font-medium text-slate-700">
                Published
              </label>
              <p className="text-xs text-slate-500">
                Unpublished pages are not visible on the public website.
              </p>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Link
            href="/admin/pages"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? 'Saving...' : editing ? 'Update Page' : 'Create Page'}
          </button>
        </div>
      </form>
    </div>
  );
}
