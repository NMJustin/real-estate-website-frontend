import { renderHook, act } from '@testing-library/react'
import { useInactivityLogout } from '../useInactivityLogout'

// Mock the useAuth hook
jest.mock('@/context/AuthContext', () => ({
  useAuth: () => ({
    logout: jest.fn(),
    isAuthenticated: true,
  }),
}))

// Mock Next.js hooks
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
  usePathname: () => '/portal/dashboard',
}))

describe('useInactivityLogout', () => {
  beforeEach(() => {
    jest.useFakeTimers()
    jest.clearAllMocks()
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('should not show warning immediately on mount', () => {
    const { result } = renderHook(() => useInactivityLogout())
    expect(result.current.showWarning).toBe(false)
  })

  it('should show warning after 13 minutes of inactivity', () => {
    const { result } = renderHook(() => useInactivityLogout())

    // Fast-forward 13 minutes
    act(() => {
      jest.advanceTimersByTime(13 * 60 * 1000)
    })

    expect(result.current.showWarning).toBe(true)
  })

  it('should countdown when warning is shown', () => {
    const { result } = renderHook(() => useInactivityLogout())

    // Fast-forward to warning time
    act(() => {
      jest.advanceTimersByTime(13 * 60 * 1000)
    })

    expect(result.current.showWarning).toBe(true)
    expect(result.current.countdown).toBeGreaterThan(0)

    // Advance 1 second
    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(result.current.countdown).toBeLessThan(2 * 60)
  })

  it('should reset timer on stayLoggedIn', () => {
    const { result } = renderHook(() => useInactivityLogout())

    // Fast-forward to warning time
    act(() => {
      jest.advanceTimersByTime(13 * 60 * 1000)
    })

    expect(result.current.showWarning).toBe(true)

    // Stay logged in
    act(() => {
      result.current.stayLoggedIn()
    })

    expect(result.current.showWarning).toBe(false)
  })

  it('should format countdown correctly', () => {
    const { result } = renderHook(() => useInactivityLogout())

    expect(result.current.formatCountdown(120)).toBe('2:00')
    expect(result.current.formatCountdown(90)).toBe('1:30')
    expect(result.current.formatCountdown(30)).toBe('0:30')
    expect(result.current.formatCountdown(5)).toBe('0:05')
  })
})
