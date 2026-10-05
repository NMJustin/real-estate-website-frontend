'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import api from '../../services/api'

type Agent = {
  id: string
  name: string
  slug: string
  email?: string
  phone?: string | null
  role?: string
  status?: string
  avatarUrl?: string | null
  _count?: { properties: number }
}

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    api.getAgents({ limit: 100 })
      .then((response) => setAgents((response as { data: Agent[] }).data || []))
      .catch((requestError: unknown) => {
        setError(requestError instanceof Error ? requestError.message : 'Unable to load our team.')
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <main className="min-h-screen bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-slate-900">Meet Our Team</h1>
        <p className="mt-3 max-w-2xl text-slate-600">Connect with our real estate professionals for local expertise and personal service.</p>
        {loading ? (
          <p className="mt-8 text-slate-600">Loading our team…</p>
        ) : error ? (
          <p role="alert" className="mt-8 text-red-700">{error}</p>
        ) : agents.length === 0 ? (
          <p className="mt-8 text-slate-600">Our team profiles will be available soon.</p>
        ) : (
          <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <article key={agent.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
                {agent.avatarUrl ? (
                  <img src={agent.avatarUrl} alt={agent.name} className="h-64 w-full object-cover" />
                ) : (
                  <div className="flex h-64 items-center justify-center bg-slate-200 text-5xl font-semibold text-slate-500" aria-hidden="true">
                    {agent.name.charAt(0)}
                  </div>
                )}
                <div className="p-6">
                  <p className="text-sm font-medium text-emerald-700">{agent.role || 'Real Estate Agent'}</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-900">{agent.name}</h2>
                  <p className="mt-2 text-sm text-slate-600">{agent._count?.properties ?? 0} listed properties</p>
                  <Link href={`/agents/${encodeURIComponent(agent.slug)}`} className="mt-4 inline-block font-medium text-emerald-700 hover:underline">
                    View profile
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
