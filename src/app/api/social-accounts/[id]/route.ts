import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-utils'

export const dynamic = 'force-dynamic'

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const existing = await db.socialAccount.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(errorResponse('NOT_FOUND', 'Social account not found'), { status: 404 })
    }
    await db.socialAccount.delete({ where: { id } })
    return NextResponse.json(successResponse(null, { message: 'Account removed' }))
  } catch (error: any) {
    console.error('Error deleting social account:', error)
    return NextResponse.json(errorResponse('DELETE_ERROR', 'Failed to delete social account', error.message), { status: 500 })
  }
}