import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Eye, TrendingUp, Award, Globe, Target, Shield, Users } from 'lucide-react';

export default function Vision() {
  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-brand-navy text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link 
            to="/about/our-company" 
            className="inline-flex items-center gap-2 text-slate-300 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to About
          </Link>
          <h1 className="text-4xl font-bold mb-4">Our Vision</h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            The future we aspire to create in the real estate industry
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
              to="/about/our-company"
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-brand-emerald transition-all group"
            >
              <Users className="w-8 h-8 text-brand-emerald mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-brand-navy mb-2">Our Company</h3>
              <p className="text-slate-600 text-sm">Learn about our company overview and background</p>
            </Link>
            <Link 
              to="/about/mission"
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-brand-emerald transition-all group"
            >
              <Target className="w-8 h-8 text-brand-emerald mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-brand-navy mb-2">Our Mission</h3>
              <p className="text-slate-600 text-sm">Discover the purpose that drives everything we do</p>
            </Link>
            <Link 
              to="/about/core-values"
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-brand-emerald transition-all group"
            >
              <Shield className="w-8 h-8 text-brand-emerald mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-brand-navy mb-2">Core Values</h3>
              <p className="text-slate-600 text-sm">Understand the principles that guide our actions</p>
            </Link>
            <Link 
              to="/about/why-choose-us"
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-brand-emerald transition-all group"
            >
              <Award className="w-8 h-8 text-brand-emerald mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-brand-navy mb-2">Why Choose Us</h3>
              <p className="text-slate-600 text-sm">See what sets us apart from others</p>
            </Link>
          </div>
        </section>

        {/* Vision Statement */}
        <section className="mb-16">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 md:p-12">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
                <Eye className="w-8 h-8 text-brand-emerald" />
              </div>
              <h2 className="text-2xl font-bold text-brand-navy">Our Vision Statement</h2>
            </div>
            <blockquote className="text-2xl md:text-3xl font-bold text-brand-navy mb-8 leading-relaxed">
              "To become a trusted and respected real estate partner known for professional service, market knowledge and customer satisfaction."
            </blockquote>
            <p className="text-slate-600 leading-relaxed">
              This vision inspires our daily work and long-term strategy. It represents our commitment to building lasting relationships, staying ahead of market trends, and consistently delivering exceptional experiences for every client we serve.
            </p>
          </div>
        </section>

        {/* Vision Pillars */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-brand-navy mb-6">Our Vision Pillars</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <Award className="w-8 h-8 text-brand-emerald mb-3" />
              <h3 className="text-xl font-bold text-brand-navy mb-2">Trusted Partner</h3>
              <p className="text-slate-600">Building trust through integrity, transparency, and consistent delivery on our promises to clients and stakeholders.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <TrendingUp className="w-8 h-8 text-brand-emerald mb-3" />
              <h3 className="text-xl font-bold text-brand-navy mb-2">Market Knowledge</h3>
              <p className="text-slate-600">Maintaining deep understanding of real estate markets, trends, and opportunities to provide informed guidance.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <Globe className="w-8 h-8 text-brand-emerald mb-3" />
              <h3 className="text-xl font-bold text-brand-navy mb-2">Respected Leader</h3>
              <p className="text-slate-600">Earning respect through professional excellence, ethical practices, and positive contributions to the industry.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <Eye className="w-8 h-8 text-brand-emerald mb-3" />
              <h3 className="text-xl font-bold text-brand-navy mb-2">Customer Satisfaction</h3>
              <p className="text-slate-600">Prioritizing client needs and ensuring every interaction results in positive, memorable experiences.</p>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand-navy text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Join Our Vision</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Be part of our journey to transform real estate services. Let us help you achieve your property goals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/properties" 
              className="bg-brand-emerald hover:bg-brand-emerald-hover text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Properties
            </Link>
            <Link 
              to="/contact" 
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
