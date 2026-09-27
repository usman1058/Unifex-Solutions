'use client'

import { useEffect, useRef, useState } from 'react'
import { Download, Film, Loader2, Scissors, Upload, X } from 'lucide-react'

const MAX_VIDEO_SIZE = 500 * 1024 * 1024

export default function VideoClipper() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const ffmpegRef = useRef<any>(null)
  const [file, setFile] = useState<File | null>(null)
  const [sourceUrl, setSourceUrl] = useState('')
  const [outputUrl, setOutputUrl] = useState('')
  const [duration, setDuration] = useState(0)
  const [start, setStart] = useState(0)
  const [end, setEnd] = useState(0)
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => () => {
    if (sourceUrl) URL.revokeObjectURL(sourceUrl)
    if (outputUrl) URL.revokeObjectURL(outputUrl)
  }, [sourceUrl, outputUrl])

  const chooseFile = (next: File | undefined) => {
    if (!next) return
    setError('')
    setOutputUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return ''
    })
    if (!next.type.startsWith('video/')) {
      setError('Choose a video file.')
      return
    }
    if (next.size > MAX_VIDEO_SIZE) {
      setError('Videos must be 500 MB or smaller.')
      return
    }
    if (sourceUrl) URL.revokeObjectURL(sourceUrl)
    const url = URL.createObjectURL(next)
    setFile(next)
    setSourceUrl(url)
    setDuration(0)
    setStart(0)
    setEnd(0)
  }

  const handleLoadedMetadata = () => {
    const value = videoRef.current?.duration || 0
    setDuration(value)
    setEnd(value)
  }

  const clip = async () => {
    if (!file || !duration) return
    if (start < 0 || end <= start || end > duration) {
      setError('Choose a valid start and end time.')
      return
    }

    setLoading(true)
    setProgress(0)
    setError('')
    try {
      const { FFmpeg } = await import('@ffmpeg/ffmpeg')
      const { fetchFile, toBlobURL } = await import('@ffmpeg/util')
      const ffmpeg = ffmpegRef.current || new FFmpeg()
      ffmpegRef.current = ffmpeg
      if (!ffmpeg.loaded) {
        const base = 'https://unpkg.com/@ffmpeg/core@0.12.10/dist/umd'
        await ffmpeg.load({
          coreURL: await toBlobURL(`${base}/ffmpeg-core.js`, 'text/javascript'),
          wasmURL: await toBlobURL(`${base}/ffmpeg-core.wasm`, 'application/wasm'),
        })
      }
      ffmpeg.on('progress', ({ progress: value }: { progress: number }) => setProgress(Math.round(value * 100)))
      const inputName = `input-${Date.now()}.${file.name.split('.').pop() || 'mp4'}`
      const outputName = 'unifex-clip.mp4'
      await ffmpeg.writeFile(inputName, await fetchFile(file))
      await ffmpeg.exec([
        '-ss', start.toFixed(3),
        '-i', inputName,
        '-t', (end - start).toFixed(3),
        '-c:v', 'libx264',
        '-preset', 'veryfast',
        '-c:a', 'aac',
        outputName,
      ])
      const data = await ffmpeg.readFile(outputName)
      const blob = new Blob([data], { type: 'video/mp4' })
      setOutputUrl(URL.createObjectURL(blob))
      await ffmpeg.deleteFile(inputName)
      await ffmpeg.deleteFile(outputName)
      setProgress(100)
    } catch (clipError) {
      console.error('Video clipping failed:', clipError)
      setError('The video could not be clipped in this browser. Try a smaller MP4/WebM file.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-primary"><Film className="h-5 w-5" /><span className="text-xs font-bold uppercase tracking-[0.2em]">Video clipper</span></div>
          <h2 className="text-2xl font-bold">Trim a video locally</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">Your video stays in this browser. Select a range, process it with WebAssembly, and download the MP4 clip.</p>
        </div>
        {file && <button type="button" onClick={() => { setFile(null); setSourceUrl(''); setOutputUrl(''); setDuration(0) }} className="rounded-lg p-2 text-muted-foreground hover:bg-muted" aria-label="Clear video"><X className="h-5 w-5" /></button>}
      </div>

      {!file ? (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-primary/40 bg-primary/5 px-6 py-16 text-center hover:bg-primary/10">
          <Upload className="mb-4 h-8 w-8 text-primary" />
          <span className="font-semibold">Choose a video</span>
          <span className="mt-2 text-xs text-muted-foreground">MP4/WebM recommended · up to 500 MB</span>
          <input type="file" accept="video/*" className="sr-only" onChange={(event) => chooseFile(event.target.files?.[0])} />
        </label>
      ) : (
        <div className="space-y-6">
          <video ref={videoRef} src={sourceUrl} controls onLoadedMetadata={handleLoadedMetadata} className="max-h-[28rem] w-full rounded-xl bg-black" />
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm font-medium">Start (seconds)<input type="number" min={0} max={Math.max(0, end - 0.1)} step={0.1} value={start} onChange={(event) => setStart(Number(event.target.value))} className="mt-2 w-full rounded-lg border bg-background px-3 py-2" /></label>
            <label className="text-sm font-medium">End (seconds)<input type="number" min={Math.min(duration, start + 0.1)} max={duration} step={0.1} value={end} onChange={(event) => setEnd(Number(event.target.value))} className="mt-2 w-full rounded-lg border bg-background px-3 py-2" /></label>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button type="button" onClick={clip} disabled={loading || !duration} className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Scissors className="h-4 w-4" />}{loading ? `Processing ${progress}%` : 'Create clip'}</button>
            {outputUrl && <a href={outputUrl} download="unifex-clip.mp4" className="inline-flex items-center gap-2 rounded-lg border px-5 py-3 font-semibold hover:bg-muted"><Download className="h-4 w-4" />Download MP4</a>}
          </div>
          {error && <p className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive">{error}</p>}
        </div>
      )}
    </section>
  )
}
