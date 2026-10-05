'use client'

import { useEffect, useMemo, useState } from 'react';
import {
  Search,
  Users,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
  Mail,
  Phone,
  ShieldAlert
} from 'lucide-react';
import { adminApi } from '../../../services/api';

interface Role {
  id: number;
  name: string;
}

interface User {
  id: string;
  name: string | null;
  email: string;
  phone: string | null;
  isActive: boolean;
  canUploadPropertyMedia: boolean;
  createdAt: string;
  lastLoginAt: string | null;
  role: Role;
}

interface ApiResponse {
  success?: boolean;
  data?: User[];
  meta?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  message?: string;
}

const formatLabel = (value: string) => {
  return value
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

const formatDate = (date: string | null) => {
  if (!date) return '—';
  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return '—';
  return parsedDate.toLocaleDateString();
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const [usersResponse, rolesResponse] = await Promise.all([
        adminApi.getUsers({
          page,
          limit,
        }),
        adminApi.getRoles(),
      ]);
      
      const result = usersResponse as ApiResponse;
      setUsers(result.data ?? []);
      setRoles((rolesResponse as { data?: Role[] }).data ?? []);
      
      if (result.meta?.totalPages) {
        setTotalPages(result.meta.totalPages);
      } else {
        setTotalPages(1);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
      setError(err instanceof Error ? err.message : 'Failed to load users.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page]);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const nameMatch = user.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const emailMatch = user.email.toLowerCase().includes(searchTerm.toLowerCase());
      return !searchTerm || nameMatch || emailMatch;
    });
  }, [users, searchTerm]);

  const handleTogglePermission = async (userId: string, currentVal: boolean) => {
    try {
      await adminApi.updateUserMediaPermission(userId, !currentVal);
      // Update local state
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, canUploadPropertyMedia: !currentVal } : u));
    } catch (err) {
      console.error('Failed to update permission:', err);
      alert(err instanceof Error ? err.message : 'Failed to update permission.');
    }
  };

  const handleRoleChange = async (userId: string, roleId: number) => {
    try {
      await adminApi.updateUserRole(userId, roleId);
      // Reload users to get updated role data
      await fetchUsers();
    } catch (err) {
      console.error('Failed to update role:', err);
      alert(err instanceof Error ? err.message : 'Failed to update role.');
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
            <Users className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Manage system users and their media upload permissions.
          </p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Unable to load users</p>
            <p className="mt-1 text-sm">{error}</p>
          </div>
          <button
            type="button"
            onClick={() => setError('')}
            className="rounded p-1 hover:bg-red-100"
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
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name or email..."
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

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  User
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Contact
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Role
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Joined
                </th>
                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Media Upload
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center text-sm text-slate-500">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-5 py-12 text-center">
                    <Users className="mx-auto h-10 w-10 text-slate-300" />
                    <p className="mt-3 font-medium text-slate-700">No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isEligible = user.role.name === 'agent' || user.role.name === 'property_owner';
                  
                  return (
                    <tr key={user.id} className="transition hover:bg-slate-50">
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
                            {(user.name || user.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{user.name || 'No Name'}</div>
                            <div className="text-xs text-slate-500">{formatLabel(user.role.name)}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-sm text-slate-600">
                        <div className="flex flex-col gap-1">
                          <span className="flex items-center gap-1.5">
                            <Mail className="h-3.5 w-3.5 text-slate-400" />
                            {user.email}
                          </span>
                          {user.phone && (
                            <span className="flex items-center gap-1.5 text-slate-500">
                              <Phone className="h-3.5 w-3.5 text-slate-400" />
                              {user.phone}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                        <select
                          value={user.role?.id || ''}
                          onChange={(e) => handleRoleChange(user.id, Number(e.target.value))}
                          className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-medium outline-none focus:ring-2 focus:ring-emerald-500"
                        >
                          {roles.map((role) => (
                            <option key={role.id} value={role.id}>
                              {formatLabel(role.name)}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-center">
                        {isEligible ? (
                          <button
                            type="button"
                            onClick={() => handleTogglePermission(user.id, user.canUploadPropertyMedia)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                              user.canUploadPropertyMedia ? 'bg-emerald-600' : 'bg-slate-200'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                user.canUploadPropertyMedia ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        ) : (
                          <div className="flex justify-center text-slate-400" title="Only agents and property owners can have media upload permission">
                            <ShieldAlert className="h-5 w-5" />
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && filteredUsers.length > 0 && (
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
    </div>
  );
}
