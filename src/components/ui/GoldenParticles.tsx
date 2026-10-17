'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  size: number
  speedX: number
  speedY: number
  opacity: number
  pulseSpeed: number
  pulseOffset: number
}

export default function GoldenParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const particlesRef = useRef<Particle[]>([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) {
      return
    }

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Create particles
    const createParticles = () => {
      const particles: Particle[] = []
      const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 25000)) as number // Limit density based on screen size

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          size: Math.random() * 3 + 1, // Size between 1 and 4
          speedX: (Math.random() - 0.5) * 0.3, // Very slow horizontal movement
          speedY: (Math.random() - 0.5) * 0.3, // Very slow vertical movement
          opacity: Math.random() * 0.5 + 0.2, // Opacity between 0.2 and 0.7
          pulseSpeed: Math.random() * 0.02 + 0.01,
          pulseOffset: Math.random() * Math.PI * 2,
        })
      }
      return particles
    }

    particlesRef.current = createParticles()

    // Animation loop
    let time = 0
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 1

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around screen
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Calculate pulsing opacity
        const pulse = Math.sin(time * particle.pulseSpeed + particle.pulseOffset)
        const currentOpacity = particle.opacity + (pulse * 0.1)

        // Draw particle with golden glow
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        
        // Golden color: #D4AF37 (golden) with opacity
        ctx.fillStyle = `rgba(212, 175, 55, ${Math.max(0, Math.min(1, currentOpacity))})`
        ctx.fill()

        // Add subtle glow
        ctx.shadowBlur = particle.size * 2
        ctx.shadowColor = `rgba(212, 175, 55, ${currentOpacity * 0.5})`
        ctx.fill()
        ctx.shadowBlur = 0
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
