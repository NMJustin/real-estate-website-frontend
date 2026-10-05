'use client'

import { Link } from '@/navigation/legacy-router';
import { ArrowLeft } from 'lucide-react';

export default function PropertyDevelopmentMarketing() {
  return (
    <main className="bg-slate-50 py-12 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link to="/services" className="text-emerald-600 hover:underline text-sm font-medium">
            <><ArrowLeft className="mr-1 inline h-4 w-4" aria-hidden="true" />Back to Services</>
          </Link>
        </div>
        
        <div className="max-w-3xl">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-6">Property Development Marketing</h1>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 sm:p-8">
            <p className="text-slate-600 mb-6 leading-relaxed">
              Our Property Development Marketing service provides marketing solutions for new developments and construction projects. 
              We help developers showcase their projects to potential buyers and investors.
            </p>
            
            <h2 className="text-xl font-bold text-slate-900 mb-4">Development Marketing</h2>
            <ul className="space-y-3 text-slate-600 mb-6">
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Pre-launch marketing campaigns</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Show home and sales center setup</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Developer branding and positioning</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-emerald-600 mt-1">•</span>
                <span>Buyer database management</span>
              </li>
            </ul>
            
            <Link
              to="/contact"
              className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}