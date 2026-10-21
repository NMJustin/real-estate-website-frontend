'use client'

import { Clock, LogOut } from 'lucide-react'

interface InactivityWarningModalProps {
  show: boolean
  countdown: number
  formatCountdown: (seconds: number) => string
  onStayLoggedIn: () => void
  onLogout: () => void
}

export function InactivityWarningModal({
  show,
  countdown,
  formatCountdown,
  onStayLoggedIn,
  onLogout,
}: InactivityWarningModalProps) {
  if (!show) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <Clock className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Session Expiring Soon</h2>
            <p className="text-sm text-slate-500">You will be logged out due to inactivity</p>
          </div>
        </div>

        <div className="mb-6 text-center">
          <div className="mb-2 text-4xl font-bold text-amber-600">
            {formatCountdown(countdown)}
          </div>
          <p className="text-sm text-slate-600">Time remaining</p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onLogout}
            className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            <LogOut className="h-4 w-4" />
            Log Out Now
          </button>
          <button
            onClick={onStayLoggedIn}
            className="flex flex-1 items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Stay Logged In
          </button>
        </div>
      </div>
    </div>
  )
}
