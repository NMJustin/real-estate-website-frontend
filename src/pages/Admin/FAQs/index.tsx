import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus,
  Search,
  Pencil,
  Trash2,
  HelpCircle,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import { adminApi } from '../../../services/api';

interface Faq {
  id: string;
  question: string;
  answer: string;
  category?: string | null;
  order?: number;
  createdAt: string;
}

interface ApiResponse {
  success?: boolean;
  data?: Faq[];
  faqs?: Faq[];
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

export default function Faqs() {
  const [faqs, setFaqs] = useState<Faq[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const limit = 10;

  const fetchFaqs = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await adminApi.getAdminFaqs({
        page,
        limit,
        search: searchTerm || undefined,
      });

      const result = response as ApiResponse;
      const faqData = result.data ?? result.faqs ?? [];

      setFaqs(faqData);

      if (result.pagination?.totalPages) {
        setTotalPages(result.pagination.totalPages);
      } else if (result.total !== undefined) {
        setTotalPages(Math.max(1, Math.ceil(result.total / limit)));
      } else {
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Failed to load FAQs:', err);
      setError(err instanceof Error ? err.message : 'Failed to load FAQs.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, [page, searchTerm]);

  const filteredFaqs = useMemo(() => {
    return faqs.filter((faq) => {
      const matchesSearch =
        !searchTerm ||
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [faqs, searchTerm]);

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await adminApi.deleteAdminFaq(deleteId);
      setDeleteId(null);
      await fetchFaqs();
    } catch (err) {
      console.error('Failed to delete FAQ:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete FAQ.');
    } finally {
      setIsDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <HelpCircle className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Manage help center content and customer inquiries FAQs.
          </p>
        </div>

        <Link
          to="/admin/faqs/new"
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-5 py-2.5 font-medium text-white shadow-sm transition hover:bg-emerald-700"
        >
          <Plus className="h-5 w-5" />
          Add FAQ
        </Link>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Unable to load FAQs</p>
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
            onChange={(event) => {
              setSearchTerm(event.target.value);
              setPage(1);
            }}
            placeholder="Search questions or answers..."
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

      {/* FAQs Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Question / Answer
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Category
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
                  <td colSpan={4} className="px-5 py-12 text-center text-sm text-slate-500">
                    Loading FAQs...
                  </td>
                </tr>
              ) : filteredFaqs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-5 py-12 text-center">
                    <HelpCircle className="mx-auto h-10 w-10 text-slate-300" />
                    <p className="mt-3 font-medium text-slate-700">No FAQs found</p>
                    <p className="mt-1 text-sm text-slate-500">
                      Try changing your search or add a new FAQ.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredFaqs.map((faq) => (
                  <tr key={faq.id} className="transition hover:bg-slate-50">
                    <td className="px-5 py-4">
                      <div className="font-medium text-slate-900">{faq.question}</div>
                      <div className="mt-1 line-clamp-2 text-xs text-slate-500">{faq.answer}</div>
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                      {faq.category ? (
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          {faq.category}
                        </span>
                      ) : (
                        <span className="text-slate-400">General</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                      {formatDate(faq.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Link
                          to={`/admin/faqs/${faq.id}/edit`}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                          <Pencil className="h-4 w-4" />
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteId(faq.id)}
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

        {/* Pagination */}
        {!isLoading && filteredFaqs.length > 0 && (
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
                <h2 className="text-lg font-semibold text-slate-900">Delete FAQ?</h2>
                <p className="mt-1 text-sm text-slate-500">
                  This action cannot be undone. The question and answer will be removed from the help section.
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
                {isDeleting ? 'Deleting...' : 'Delete FAQ'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}