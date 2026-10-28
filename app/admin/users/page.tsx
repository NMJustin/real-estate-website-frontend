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
  ShieldAlert,
  ShieldCheck,
  Plus,
  Pencil,
  Trash2,
  Check,
  Lock,
  Loader2,
  UserCheck,
  UserX,
} from 'lucide-react';
import { adminApi } from '@/services/api';

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

const formatLabel = (value?: string | null) => {
  if (!value) return '—';
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

const uniqueRoles = (roles: Role[]) => {
  const unique = new Map<string, Role>();
  for (const role of roles) {
    const normalized = role.name.trim().toLowerCase();
    const existing = unique.get(normalized);
    if (!existing || (role.name === normalized && existing.name !== normalized)) {
      unique.set(normalized, { ...role, name: normalized });
    }
  }
  return [...unique.values()].sort((a, b) => a.name.localeCompare(b.name));
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 20;

  // Edit Modal State
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roleId: 0,
    isActive: true,
    canUploadPropertyMedia: false,
    password: '',
  });
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createFormData, setCreateFormData] = useState({
    name: '',
    email: '',
    phone: '',
    roleId: 0,
    password: '',
    canUploadPropertyMedia: false,
  });
  const [createSaving, setCreateSaving] = useState(false);
  const [createError, setCreateError] = useState('');

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
      const fetchedRoles = uniqueRoles((rolesResponse as { data?: Role[] }).data ?? []);
      setRoles(fetchedRoles);
      
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
      const phoneMatch = user.phone?.toLowerCase().includes(searchTerm.toLowerCase());
      const roleMatch = user.role?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return !searchTerm || nameMatch || emailMatch || phoneMatch || roleMatch;
    });
  }, [users, searchTerm]);

  const handleTogglePermission = async (userId: string, currentVal: boolean) => {
    try {
      await adminApi.updateUserMediaPermission(userId, !currentVal);
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, canUploadPropertyMedia: !currentVal } : u));
      setSuccessMessage('Media upload permission updated.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to update permission:', err);
      alert(err instanceof Error ? err.message : 'Failed to update permission.');
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await adminApi.deleteUser(userId);
      setUsers(prev => prev.filter(u => u.id !== userId));
      setSuccessMessage(`User ${userName} deleted successfully.`);
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete user.');
    }
  };

  // Open Edit Modal
  const openEditModal = (user: User) => {
    setEditingUser(user);
    setEditFormData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      roleId: user.role?.id || (roles[0]?.id || 0),
      isActive: user.isActive !== false,
      canUploadPropertyMedia: Boolean(user.canUploadPropertyMedia),
      password: '',
    });
    setEditError('');
  };

  // Submit Edit User
  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!editFormData.name.trim()) {
      setEditError('Name is required.');
      return;
    }
    if (!editFormData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(editFormData.email.trim())) {
      setEditError('Enter a valid email address.');
      return;
    }
    if (editFormData.password && editFormData.password.length < 8) {
      setEditError('Password must be at least 8 characters long.');
      return;
    }

    setEditSaving(true);
    setEditError('');

    try {
      const payload: Record<string, unknown> = {
        name: editFormData.name.trim(),
        email: editFormData.email.trim().toLowerCase(),
        phone: editFormData.phone.trim() || null,
        roleId: editFormData.roleId,
        isActive: editFormData.isActive,
        canUploadPropertyMedia: editFormData.canUploadPropertyMedia,
      };

      if (editFormData.password.trim()) {
        payload.password = editFormData.password.trim();
      }

      await adminApi.updateUser(editingUser.id, payload);

      setEditingUser(null);
      setSuccessMessage('User updated successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
      await fetchUsers();
    } catch (err) {
      console.error('Failed to update user:', err);
      setEditError(err instanceof Error ? err.message : 'Failed to update user.');
    } finally {
      setEditSaving(false);
    }
  };

  // Open Create Modal
  const openCreateModal = () => {
    setIsCreateModalOpen(true);
    setCreateFormData({
      name: '',
      email: '',
      phone: '',
      roleId: roles[0]?.id || 1,
      password: '',
      canUploadPropertyMedia: false,
    });
    setCreateError('');
  };

  // Submit Create User
  const handleSaveCreate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!createFormData.name.trim()) {
      setCreateError('Name is required.');
      return;
    }
    if (!createFormData.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createFormData.email.trim())) {
      setCreateError('Enter a valid email address.');
      return;
    }
    if (!createFormData.password || createFormData.password.length < 8) {
      setCreateError('Password must be at least 8 characters long.');
      return;
    }
    if (!createFormData.roleId) {
      setCreateError('Please select a role.');
      return;
    }

    setCreateSaving(true);
    setCreateError('');

    try {
      await adminApi.createUser({
        name: createFormData.name.trim(),
        email: createFormData.email.trim().toLowerCase(),
        phone: createFormData.phone.trim() || null,
        password: createFormData.password,
        roleId: createFormData.roleId,
        canUploadPropertyMedia: createFormData.canUploadPropertyMedia,
      });

      setIsCreateModalOpen(false);
      setSuccessMessage('New user created successfully.');
      setTimeout(() => setSuccessMessage(''), 3000);
      await fetchUsers();
    } catch (err) {
      console.error('Failed to create user:', err);
      setCreateError(err instanceof Error ? err.message : 'Failed to create user.');
    } finally {
      setCreateSaving(false);
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-emerald-600" />
            <h1 className="text-2xl font-bold text-slate-900">Users</h1>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Manage system users, assign roles, and configure media upload permissions.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Global Alerts */}
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

      {successMessage && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-emerald-700">
          <Check className="h-5 w-5 shrink-0" />
          <span className="text-sm font-medium">{successMessage}</span>
          <button
            type="button"
            onClick={() => setSuccessMessage('')}
            className="ml-auto rounded p-1 hover:bg-emerald-100"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Search Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users by name, email, phone, or role..."
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

      {/* Users Table */}
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
                  Status
                </th>
                <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Joined
                </th>
                <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Media Upload
                </th>
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-sm text-slate-500">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <div className="h-8 w-8 animate-spin rounded-full border-4 border-emerald-500 border-t-transparent" />
                      <span>Loading users...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <Users className="mx-auto h-10 w-10 text-slate-300" />
                    <p className="mt-3 font-medium text-slate-700">No users found</p>
                    <p className="mt-1 text-sm text-slate-500">Try adjusting your search query.</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const roleName = user.role?.name?.toLowerCase() || '';
                  const isEligible = roleName === 'agent' || roleName === 'property_owner';
                  const hasRoleBasedUpload = roleName === 'property_manager';
                  const isActive = user.isActive !== false;
                  
                  return (
                    <tr key={user.id} className="transition hover:bg-slate-50">
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
                            {(user.name || user.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{user.name || 'No Name'}</div>
                            <div className="text-xs text-slate-400">ID: {user.id.slice(0, 8)}...</div>
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
                        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                          roleName === 'admin'
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : roleName === 'property_manager'
                            ? 'bg-blue-100 text-blue-700 border border-blue-200'
                            : roleName === 'agent'
                            ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {formatLabel(user.role?.name || 'user')}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm">
                        {isActive ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            <UserCheck className="h-3 w-3" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-xs font-medium text-rose-700">
                            <UserX className="h-3 w-3" /> Inactive
                          </span>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-500">
                        {formatDate(user.createdAt)}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-center">
                        {hasRoleBasedUpload ? (
                          <div className="flex justify-center text-emerald-600" title="Property managers can upload property media by role">
                            <ShieldCheck className="h-5 w-5" />
                          </div>
                        ) : isEligible ? (
                          <button
                            type="button"
                            onClick={() => handleTogglePermission(user.id, user.canUploadPropertyMedia)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                              user.canUploadPropertyMedia ? 'bg-emerald-600' : 'bg-slate-200'
                            }`}
                            title="Toggle media upload permission"
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                user.canUploadPropertyMedia ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        ) : (
                          <div className="flex justify-center text-slate-400" title="Only agents and property owners can be granted individual media upload permission">
                            <ShieldAlert className="h-5 w-5" />
                          </div>
                        )}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openEditModal(user)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                            title="Edit user"
                          >
                            <Pencil className="h-3.5 w-3.5 text-slate-500" /> Edit
                          </button>
                          {user.role?.name?.toLowerCase() !== 'admin' && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(user.id, user.name || user.email)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-50"
                              title="Delete user"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Delete
                            </button>
                          )}
                        </div>
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

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                  <Pencil className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Edit User</h3>
                  <p className="text-xs text-slate-500">Update account profile, role, and permissions</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingUser(null)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="mt-4 space-y-4">
              {editError && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{editError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={editFormData.name}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={editFormData.email}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={editFormData.phone}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+250 7XX XXX XXX"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Role
                  </label>
                  <select
                    value={editFormData.roleId}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, roleId: Number(e.target.value) }))}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {formatLabel(r.name)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                    Account Status
                  </label>
                  <select
                    value={editFormData.isActive ? 'active' : 'inactive'}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, isActive: e.target.value === 'active' }))}
                    className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* Media Upload Permission */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <div>
                  <span className="block text-sm font-medium text-slate-900">Property Media Upload</span>
                  <span className="block text-xs text-slate-500">Allow user to upload property listing images and media</span>
                </div>
                <input
                  type="checkbox"
                  checked={editFormData.canUploadPropertyMedia}
                  onChange={(e) => setEditFormData(prev => ({ ...prev, canUploadPropertyMedia: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </div>

              {/* Reset Password */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  New Password <span className="font-normal text-slate-400 lowercase">(optional, min 8 chars)</span>
                </label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    placeholder="Leave blank to keep current password"
                    value={editFormData.password}
                    onChange={(e) => setEditFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={editSaving}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  {editSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create User Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-200 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="rounded-lg bg-emerald-100 p-2 text-emerald-700">
                  <Plus className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Add New User</h3>
                  <p className="text-xs text-slate-500">Create a system account with designated permissions</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCreate} className="mt-4 space-y-4">
              {createError && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700 border border-red-200">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{createError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={createFormData.name}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="John Doe"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  value={createFormData.email}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="user@example.com"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={createFormData.phone}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="+250 7XX XXX XXX"
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Initial Password
                </label>
                <div className="relative mt-1.5">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    placeholder="Minimum 8 characters"
                    value={createFormData.password}
                    onChange={(e) => setCreateFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="w-full rounded-lg border border-slate-300 py-2 pl-9 pr-3 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700">
                  Role
                </label>
                <select
                  value={createFormData.roleId}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, roleId: Number(e.target.value) }))}
                  className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-900 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  {roles.map((r) => (
                    <option key={r.id} value={r.id}>
                      {formatLabel(r.name)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Media Upload Permission */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3.5">
                <div>
                  <span className="block text-sm font-medium text-slate-900">Property Media Upload</span>
                  <span className="block text-xs text-slate-500">Enable property photo & document uploads</span>
                </div>
                <input
                  type="checkbox"
                  checked={createFormData.canUploadPropertyMedia}
                  onChange={(e) => setCreateFormData(prev => ({ ...prev, canUploadPropertyMedia: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={createSaving}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                >
                  {createSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" /> Creating...
                    </>
                  ) : (
                    'Create User'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
