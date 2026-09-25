import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Target, Eye, Shield, Users } from 'lucide-react';

export default function WhyChooseUs() {
  const reasons = [
    {
      title: 'Professional Expertise',
      description: 'Our team provides professional support throughout the property search and transaction process.',
      icon: '🎯'
    },
    {
      title: 'Local Market Knowledge',
      description: 'We understand the local property market and customer requirements.',
      icon: '🏙️'
    },
    {
      title: 'Verified Listings',
      description: 'Where applicable, we aim to provide accurate and appropriately verified property information.',
      icon: '✓'
    },
    {
      title: 'Customer Focus',
      description: 'We focus on understanding customer needs and matching them with suitable property opportunities.',
      icon: '👥'
    },
    {
      title: 'Transparent Service',
      description: 'We communicate relevant property information, terms and processes clearly.',
      icon: '🔍'
    }
  ];

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
          <h1 className="text-4xl font-bold mb-4">Why Choose Ingata Real Estate</h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            Discover the key reasons why customers trust us with their real estate needs
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
              to="/about/vision"
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-brand-emerald transition-all group"
            >
              <Eye className="w-8 h-8 text-brand-emerald mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-brand-navy mb-2">Our Vision</h3>
              <p className="text-slate-600 text-sm">Learn about the future we aspire to create</p>
            </Link>
            <Link 
              to="/about/core-values"
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-brand-emerald transition-all group"
            >
              <Shield className="w-8 h-8 text-brand-emerald mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-bold text-brand-navy mb-2">Core Values</h3>
              <p className="text-slate-600 text-sm">Understand the principles that guide our actions</p>
            </Link>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <div 
              key={index}
              className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center text-2xl flex-shrink-0">
                  {reason.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-brand-navy mb-3">
                    {reason.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {reason.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-brand-navy text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Work With Us?</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Contact our team today to discuss your real estate needs and discover how we can help you achieve your property goals.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              to="/properties" 
              className="bg-brand-emerald hover:bg-brand-emerald-hover text-white px-6 py-3 rounded-lg font-medium transition-colors"
            >
              Browse Properties
            </Link>
            <Link 
              to="/list-your-property" 
              className="border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-brand-navy transition-colors"
            >
              List Your Property
            </Link>
            <Link 
              to="/contact" 
              className="bg-transparent border border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white hover:text-brand-navy transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}