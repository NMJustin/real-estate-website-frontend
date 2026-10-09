'use client'

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Building2, LockKeyhole, Mail } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { portalApi } from '@/services/api';

const getRoleHome = (role: string) => {
  switch (role.toLowerCase()) {
    case 'admin': return '/admin/dashboard';
    case 'agent': return '/portal/agent/dashboard';
    case 'property_manager': return '/portal/property-manager/dashboard';
    case 'content_editor': return '/portal/content-editor/dashboard';
    default: return '/';
  }
};

const getMessage = (response: unknown) => {
  if (response && typeof response === 'object' && 'message' in response) {
    return String((response as { message: unknown }).message);
  }
  return '';
};

function PortalAuthShell({ children, title, description }: { children: React.ReactNode; title: string; description: string }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-lg sm:p-9">
        <div className="mb-7 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500 text-white"><Building2 className="h-6 w-6" /></span>
          <div><p className="font-bold text-slate-900">Ingata</p><p className="text-xs text-slate-500">Staff Portal</p></div>
        </div>
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        <p className="mt-2 text-sm leading-6 text-slate-500">{description}</p>
        {children}
      </div>
    </main>
  );
}

export function PortalLoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, userLogin, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const authenticatedUser = await userLogin(email.trim(), password);
      router.replace(getRoleHome(authenticatedUser.role));
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Unable to sign in.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PortalAuthShell title="Sign in" description="Use your staff account email and password to continue.">
      {isAuthenticated && user && (
        <div className="mt-5 flex items-center justify-between gap-3 rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          <span>Currently signed in as {user.email} ({user.role.replaceAll('_', ' ')}).</span>
          <button type="button" onClick={logout} className="shrink-0 font-semibold underline">Sign out</button>
        </div>
      )}
      <form onSubmit={submit} className="mt-6 space-y-4">
        {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        <label className="block text-sm font-medium text-slate-700">Email address
          <span className="relative mt-1.5 block">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="email" required autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
          </span>
        </label>
        <label className="block text-sm font-medium text-slate-700">Password
          <span className="relative mt-1.5 block">
            <LockKeyhole className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input type="password" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full rounded-lg border border-slate-300 py-2.5 pl-10 pr-3 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
          </span>
        </label>
        <div className="text-right"><Link href="/portal/forgot-password" className="text-sm font-medium text-emerald-700 hover:text-emerald-800">Forgot password?</Link></div>
        <button type="submit" disabled={submitting || isLoading} className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60">
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </PortalAuthShell>
  );
}

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setSubmitting(true);
    try {
      const response = await portalApi.forgotPassword(email.trim());
      setMessage(getMessage(response) || 'If an account exists for that email, password reset instructions will be sent.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not request a password reset.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PortalAuthShell title="Forgot password?" description="Enter the email address for your account. If it exists, we’ll email you a secure reset link.">
      <form onSubmit={submit} className="mt-6 space-y-4">
        {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {message && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
        <label className="block text-sm font-medium text-slate-700">Email address
          <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
        </label>
        <button type="submit" disabled={submitting} className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
          {submitting ? 'Sending…' : 'Send reset link'}
        </button>
        <p className="text-center text-sm"><Link href="/portal/login" className="font-medium text-emerald-700 hover:text-emerald-800">Back to sign in</Link></p>
      </form>
    </PortalAuthShell>
  );
}

export function ResetPasswordPage() {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setToken(new URLSearchParams(window.location.search).get('token') || '');
  }, []);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!token) {
      setError('This reset link is missing its token. Request another link.');
      return;
    }
    if (password !== confirmPassword) {
      setError('The passwords do not match.');
      return;
    }
    setSubmitting(true);
    try {
      const response = await portalApi.resetPassword(token, password);
      setMessage(getMessage(response) || 'Password reset successfully. You can now sign in.');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Could not reset the password.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PortalAuthShell title="Set a new password" description="Choose a new password with at least 8 characters. Reset links expire after 30 minutes.">
      <form onSubmit={submit} className="mt-6 space-y-4">
        {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {message && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p>}
        <label className="block text-sm font-medium text-slate-700">New password
          <input type="password" required minLength={8} maxLength={128} autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
        </label>
        <label className="block text-sm font-medium text-slate-700">Confirm new password
          <input type="password" required minLength={8} maxLength={128} autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100" />
        </label>
        <button type="submit" disabled={submitting || !!message} className="w-full rounded-lg bg-emerald-600 px-4 py-2.5 font-semibold text-white hover:bg-emerald-700 disabled:opacity-60">
          {submitting ? 'Updating…' : 'Reset password'}
        </button>
        {message && <p className="text-center text-sm"><Link href="/portal/login" className="font-medium text-emerald-700 hover:text-emerald-800">Go to sign in</Link></p>}
      </form>
    </PortalAuthShell>
  );
}
