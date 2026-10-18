export const TERMS_POLICY_VERSION = '2026-10-15'
export const COOKIE_POLICY_VERSION = '2026-10-15'

export type CookiePreferences = {
  necessary: true
  analytics: boolean
  marketing: boolean
  policyVersion: string
  updatedAt: string
}

const COOKIE_PREFERENCES_KEY = 'ingata_cookie_preferences'

export function getCookiePreferences(): CookiePreferences | null {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem(COOKIE_PREFERENCES_KEY)
    if (!stored) return null
    const preferences = JSON.parse(stored) as Partial<CookiePreferences>
    if (preferences.policyVersion !== COOKIE_POLICY_VERSION || preferences.necessary !== true || typeof preferences.analytics !== 'boolean' || typeof preferences.marketing !== 'boolean') return null
    return preferences as CookiePreferences
  } catch {
    return null
  }
}

export function hasAnalyticsConsent() {
  return getCookiePreferences()?.analytics === true
}

export function saveCookiePreferences(preferences: Omit<CookiePreferences, 'necessary' | 'policyVersion' | 'updatedAt'>) {
  if (typeof window === 'undefined') return
  localStorage.setItem(COOKIE_PREFERENCES_KEY, JSON.stringify({ necessary: true, analytics: preferences.analytics, marketing: preferences.marketing, policyVersion: COOKIE_POLICY_VERSION, updatedAt: new Date().toISOString() } satisfies CookiePreferences))
  window.dispatchEvent(new Event('ingata-cookie-preferences-updated'))
}
