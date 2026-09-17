import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../ui/Button';

export function Header() {
  return (
    <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-brand-emerald rounded flex items-center justify-center text-white font-bold text-xl">R</div>
          <span className="font-bold text-xl text-brand-navy tracking-tight">RealEstate</span>
        </Link>
        
        <nav className="hidden xl:flex gap-6 items-center text-sm">
          <Link to="/" className="text-brand-charcoal hover:text-brand-emerald font-medium transition-colors">Home</Link>
          <Link to="/properties" className="text-brand-charcoal hover:text-brand-emerald font-medium transition-colors">Properties</Link>
          <Link to="/services" className="text-brand-charcoal hover:text-brand-emerald font-medium transition-colors">Services</Link>
          <Link to="/about/our-company" className="text-brand-charcoal hover:text-brand-emerald font-medium transition-colors">About Us</Link>
          <Link to="/our-team" className="text-brand-charcoal hover:text-brand-emerald font-medium transition-colors">Our Team</Link>
          <Link to="/insights/articles" className="text-brand-charcoal hover:text-brand-emerald font-medium transition-colors">Insights</Link>
          <Link to="/faqs" className="text-brand-charcoal hover:text-brand-emerald font-medium transition-colors">FAQs</Link>
          <Link to="/contact" className="text-brand-charcoal hover:text-brand-emerald font-medium transition-colors">Contact</Link>
        </nav>
        
        <div className="flex items-center gap-3">
          <Link to="/properties" className="hidden lg:block">
            <Button variant="primary">Find a Property</Button>
          </Link>
          <Link to="/list-your-property" className="hidden sm:block">
            <Button variant="secondary">List Your Property</Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
