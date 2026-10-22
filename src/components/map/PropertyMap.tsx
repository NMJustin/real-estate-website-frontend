'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

interface PropertyMapProps {
  latitude: number
  longitude: number
  address?: string
  className?: string
}

// Fix for default marker icons in Leaflet with Next.js
const createCustomIcon = () => {
  return L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  })
}

export default function PropertyMap({ latitude, longitude, address, className = '' }: PropertyMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    if (!mapRef.current || !latitude || !longitude) return

    // Initialize map only once
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        center: [latitude, longitude],
        zoom: 15,
        scrollWheelZoom: false,
      })

      // Add OpenStreetMap tiles (free, no API key required)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(mapInstanceRef.current)
    }

    // Update center if coordinates change
    mapInstanceRef.current.setView([latitude, longitude], 15)

    // Remove existing marker if any
    if (markerRef.current) {
      mapInstanceRef.current.removeLayer(markerRef.current)
    }

    // Add marker
    const customIcon = createCustomIcon()
    markerRef.current = L.marker([latitude, longitude], { icon: customIcon }).addTo(mapInstanceRef.current)

    // Add popup with address if provided
    if (address) {
      markerRef.current.bindPopup(address).openPopup()
    }

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [latitude, longitude, address])

  return (
    <div
      ref={mapRef}
      className={`w-full h-64 md:h-96 rounded-lg shadow-md ${className}`}
      style={{ minHeight: '300px' }}
    />
  )
}
