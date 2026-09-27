import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { errorResponse } from '@/lib/api-utils'

export const dynamic = 'force-dynamic'

const MAX_SIZE = 10 * 1024 * 1024 // 10MB
const ALLOWED = ['image/png', 'image/jpeg', 'image/webp', 'image/gif', 'application/pdf']
const EXTENSIONS: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/gif': '.gif',
  'application/pdf': '.pdf',
}

function hasExpectedSignature(buffer: Buffer, mimeType: string) {
  if (mimeType === 'image/png') return buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  if (mimeType === 'image/jpeg') return buffer.subarray(0, 3).equals(Buffer.from([255, 216, 255]))
  if (mimeType === 'image/gif') return buffer.subarray(0, 6).toString('ascii') === 'GIF87a' || buffer.subarray(0, 6).toString('ascii') === 'GIF89a'
  if (mimeType === 'image/webp') return buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  if (mimeType === 'application/pdf') return buffer.subarray(0, 5).toString('ascii') === '%PDF-'
  return false
}

// POST /api/uploads - Upload a payment receipt
export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get('content-type') || ''

    let fileBuffer: Buffer
    let fileName: string
    let mimeType: string

    if (contentType.includes('multipart/form-data')) {
      const formData = await request.formData()
      const file = formData.get('file') as File | null
      if (!file) {
        return NextResponse.json(errorResponse('VALIDATION_ERROR', 'No file provided'), { status: 400 })
      }
      fileName = file.name
      mimeType = file.type
      if (!ALLOWED.includes(mimeType)) {
        return NextResponse.json(
          errorResponse('VALIDATION_ERROR', `File type ${mimeType} not allowed`),
          { status: 400 }
        )
      }
      if (file.size > MAX_SIZE) {
        return NextResponse.json(errorResponse('VALIDATION_ERROR', 'File too large (max 10MB)'), { status: 400 })
      }
      fileBuffer = Buffer.from(await file.arrayBuffer())
    } else {
      const body = await request.json()
      const base64 = body.file
      mimeType = body.mimeType || 'image/png'
      if (!base64) {
        return NextResponse.json(errorResponse('VALIDATION_ERROR', 'No file provided'), { status: 400 })
      }
      if (typeof base64 !== 'string' || base64.length > Math.ceil(MAX_SIZE / 3) * 4 + 256) {
        return NextResponse.json(errorResponse('VALIDATION_ERROR', 'File too large or invalid'), { status: 400 })
      }
      fileName = body.fileName || `receipt${EXTENSIONS[mimeType] || '.bin'}`
      if (!ALLOWED.includes(mimeType)) {
        return NextResponse.json(
          errorResponse('VALIDATION_ERROR', `File type ${mimeType} not allowed`),
          { status: 400 }
        )
      }
      fileBuffer = Buffer.from(base64, 'base64')
      if (fileBuffer.length > MAX_SIZE) {
        return NextResponse.json(errorResponse('VALIDATION_ERROR', 'File too large (max 10MB)'), { status: 400 })
      }
    }

    if (!fileBuffer.length || !hasExpectedSignature(fileBuffer, mimeType)) {
      return NextResponse.json(errorResponse('VALIDATION_ERROR', 'File contents do not match the declared type'), { status: 400 })
    }

    const ext = EXTENSIONS[mimeType]
    const safeName = `${Date.now()}-${crypto.randomBytes(6).toString('hex')}${ext.toLowerCase()}`
    const dir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(dir, { recursive: true })
    await writeFile(path.join(dir, safeName), fileBuffer)

    const url = `/uploads/${safeName}`
    return NextResponse.json({
      success: true,
      data: { url, fileName: safeName, mimeType },
      meta: { message: 'File uploaded successfully' },
    }, { status: 201 })
  } catch (error: any) {
    console.error('Error uploading file:', error)
    return NextResponse.json(
      errorResponse('UPLOAD_ERROR', 'Failed to upload file', error.message),
      { status: 500 }
    )
  }
}
