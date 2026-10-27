'use client'

import { FormEvent, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import api from '@/services/api'

export default function RequestViewing() {
  const searchParams = useSearchParams()
  const [form, setForm] = useState({
    propertyId: searchParams.get('propertyId') || '',
    name: '',
    email: '',
    phone: '',
    preferredViewingDate: '',
    preferredContactTime: '',
    numberOfVisitors: '',
    message: ''
  })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const validateForm = () => {
    if (!form.name.trim()) return 'Name is required'
    if (!form.email.trim()) return 'Email is required'
    if (!form.phone.trim()) return 'Phone number is required'
    if (!form.propertyId.trim()) return 'Property reference is required'
    if (!form.preferredViewingDate) return 'Preferred viewing date is required'
    if (!form.preferredContactTime) return 'Preferred contact time is required'
    if (!form.numberOfVisitors) return 'Number of visitors is required'
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(form.email)) return 'Please enter a valid email address'
    const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,4}[-\s.]?[0-9]{1,9}$/
    if (!phoneRegex.test(form.phone)) return 'Please enter a valid phone number'
    return ''
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setLoading(true)

    console.log('Form submission started:', form)

    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      setLoading(false)
      return
    }

    try {
      console.log('Submitting to API:', form)
      const response = await api.createViewing(form)
      console.log('API response:', response)
      setSubmitted(true)
      setMessage('Thank You\n\nYour inquiry has been received successfully. A member of our team will review your request and contact you using the information you provided.')
    } catch (err) {
      console.error('API Error:', err)
      const errorMessage = err instanceof Error ? err.message : 'Unable to send your request. Please try again later.'
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 text-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-slate-900 mb-4">Thank You</h1>
          <p className="text-slate-600 mb-6 whitespace-pre-line">Your inquiry has been received successfully. A member of our team will review your request and contact you using the information you provided.</p>
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-amber-800 text-sm">
              <strong>Note:</strong> Viewing requests shall not automatically constitute a confirmed appointment unless the company confirms the appointment.
            </p>
          </div>
          <Link href="/properties" className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
            Browse Properties
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link href="/properties" className="text-emerald-600 hover:underline text-sm font-medium">
            <><ArrowLeft className="mr-1 inline h-4 w-4" aria-hidden="true" />Back to Properties</>
          </Link>
        </div>

        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Request a Property Viewing</h1>

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
            <p className="text-amber-800 text-sm">
              <strong>Important:</strong> Viewing requests shall not automatically constitute a confirmed appointment unless the company confirms the appointment.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            <div>
              <label htmlFor="propertyId" className="block text-sm font-medium text-slate-700 mb-2">
                Property Reference *
              </label>
              <input
                id="propertyId"
                name="propertyId"
                type="text"
                required
                value={form.propertyId}
                onChange={(event) => setForm({ ...form, propertyId: event.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Property ID or reference"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                  Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  value={form.name}
                  onChange={(event) => setForm({ ...form, name: event.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                  Phone Number *
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={(event) => setForm({ ...form, phone: event.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                  placeholder="+250 7XX XXX XXX"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={form.email}
                onChange={(event) => setForm({ ...form, email: event.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="preferredViewingDate" className="block text-sm font-medium text-slate-700 mb-2">
                  Preferred Viewing Date (Optional)
                </label>
                <div className="relative">
                  <input
                    id="preferredViewingDate"
                    name="preferredViewingDate"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={form.preferredViewingDate}
                    onChange={(event) => setForm({ ...form, preferredViewingDate: event.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div>
                <label htmlFor="preferredContactTime" className="block text-sm font-medium text-slate-700 mb-2">
                  Preferred Contact Time (Optional)
                </label>
                <div className="relative">
                  <input
                    id="preferredContactTime"
                    name="preferredContactTime"
                    type="time"
                    value={form.preferredContactTime}
                    onChange={(event) => setForm({ ...form, preferredContactTime: event.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-emerald-500"
                  />
                  <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="numberOfVisitors" className="block text-sm font-medium text-slate-700 mb-2">
                Number of Visitors *
              </label>
              <input
                id="numberOfVisitors"
                name="numberOfVisitors"
                type="number"
                required
                min="1"
                value={form.numberOfVisitors}
                onChange={(event) => setForm({ ...form, numberOfVisitors: event.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="e.g., 2"
              />
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-700 mb-2">
                Additional Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={form.message}
                onChange={(event) => setForm({ ...form, message: event.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                placeholder="Any additional information or requests..."
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 text-sm">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Submitting...
                </>
              ) : (
                'Request Viewing'
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}
