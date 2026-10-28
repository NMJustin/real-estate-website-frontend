'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { getLoginRedirectForRole } from '@/services/api'

const STORAGE_KEY = 'inactivity_logout'
const SYNC_EVENT = 'inactivity_sync'

export function getInactivityTimeouts(): { inactivityTimeout: number; warningTimeout: number } {
  if (typeof window !== 'undefined') {
    try {
      const raw = localStorage.getItem('site_security_settings');
      if (raw) {
        const parsed = JSON.parse(raw);
        const timeoutMinutes = Number(parsed.sessionTimeoutMinutes ?? parsed.session_timeout_minutes);
        const warningMinutes = Number(parsed.sessionWarningMinutes ?? parsed.session_warning_minutes);
        if (Number.isFinite(timeoutMinutes) && timeoutMinutes > 0) {
          const timeoutMs = timeoutMinutes * 60 * 1000;
          const warnMs = Number.isFinite(warningMinutes) && warningMinutes > 0 && warningMinutes < timeoutMinutes
            ? warningMinutes * 60 * 1000
            : Math.max(30 * 1000, timeoutMs - 2 * 60 * 1000);
          return { inactivityTimeout: timeoutMs, warningTimeout: warnMs };
        }
      }
    } catch {
      // fallback
    }
  }
  return { inactivityTimeout: 5 * 60 * 1000, warningTimeout: 3 * 60 * 1000 };
}

interface InactivityState {
  logoutTime: number | null
  warningShown: boolean
}

export function useInactivityLogout() {
  const router = useRouter()
  const pathname = usePathname()
  const { logout, isAuthenticated, user } = useAuth()
  const [showWarning, setShowWarning] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isSessionExpired, setIsSessionExpired] = useState(false)
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null)
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityRef = useRef<number>(Date.now())

  // Keep stable refs to external dependencies to avoid callback thrashing on renders
  const logoutRef = useRef(logout)
  logoutRef.current = logout
  const routerRef = useRef(router)
  routerRef.current = router
  const pathnameRef = useRef(pathname)
  pathnameRef.current = pathname
  const userRef = useRef(user)
  userRef.current = user

  // Perform logout
  const performLogout = useCallback(() => {
    // Determine correct login page based on verified role or current route context
    let storedRole: string | null = userRef.current?.role || null
    if (!storedRole && typeof window !== 'undefined') {
      try {
        const item = localStorage.getItem('user_role')
        storedRole = item ? JSON.parse(item) : null
      } catch {
        storedRole = null
      }
    }
    const loginPage = getLoginRedirectForRole(storedRole, pathnameRef.current)

    logoutRef.current()
    setIsSessionExpired(true)
    setShowWarning(false)

    // Clear timers
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current)
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
    }

    routerRef.current.push(`${loginPage}?session=expired`)
  }, [])

  // Reset inactivity timer on genuine user activity
  const resetTimer = useCallback(() => {
    if (!isAuthenticated) return

    const now = Date.now()
    lastActivityRef.current = now

    // Clear existing timers
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current)
    }
    if (warningTimerRef.current) {
      clearTimeout(warningTimerRef.current)
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current)
    }

    const { inactivityTimeout, warningTimeout } = getInactivityTimeouts()

    // Set warning timer
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true)
      const warningDurationSec = Math.max(10, Math.round((inactivityTimeout - warningTimeout) / 1000))
      setCountdown(warningDurationSec)

      // Start countdown
      countdownIntervalRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownIntervalRef.current!)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }, warningTimeout)

    // Set logout timer
    inactivityTimerRef.current = setTimeout(() => {
      performLogout()
    }, inactivityTimeout)

    // Hide warning if shown
    setShowWarning((prev) => {
      if (prev && countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
      return false
    })

    // Sync with other tabs
    const state: InactivityState = {
      logoutTime: now + inactivityTimeout,
      warningShown: false,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    window.dispatchEvent(new Event(STORAGE_KEY))
  }, [isAuthenticated, performLogout])

  // Stay logged in (user clicked button)
  const stayLoggedIn = useCallback(() => {
    resetTimer()
  }, [resetTimer])

  // Handle genuine user activity events
  useEffect(() => {
    if (!isAuthenticated) return

    const activityEvents = [
      'click',
      'keydown',
      'scroll',
      'touchstart',
      'touchend',
      'touchmove',
      'submit',
      'change',
      'input',
    ]

    const handleActivity = () => {
      resetTimer()
    }

    // Add event listeners for genuine activity
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity, { passive: true })
    })

    // Initialize timer on mount
    resetTimer()

    // Cleanup
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity)
      })
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current)
      }
      if (warningTimerRef.current) {
        clearTimeout(warningTimerRef.current)
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
    }
  }, [isAuthenticated, resetTimer])

  // Cross-tab synchronization
  useEffect(() => {
    if (!isAuthenticated) return

    const handleStorageChange = (e: StorageEvent | Event) => {
      if ('key' in e && e.key === STORAGE_KEY) {
        const newState = JSON.parse((e as StorageEvent).newValue || '{}')
        const now = Date.now()

        if (newState.logoutTime && newState.logoutTime > now) {
          // Another tab reset the timer, sync local state
          const timeRemaining = newState.logoutTime - now
          const { warningTimeout } = getInactivityTimeouts()
          if (timeRemaining > warningTimeout) {
            // Reset local timer
            resetTimer()
          } else if (timeRemaining > 0) {
            // Show warning if in warning period
            setShowWarning(true)
            setCountdown(Math.floor(timeRemaining / 1000))
          } else {
            // Logout immediately
            performLogout()
          }
        }
      } else if (e.type === SYNC_EVENT) {
        // Custom sync event
        resetTimer()
      }
    }

    window.addEventListener('storage', handleStorageChange as EventListener)
    window.addEventListener(SYNC_EVENT, handleStorageChange)

    return () => {
      window.removeEventListener('storage', handleStorageChange as EventListener)
      window.removeEventListener(SYNC_EVENT, handleStorageChange)
    }
  }, [isAuthenticated, resetTimer, performLogout])

  // Reset timer on route change
  useEffect(() => {
    if (isAuthenticated) {
      resetTimer()
    }
  }, [pathname, isAuthenticated, resetTimer])

  // Check for session expired on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('session') === 'expired') {
      setIsSessionExpired(true)
      // Clean URL
      window.history.replaceState({}, '', '/portal/login')
    }
  }, [])

  // Format countdown as MM:SS
  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  return {
    showWarning,
    countdown,
    formatCountdown,
    stayLoggedIn,
    isSessionExpired,
  }
}
