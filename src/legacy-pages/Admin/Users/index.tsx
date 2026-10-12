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
  Save,
  Trash2
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
  agentProfile: AgentProfile | null;
}

interface AgentProfile {
  name: string;
  slug: string;
  profileImage: string;
  bio: string;
  specialization: string;
  licenseNumber: string;
  yearsExperience: number | '';
  isActive: boolean;
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

const emptyAgentProfile: AgentProfile = {
  name: '',
  slug: '',
  profileImage: '',
  bio: '',
  specialization: '',
  licenseNumber: '',
  yearsExperience: '',
  isActive: true,
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [saving, setSaving] = useState(false);

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
      setRoles(uniqueRoles((rolesResponse as { data?: Role[] }).data ?? []));
      
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

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete ${userName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await adminApi.deleteUser(userId);
      // Remove user from local state
      setUsers(prev => prev.filter(u => u.id !== userId));
    } catch (err) {
      console.error('Failed to delete user:', err);
      alert(err instanceof Error ? err.message : 'Failed to delete user.');
    }
  };

  const handleUserSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSaving(true);
    const form = new FormData(event.currentTarget);
    const roleId = Number(form.get('roleId'));
    const selectedRole = roles.find((role) => role.id === roleId);
    const payload: Record<string, unknown> = {
      name: String(form.get('name') || '').trim(),
      email: String(form.get('email') || '').trim(),
      phone: String(form.get('phone') || '').trim(),
      roleId,
      isActive: form.get('isActive') === 'on',
      canUploadPropertyMedia: form.get('canUploadPropertyMedia') === 'on',
    };
    const password = String(form.get('password') || '');
    if (password) payload.password = password;
    if (selectedRole?.name === 'agent') {
      payload.agentProfile = {
        name: String(form.get('agentName') || '').trim(),
        slug: String(form.get('agentSlug') || '').trim(),
        profileImage: String(form.get('profileImage') || '').trim(),
        bio: String(form.get('bio') || '').trim(),
        specialization: String(form.get('specialization') || '').trim(),
        licenseNumber: String(form.get('licenseNumber') || '').trim(),
        yearsExperience: form.get('yearsExperience') ? Number(form.get('yearsExperience')) : undefined,
        isActive: form.get('agentIsActive') === 'on',
      };
    }

