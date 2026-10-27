import Link from 'next/link'
import { ArrowLeft, Target, Users, Home, Eye, Shield, Award, Navigation } from 'lucide-react'

export default function MissionPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-brand-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/about/our-company"
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to About
          </Link>
          <h1 className="text-4xl font-bold mb-4">Our Mission</h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            The purpose that drives everything we do
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* About Navigation */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-brand-navy mb-6">Explore More About Us</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/about/our-company"
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-brand-emerald transition-all group"
            >
              <Users className="w-8 h-8 text-brand-emerald mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-brand-navy mb-2">Our Company</h3>
              <p className="text-slate-600 text-sm">Learn about our company overview and background</p>
            </Link>
            <Link
              href="/about/vision"
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-brand-emerald transition-all group"
            >
              <Eye className="w-8 h-8 text-brand-emerald mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-brand-navy mb-2">Our Vision</h3>
              <p className="text-slate-600 text-sm">Discover the future we aspire to create</p>
            </Link>
            <Link
              href="/about/core-values"
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-brand-emerald transition-all group"
            >
              <Shield className="w-8 h-8 text-brand-emerald mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-brand-navy mb-2">Core Values</h3>
              <p className="text-slate-600 text-sm">Understand the principles that guide our actions</p>
            </Link>
            <Link
              href="/about/why-choose-us"
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-brand-emerald transition-all group"
            >
              <Award className="w-8 h-8 text-brand-emerald mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-brand-navy mb-2">Why Choose Us</h3>
              <p className="text-slate-600 text-sm">See what sets us apart from others</p>
            </Link>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <Target className="w-8 h-8 text-brand-emerald" />
              </div>
              <h2 className="text-2xl font-bold text-brand-navy">Our Mission Statement</h2>
            </div>
            <blockquote className="text-2xl md:text-3xl font-bold text-brand-navy mb-8 leading-relaxed">
              "To provide professional and customer-focused real estate services that connect people and organizations with suitable property opportunities."
            </blockquote>
            <p className="text-slate-600 leading-relaxed">
              This mission guides every decision we make and every action we take. It represents our commitment to excellence, customer satisfaction, and the continuous pursuit of better real estate solutions for our clients.
            </p>
          </div>
        </section>

        {/* Mission in Action */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-brand-navy mb-6">Our Mission in Action</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <Navigation className="w-8 h-8 text-brand-emerald mb-3" />
              <h3 className="text-xl font-bold text-brand-navy mb-2">Professional Services</h3>
              <p className="text-slate-600">Delivering high-quality real estate services that meet industry standards and exceed client expectations.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <Users className="w-8 h-8 text-brand-emerald mb-3" />
              <h3 className="text-xl font-bold text-brand-navy mb-2">Customer Focus</h3>
              <p className="text-slate-600">Prioritizing our clients' needs and ensuring their satisfaction in every interaction.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <Home className="w-8 h-8 text-brand-emerald mb-3" />
              <h3 className="text-xl font-bold text-brand-navy mb-2">Property Connections</h3>
              <p className="text-slate-600">Connecting people and organizations with properties that match their specific requirements.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand-navy text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Experience Our Mission</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Let us help you find the perfect property opportunity. Contact our team today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/properties"
              className="bg-brand-emerald hover:bg-brand-emerald-hover text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Properties
            </Link>
            <Link
              href="/contact"
              className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-brand-navy transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </section>
      </div>
    </div>
  )
}
