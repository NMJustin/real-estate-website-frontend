'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

const INACTIVITY_TIMEOUT = 15 * 60 * 1000 // 15 minutes
const WARNING_TIMEOUT = 13 * 60 * 1000 // 13 minutes
const STORAGE_KEY = 'inactivity_logout'
const SYNC_EVENT = 'inactivity_sync'

interface InactivityState {
  logoutTime: number | null
  warningShown: boolean
}

export function useInactivityLogout() {
  const router = useRouter()
  const pathname = usePathname()
  const { logout, isAuthenticated } = useAuth()
  const [showWarning, setShowWarning] = useState(false)
  const [countdown, setCountdown] = useState(0)
  const [isSessionExpired, setIsSessionExpired] = useState(false)
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null)
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null)
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastActivityRef = useRef<number>(Date.now())

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

    // Set warning timer (13 minutes)
    warningTimerRef.current = setTimeout(() => {
      setShowWarning(true)
      setCountdown(2 * 60) // 2 minutes in seconds

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
    }, WARNING_TIMEOUT)

    // Set logout timer (15 minutes)
    inactivityTimerRef.current = setTimeout(() => {
      performLogout()
    }, INACTIVITY_TIMEOUT)

    // Hide warning if shown
    if (showWarning) {
      setShowWarning(false)
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current)
      }
    }

    // Sync with other tabs
    const state: InactivityState = {
      logoutTime: now + INACTIVITY_TIMEOUT,
      warningShown: false,
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    window.dispatchEvent(new Event(STORAGE_KEY))
  }, [isAuthenticated, showWarning])

  // Perform logout
  const performLogout = useCallback(() => {
    logout()
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

    // Redirect to login with session expired message
    router.push('/portal/login?session=expired')
  }, [logout, router])

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
          if (timeRemaining > WARNING_TIMEOUT) {
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
