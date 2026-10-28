'use client'

import { useState, useEffect } from 'react'

export interface Property {
  id: string
  title: string
  price: number | string
  currency?: string
  location?: string
  district?: string
  propertyType?: string
  transactionType?: string
  bedrooms?: number
  bathrooms?: number
  size?: number | string
  sizeUnit?: string
  propertyImages?: { imageUrl: string; isPrimary?: boolean }[]
  amenities?: string[]
  furnishingStatus?: string
  status?: string
  slug: string
}

const COMPARISON_STORAGE_KEY = 'ingata_property_comparison'

const notifyChange = (updated: Property[]) => {
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(updated))
      window.dispatchEvent(new CustomEvent('ingata_property_comparison_changed', { detail: updated }))
    } catch (e) {
      console.error('Failed to notify comparison change:', e)
    }
  }
}

export function usePropertyComparison() {
  const [comparingProperties, setComparingProperties] = useState<Property[]>([])
  const [isComparisonOpen, setIsComparisonOpen] = useState(false)

  // Load comparison from localStorage on mount & listen for sync events
  useEffect(() => {
    try {
      const stored = localStorage.getItem(COMPARISON_STORAGE_KEY)
      if (stored) {
        setComparingProperties(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Failed to load comparison from localStorage:', error)
    }

    const handleSync = (e: Event) => {
      const customEvent = e as CustomEvent<Property[]>
      if (customEvent.detail) {
        setComparingProperties(customEvent.detail)
      } else {
        try {
          const stored = localStorage.getItem(COMPARISON_STORAGE_KEY)
          if (stored) {
            setComparingProperties(JSON.parse(stored))
          } else {
            setComparingProperties([])
          }
        } catch {}
      }
    }

    window.addEventListener('ingata_property_comparison_changed', handleSync)
    return () => window.removeEventListener('ingata_property_comparison_changed', handleSync)
  }, [])

  const addToComparison = (property: Property) => {
    if (comparingProperties.length >= 5) {
      return { success: false, message: 'You can compare up to 5 properties at a time' }
    }

    if (comparingProperties.some((p) => p.id === property.id)) {
      return { success: false, message: 'This property is already in comparison' }
    }

    const updated = [...comparingProperties, property]
    setComparingProperties(updated)
    notifyChange(updated)
    return { success: true, message: 'Property added to comparison' }
  }

  const removeFromComparison = (propertyId: string) => {
    const updated = comparingProperties.filter((p) => p.id !== propertyId)
    setComparingProperties(updated)
    notifyChange(updated)
  }

  const clearComparison = () => {
    setComparingProperties([])
    notifyChange([])
  }

  const toggleComparison = (property: Property) => {
    const isComp = comparingProperties.some((p) => p.id === property.id)
    if (isComp) {
      removeFromComparison(property.id)
      return { success: true, message: 'Property removed from comparison' }
    } else {
      return addToComparison(property)
    }
  }

  const isComparing = (propertyId: string) => {
    return comparingProperties.some((p) => p.id === propertyId)
  }

  return {
    comparingProperties,
    isComparisonOpen,
    setIsComparisonOpen,
    addToComparison,
    removeFromComparison,
    clearComparison,
    toggleComparison,
    isComparing,
  }
}
