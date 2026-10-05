'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/' && pathname !== '/') return false;
    return pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-white shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/images/ingata_logo.png" 
                alt="Ingata Real Estate Logo" 
                width={1536}
                height={1024}
                sizes="72px"
                priority
                className="h-12 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation with Full Dropdowns */}
          <nav className="hidden lg:flex space-x-6">
            <Link href="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-brand-emerald' : 'text-brand-charcoal hover:text-brand-emerald'}`}>
              Home
            </Link>

            {/* 1. Properties Dropdown */}
            <div className="relative group">
              <Link href="/properties" className={`text-sm font-medium transition-colors flex items-center gap-1 ${isActive('/properties') ? 'text-brand-emerald' : 'text-brand-charcoal hover:text-brand-emerald'}`}>
                Properties
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </Link>
              <div className="absolute left-0 mt-2 w-52 bg-white border border-gray-100 shadow-lg rounded-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50 py-2">
                <Link href="/properties/for-sale" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">For Sale</Link>
                <Link href="/properties/for-rent" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">For Rent</Link>
                <Link href="/properties/for-lease" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">For Lease</Link>
                <div className="border-t border-gray-100 my-1"></div>
                <Link href="/properties/residential" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Residential</Link>
                <Link href="/properties/commercial" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Commercial</Link>
                <Link href="/properties/apartments" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Apartments</Link>
                <Link href="/properties/houses" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Houses</Link>
                <Link href="/properties/land" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Land</Link>
                <Link href="/properties/offices" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Offices</Link>
                <Link href="/properties/warehouses" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Warehouses</Link>
                <div className="border-t border-gray-100 my-1"></div>
                <Link href="/properties/new-developments" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">New Developments</Link>
              </div>
            </div>

            {/* 2. Services Dropdown */}
            <div className="relative group">
              <Link href="/services" className={`text-sm font-medium transition-colors flex items-center gap-1 ${isActive('/services') ? 'text-brand-emerald' : 'text-brand-charcoal hover:text-brand-emerald'}`}>
                Services
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </Link>
              <div className="absolute left-0 mt-2 w-60 bg-white border border-gray-100 shadow-lg rounded-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50 py-2">
                <Link href="/services/property-sales" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Property Sales</Link>
                <Link href="/services/property-rentals" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Property Rentals</Link>
                <Link href="/services/property-leasing" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Property Leasing</Link>
                <Link href="/services/property-management" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Property Management</Link>
                <Link href="/services/property-valuation" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Property Valuation</Link>
                <Link href="/services/property-marketing" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Property Marketing</Link>
                <Link href="/services/real-estate-advisory" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Real Estate Advisory</Link>
              </div>
            </div>

            {/* 3. About Dropdown */}
            <div className="relative group">
              <Link href="/about/our-company" className={`text-sm font-medium transition-colors flex items-center gap-1 ${isActive('/about') ? 'text-brand-emerald' : 'text-brand-charcoal hover:text-brand-emerald'}`}>
                About Us
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </Link>
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50 py-2">
                <Link href="/about/our-company" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Our Company</Link>
                <Link href="/about/mission" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Mission</Link>
                <Link href="/about/vision" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Vision</Link>
                <Link href="/about/core-values" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Core Values</Link>
                <Link href="/about/why-choose-us" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Why Choose Us</Link>
              </div>
            </div>

            {/* 4. Our Team Link */}
            <Link href="/our-team" className={`text-sm font-medium transition-colors ${isActive('/our-team') ? 'text-brand-emerald' : 'text-brand-charcoal hover:text-brand-emerald'}`}>
              Our Team
            </Link>

            {/* 5. Insights Dropdown */}
            <div className="relative group">
              <Link href="/insights/articles" className={`text-sm font-medium transition-colors flex items-center gap-1 ${isActive('/insights') ? 'text-brand-emerald' : 'text-brand-charcoal hover:text-brand-emerald'}`}>
                Insights
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </Link>
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50 py-2">
                <Link href="/insights/articles" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Articles</Link>
                <Link href="/insights/news" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">News</Link>
                <Link href="/insights/property-guides" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Property Guides</Link>
              </div>
            </div>

            {/* 6. FAQs Link */}
            <Link href="/faqs" className={`text-sm font-medium transition-colors ${isActive('/faqs') ? 'text-brand-emerald' : 'text-brand-charcoal hover:text-brand-emerald'}`}>
              FAQs
            </Link>

            {/* 7. Contact Link */}
            <Link href="/contact" className={`text-sm font-medium transition-colors ${isActive('/contact') ? 'text-brand-emerald' : 'text-brand-charcoal hover:text-brand-emerald'}`}>
              Contact
            </Link>
          </nav>

          {/* Call to Action Buttons (Desktop) */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link href="/property-search" className="bg-brand-navy hover:bg-slate-800 text-brand-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm">
               Find a Property
            </Link>
            <Link href="/list-your-property" className="bg-brand-emerald hover:bg-brand-emerald-hover text-brand-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm">
              List Your Property
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-brand-charcoal hover:text-brand-emerald focus:outline-none">
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileMenuOpen ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /> : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-brand-white border-t border-gray-100 shadow-lg overflow-y-auto max-h-[calc(100vh-80px)]">
          <div className="px-4 py-4 space-y-4">
            {/* Top Level Links for Mobile */}
            <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-brand-charcoal">Home</Link>
            <Link href="/properties" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-brand-charcoal">Properties</Link>
            <div className="pl-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-600">
              <Link href="/properties/for-sale" onClick={() => setIsMobileMenuOpen(false)}>For Sale</Link>
              <Link href="/properties/for-rent" onClick={() => setIsMobileMenuOpen(false)}>For Rent</Link>
              <Link href="/properties/for-lease" onClick={() => setIsMobileMenuOpen(false)}>For Lease</Link>
              <Link href="/properties/residential" onClick={() => setIsMobileMenuOpen(false)}>Residential</Link>
              <Link href="/properties/commercial" onClick={() => setIsMobileMenuOpen(false)}>Commercial</Link>
              <Link href="/properties/apartments" onClick={() => setIsMobileMenuOpen(false)}>Apartments</Link>
              <Link href="/properties/houses" onClick={() => setIsMobileMenuOpen(false)}>Houses</Link>
              <Link href="/properties/land" onClick={() => setIsMobileMenuOpen(false)}>Land</Link>
              <Link href="/properties/offices" onClick={() => setIsMobileMenuOpen(false)}>Offices</Link>
              <Link href="/properties/warehouses" onClick={() => setIsMobileMenuOpen(false)}>Warehouses</Link>
              <Link href="/properties/new-developments" onClick={() => setIsMobileMenuOpen(false)}>New Developments</Link>
            </div>
            <Link href="/services" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-brand-charcoal">Services</Link>
            <div className="pl-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-600">
              <Link href="/services/property-sales" onClick={() => setIsMobileMenuOpen(false)}>Property Sales</Link>
              <Link href="/services/property-rentals" onClick={() => setIsMobileMenuOpen(false)}>Property Rentals</Link>
              <Link href="/services/property-leasing" onClick={() => setIsMobileMenuOpen(false)}>Property Leasing</Link>
              <Link href="/services/property-management" onClick={() => setIsMobileMenuOpen(false)}>Property Management</Link>
              <Link href="/services/property-valuation" onClick={() => setIsMobileMenuOpen(false)}>Property Valuation</Link>
              <Link href="/services/property-marketing" onClick={() => setIsMobileMenuOpen(false)}>Property Marketing</Link>
              <Link href="/services/real-estate-advisory" onClick={() => setIsMobileMenuOpen(false)}>Real Estate Advisory</Link>
              <Link href="/services/property-search-services" onClick={() => setIsMobileMenuOpen(false)}>Property Search</Link>
              <Link href="/services/real-estate-consultancy" onClick={() => setIsMobileMenuOpen(false)}>Consultancy</Link>
              <Link href="/services/property-development-marketing" onClick={() => setIsMobileMenuOpen(false)}>Development Marketing</Link>
            </div>
            <Link href="/about/our-company" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-brand-charcoal">About Us</Link>
            <div className="pl-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-600">
              <Link href="/about/mission" onClick={() => setIsMobileMenuOpen(false)}>Mission</Link>
              <Link href="/about/vision" onClick={() => setIsMobileMenuOpen(false)}>Vision</Link>
              <Link href="/about/core-values" onClick={() => setIsMobileMenuOpen(false)}>Core Values</Link>
              <Link href="/about/why-choose-us" onClick={() => setIsMobileMenuOpen(false)}>Why Choose Us</Link>
            </div>
            <Link href="/our-team" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-brand-charcoal">Our Team</Link>
            <Link href="/insights/articles" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-brand-charcoal">Insights</Link>
            <div className="pl-4 grid grid-cols-2 gap-x-4 gap-y-2 text-sm text-slate-600">
              <Link href="/insights/news" onClick={() => setIsMobileMenuOpen(false)}>News</Link>
              <Link href="/insights/property-guides" onClick={() => setIsMobileMenuOpen(false)}>Property Guides</Link>
            </div>
            <Link href="/faqs" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-brand-charcoal">FAQs</Link>
            <Link href="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-brand-charcoal">Contact</Link>
            
            <div className="border-t border-gray-100 pt-4 flex flex-col space-y-3">
              <Link href="/property-search" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center text-brand-white bg-brand-navy hover:bg-slate-800 font-medium px-5 py-3 rounded-md transition-colors">
                Find a Property
              </Link>
              <Link href="/list-your-property" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center bg-brand-emerald hover:bg-brand-emerald-hover text-brand-white px-5 py-3 rounded-md font-medium transition-colors">
                List Your Property
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};