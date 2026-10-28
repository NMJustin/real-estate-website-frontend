import ProtectedRoute from '@/components/auth/ProtectedRoute'
import AdminDashboard from '@/components/admin/AdminDashboard'

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  )
}