    try {
      if (editingUser) {
        await adminApi.updateUser(editingUser.id, payload);
      } else {
        await adminApi.createUser(payload);
      }
      setEditingUser(null);
      setShowCreateForm(false);
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save user.');
    } finally {
      setSaving(false);
    }
  };

  const openEditForm = (user: User) => {
    setShowCreateForm(false);
    setEditingUser(user);
  };

  const closeForm = () => {
    setShowCreateForm(false);
    setEditingUser(null);
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
        <button
          type="button"
          onClick={() => { setEditingUser(null); setShowCreateForm(true); }}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          <Plus className="h-4 w-4" /> Add User
        </button>
      </div>

      {(showCreateForm || editingUser) && (
        <UserForm
          user={editingUser}
          roles={roles}
          saving={saving}
          error={error}
          agentProfile={editingUser?.agentProfile || emptyAgentProfile}
          onClose={closeForm}
          onSubmit={handleUserSubmit}
        />
      )}

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
                <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-500">
                    Loading users...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center">
                    <Users className="mx-auto h-10 w-10 text-slate-300" />
                    <p className="mt-3 font-medium text-slate-700">No users found</p>
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const isEligible = user.role.name === 'agent' || user.role.name === 'property_owner';
                  const hasRoleBasedUpload = user.role.name === 'property_manager';
                  
                  return (
                    <tr key={user.id} className="transition hover:bg-slate-50">
                      <td className="whitespace-nowrap px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 font-semibold text-emerald-700">
                            {(user.name || user.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">{user.name || 'No Name'}</div>
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
                        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700">
                          {formatLabel(user.role?.name || 'user')}
                        </span>
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
                            onClick={() => openEditForm(user)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50"
                          >
                            <Pencil className="h-3.5 w-3.5" /> Edit
                          </button>
                          {user.role?.name.toLowerCase() !== 'admin' && (
                            <button
                              type="button"
                              onClick={() => handleDeleteUser(user.id, user.name || user.email)}
                              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50"
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
    </div>
  );
}

function UserForm({
  user,
  roles,
  saving,
  error,
  agentProfile,
  onClose,
  onSubmit,
}: {
  user: User | null;
  roles: Role[];
  saving: boolean;
  error: string;
  agentProfile: AgentProfile;
  onClose: () => void;
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}) {
  const defaultRoleId = user?.role?.id ?? roles.find((role) => role.name === 'user')?.id ?? '';
  const [selectedRoleId, setSelectedRoleId] = useState(String(defaultRoleId));
  const [agentName, setAgentName] = useState(agentProfile.name);
  const [agentSlug, setAgentSlug] = useState(agentProfile.slug);
  const selectedRole = roles.find((role) => role.id === Number(selectedRoleId));

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-900/50 p-4 sm:items-center">
      <form onSubmit={onSubmit} className="my-4 w-full max-w-3xl rounded-2xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4 sm:px-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">{user ? 'Edit User' : 'Add User'}</h2>
            <p className="mt-1 text-sm text-slate-500">Manage account details, sign-in credentials, role, and agent profile.</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close form" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X className="h-5 w-5" /></button>
        </div>

        {error && <div role="alert" className="mx-5 mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 sm:mx-6">{error}</div>}

        <div className="grid gap-4 px-5 py-5 sm:grid-cols-2 sm:px-6">
          <label className="text-sm font-medium text-slate-700">Full name
            <input name="name" required defaultValue={user?.name || ''} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
          </label>
          <label className="text-sm font-medium text-slate-700">Email
            <input name="email" type="email" required defaultValue={user?.email || ''} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
          </label>
          <label className="text-sm font-medium text-slate-700">Phone
            <input name="phone" type="tel" defaultValue={user?.phone || ''} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
          </label>
          <label className="text-sm font-medium text-slate-700">Role
            <select
              name="roleId"
              required
              value={selectedRoleId}
              onChange={(event) => setSelectedRoleId(event.target.value)}
              className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            >
              {!selectedRoleId && <option value="">Select a role...</option>}
              {roles.map((role) => <option key={role.id} value={role.id}>{formatLabel(role.name)}</option>)}
            </select>
          </label>
          <label className="text-sm font-medium text-slate-700 sm:col-span-2">
            {user ? 'New password (leave blank to keep current password)' : 'Initial password'}
            <input
              name="password"
              type="password"
              required={!user}
              minLength={8}
              maxLength={128}
              autoComplete="new-password"
              className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100"
            />
            <span className="mt-1 block text-xs font-normal text-slate-500">Use 8–128 characters. Passwords are stored securely as hashes.</span>
          </label>

          {user && (
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <input name="isActive" type="checkbox" defaultChecked={user.isActive} className="h-4 w-4 accent-emerald-600" />
              Account active
            </label>
          )}

          {(selectedRole?.name === 'agent' || (user?.role?.name === 'agent' && !selectedRole)) && (
            <div className="space-y-4 rounded-xl border border-emerald-100 bg-emerald-50/40 p-4 sm:col-span-2">
              <div>
                <h3 className="font-semibold text-slate-800">Agent profile</h3>
                <p className="mt-1 text-xs text-slate-500">Agent profile details are managed here alongside the user’s sign-in account.</p>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-700">Agent display name
                  <input name="agentName" value={agentName} onChange={(event) => {
                    const nextName = event.target.value;
                    setAgentName(nextName);
                    if (!agentSlug || agentSlug === agentProfile.slug) setAgentSlug(nextName.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
                  }} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-500" />
                </label>
                <label className="text-sm font-medium text-slate-700">Profile slug
                  <input name="agentSlug" value={agentSlug} onChange={(event) => setAgentSlug(event.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-500" />
                </label>
                <label className="text-sm font-medium text-slate-700">Specialization
                  <input name="specialization" defaultValue={agentProfile.specialization} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-500" />
                </label>
                <label className="text-sm font-medium text-slate-700">License number
                  <input name="licenseNumber" defaultValue={agentProfile.licenseNumber} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-500" />
                </label>
                <label className="text-sm font-medium text-slate-700">Years of experience
                  <input name="yearsExperience" type="number" min={0} max={100} defaultValue={agentProfile.yearsExperience} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-500" />
                </label>
                <label className="text-sm font-medium text-slate-700">Profile image URL
                  <input name="profileImage" type="url" defaultValue={agentProfile.profileImage} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-500" />
                </label>
                <label className="text-sm font-medium text-slate-700 sm:col-span-2">Biography
                  <textarea name="bio" rows={3} defaultValue={agentProfile.bio} className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-emerald-500" />
                </label>
                <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                  <input name="agentIsActive" type="checkbox" defaultChecked={agentProfile.isActive} className="h-4 w-4 accent-emerald-600" />
                  Agent profile active
                </label>
              </div>
            </div>
          )}

          {(selectedRole?.name === 'agent' || selectedRole?.name === 'property_owner') && (
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 sm:col-span-2">
              <input name="canUploadPropertyMedia" type="checkbox" defaultChecked={user?.canUploadPropertyMedia ?? false} className="h-4 w-4 accent-emerald-600" />
              Allow property media uploads
            </label>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-4 sm:px-6">
          <button type="button" onClick={onClose} className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">Cancel</button>
          <button type="submit" disabled={saving || roles.length === 0} className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
            <Save className="h-4 w-4" /> {saving ? 'Saving…' : user ? 'Save changes' : 'Create user'}
          </button>
        </div>
      </form>
    </div>
  );
}
