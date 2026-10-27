'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import { adminApi } from '@/services/api';

interface Testimonial {
  id: string;
  name: string;
  content: string;
  role: string | null;
  company: string | null;
  rating: number | null;
  isActive: boolean;
  displayOrder: number | null;
}

export default function TestimonialForm({ testimonialId }: { testimonialId?: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(!!testimonialId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [role, setRole] = useState('');
  const [company, setCompany] = useState('');
  const [rating, setRating] = useState(5);
  const [isActive, setIsActive] = useState(true);
  const [displayOrder, setDisplayOrder] = useState(0);

  const editing = Boolean(testimonialId);

  useEffect(() => {
    if (testimonialId) {
      loadData();
    }
  }, [testimonialId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const testimonialRes = await adminApi.getAdminTestimonial(testimonialId!);
      const testimonial = (testimonialRes as { data: Testimonial }).data;

      setName(testimonial.name);
      setContent(testimonial.content);
      setRole(testimonial.role || '');
      setCompany(testimonial.company || '');
      setRating(testimonial.rating || 5);
      setIsActive(testimonial.isActive);
      setDisplayOrder(testimonial.displayOrder || 0);
    } catch (err) {
      console.error('Failed to load testimonial:', err);
      setError(err instanceof Error ? err.message : 'Failed to load testimonial');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const data = {
        name,
        content,
        role: role || null,
        company: company || null,
        rating,
        isActive,
        displayOrder,
      };

      if (editing) {
        await adminApi.updateTestimonial(testimonialId!, data);
      } else {
        await adminApi.createTestimonial(data);
      }
      router.push('/admin/testimonials');
    } catch (err) {
      setError(err instanceof Error ? err.message : editing ? 'Failed to update testimonial' : 'Failed to create testimonial');
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
          <Link href="/admin/testimonials" className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-emerald-600">
            <ArrowLeft className="h-4 w-4" />
            Back to Testimonials
          </Link>
          <h1 className="mt-2 text-2xl font-bold text-slate-900">{editing ? 'Edit Testimonial' : 'Add Testimonial'}</h1>
          <p className="mt-1 text-sm text-slate-500">
            {editing ? 'Update this client testimonial to reflect their experience with your real estate services.' : 'Add a client testimonial to showcase positive experiences with your real estate services.'}
          </p>
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
              Client Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="e.g., John Smith"
            />
            <p className="mt-1 text-xs text-slate-500">Full name of the client providing the testimonial</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Testimonial Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={4}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              placeholder="e.g., The team at Ingata Real Estate made finding my dream home incredibly easy. Their professionalism and attention to detail were outstanding."
            />
            <p className="mt-1 text-xs text-slate-500">The client's actual testimonial or review text</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Role
              </label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="e.g., CEO, Manager, Homeowner"
              />
              <p className="mt-1 text-xs text-slate-500">Client's job title or role</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Company
              </label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="e.g., ABC Corporation"
              />
              <p className="mt-1 text-xs text-slate-500">Client's company or organization</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Rating (1-5)
              </label>
              <select
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
              >
                <option value={1}>1 - Poor</option>
                <option value={2}>2 - Fair</option>
                <option value={3}>3 - Good</option>
                <option value={4}>4 - Very Good</option>
                <option value={5}>5 - Excellent</option>
              </select>
              <p className="mt-1 text-xs text-slate-500">Client's rating of your service</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={displayOrder}
                onChange={(e) => setDisplayOrder(Number(e.target.value))}
                className="w-full rounded-lg border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                placeholder="0"
              />
              <p className="mt-1 text-xs text-slate-500">Lower numbers appear first on the website</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isActive"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
            />
            <label htmlFor="isActive" className="text-sm text-slate-700">
              Active
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Link
            href="/admin/testimonials"
            className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
          >
            {saving ? 'Saving...' : editing ? 'Update Testimonial' : 'Create Testimonial'}
          </button>
        </div>
      </form>
    </div>
  );
}
