import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Users, Award, Target, TrendingUp, Shield, Heart, Lightbulb, BookOpen, Eye } from 'lucide-react';

export default function OurCompany() {
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
          <h1 className="text-4xl font-bold mb-4">About Ingata Real Estate</h1>
          <p className="text-slate-300 text-lg max-w-2xl">
            Your trusted partner for professional real estate services in Rwanda
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

        {/* Company Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-brand-navy mb-6">Company Overview</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <p className="text-slate-600 leading-relaxed mb-4">
              Ingata Real Estate is a real estate business providing property-related services to individuals, businesses, investors, property owners and developers.
            </p>
            <p className="text-slate-600 leading-relaxed mb-4">
              Our services include property sales, rentals, property management, property marketing, valuation coordination and real estate advisory.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Our focus is on providing professional, transparent and customer-oriented real estate services that connect people and organizations with suitable property opportunities.
            </p>
          </div>
        </section>

        {/* Company Background */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-brand-navy mb-6">Company Background</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <p className="text-slate-600 leading-relaxed">
              Founded with a vision to transform the real estate landscape in Rwanda, Ingata Real Estate has grown from a small operation to a comprehensive real estate service provider. Our journey has been guided by a commitment to excellence, integrity, and customer satisfaction.
            </p>
          </div>
        </section>

        {/* Company Story */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-brand-navy mb-6">Our Story</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-start gap-4 mb-6">
              <BookOpen className="w-10 h-10 text-brand-emerald flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">The Beginning</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  Ingata Real Estate was born from a simple observation: the real estate market in Rwanda needed a service provider that combined professional expertise with genuine care for clients. Our founders recognized that finding the right property shouldn't be a stressful experience—it should be an exciting journey toward achieving dreams and goals.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 mb-6">
              <TrendingUp className="w-10 h-10 text-brand-emerald flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">Growth and Evolution</h3>
                <p className="text-slate-600 leading-relaxed mb-4">
                  From our early days serving individual homebuyers, we expanded our services to meet the diverse needs of businesses, investors, property owners, and developers. Each expansion was driven by client feedback and market needs, ensuring that every new service we offered addressed real challenges faced by our community.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Heart className="w-10 h-10 text-brand-emerald flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">Looking Forward</h3>
                <p className="text-slate-600 leading-relaxed">
                  Today, we continue to grow and evolve, but our core purpose remains unchanged: connecting people and organizations with properties that enable their success. Every property we help buy, sell, rent, or manage represents a story of partnership and trust—a story we're honored to be part of.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Professional Approach */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-brand-navy mb-6">Professional Approach</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <Target className="w-8 h-8 text-brand-emerald mb-3" />
              <h3 className="text-xl font-bold text-brand-navy mb-2">Strategic Planning</h3>
              <p className="text-slate-600">We develop comprehensive strategies tailored to each client's unique real estate objectives.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <TrendingUp className="w-8 h-8 text-brand-emerald mb-3" />
              <h3 className="text-xl font-bold text-brand-navy mb-2">Market Analysis</h3>
              <p className="text-slate-600">Deep understanding of market trends and property values to inform decision-making.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <Shield className="w-8 h-8 text-brand-emerald mb-3" />
              <h3 className="text-xl font-bold text-brand-navy mb-2">Risk Management</h3>
              <p className="text-slate-600">Proactive identification and mitigation of potential risks in real estate transactions.</p>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <Lightbulb className="w-8 h-8 text-brand-emerald mb-3" />
              <h3 className="text-xl font-bold text-brand-navy mb-2">Innovation</h3>
              <p className="text-slate-600">Embracing technology and modern methods to enhance service delivery.</p>
            </div>
          </div>
        </section>

        {/* Customer Commitment */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-brand-navy mb-6">Customer Commitment</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-start gap-4 mb-6">
              <Heart className="w-8 h-8 text-brand-emerald flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">Client-Centric Service</h3>
                <p className="text-slate-600 leading-relaxed">
                  We prioritize our clients' needs and work tirelessly to exceed their expectations. Every client receives personalized attention and dedicated support throughout their real estate journey.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <Shield className="w-8 h-8 text-brand-emerald flex-shrink-0 mt-1" />
              <div>
                <h3 className="text-xl font-bold text-brand-navy mb-2">Transparency & Trust</h3>
                <p className="text-line-height-6 text-slate-600 leading-relaxed">
                  We believe in building long-term relationships based on trust, transparency, and mutual respect. All terms, processes, and information are communicated clearly to our clients.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Overview */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-brand-navy mb-6">Our Team</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center gap-4 mb-6">
              <Users className="w-12 h-12 text-brand-emerald" />
              <div>
                <h3 className="text-xl font-bold text-brand-navy">Experienced Professionals</h3>
                <p className="text-slate-600">Our team consists of experienced real estate professionals with diverse expertise in sales, marketing, property management, and advisory services.</p>
              </div>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Each team member is committed to delivering exceptional service and contributing to our collective success. We invest in continuous training and development to stay at the forefront of industry best practices.
            </p>
          </div>
        </section>

        {/* Awards and Recognition */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-brand-navy mb-6">Awards & Recognition</h2>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
            <div className="flex items-center gap-4 mb-4">
              <Award className="w-10 h-10 text-brand-emerald" />
              <p className="text-slate-600">
                We are proud of our achievements and the recognition we have received in the real estate industry. Our commitment to excellence has earned us the trust of numerous satisfied clients.
              </p>
            </div>
            <p className="text-slate-500 italic text-sm">
              Awards and recognition will be updated as they are received.
            </p>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-brand-navy text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl font-bold mb-4">Work With Us</h2>
          <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
            Ready to experience the Ingata Real Estate difference? Contact our team today to discuss your real estate needs.
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