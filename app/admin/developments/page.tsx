'use client'

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  Building2,
  AlertCircle,
  X,
} from 'lucide-react';
import { adminApi } from '@/services/api';

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

interface ApiResponse {
  success?: boolean;
  data?: Development[];
  message?: string;
}

const formatDate = (date: string) => {
  if (!date) return '—';
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return '—';
  return parsedDate.toLocaleDateString();
};

export default function Developments() {
  const [developments, setDevelopments] = useState<Development[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchDevelopments = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await adminApi.getDevelopments();
      const result = response as ApiResponse;
      setDevelopments(result.data || []);
    } catch (err) {
      console.error('Failed to load developments:', err);
      setError(err instanceof Error ? err.message : 'Failed to load developments.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopments();
  }, []);

  const filteredDevelopments = useMemo(() => {
    return developments.filter((development) => {
      const matchesSearch =
        !searchTerm ||
        development.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        development.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (development.location && development.location.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (development.developerName && development.developerName.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesSearch;
    });
  }, [developments, searchTerm]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await adminApi.deleteDevelopment(deleteId);
      setDeleteId(null);
      await fetchDevelopments();
    } catch (err) {
      console.error('Failed to delete development:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete development.');
    } finally {
      setIsDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Building2 className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-slate-900">Developments</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Manage property developments and new projects
          </p>
        </div>

        <Link
          href="/admin/developments/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-emerald-700"
        >
          <Plus className="h-5 w-5" />
          Add Development
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Unable to load developments</p>
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
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search developments by name, location, or developer..."
            className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
          />
        </div>

        {searchTerm && (
          <button
            type="button"
            onClick={clearFilters}
            className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900"
          >
            <X className="h-4 w-4" />
            Clear search
          </button>
        )}
      </div>

      {/* Developments Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Development
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Location
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Developer
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Completion
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
                    Loading developments...
                  </td>
                </tr>
              ) : filteredDevelopments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <Building2 className="mx-auto h-10 w-10 text-slate-300" />
                    <p className="mt-3 font-medium text-slate-700">No developments found</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your search or add a new development.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredDevelopments.map((development) => (
                  <tr key={development.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900">{development.name}</div>
                      <div className="text-sm text-slate-500">{development.slug}</div>
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {development.location || '—'}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {development.developerName || '—'}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {development.status || '—'}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-500">
                      {formatDate(development.completionDate || '')}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          href={`/admin/developments/${development.id}/edit`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteId(development.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
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
                <h2 className="text-lg font-semibold text-slate-900">Delete development?</h2>
                <p className="mt-1 text-sm text-slate-500">
                  This action cannot be undone. Properties linked to this development will lose the association.
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
                {isDeleting ? 'Deleting...' : 'Delete Development'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
