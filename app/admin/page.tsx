import { Suspense } from 'react'
import AdminLogin from '@/legacy-pages/Admin/Login'

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<main className="min-h-screen bg-slate-900" />}>
      <AdminLogin />
    </Suspense>
  )
}
