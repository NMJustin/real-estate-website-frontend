'use client'

import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Verifying session...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to admin login with from parameter for redirect after login
    router.push(`/admin?from=${encodeURIComponent(pathname)}`);
    return null;
  }

  if (user?.role.toLowerCase() !== 'admin') {
    router.push('/portal/dashboard');
    return null;
  }

  return <>{children}</>;
}
