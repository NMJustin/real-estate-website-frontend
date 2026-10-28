'use client'

import { useState, useEffect, useCallback } from 'react'
import api from '@/services/api'
import { useAuth } from '@/context/AuthContext'

const FAVORITES_STORAGE_KEY = 'ingata_saved_favorites'
const FAVORITES_EVENT = 'ingata_favorites_changed'

export function useFavorites() {
  const { user, isAuthenticated } = useAuth()
  const [favoriteIds, setFavoriteIds] = useState<string[]>([])
  const [favoriteRecords, setFavoriteRecords] = useState<Record<string, string>>({})
  const [isLoading, setIsLoading] = useState(false)

  const loadFavorites = useCallback(async () => {
    if (typeof window === 'undefined') return

    // 1. If authenticated, fetch from backend
    if (isAuthenticated && user?.id) {
      try {
        setIsLoading(true)
        const res = (await api.getFavorites(user.id)) as {
          data: { id: string; propertyId?: string; property?: { id: string } }[]
        }
        const data = res.data || []
        const ids: string[] = []
        const records: Record<string, string> = {}
        data.forEach((fav) => {
          const propId = fav.propertyId || fav.property?.id
          if (propId) {
            ids.push(propId)
            records[propId] = fav.id
          }
        })
        setFavoriteIds(ids)
        setFavoriteRecords(records)
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(ids))
        return
      } catch (err) {
        console.error('Failed to load favorites from backend:', err)
      } finally {
        setIsLoading(false)
      }
    }

    // 2. Fallback to localStorage
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY)
      if (stored) {
        setFavoriteIds(JSON.parse(stored))
      } else {
        setFavoriteIds([])
      }
    } catch {}
  }, [isAuthenticated, user?.id])

  useEffect(() => {
    loadFavorites()

    const handleSync = () => {
      loadFavorites()
    }
    window.addEventListener(FAVORITES_EVENT, handleSync)
    return () => window.removeEventListener(FAVORITES_EVENT, handleSync)
  }, [loadFavorites])

  const notifyChange = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent(FAVORITES_EVENT))
    }
  }

  const isFavorited = useCallback(
    (propertyId: string) => {
      return favoriteIds.includes(propertyId)
    },
    [favoriteIds]
  )

  const toggleFavorite = useCallback(
    async (propertyId: string) => {
      const isCurrentlyFav = favoriteIds.includes(propertyId)
      const newIds = isCurrentlyFav
        ? favoriteIds.filter((id) => id !== propertyId)
        : [...favoriteIds, propertyId]

      setFavoriteIds(newIds)
      if (typeof window !== 'undefined') {
        localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(newIds))
      }
      notifyChange()

      if (isAuthenticated && user?.id) {
        try {
          if (isCurrentlyFav) {
            const favoriteId = favoriteRecords[propertyId]
            if (favoriteId) {
              await api.removeFavorite(favoriteId)
            } else {
              const res = (await api.getFavorites(user.id)) as {
                data: { id: string; propertyId?: string; property?: { id: string } }[]
              }
              const match = res.data?.find((f) => (f.propertyId || f.property?.id) === propertyId)
              if (match) await api.removeFavorite(match.id)
            }
          } else {
            const res = (await api.addFavorite(user.id, propertyId)) as { data: { id: string } }
            if (res?.data?.id) {
              setFavoriteRecords((prev) => ({ ...prev, [propertyId]: res.data.id }))
            }
          }
        } catch (err) {
          console.error('Failed to toggle favorite on backend:', err)
        }
      }

      return !isCurrentlyFav
    },
    [favoriteIds, favoriteRecords, isAuthenticated, user?.id]
  )

  return {
    favoriteIds,
    isFavorited,
    toggleFavorite,
    isLoading,
    refreshFavorites: loadFavorites,
  }
}
