'use client'

import { useState, useEffect } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'

interface Property {
  id: string
  title: string
  price: number
  currency: string
  location: string
  district?: string
  propertyType: string
  transactionType: string
  bedrooms?: number
  bathrooms?: number
  size?: number
  sizeUnit?: string
  propertyImages?: { imageUrl: string; isPrimary?: boolean }[]
  amenities?: string[]
  furnishingStatus?: string
  status?: string
  slug: string
}

interface PropertyComparisonProps {
  properties: Property[]
  onRemove: (propertyId: string) => void
  onClose: () => void
}

export default function PropertyComparison({ properties, onRemove, onClose }: PropertyComparisonProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const visibleProperties = properties.slice(currentIndex, currentIndex + 3)

  const handlePrevious = () => {
    setCurrentIndex(Math.max(0, currentIndex - 1))
  }

  const handleNext = () => {
    setCurrentIndex(Math.min(properties.length - 3, currentIndex + 1))
  }

  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-RW', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price)
  }

  const formatSize = (size: number | undefined, unit: string) => {
    if (!size) return 'N/A'
    return `${size.toLocaleString()} ${unit}`
  }

  const renderRow = (label: string, getValue: (property: Property) => React.ReactNode): React.JSX.Element => (
    <tr className="border-b border-slate-200">
      <td className="py-3 px-4 font-medium text-slate-700 bg-slate-50 sticky left-0">{label}</td>
      {visibleProperties.map((property) => (
        <td key={property.id} className="py-3 px-4 text-center">
          {getValue(property)}
        </td>
      ))}
      {visibleProperties.length < 3 && Array.from({ length: 3 - visibleProperties.length }).map((_, i) => (
        <td key={`empty-${i}`} className="py-3 px-4 text-center text-slate-400">-</td>
      ))}
    </tr>
  )

  if (properties.length === 0) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Property Comparison</h2>
            <p className="text-slate-500 mt-1">Comparing {properties.length} properties</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            aria-label="Close comparison"
          >
            <X className="w-6 h-6 text-slate-600" />
          </button>
        </div>

        {/* Navigation */}
        {properties.length > 3 && (
          <div className="flex items-center justify-center gap-4 p-4 border-b border-slate-200">
            <button
              onClick={handlePrevious}
              disabled={currentIndex === 0}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous properties"
            >
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <span className="text-sm text-slate-600">
              Showing {currentIndex + 1}-{Math.min(currentIndex + 3, properties.length)} of {properties.length}
            </span>
            <button
              onClick={handleNext}
              disabled={currentIndex >= properties.length - 3}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next properties"
            >
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        )}

        {/* Comparison Table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-100">
                <th className="py-4 px-4 text-left font-semibold text-slate-700 sticky left-0 bg-slate-100 z-10">
                  Feature
                </th>
                {visibleProperties.map((property) => (
                  <th key={property.id} className="py-4 px-4 text-center min-w-[300px]">
                    <div className="relative">
                      <button
                        onClick={() => onRemove(property.id)}
                        className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                        aria-label={`Remove ${property.title} from comparison`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="aspect-video mb-3 rounded-lg overflow-hidden bg-slate-200">
                        {property.propertyImages?.[0]?.imageUrl ? (
                          <img
                            src={property.propertyImages[0].imageUrl}
                            alt={property.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400">
                            No image
                          </div>
                        )}
                      </div>
                      <h3 className="font-semibold text-slate-900 line-clamp-2">{property.title}</h3>
                      <p className="text-emerald-600 font-bold mt-1">
                        {formatPrice(property.price, property.currency)}
                      </p>
                    </div>
                  </th>
                ))}
                {visibleProperties.length < 3 && Array.from({ length: 3 - visibleProperties.length }).map((_, i) => (
                  <th key={`empty-${i}`} className="py-4 px-4 text-center min-w-[300px]">
                    <div className="text-slate-400">Empty slot</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {renderRow('Price', (p) => formatPrice(p.price, p.currency))}
              {renderRow('Location', (p) => (
                <div>
                  <div className="font-medium">{p.location}</div>
                  {p.district && <div className="text-sm text-slate-500">{p.district}</div>}
                </div>
              ))}
              {renderRow('Property Type', (p) => p.propertyType)}
              {renderRow('Transaction Type', (p) => p.transactionType)}
              {renderRow('Bedrooms', (p) => p.bedrooms ?? 'N/A')}
              {renderRow('Bathrooms', (p) => p.bathrooms ?? 'N/A')}
              {renderRow('Size', (p) => formatSize(p.size, p.sizeUnit || 'sqm'))}
              {renderRow('Furnishing', (p) => p.furnishingStatus || 'N/A')}
              {renderRow('Status', (p) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  p.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-700' :
                  p.status === 'SOLD' ? 'bg-red-100 text-red-700' :
                  p.status === 'RENTED' ? 'bg-blue-100 text-blue-700' :
                  'bg-slate-100 text-slate-700'
                }`}>
                  {p.status || 'N/A'}
                </span>
              ))}
              {renderRow('Amenities', (p) => (
                <div className="max-w-xs mx-auto">
                  {p.amenities && p.amenities.length > 0 ? (
                    <div className="flex flex-wrap gap-1 justify-center">
                      {p.amenities.slice(0, 3).map((amenity, i) => (
                        <span key={i} className="px-2 py-1 bg-slate-100 rounded text-xs">
                          {amenity}
                        </span>
                      ))}
                      {p.amenities.length > 3 && (
                        <span className="text-xs text-slate-500">+{p.amenities.length - 3} more</span>
                      )}
                    </div>
                  ) : (
                    <span className="text-slate-400">None listed</span>
                  )}
                </div>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2.5 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
