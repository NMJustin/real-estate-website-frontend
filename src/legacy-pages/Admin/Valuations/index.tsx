'use client'

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  TrendingUp,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Trash2,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { adminApi } from '../../../services/api';

interface Valuation {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  propertyType?: string | null;
  propertyAddress?: string | null;
  estimatedValue?: string | null;
  message?: string | null;
  status?: string;
  property?: { title: string } | null;
  createdAt: string;
}

interface ApiResponse {
  success?: boolean;
  data?: Valuation[];
  valuations?: Valuation[];
  total?: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-700',
  REVIEWING: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-600',
};

const formatLabel = (value: string) => {
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (date: string) => {
  if (!date) return '—';
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return '—';
  return parsedDate.toLocaleDateString();
};

export default function Valuations() {
  const [valuations, setValuations] = useState<Valuation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedValuation, setSelectedValuation] = useState<Valuation | null>(null);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  const fetchValuations = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await adminApi.getValuations({
        page,
        limit,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
      });

      const result = response as ApiResponse;
      const valuationData = result.data ?? result.valuations ?? [];

      setValuations(valuationData);

      if (result.pagination?.totalPages) {
        setTotalPages(result.pagination.totalPages);
      } else if (result.total !== undefined) {
        setTotalPages(Math.max(1, Math.ceil(result.total / limit)));
      } else {
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Failed to load valuations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load valuations.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchValuations();
  }, [page, searchTerm, statusFilter]);

  const filteredValuations = useMemo(() => {
    return valuations.filter((item) => {
      const matchesSearch =
        !searchTerm ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || item.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [valuations, searchTerm, statusFilter]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await adminApi.updateValuation(id, { status: newStatus });
      await fetchValuations();
    } catch (err) {
      console.error('Failed to update valuation status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update valuation status.');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await adminApi.deleteValuation(deleteId);
      setDeleteId(null);
      if (selectedValuation?.id === deleteId) {
        setSelectedValuation(null);
      }
      await fetchValuations();
    } catch (err) {
      console.error('Failed to delete valuation:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete valuation.');
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-emerald-600" />
          <h1 className="text-2xl font-bold text-slate-900">Property Valuations</h1>
        </div>
        <p className="mt-1 text-sm text-slate-500">
          Manage property valuation requests and assessments.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Unable to load valuations</p>
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
              placeholder="Search by client name or email..."
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
            <option value="PENDING">Pending</option>
            <option value="REVIEWING">Reviewing</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
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

      {/* Valuations Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Client
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Property / Details
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Received
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">
                    Loading valuations...
                  </td>
                </tr>
              ) : filteredValuations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <TrendingUp className="mx-auto h-10 w-10 text-slate-300" />
                    <p className="mt-3 font-medium text-slate-700">No valuation requests found</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your search or filter settings.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredValuations.map((valuation) => (
                  <tr key={valuation.id} className="transition hover:bg-slate-50">
                    <td className="whitespace-nowrap px-5 py-4">
                      <div className="font-medium text-slate-900">{valuation.name}</div>
                      <div className="text-xs text-slate-500">{valuation.email}</div>
                    </td>
                    <td className="px-5 py-4">
                      {valuation.property && (
                        <div className="mb-1 text-xs font-semibold text-emerald-600">
                          Property: {valuation.property.title}
                        </div>
                      )}
                      <div className="text-xs text-slate-500">
                        {valuation.propertyType || '—'} · {valuation.estimatedValue || 'No value provided'}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4">
                      <select
                        value={valuation.status || 'PENDING'}
                        onChange={(e) => handleStatusUpdate(valuation.id, e.target.value)}
                        className={`rounded-lg px-2.5 py-1 text-xs font-medium border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500 ${
                          STATUS_COLORS[valuation.status || 'PENDING'] ?? 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        <option value="PENDING">Pending</option>
                        <option value="REVIEWING">Reviewing</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3.5 w-3.5 text-slate-400" />
                        {formatDate(valuation.createdAt)}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setSelectedValuation(valuation)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteId(valuation.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
                        >
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

        {/* Pagination */}
        {!isLoading && filteredValuations.length > 0 && (
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

      {/* View Details Modal */}
      {selectedValuation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start justify-between border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Valuation Request Details</h2>
                <p className="text-xs text-slate-500">Requested on {formatDate(selectedValuation.createdAt)}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedValuation(null)}
                className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4 py-4">
              <div>
                <span className="text-xs font-medium uppercase text-slate-400">Client Name</span>
                <p className="font-semibold text-slate-900">{selectedValuation.name}</p>
              </div>

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <span className="text-xs font-medium uppercase text-slate-400">Email</span>
                  <p className="flex items-center gap-1.5 text-sm text-slate-700">
                    <Mail className="h-4 w-4 text-slate-400" />
                    <a href={`mailto:${selectedValuation.email}`} className="text-emerald-600 hover:underline">
                      {selectedValuation.email}
                    </a>
                  </p>
                </div>
                {selectedValuation.phone && (
                  <div>
                    <span className="text-xs font-medium uppercase text-slate-400">Phone</span>
                    <p className="flex items-center gap-1.5 text-sm text-slate-700">
                      <Phone className="h-4 w-4 text-slate-400" />
                      <a href={`tel:${selectedValuation.phone}`} className="text-emerald-600 hover:underline">
                        {selectedValuation.phone}
                      </a>
                    </p>
                  </div>
                )}
              </div>

              {selectedValuation.property && (
                <div className="rounded-lg bg-emerald-50 p-3 text-sm text-emerald-900">
                  <span className="font-semibold">Associated Property:</span> {selectedValuation.property.title}
                </div>
              )}

              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                <div>
                  <span className="text-xs font-medium uppercase text-slate-400">Property Type</span>
                  <p className="text-sm text-slate-700">{selectedValuation.propertyType || '—'}</p>
                </div>
                <div>
                  <span className="text-xs font-medium uppercase text-slate-400">Estimated Value</span>
                  <p className="text-sm text-slate-700">{selectedValuation.estimatedValue || '—'}</p>
                </div>
              </div>

              {selectedValuation.propertyAddress && (
                <div>
                  <span className="text-xs font-medium uppercase text-slate-400">Property Address</span>
                  <p className="text-sm text-slate-700">{selectedValuation.propertyAddress}</p>
                </div>
              )}

              {selectedValuation.message && (
                <div>
                  <span className="text-xs font-medium uppercase text-slate-400">Additional Message</span>
                  <div className="mt-1 rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-700 whitespace-pre-wrap">
                    {selectedValuation.message}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
              <button
                type="button"
                onClick={() => setSelectedValuation(null)}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Delete valuation request?</h2>
                <p className="mt-1 text-sm text-slate-500">
                  This action cannot be undone. The valuation request will be permanently removed.
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
                {isDeleting ? 'Deleting...' : 'Delete Valuation'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}