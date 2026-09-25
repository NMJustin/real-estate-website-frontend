import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

export const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-brand-white shadow-sm font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/images/ingata_logo.png" 
                alt="Ingata Real Estate Logo" 
                className="h-12 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Desktop Navigation with Full Dropdowns */}
          <nav className="hidden lg:flex space-x-6">
            <Link to="/" className={`text-sm font-medium transition-colors ${isActive('/') ? 'text-brand-emerald' : 'text-brand-charcoal hover:text-brand-emerald'}`}>
              Home
            </Link>

            {/* 1. Properties Dropdown */}
            <div className="relative group">
              <Link to="/properties" className={`text-sm font-medium transition-colors flex items-center gap-1 ${isActive('/properties') ? 'text-brand-emerald' : 'text-brand-charcoal hover:text-brand-emerald'}`}>
                Properties
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </Link>
              <div className="absolute left-0 mt-2 w-52 bg-white border border-gray-100 shadow-lg rounded-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50 py-2">
                <Link to="/properties/for-sale" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">For Sale</Link>
                <Link to="/properties/for-rent" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">For Rent</Link>
                <Link to="/properties/for-lease" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">For Lease</Link>
                <div className="border-t border-gray-100 my-1"></div>
                <Link to="/properties/residential" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Residential</Link>
                <Link to="/properties/commercial" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Commercial</Link>
                <Link to="/properties/apartments" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Apartments</Link>
                <Link to="/properties/houses" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Houses</Link>
                <Link to="/properties/land" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Land</Link>
                <Link to="/properties/offices" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Offices</Link>
                <Link to="/properties/warehouses" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Warehouses</Link>
                <div className="border-t border-gray-100 my-1"></div>
                <Link to="/properties/new-developments" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">New Developments</Link>
              </div>
            </div>

            {/* 2. Services Dropdown */}
            <div className="relative group">
              <Link to="/services" className={`text-sm font-medium transition-colors flex items-center gap-1 ${isActive('/services') ? 'text-brand-emerald' : 'text-brand-charcoal hover:text-brand-emerald'}`}>
                Services
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </Link>
              <div className="absolute left-0 mt-2 w-60 bg-white border border-gray-100 shadow-lg rounded-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50 py-2">
                <Link to="/services/property-sales" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Property Sales</Link>
                <Link to="/services/property-rentals" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Property Rentals</Link>
                <Link to="/services/property-leasing" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Property Leasing</Link>
                <Link to="/services/property-management" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Property Management</Link>
                <Link to="/services/property-valuation" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Property Valuation</Link>
                <Link to="/services/property-marketing" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Property Marketing</Link>
                <Link to="/services/real-estate-advisory" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Real Estate Advisory</Link>
              </div>
            </div>

            {/* 3. About Dropdown */}
            <div className="relative group">
              <Link to="/about/our-company" className={`text-sm font-medium transition-colors flex items-center gap-1 ${isActive('/about') ? 'text-brand-emerald' : 'text-brand-charcoal hover:text-brand-emerald'}`}>
                About Us
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </Link>
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50 py-2">
                <Link to="/about/our-company" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Our Company</Link>
                <Link to="/about/mission" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Mission</Link>
                <Link to="/about/vision" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Vision</Link>
                <Link to="/about/core-values" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Core Values</Link>
                <Link to="/about/why-choose-us" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Why Choose Us</Link>
              </div>
            </div>

            {/* 4. Our Team Link */}
            <Link to="/our-team" className={`text-sm font-medium transition-colors ${isActive('/our-team') ? 'text-brand-emerald' : 'text-brand-charcoal hover:text-brand-emerald'}`}>
              Our Team
            </Link>

            {/* 5. Insights Dropdown */}
            <div className="relative group">
              <Link to="/insights/articles" className={`text-sm font-medium transition-colors flex items-center gap-1 ${isActive('/insights') ? 'text-brand-emerald' : 'text-brand-charcoal hover:text-brand-emerald'}`}>
                Insights
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </Link>
              <div className="absolute left-0 mt-2 w-48 bg-white border border-gray-100 shadow-lg rounded-md opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all duration-200 z-50 py-2">
                <Link to="/insights/articles" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Articles</Link>
                <Link to="/insights/news" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">News</Link>
                <Link to="/insights/property-guides" className="block px-4 py-2 text-sm text-brand-charcoal hover:bg-brand-background hover:text-brand-emerald">Property Guides</Link>
              </div>
            </div>

            {/* 6. FAQs Link */}
            <Link to="/faqs" className={`text-sm font-medium transition-colors ${isActive('/faqs') ? 'text-brand-emerald' : 'text-brand-charcoal hover:text-brand-emerald'}`}>
              FAQs
            </Link>

            {/* 7. Contact Link */}
            <Link to="/contact" className={`text-sm font-medium transition-colors ${isActive('/contact') ? 'text-brand-emerald' : 'text-brand-charcoal hover:text-brand-emerald'}`}>
              Contact
            </Link>
          </nav>

          {/* Call to Action Buttons (Desktop) */}
          <div className="hidden lg:flex items-center space-x-4">
            <Link to="/property-search" className="bg-brand-navy hover:bg-slate-800 text-brand-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm">
               Find a Property
            </Link>
            <Link to="/list-your-property" className="bg-brand-emerald hover:bg-brand-emerald-hover text-brand-white px-4 py-2.5 rounded-md text-sm font-medium transition-colors duration-200 shadow-sm">
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
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-brand-charcoal">Home</Link>
            <Link to="/properties" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-brand-charcoal">Properties</Link>
            <Link to="/services" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-brand-charcoal">Services</Link>
            <Link to="/about/our-company" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-brand-charcoal">About Us</Link>
            <Link to="/our-team" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-brand-charcoal">Our Team</Link>
            <Link to="/insights/articles" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-brand-charcoal">Insights</Link>
            <Link to="/faqs" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-brand-charcoal">FAQs</Link>
            <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block text-base font-medium text-brand-charcoal">Contact</Link>
            
            <div className="border-t border-gray-100 pt-4 flex flex-col space-y-3">
              <Link to="/property-search" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center text-brand-white bg-brand-navy hover:bg-slate-800 font-medium px-5 py-3 rounded-md transition-colors">
                Find a Property
              </Link>
              <Link to="/list-your-property" onClick={() => setIsMobileMenuOpen(false)} className="block w-full text-center bg-brand-emerald hover:bg-brand-emerald-hover text-brand-white px-5 py-3 rounded-md font-medium transition-colors">
                List Your Property
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};