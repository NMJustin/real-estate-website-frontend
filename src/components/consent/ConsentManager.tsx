'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { COOKIE_POLICY_VERSION, getCookiePreferences, saveCookiePreferences, TERMS_POLICY_VERSION } from '@/utils/consent'

const TERMS_KEY = 'ingata_terms_decision'

type Dialog = 'terms' | 'cookies' | 'customize' | null

export function ConsentManager() {
  const [dialog, setDialog] = useState<Dialog>(null)
  const [analytics, setAnalytics] = useState(false)
  const [marketing, setMarketing] = useState(false)

  useEffect(() => {
    const storedTerms = localStorage.getItem(TERMS_KEY)
    let termsCurrent = false
    try { termsCurrent = !!storedTerms && JSON.parse(storedTerms).policyVersion === TERMS_POLICY_VERSION } catch { localStorage.removeItem(TERMS_KEY) }
    const preferences = getCookiePreferences()
    if (!termsCurrent) setDialog('terms')
    else if (!preferences) setDialog('cookies')
    else { setAnalytics(preferences.analytics); setMarketing(preferences.marketing) }
  }, [])

  useEffect(() => {
    const openSettings = () => {
      const preferences = getCookiePreferences()
      setAnalytics(preferences?.analytics ?? false)
      setMarketing(preferences?.marketing ?? false)
      setDialog('customize')
    }
    window.addEventListener('ingata-open-cookie-settings', openSettings)
    return () => window.removeEventListener('ingata-open-cookie-settings', openSettings)
  }, [])

  const decideTerms = (decision: 'accepted' | 'declined') => {
    localStorage.setItem(TERMS_KEY, JSON.stringify({ decision, policyVersion: TERMS_POLICY_VERSION, decidedAt: new Date().toISOString() }))
    setDialog(getCookiePreferences() ? null : 'cookies')
  }
  const save = (nextAnalytics: boolean, nextMarketing: boolean) => {
    saveCookiePreferences({ analytics: nextAnalytics, marketing: nextMarketing })
    setAnalytics(nextAnalytics); setMarketing(nextMarketing); setDialog(null)
  }

  if (!dialog) return null
  return <div className="fixed inset-0 z-[100] flex items-end bg-slate-950/45 p-3 backdrop-blur-[1px] sm:items-center sm:justify-center sm:p-6" role="presentation">
    <section aria-modal="true" aria-labelledby="consent-title" role="dialog" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
      {dialog === 'terms' && <><p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">Before you continue</p><h2 id="consent-title" className="mt-2 text-2xl font-bold text-slate-900">Terms &amp; Conditions</h2><p className="mt-3 text-sm leading-6 text-slate-600">Please review our <Link className="font-medium text-emerald-700 underline" href="/legal/terms-and-conditions">Terms &amp; Conditions</Link>. Your decision is recorded with the policy version and date. You can still browse if you decline.</p><div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button onClick={() => decideTerms('declined')} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Decline</button><button onClick={() => decideTerms('accepted')} className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">Accept terms</button></div></>}
      {dialog === 'cookies' && <><p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">Your privacy choices</p><h2 id="consent-title" className="mt-2 text-2xl font-bold text-slate-900">Cookie preferences</h2><p className="mt-3 text-sm leading-6 text-slate-600">Necessary cookies keep core features working. Analytics and marketing cookies are optional and are off until you choose them. Read our <Link className="font-medium text-emerald-700 underline" href="/legal/cookie-policy">Cookie Policy</Link>.</p><div className="mt-6 grid gap-3 sm:grid-cols-2"><button onClick={() => save(false, false)} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Necessary only</button><button onClick={() => setDialog('customize')} className="rounded-lg border border-emerald-700 px-4 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-50">Customize</button><button onClick={() => save(true, true)} className="sm:col-span-2 rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">Accept all</button></div></>}
      {dialog === 'customize' && <><p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">Cookie settings</p><h2 id="consent-title" className="mt-2 text-2xl font-bold text-slate-900">Choose your preferences</h2><div className="mt-5 space-y-4"><label className="flex gap-3 rounded-lg border border-slate-200 p-4"><input checked disabled type="checkbox" className="mt-1 h-4 w-4 accent-emerald-700" /><span><strong className="block text-slate-900">Necessary</strong><span className="text-sm text-slate-600">Required for core site features.</span></span></label><label className="flex cursor-pointer gap-3 rounded-lg border border-slate-200 p-4"><input checked={analytics} onChange={(event) => setAnalytics(event.target.checked)} type="checkbox" className="mt-1 h-4 w-4 accent-emerald-700" /><span><strong className="block text-slate-900">Analytics</strong><span className="text-sm text-slate-600">Helps us understand site usage and performance.</span></span></label><label className="flex cursor-pointer gap-3 rounded-lg border border-slate-200 p-4"><input checked={marketing} onChange={(event) => setMarketing(event.target.checked)} type="checkbox" className="mt-1 h-4 w-4 accent-emerald-700" /><span><strong className="block text-slate-900">Marketing</strong><span className="text-sm text-slate-600">Allows marketing technologies, if used.</span></span></label></div><div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button onClick={() => setDialog(getCookiePreferences() ? null : 'cookies')} className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Back</button><button onClick={() => save(analytics, marketing)} className="rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-800">Save preferences</button></div></>}
    </section>
  </div>
}

export function CookieSettingsButton() {
  return <button type="button" onClick={() => window.dispatchEvent(new Event('ingata-open-cookie-settings'))} className="text-left hover:text-white transition-colors">Cookie Settings</button>
}
