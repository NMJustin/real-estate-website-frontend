'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { COOKIE_POLICY_VERSION, getCookiePreferences, saveCookiePreferences, TERMS_POLICY_VERSION } from '@/utils/consent'

const TERMS_KEY = 'ingata_terms_decision'
type Banner = 'terms' | 'cookies' | 'customize' | null

function hasCurrentTermsDecision() {
  try {
    const stored = localStorage.getItem(TERMS_KEY)
    return !!stored && JSON.parse(stored).policyVersion === TERMS_POLICY_VERSION
  } catch {
    localStorage.removeItem(TERMS_KEY)
    return false
  }
}

/** A non-blocking, versioned consent sequence for public pages. */
export function ConsentManager() {
  const [banner, setBanner] = useState<Banner>(null)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const preferences = getCookiePreferences()
    if (!hasCurrentTermsDecision()) setBanner('terms')
    else if (!preferences) setBanner('cookies')
    else {
      setAnalytics(preferences.analytics)
      setMarketing(preferences.marketing)
    }
  }, [])

  // Reserve space while a banner is visible so the page's final content remains reachable.
  useEffect(() => {
    if (!banner) return
    const previousPadding = document.body.style.paddingBottom
    document.body.style.paddingBottom = 'min(34rem, 72vh)'
    return () => { document.body.style.paddingBottom = previousPadding }
  }, [banner])

  useEffect(() => {
    const openSettings = () => {
      const preferences = getCookiePreferences()
      setAnalytics(preferences?.analytics ?? false)
      setMarketing(preferences?.marketing ?? false)
      setBanner('customize')
    }
    window.addEventListener('ingata-open-cookie-settings', openSettings)
    return () => window.removeEventListener('ingata-open-cookie-settings', openSettings)
  }, [])

  const decideTerms = (decision: 'accepted' | 'declined') => {
    localStorage.setItem(TERMS_KEY, JSON.stringify({ decision, policyVersion: TERMS_POLICY_VERSION, decidedAt: new Date().toISOString() }))
    setBanner(getCookiePreferences() ? null : 'cookies')
  }

  const save = (nextAnalytics: boolean, nextMarketing: boolean) => {
    saveCookiePreferences({ analytics: nextAnalytics, marketing: nextMarketing })
    setAnalytics(nextAnalytics)
    setMarketing(nextMarketing)
    setBanner(null)
  }

  if (!banner) return null

  return (
    <aside aria-labelledby="consent-title" aria-live="polite" className="fixed inset-x-0 bottom-0 z-[100] border-t border-slate-200 bg-white/98 shadow-[0_-12px_36px_rgba(15,23,42,0.16)] backdrop-blur">
      <div className="mx-auto max-h-[72vh] w-full max-w-6xl overflow-y-auto px-4 py-4 sm:px-6 sm:py-5 lg:flex lg:items-center lg:gap-8 lg:px-8">
        <div className="min-w-0 flex-1">
          {banner === 'terms' && <>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Before you continue</p>
            <h2 id="consent-title" className="mt-1 text-lg font-bold text-slate-900">Terms &amp; Conditions</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Please review our <Link className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800" href="/legal/terms-and-conditions">Terms &amp; Conditions</Link>. If you decline, you must immediately discontinue use of the website and its associated services.</p>
          </>}
          {banner === 'cookies' && <>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Your privacy choices</p>
            <h2 id="consent-title" className="mt-1 text-lg font-bold text-slate-900">Cookie consent</h2>
            <p className="mt-1 text-sm leading-6 text-slate-600">Necessary cookies keep core features working. Optional analytics and marketing cookies stay off until you allow them. Read our <Link className="font-semibold text-emerald-700 underline underline-offset-2 hover:text-emerald-800" href="/legal/cookie-policy">Cookie Policy</Link>.</p>
          </>}
          {banner === 'customize' && <>
            <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">Cookie settings</p>
            <h2 id="consent-title" className="mt-1 text-lg font-bold text-slate-900">Choose your preferences</h2>
            <div className="mt-3 grid gap-2 sm:grid-cols-3">
              <label className="flex gap-2 rounded-lg border border-slate-200 p-3 text-sm"><input checked disabled type="checkbox" className="mt-0.5 h-4 w-4 accent-emerald-700" /><span><strong className="block text-slate-900">Necessary</strong><span className="text-slate-600">Always on for core features.</span></span></label>
              <label className="flex cursor-pointer gap-2 rounded-lg border border-slate-200 p-3 text-sm"><input checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} type="checkbox" className="mt-0.5 h-4 w-4 accent-emerald-700" /><span><strong className="block text-slate-900">Analytics</strong><span className="text-slate-600">Helps improve the site.</span></span></label>
              <label className="flex cursor-pointer gap-2 rounded-lg border border-slate-200 p-3 text-sm"><input checked={marketing} onChange={(event) => setMarketing(event.target.checked)} type="checkbox" className="mt-0.5 h-4 w-4 accent-emerald-700" /><span><strong className="block text-slate-900">Marketing</strong><span className="text-slate-600">Allows marketing technologies.</span></span></label>
            </div>
          </>}
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:mt-0 lg:flex lg:w-auto lg:shrink-0 lg:flex-wrap lg:justify-end">
          {banner === 'terms' && <><button onClick={() => decideTerms('declined')} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Decline</button><button onClick={() => decideTerms('accepted')} className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800">Accept terms</button></>}
          {banner === 'cookies' && <><button onClick={() => save(false, false)} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Necessary only</button><button onClick={() => setBanner('customize')} className="rounded-lg border border-emerald-700 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-50">Customize</button><button onClick={() => save(true, true)} className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 sm:col-span-2 lg:w-full">Accept all</button></>}
          {banner === 'customize' && <><button onClick={() => setBanner(getCookiePreferences() ? null : 'cookies')} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">Back</button><button onClick={() => save(analytics, marketing)} className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800">Save preferences</button></>}
        </div>
      </div>
    </aside>
  )
}

export function CookieSettingsButton() {
  return <button type="button" onClick={() => window.dispatchEvent(new Event('ingata-open-cookie-settings'))} className="text-left transition-colors hover:text-white">Cookie Settings</button>
}
