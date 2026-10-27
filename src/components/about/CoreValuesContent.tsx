'use client'

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Shield, Briefcase, Eye, Heart, Clock, Lightbulb, Scale, Award, Target, Users } from 'lucide-react';

export default function CoreValuesContent() {
  const values = [
    {
      icon: Shield,
      title: 'Integrity',
      description: 'We conduct our business with honesty, ethics, and moral principles. We believe in doing the right thing, even when no one is watching.'
    },
    {
      icon: Briefcase,
      title: 'Professionalism',
      description: 'We maintain high standards of conduct, expertise, and service delivery. Our team represents the real estate industry with dignity and competence.'
    },
    {
      icon: Eye,
      title: 'Transparency',
      description: 'We operate with openness and clarity in all our dealings. Clients receive complete information about properties, processes, and terms.'
    },
    {
      icon: Heart,
      title: 'Customer Focus',
      description: 'Our clients are at the center of everything we do. We listen, understand, and prioritize their needs in every decision and action.'
    },
    {
      icon: Clock,
      title: 'Reliability',
      description: 'We deliver on our promises consistently. Clients can depend on us to follow through, meet deadlines, and provide dependable service.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We embrace new ideas, technologies, and methods to improve our services. We continuously seek better ways to serve our clients.'
    },
    {
      icon: Scale,
      title: 'Responsibility',
      description: 'We take ownership of our actions and their impact. We are accountable to our clients, team, and community in all our endeavors.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for the highest quality in everything we do. From property listings to client interactions, excellence is our standard.'
    }
  ];

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
          <h1 className="text-4xl font-bold mb-4">Our Core Values</h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            The principles that guide our actions and define who we are
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
              href="/about/mission"
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-brand-emerald transition-all group"
            >
              <Target className="w-8 h-8 text-brand-emerald mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-brand-navy mb-2">Our Mission</h3>
              <p className="text-slate-600 text-sm">Discover the purpose that drives everything we do</p>
            </Link>
            <Link
              href="/about/vision"
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-brand-emerald transition-all group"
            >
              <Eye className="w-8 h-8 text-brand-emerald mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-brand-navy mb-2">Our Vision</h3>
              <p className="text-slate-600 text-sm">Learn about the future we aspire to create</p>
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

        {/* Introduction */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <h2 className="text-2xl font-bold text-brand-navy mb-4">What We Stand For</h2>
            <p className="text-slate-600 leading-relaxed">
              Our core values are the foundation of our company culture and the guiding principles for every decision we make. They define how we interact with clients, partners, and each other, ensuring that we consistently deliver on our mission and work toward our vision.
            </p>
          </div>
        </section>

        {/* Core Values Grid */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-brand-navy mb-6">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div
                  key={index}
                  className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-brand-emerald" />
                  </div>
                  <h3 className="text-xl font-bold text-brand-navy mb-3">
                    {value.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Values in Action */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-brand-navy mb-6">How We Live Our Values</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-brand-emerald rounded-full mt-2 flex-shrink-0" />
                <p className="text-slate-600"><strong>Integrity in Action:</strong> We provide accurate property information and honest assessments, never misrepresenting details to close a deal.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-brand-emerald rounded-full mt-2 flex-shrink-0" />
                <p className="text-slate-600"><strong>Professionalism in Action:</strong> Our team maintains punctuality, proper documentation, and respectful communication in all client interactions.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-brand-emerald rounded-full mt-2 flex-shrink-0" />
                <p className="text-slate-600"><strong>Transparency in Action:</strong> We clearly explain all fees, terms, and processes upfront, ensuring no hidden surprises for our clients.</p>
              </li>
              <li className="flex items-start gap-3">
                <div className="w-2 h-2 bg-brand-emerald rounded-full mt-2 flex-shrink-0" />
                <p className="text-slate-600"><strong>Customer Focus in Action:</strong> We take time to understand each client's unique needs and tailor our services accordingly.</p>
              </li>
            </ul>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand-navy text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Experience Our Values</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Work with a team that lives by its principles. Contact us today to experience our commitment to excellence.
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
  );
}
