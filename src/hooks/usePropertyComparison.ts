'use client'

import { useState, useEffect } from 'react'

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

const COMPARISON_STORAGE_KEY = 'ingata_property_comparison'

export function usePropertyComparison() {
  const [comparingProperties, setComparingProperties] = useState<Property[]>([])
  const [isComparisonOpen, setIsComparisonOpen] = useState(false)

  // Load comparison from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(COMPARISON_STORAGE_KEY)
      if (stored) {
        setComparingProperties(JSON.parse(stored))
      }
    } catch (error) {
      console.error('Failed to load comparison from localStorage:', error)
    }
  }, [])

  // Save comparison to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(COMPARISON_STORAGE_KEY, JSON.stringify(comparingProperties))
    } catch (error) {
      console.error('Failed to save comparison to localStorage:', error)
    }
  }, [comparingProperties])

  const addToComparison = (property: Property) => {
    if (comparingProperties.length >= 5) {
      return { success: false, message: 'You can compare up to 5 properties at a time' }
    }

    if (comparingProperties.some(p => p.id === property.id)) {
      return { success: false, message: 'This property is already in comparison' }
    }

    setComparingProperties([...comparingProperties, property])
    return { success: true, message: 'Property added to comparison' }
  }

  const removeFromComparison = (propertyId: string) => {
    setComparingProperties(comparingProperties.filter(p => p.id !== propertyId))
  }

  const clearComparison = () => {
    setComparingProperties([])
  }

  const toggleComparison = (property: Property) => {
    const isComparing = comparingProperties.some(p => p.id === property.id)
    if (isComparing) {
      removeFromComparison(property.id)
      return { success: true, message: 'Property removed from comparison' }
    } else {
      return addToComparison(property)
    }
  }

  const isComparing = (propertyId: string) => {
    return comparingProperties.some(p => p.id === propertyId)
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
