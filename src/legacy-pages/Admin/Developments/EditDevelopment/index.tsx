'use client'

import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from '@/navigation/legacy-router';
import { ArrowLeft, Save, AlertCircle, X, Upload } from 'lucide-react';
import { adminApi } from '../../../../services/api';

interface Development {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  location: string | null;
  developerName: string | null;
  status: string | null;
  completionDate: string | null;
  imageUrl: string | null;
  createdAt: string;
}

export default function EditDevelopment() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [developerName, setDeveloperName] = useState('');
  const [status, setStatus] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      const developmentRes = await adminApi.getDevelopment(id!);
      const development = (developmentRes as { data: Development }).data;

      setName(development.name);
      setSlug(development.slug);
      setDescription(development.description || '');
      setLocation(development.location || '');
      setDeveloperName(development.developerName || '');
      setStatus(development.status || '');
      setCompletionDate(development.completionDate ? development.completionDate.split('T')[0] : '');
      setImageUrl(development.imageUrl || '');
    } catch (err) {
      console.error('Failed to load development:', err);
      setError(err instanceof Error ? err.message : 'Failed to load development');
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

  const handleFileButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      return;
    }

    const file = files[0];
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type) || file.size > 100 * 1024 * 1024) {
      setError('Use JPG, PNG, WebP, or GIF files up to 100 MB.');
      return;
    }

    try {
      setUploading(true);
      setError('');
      const result = await adminApi.uploadDevelopmentMedia(file);
      setImageUrl(result.data.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to upload image.');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      await adminApi.updateDevelopment(id!, {
        name,
        slug: slug || generateSlug(name),
        description: description || null,
        location: location || null,
        developerName: developerName || null,
        status: status || null,
        completionDate: completionDate || null,
        imageUrl: imageUrl || null,
      });
      navigate('/admin/developments');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update development');
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
          <Link to="/admin/developments" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-emerald-600">
            <ArrowLeft className="h-4 w-4" />
            Back to Developments
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">Edit Development</h1>
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
              Development Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="e.g., Kigali Heights, Nyarutarama Residences"
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
              placeholder="e.g., kigali-heights, nyarutarama-residences"
            />
            <p className="mt-1 text-xs text-slate-500">
              URL-friendly version of the name (auto-generated from name)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="Brief description of the development"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="e.g., Kigali, Nyarutarama"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Developer Name
            </label>
            <input
              type="text"
              value={developerName}
              onChange={(e) => setDeveloperName(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="e.g., Rwanda Construction Ltd"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              <option value="">Not specified</option>
              <option value="PLANNING">Planning</option>
              <option value="UNDER_CONSTRUCTION">Under Construction</option>
              <option value="COMPLETED">Completed</option>
              <option value="ON_HOLD">On Hold</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Completion Date
            </label>
            <input
              type="date"
              value={completionDate}
              onChange={(e) => setCompletionDate(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Development Image
            </label>
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="hidden"
                onChange={(e) => handleFileUpload(e.target.files)}
                disabled={uploading}
              />
              <button
                type="button"
                onClick={handleFileButtonClick}
                disabled={uploading}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
              >
                <Upload className="h-4 w-4" />
                {uploading ? 'Uploading...' : 'Upload Image'}
              </button>
              <p className="text-xs text-slate-500">JPG, PNG, WebP, GIF up to 100MB</p>

              {imageUrl && (
                <div className="relative inline-block">
                  <img
                    src={imageUrl}
                    alt="Development preview"
                    className="h-32 w-32 rounded-lg object-cover border border-slate-200"
                  />
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="absolute -top-2 -right-2 rounded-full bg-red-500 p-1 text-white hover:bg-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Link
            to="/admin/developments"
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Update Development'}
          </button>
        </div>
      </form>
    </div>
  );
}
