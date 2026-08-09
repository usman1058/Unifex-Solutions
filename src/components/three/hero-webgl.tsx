'use client'

import { useEffect, useMemo, useRef } from 'react'

function prefersReducedMotion() {
  if (typeof window === 'undefined') return true
  return window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches ?? false
}

function createShader(gl: WebGLRenderingContext, type: number, src: string) {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('Failed to create shader')
  gl.shaderSource(shader, src)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader) ?? 'Unknown shader error'
    gl.deleteShader(shader)
    throw new Error(info)
  }
  return shader
}

function createProgram(gl: WebGLRenderingContext, vsSrc: string, fsSrc: string) {
  const vs = createShader(gl, gl.VERTEX_SHADER, vsSrc)
  const fs = createShader(gl, gl.FRAGMENT_SHADER, fsSrc)
  const program = gl.createProgram()
  if (!program) throw new Error('Failed to create program')
  gl.attachShader(program, vs)
  gl.attachShader(program, fs)
  gl.linkProgram(program)
  gl.deleteShader(vs)
  gl.deleteShader(fs)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program) ?? 'Unknown program error'
    gl.deleteProgram(program)
    throw new Error(info)
  }
  return program
}

export function HeroWebGL({
  className,
  intensity = 0.9,
}: {
  className?: string
  intensity?: number
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const supportsWebGL = useMemo(() => {
    if (typeof document === 'undefined') return false
    const c = document.createElement('canvas')
    return Boolean(c.getContext('webgl') || c.getContext('experimental-webgl'))
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (!supportsWebGL) return
    if (prefersReducedMotion()) return

    const gl = canvas.getContext('webgl', { antialias: true, alpha: true, premultipliedAlpha: false })
    if (!gl) return

    const vsSrc = `
      attribute vec2 a_pos;
      varying vec2 v_uv;
      void main() {
        v_uv = (a_pos + 1.0) * 0.5;
        gl_Position = vec4(a_pos, 0.0, 1.0);
      }
    `

    const fsSrc = `
      precision mediump float;
      varying vec2 v_uv;
      uniform float u_time;
      uniform vec2 u_res;
      uniform float u_intensity;

      float hash(vec2 p) {
        p = fract(p * vec2(123.34, 456.21));
        p += dot(p, p + 34.345);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
      }

      void main() {
        vec2 uv = v_uv;
        vec2 p = (uv - 0.5) * vec2(u_res.x / u_res.y, 1.0);

        float t = u_time * 0.12;
        float n = 0.0;
        n += noise(p * 2.0 + vec2(t, -t)) * 0.55;
        n += noise(p * 5.0 - vec2(t * 1.3, t * 0.9)) * 0.25;
        n += noise(p * 11.0 + vec2(-t * 1.7, t * 1.1)) * 0.12;

        float vignette = smoothstep(0.95, 0.25, length(p));

        vec3 amber = vec3(1.0, 0.72, 0.48);
        vec3 ember = vec3(1.0, 0.56, 0.0);
        vec3 base = mix(amber, ember, smoothstep(0.25, 0.95, n));

        float glow = pow(max(0.0, 1.0 - length(p) * 0.95), 2.2);
        vec3 col = base * (0.35 + 0.9 * glow) * vignette;

        float alpha = (0.18 + 0.22 * glow) * u_intensity;
        gl_FragColor = vec4(col, alpha);
      }
    `

    let program: WebGLProgram
    try {
      program = createProgram(gl, vsSrc, fsSrc)
    } catch {
      return
    }

    const posLoc = gl.getAttribLocation(program, 'a_pos')
    const timeLoc = gl.getUniformLocation(program, 'u_time')
    const resLoc = gl.getUniformLocation(program, 'u_res')
    const intensityLoc = gl.getUniformLocation(program, 'u_intensity')

    const quad = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, quad)
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW,
    )

    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const rect = canvas.getBoundingClientRect()
      const w = Math.max(1, Math.floor(rect.width * dpr))
      const h = Math.max(1, Math.floor(rect.height * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
      gl.useProgram(program)
      gl.uniform2f(resLoc, canvas.width, canvas.height)
    }

    let raf = 0
    let start = performance.now()
    let isVisible = true

    const io = new IntersectionObserver(
      (entries) => {
        isVisible = entries.some((e) => e.isIntersecting)
      },
      { root: null, threshold: 0.01 },
    )
    io.observe(canvas)

    const render = (now: number) => {
      raf = requestAnimationFrame(render)
      if (!isVisible) return

      resize()
      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)

      gl.useProgram(program)
      gl.uniform1f(timeLoc, (now - start) / 1000)
      gl.uniform1f(intensityLoc, intensity)

      gl.bindBuffer(gl.ARRAY_BUFFER, quad)
      gl.enableVertexAttribArray(posLoc)
      gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 0, 0)
      gl.drawArrays(gl.TRIANGLES, 0, 6)
    }

    const onResize = () => resize()
    window.addEventListener('resize', onResize)
    resize()
    raf = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('resize', onResize)
      cancelAnimationFrame(raf)
      io.disconnect()
      gl.deleteBuffer(quad)
      gl.deleteProgram(program)
    }
  }, [intensity, supportsWebGL])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden="true"
    />
  )
}

