'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Scale, X, ArrowRight, Trash2 } from 'lucide-react'
import { usePropertyComparison } from '@/hooks/usePropertyComparison'
import PropertyComparison from './PropertyComparison'

export default function PropertyComparisonBar() {
  const { comparingProperties, removeFromComparison, clearComparison } = usePropertyComparison()
  const [isModalOpen, setIsModalOpen] = useState(false)

  if (!comparingProperties || comparingProperties.length === 0) {
    return null
  }

  return (
    <>
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-4xl bg-brand-navy/95 backdrop-blur-md text-white rounded-2xl shadow-2xl p-3 sm:p-4 border border-white/10 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5">
        <div className="flex flex-wrap items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 flex-shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm sm:text-base">Compare Properties</span>
                <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {comparingProperties.length} / 5
                </span>
              </div>
              <p className="text-xs text-slate-300 hidden sm:block">
                Select up to 5 properties to compare side-by-side
              </p>
            </div>
          </div>

          {/* Property Thumbnails Strip */}
          <div className="flex items-center gap-2 overflow-x-auto py-1 max-w-full sm:max-w-md">
            {comparingProperties.map((prop) => (
              <div
                key={prop.id}
                className="relative group flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border border-white/20 bg-slate-800"
                title={prop.title}
              >
                {prop.propertyImages?.[0]?.imageUrl ? (
                  <img
                    src={prop.propertyImages[0].imageUrl}
                    alt={prop.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-[10px] text-slate-400">
                    No img
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => removeFromComparison(prop.id)}
                  aria-label={`Remove ${prop.title}`}
                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity"
                >
                  <X className="w-4 h-4 text-red-400" />
                </button>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={clearComparison}
              className="px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition-colors flex items-center gap-1"
              title="Clear comparison list"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clear</span>
            </button>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 text-xs sm:text-sm font-semibold bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-md transition-all flex items-center gap-1.5"
            >
              <span>Quick Compare</span>
            </button>

            <Link
              href="/compare-properties"
              className="px-4 py-2 text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all flex items-center gap-1"
            >
              <span>Full Page</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <PropertyComparison
          properties={comparingProperties as any}
          onRemove={removeFromComparison}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  )
}
