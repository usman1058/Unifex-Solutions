'use client'

import { useEffect, useRef, useState } from 'react'

export function Hero3DInteractive({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0, isHovering: false })
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let width = 0
    let height = 0
    let dpr = 1

    // 3D Nodes for Kinetic Polyhedron / Monolith Matrix
    interface Node3D {
      x: number
      y: number
      z: number
      ox: number
      oy: number
      oz: number
    }

    const nodes: Node3D[] = []
    const numNodes = 28

    // Generate 3D geometry points (Icosahedron / Monolith hybrid structure)
    const phi = (1 + Math.sqrt(5)) / 2
    const baseScale = 140

    const rawCoords = [
      [-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0],
      [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi],
      [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1],
      // Extra inner core nodes
      [-0.5, 0.5, 0.5], [0.5, 0.5, 0.5], [-0.5, -0.5, 0.5], [0.5, -0.5, 0.5],
      [-0.5, 0.5, -0.5], [0.5, 0.5, -0.5], [-0.5, -0.5, -0.5], [0.5, -0.5, -0.5]
    ]

    rawCoords.forEach(([x, y, z]) => {
      const len = Math.sqrt(x * x + y * y + z * z) || 1
      const nx = (x / len) * baseScale
      const ny = (y / len) * baseScale
      const nz = (z / len) * baseScale
      nodes.push({ x: nx, y: ny, z: nz, ox: nx, oy: ny, oz: nz })
    })

    // Floating background particles
    const particles: { x: number; y: number; z: number; size: number; alpha: number; speed: number }[] = []
    for (let i = 0; i < 45; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 800,
        y: (Math.random() - 0.5) * 800,
        z: Math.random() * 400 - 200,
        size: Math.random() * 2 + 1,
        alpha: Math.random() * 0.6 + 0.2,
        speed: Math.random() * 0.5 + 0.2
      })
    }

    const resize = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1)
      const rect = canvas.getBoundingClientRect()
      width = rect.width
      height = rect.height
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
    }

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      mouseRef.current.targetX = x * 2.5
      mouseRef.current.targetY = y * 2.5
      mouseRef.current.isHovering = true
    }

    const handleMouseLeave = () => {
      mouseRef.current.targetX = 0
      mouseRef.current.targetY = 0
      mouseRef.current.isHovering = false
    }

    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    resize()

    let angleX = 0
    let angleY = 0

    const render = () => {
      // Smooth mouse spring interpolation
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05

      angleY += 0.006 + mouseRef.current.x * 0.01
      angleX += 0.003 + mouseRef.current.y * 0.01

      ctx.clearRect(0, 0, width, height)

      const centerX = width / 2 + mouseRef.current.x * 40
      const centerY = height / 2 + mouseRef.current.y * 40
      const fov = 400

      // Render floating background particles
      particles.forEach((p) => {
        p.y -= p.speed
        if (p.y < -height / 2) p.y = height / 2

        const scale = fov / (fov + p.z)
        const px = centerX + p.x * scale
        const py = centerY + p.y * scale

        ctx.beginPath()
        ctx.arc(px, py, p.size * scale, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(245, 158, 11, ${p.alpha * 0.5})`
        ctx.fill()
      })

      // Project 3D nodes to 2D screen coordinates
      const projected: { x: number; y: number; z: number; scale: number }[] = []

      nodes.forEach((node) => {
        // Rotation matrices (Y then X)
        const cosY = Math.cos(angleY)
        const sinY = Math.sin(angleY)
        const x1 = node.ox * cosY - node.oz * sinY
        const z1 = node.ox * sinY + node.oz * cosY

        const cosX = Math.cos(angleX)
        const sinX = Math.sin(angleX)
        const y2 = node.oy * cosX - z1 * sinX
        const z2 = node.oy * sinX + z1 * cosX

        const scale = fov / (fov + z2 + 100)
        const projX = centerX + x1 * scale
        const projY = centerY + y2 * scale

        projected.push({ x: projX, y: projY, z: z2, scale })
      })

      // Draw wireframe connecting lines between close 3D nodes
      for (let i = 0; i < projected.length; i++) {
        for (let j = i + 1; j < projected.length; j++) {
          const p1 = projected[i]
          const p2 = projected[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 130 * ((p1.scale + p2.scale) / 2)) {
            const alpha = (1 - dist / (130 * ((p1.scale + p2.scale) / 2))) * 0.35
            ctx.beginPath()
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)

            // Gradient line for kinetic glow
            const gradient = ctx.createLinearGradient(p1.x, p1.y, p2.x, p2.y)
            gradient.addColorStop(0, `rgba(245, 158, 11, ${alpha * 1.2})`)
            gradient.addColorStop(0.5, `rgba(251, 191, 36, ${alpha * 0.8})`)
            gradient.addColorStop(1, `rgba(217, 119, 6, ${alpha * 0.3})`)

            ctx.strokeStyle = gradient
            ctx.lineWidth = 1.2 * p1.scale
            ctx.stroke()
          }
        }
      }

      // Draw 3D glowing vertex nodes
      projected.forEach((p) => {
        const radius = Math.max(1.5, 3.5 * p.scale)
        ctx.beginPath()
        ctx.arc(p.x, p.y, radius, 0, Math.PI * 2)

        // Radial glow
        const radGlow = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, radius * 3)
        radGlow.addColorStop(0, 'rgba(255, 255, 255, 0.9)')
        radGlow.addColorStop(0.4, 'rgba(245, 158, 11, 0.7)')
        radGlow.addColorStop(1, 'rgba(245, 158, 11, 0)')

        ctx.fillStyle = radGlow
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isClient])

  return (
    <div className={`relative w-full h-full pointer-events-auto ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
}
