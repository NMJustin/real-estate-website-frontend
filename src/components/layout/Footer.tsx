import React from 'react';
import { Link } from 'react-router-dom';

export function Footer() {
  return (
    <footer className="bg-brand-navy text-slate-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-brand-emerald rounded flex items-center justify-center text-white font-bold text-xl">R</div>
            <span className="font-bold text-xl text-white tracking-tight">RealEstate</span>
          </div>
          <p className="text-sm">Providing exceptional real estate services with a focus on trust and modern solutions.</p>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Properties</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/properties/for-sale" className="hover:text-white transition-colors">For Sale</Link></li>
            <li><Link to="/properties/for-rent" className="hover:text-white transition-colors">For Rent</Link></li>
            <li><Link to="/properties/commercial" className="hover:text-white transition-colors">Commercial</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Company</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about/our-company" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link to="/our-team" className="hover:text-white transition-colors">Our Team</Link></li>
            <li><Link to="/contact-us" className="hover:text-white transition-colors">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white font-semibold mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy-policy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link to="/terms-and-conditions" className="hover:text-white transition-colors">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-700 text-sm text-center">
        &copy; {new Date().getFullYear()} RealEstate. All rights reserved.
      </div>
    </footer>
  );
}
