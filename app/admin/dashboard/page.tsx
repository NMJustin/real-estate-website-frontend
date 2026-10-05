import { AdminLayout } from '@/components/layout/AdminLayout'
import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AdminDashboard from '@/legacy-pages/Admin/Dashboard'

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    </ProtectedRoute>
  )
}
