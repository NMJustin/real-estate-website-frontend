'use client'

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  MessageSquareQuote,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { adminApi } from '@/services/api';

interface Testimonial {
  id: string;
  name: string;
  content: string;
  role?: string | null;
  company?: string | null;
  rating?: number | null;
  isActive: boolean;
  displayOrder?: number | null;
  createdAt: string;
}

interface ApiResponse {
  success?: boolean;
  data?: Testimonial[];
  testimonials?: Testimonial[];
  total?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

const formatDate = (date: string) => {
  if (!date) return '—';
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return '—';
  return parsedDate.toLocaleDateString();
};

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  const fetchTestimonials = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await adminApi.getTestimonials({
        page,
        limit,
        search: searchTerm || undefined,
        isActive: statusFilter || undefined,
      });

      const result = response as ApiResponse;
      const testimonialData = result.data ?? result.testimonials ?? [];

      setTestimonials(testimonialData);

      if (result.pagination?.totalPages) {
        setTotalPages(result.pagination.totalPages);
      } else if (result.total !== undefined) {
        setTotalPages(Math.max(1, Math.ceil(result.total / limit)));
      } else {
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Failed to load testimonials:', err);
      setError(err instanceof Error ? err.message : 'Failed to load testimonials.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials();
  }, [page, searchTerm, statusFilter]);

  const filteredTestimonials = useMemo(() => {
    return testimonials.filter((testimonial) => {
      const matchesSearch =
        !searchTerm ||
        testimonial.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        testimonial.content.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || 
        (statusFilter === 'active' && testimonial.isActive) ||
        (statusFilter === 'inactive' && !testimonial.isActive);
      return matchesSearch && matchesStatus;
    });
  }, [testimonials, searchTerm, statusFilter]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await adminApi.deleteTestimonial(deleteId);
      setDeleteId(null);
      await fetchTestimonials();
    } catch (err) {
      console.error('Failed to delete testimonial:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete testimonial.');
    } finally {
      setIsDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPage(1);
  };

  const hasFilters = searchTerm || statusFilter;

  const renderStars = (rating: number | null) => {
    if (!rating) return '—';
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <MessageSquareQuote className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-slate-900">Testimonials</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Manage client testimonials and reviews.
          </p>
        </div>

        <Link
          href="/admin/testimonials/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-emerald-700"
        >
          <Plus className="h-5 w-5" />
          Add Testimonial
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Unable to load testimonials</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError('')}
            className="rounded p-1 hover:bg-red-100"
            aria-label="Dismiss error"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="relative sm:col-span-2">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => {
                setSearchTerm(event.target.value);
                setPage(1);
              }}
              placeholder="Search by name or content..."
              className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(event.target.value);
              setPage(1);
            }}
            className="rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>

        {hasFilters && (
          <button
            type="button"
            onClick={clearFilters}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <X className="h-4 w-4" />
            Clear filters
          </button>
        )}
      </div>

      {/* Testimonials Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Client
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Testimonial
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Rating
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Created
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500">
                    Loading testimonials...
                  </td>
                </tr>
              ) : filteredTestimonials.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <MessageSquareQuote className="mx-auto h-10 w-10 text-slate-300" />
                    <p className="mt-3 font-medium text-slate-700">No testimonials found</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your search or add a new testimonial.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredTestimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="transition hover:bg-slate-50">
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="font-medium text-slate-900">{testimonial.name}</div>
                      <div className="text-xs text-slate-500">
                        {testimonial.role && testimonial.company
                          ? `${testimonial.role} at ${testimonial.company}`
                          : testimonial.role || testimonial.company || 'Client'}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="line-clamp-2 text-sm text-slate-600 max-w-md">{testimonial.content}</p>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span className="text-amber-500 text-sm">{renderStars(testimonial.rating ?? null)}</span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          testimonial.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {testimonial.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                      {formatDate(testimonial.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/testimonials/${testimonial.id}/edit`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                          <Pencil className="h-3.5 w-3.5" /> Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteId(testimonial.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && filteredTestimonials.length > 0 && (
          <div className="flex items-center justify-between border-t border-slate-200 px-5 py-4">
            <p className="text-sm text-slate-500">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="inline-flex items-center gap-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Delete testimonial?</h2>
                <p className="mt-1 text-sm text-slate-500">
                  This action cannot be undone. The testimonial will be permanently removed.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Testimonial'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
