import Link from 'next/link'

export default function CookiePolicyContent() {
  return (
    <main className="min-h-[50vh] bg-slate-50 py-12 sm:py-16">
      <article className="mx-auto max-w-3xl rounded-2xl bg-white px-5 py-8 shadow-sm ring-1 ring-slate-200 sm:px-10 sm:py-12">
        <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">Ingata Technologies Ltd / Ingata Real Estate</p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Cookie Policy</h1>
        <p className="mt-3 text-sm text-slate-500">Effective date: October 18, 2026</p>
        <p className="mt-2 text-sm text-slate-500">Platform: <a className="text-emerald-700 underline hover:text-emerald-800" href="https://ingata-real-estate.vercel.app">ingata-real-estate.vercel.app</a></p>

        <div className="mt-10 space-y-8 text-sm leading-7 text-slate-700 sm:text-base">
          <section><h2 className="text-lg font-semibold text-slate-900">1. Introduction</h2><p className="mt-3">This Cookie Policy explains how Ingata Real Estate (&ldquo;we,&rdquo; &ldquo;our,&rdquo; or &ldquo;us&rdquo;) uses cookies and similar tracking technologies when you visit our website. Necessary cookies support core functions. We ask for your choice before enabling optional cookies, and you can change that choice at any time through Cookie Settings.</p></section>
          <section><h2 className="text-lg font-semibold text-slate-900">2. What Are Cookies?</h2><p className="mt-3">Cookies are small text files stored on your device, such as a computer, tablet, or mobile phone, by your web browser when you visit a website. They are widely used to make websites work efficiently, enhance user experience, and provide analytical data to website operators.</p></section>
          <section><h2 className="text-lg font-semibold text-slate-900">3. How We Use Cookies</h2><p className="mt-3">We use only cookies that are strictly necessary for platform functionality or helpful for analysing website performance.</p><ul className="mt-3 list-disc space-y-3 pl-5"><li><strong>Essential / Strictly Necessary Cookies:</strong> Required for core website operation, including secure administrative login, admin-portal session management, and basic page navigation.</li><li><strong>Performance &amp; Analytics Cookies:</strong> Used only after you give consent to understand anonymous traffic, page views, searches, and interaction flows.</li><li><strong>Marketing Cookies:</strong> Used only after you give consent, if marketing technologies are introduced.</li></ul></section>
          <section><h2 className="text-lg font-semibold text-slate-900">4. Third-Party Cookies</h2><p className="mt-3">Some cookies may be placed by third-party services that appear on our pages, such as embedded mapping tools or performance-monitoring utilities. We do not control those cookies and recommend reviewing the relevant third-party privacy policies.</p></section>
          <section><h2 className="text-lg font-semibold text-slate-900">5. Managing Your Choices</h2><p className="mt-3">Use Cookie Settings in the site footer to accept all optional cookies, keep necessary cookies only, or customise your choices. You can also manage cookies through your browser, although blocking necessary cookies may affect staff-portal sign-in, saved preferences, and other features.</p></section>
          <section><h2 className="text-lg font-semibold text-slate-900">6. Updates to This Cookie Policy</h2><p className="mt-3">We may update this policy for changes in technology, legal requirements, or platform features. When the policy version changes, we will ask you to make a new choice.</p></section>
          <section><h2 className="text-lg font-semibold text-slate-900">7. Contact Us</h2><p className="mt-3">For questions about cookies or data protection, contact <a className="text-emerald-700 underline hover:text-emerald-800" href="mailto:ingatatechnologiesltd@gmail.com">ingatatechnologiesltd@gmail.com</a>.</p><address className="mt-3 not-italic">KG 11 Ave, Zindiro, AZAM Rond Point, Gasabo-Kigali</address></section>
        </div>
        <Link href="/contact" className="mt-10 inline-flex rounded-lg bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800">Contact Ingata</Link>
      </article>
    </main>
  )
}
