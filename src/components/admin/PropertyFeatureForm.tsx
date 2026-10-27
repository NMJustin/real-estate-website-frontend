'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { adminApi } from '@/services/api';

interface PropertyFeature {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
}

export default function PropertyFeatureForm({ featureId }: { featureId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!featureId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const editing = Boolean(featureId);

  useEffect(() => {
    if (featureId) {
      loadData();
    }
  }, [featureId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const featureRes = await adminApi.getPropertyFeature(featureId!);
      const feature = (featureRes as { data: PropertyFeature }).data;

      setName(feature.name);
      setSlug(feature.slug);
    } catch (err) {
      console.error('Failed to load feature:', err);
      setError(err instanceof Error ? err.message : 'Failed to load feature');
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

  const handleNameChange = (value: string) => {
    setName(value);
    setSlug(generateSlug(value));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const data = {
        name,
        slug: slug || generateSlug(name),
      };

      if (editing) {
        await adminApi.updatePropertyFeature(featureId!, data);
      } else {
        await adminApi.createPropertyFeature(data);
      }
      router.push('/admin/property-features');
    } catch (err) {
      setError(err instanceof Error ? err.message : editing ? 'Failed to update feature' : 'Failed to create feature');
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
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/property-features" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-emerald-600">
            <ArrowLeft className="h-4 w-4" />
            Back to Features
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">{editing ? 'Edit Property Feature' : 'Add Property Feature'}</h1>
        </div>
      </div>

      {error && (
        <div className="flex gap-2 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Feature Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="e.g., Swimming Pool, Parking, Balcony"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Slug
            </label>
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="e.g., swimming-pool, parking, balcony"
            />
            <p className="mt-1 text-xs text-slate-500">
              URL-friendly version of the name (auto-generated from name)
            </p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Link
            href="/admin/property-features"
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? 'Saving...' : editing ? 'Update Feature' : 'Create Feature'}
          </button>
        </div>
      </form>
    </div>
  );
}
