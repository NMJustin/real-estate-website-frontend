'use client'

import { usePathname } from 'next/navigation';
import { Navigate } from '@/navigation/legacy-router';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const pathname = usePathname();

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
    return <Navigate to={`/admin?from=${encodeURIComponent(pathname)}`} replace />;
  }

  if (user?.role.toLowerCase() !== 'admin') {
    return <Navigate to="/portal/dashboard" replace />;
  }

  return <>{children}</>;
}
