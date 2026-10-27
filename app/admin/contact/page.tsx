'use client'

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Trash2,
  Mail,
  Phone,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Send,
  Inbox,
  CheckCircle2,
  Clock,
  MessageSquare,
  Check,
} from 'lucide-react';
import { adminApi } from '@/services/api';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string | null;
  subject?: string | null;
  message: string;
  status: string;
  createdAt: string;
}

interface ApiResponse {
  success?: boolean;
  data?: ContactMessage[];
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
  NEW: 'bg-emerald-100 text-emerald-800',
  READ: 'bg-blue-100 text-blue-800',
  RESPONDED: 'bg-purple-100 text-purple-800',
  ARCHIVED: 'bg-slate-100 text-slate-600',
};

const formatLabel = (value?: string | null) => {
  if (!value) return '—';
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (date: string) => {
  if (!date) return '—';
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return '—';
  return parsedDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export default function ContactMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);

  const [replySubject, setReplySubject] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [replyError, setReplyError] = useState('');
  const [replySuccess, setReplySuccess] = useState('');

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  const fetchMessages = async () => {
    try {
      setIsLoading(true);
      setError('');

      const response = await adminApi.getContactMessages({
        page,
        limit,
        search: searchTerm || undefined,
        status: statusFilter || undefined,
      });

      const result = response as ApiResponse;
      const data = result.data ?? [];
      setMessages(data);

      if (result.pagination?.totalPages) {
        setTotalPages(result.pagination.totalPages);
      } else if (result.total !== undefined) {
        setTotalPages(Math.max(1, Math.ceil(result.total / limit)));
      } else {
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Failed to load contact messages:', err);
      setError(err instanceof Error ? err.message : 'Failed to load messages.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, [page, searchTerm, statusFilter]);

  const filteredMessages = useMemo(() => {
    return messages.filter((msg) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        msg.name.toLowerCase().includes(query) ||
        msg.email.toLowerCase().includes(query) ||
        (msg.subject && msg.subject.toLowerCase().includes(query)) ||
        msg.message.toLowerCase().includes(query);

      const matchesStatus = !statusFilter || msg.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [messages, searchTerm, statusFilter]);

  const handleOpenMessage = async (msg: ContactMessage) => {
    setSelectedMessage(msg);
    setReplySubject(`Re: ${msg.subject || 'Your message to Ingata Real Estate'}`);
    setReplyMessage('');
    setReplyError('');
    setReplySuccess('');

    if (msg.status === 'NEW') {
      try {
        await adminApi.updateContactMessage(msg.id, { status: 'READ' });
        setMessages((prev) =>
          prev.map((item) => (item.id === msg.id ? { ...item, status: 'READ' } : item))
        );
        setSelectedMessage({ ...msg, status: 'READ' });
      } catch (err) {
        console.error('Failed to mark message as read:', err);
      }
    }
  };

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMessage) return;

    try {
      setIsSendingReply(true);
      setReplyError('');
      setReplySuccess('');

      await adminApi.replyToContactMessage(selectedMessage.id, {
        subject: replySubject.trim(),
        message: replyMessage.trim(),
      });

      setReplySuccess('Reply sent successfully via email!');
      setSuccessNotice(`Reply sent to ${selectedMessage.email}`);
      setSelectedMessage((prev) => (prev ? { ...prev, status: 'RESPONDED' } : null));

      setMessages((prev) =>
        prev.map((item) =>
          item.id === selectedMessage.id ? { ...item, status: 'RESPONDED' } : item
        )
      );

      setReplyMessage('');
      setTimeout(() => {
        setReplySuccess('');
      }, 4000);
    } catch (err) {
      console.error('Failed to send reply:', err);
      setReplyError(err instanceof Error ? err.message : 'Failed to send reply email.');
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await adminApi.updateContactMessage(id, { status: newStatus });
      setMessages((prev) =>
        prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
      );
      if (selectedMessage && selectedMessage.id === id) {
        setSelectedMessage({ ...selectedMessage, status: newStatus });
      }
      setSuccessNotice(`Message status updated to ${formatLabel(newStatus)}`);
      setTimeout(() => setSuccessNotice(''), 3000);
    } catch (err) {
      console.error('Failed to update status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update status');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setIsDeleting(true);
      await adminApi.deleteContactMessage(deleteId);
      if (selectedMessage && selectedMessage.id === deleteId) {
        setSelectedMessage(null);
      }
      setDeleteId(null);
      await fetchMessages();
    } catch (err) {
      console.error('Failed to delete message:', err);
      setError(err instanceof Error ? err.message : 'Failed to delete message.');
    } finally {
      setIsDeleting(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setStatusFilter('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">User Messages</h1>
          <p className="mt-1 text-sm text-slate-500">
            View messages sent through the website contact form and reply directly to users.
          </p>
        </div>
      </div>

      {successNotice && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-600" />
          <span>{successNotice}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
          <AlertCircle className="h-5 w-5 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by sender, email, subject, or message content..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition shadow-sm"
          />
        </div>

        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-700 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition shadow-sm cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="NEW">New</option>
            <option value="READ">Read</option>
            <option value="RESPONDED">Responded</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          {(searchTerm || statusFilter) && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-600 hover:bg-slate-50 transition shadow-sm"
            >
              <X className="h-4 w-4" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className={`${selectedMessage ? 'lg:col-span-6' : 'lg:col-span-12'} transition-all`}>
          <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <div className="h-9 w-9 animate-spin rounded-full border-3 border-emerald-500 border-t-transparent mb-3" />
                <p className="text-sm">Loading messages...</p>
              </div>
            ) : filteredMessages.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                <div className="h-16 w-16 rounded-2xl bg-slate-50 flex items-center justify-center mb-3">
                  <Inbox className="h-8 w-8 text-slate-300" />
                </div>
                <p className="text-base font-semibold text-slate-700">No messages found</p>
                <p className="text-xs text-slate-400 mt-1">
                  {searchTerm || statusFilter
                    ? 'Try adjusting your search query or filters.'
                    : 'Customer messages from the contact page will appear here.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {filteredMessages.map((msg) => {
                  const isSelected = selectedMessage?.id === msg.id;
                  const isNew = msg.status === 'NEW';
                  return (
                    <div
                      key={msg.id}
                      onClick={() => handleOpenMessage(msg)}
                      className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSelected ? 'bg-emerald-50/60 border-l-4 border-emerald-500' : ''
                      } ${isNew ? 'bg-emerald-50/20 font-medium' : ''}`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                              STATUS_COLORS[msg.status] || 'bg-slate-100 text-slate-700'
                            }`}
                          >
                            {formatLabel(msg.status)}
                          </span>
                          <span className="text-sm font-semibold text-slate-900 truncate">
                            {msg.name}
                          </span>
                          <span className="text-xs text-slate-400 hidden sm:inline">&bull;</span>
                          <span className="text-xs text-slate-500 truncate hidden sm:inline">
                            {msg.email}
                          </span>
                        </div>

                        <p className="text-sm text-slate-800 truncate mb-1">
                          {msg.subject || '(No subject)'}
                        </p>

                        <p className="text-xs text-slate-500 line-clamp-1">{msg.message}</p>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                        <div className="flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="h-3.5 w-3.5" />
                          <span>{formatDate(msg.createdAt)}</span>
                        </div>

                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteId(msg.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition"
                          title="Delete message"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-slate-100 bg-slate-50 text-xs text-slate-500">
                <span>
                  Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    disabled={page <= 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <button
                    disabled={page >= totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {selectedMessage && (
          <div className="lg:col-span-6 space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm overflow-hidden p-6 space-y-6">
              <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        STATUS_COLORS[selectedMessage.status] || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {formatLabel(selectedMessage.status)}
                    </span>
                    <span className="text-xs text-slate-400">
                      Received {formatDate(selectedMessage.createdAt)}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {selectedMessage.subject || '(No subject)'}
                  </h2>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setSelectedMessage(null)}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
                    title="Close preview"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 space-y-2 border border-slate-100 text-sm">
                <div className="flex items-center gap-2 text-slate-700">
                  <span className="font-semibold text-slate-900">{selectedMessage.name}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600">
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="inline-flex items-center gap-1.5 text-emerald-700 hover:underline"
                  >
                    <Mail className="h-3.5 w-3.5 text-emerald-600" />
                    {selectedMessage.email}
                  </a>
                  {selectedMessage.phone && (
                    <a
                      href={`tel:${selectedMessage.phone}`}
                      className="inline-flex items-center gap-1.5 text-slate-700 hover:underline"
                    >
                      <Phone className="h-3.5 w-3.5 text-slate-500" />
                      {selectedMessage.phone}
                    </a>
                  )}
                </div>

                <div className="pt-2 flex items-center gap-2">
                  <span className="text-xs text-slate-500">Update status:</span>
                  <select
                    value={selectedMessage.status}
                    onChange={(e) => handleUpdateStatus(selectedMessage.id, e.target.value)}
                    className="text-xs px-2.5 py-1 rounded-lg border border-slate-200 bg-white font-medium outline-none focus:ring-1 focus:ring-emerald-500 cursor-pointer"
                  >
                    <option value="NEW">New</option>
                    <option value="READ">Read</option>
                    <option value="RESPONDED">Responded</option>
                    <option value="ARCHIVED">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Message Content
                </p>
                <div className="rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-800 leading-relaxed whitespace-pre-wrap">
                  {selectedMessage.message}
                </div>
              </div>

              <div className="border-t border-slate-100 pt-5">
                <div className="flex items-center gap-2 mb-3">
                  <Send className="h-4 w-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Send Email Reply to {selectedMessage.name}
                  </h3>
                </div>
                <form onSubmit={handleSendReply} className="space-y-3">
                  <div>
                    <input
                      type="text"
                      value={replySubject}
                      onChange={(e) => setReplySubject(e.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      placeholder="Subject"
                    />
                  </div>
                  <div>
                    <textarea
                      value={replyMessage}
                      onChange={(e) => setReplyMessage(e.target.value)}
                      rows={4}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
                      placeholder="Your reply message..."
                    />
                  </div>
                  {replyError && (
                    <div className="text-sm text-red-600">{replyError}</div>
                  )}
                  {replySuccess && (
                    <div className="text-sm text-emerald-600">{replySuccess}</div>
                  )}
                  <button
                    type="submit"
                    disabled={isSendingReply}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {isSendingReply ? 'Sending...' : 'Send Reply'}
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-slate-900">Delete message?</h2>
                <p className="mt-1 text-sm text-slate-500">
                  This action cannot be undone. The message will be permanently removed.
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                disabled={isDeleting}
                className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete Message'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
