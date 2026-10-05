import Link from 'next/link'

export function LegalNotice({ title }: { title: string }) {
  return (
    <main className="min-h-[50vh] bg-slate-50 py-16">
      <div className="mx-auto max-w-3xl px-4 sm:px-6">
        <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
        <p className="mt-5 leading-relaxed text-slate-600">
          This document has not been published yet. Please contact Ingata Real Estate if you need information before it is available.
        </p>
        <Link href="/contact" className="mt-6 inline-block font-medium text-emerald-700 hover:underline">
          Contact us
        </Link>
      </div>
    </main>
  )
}
