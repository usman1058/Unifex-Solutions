import { NextResponse } from 'next/server'

const DEFAULT_PUBLISHER_ID = 'pub-9704794346591870'

export const dynamic = 'force-dynamic'

export async function GET() {
  const configuredId = (process.env.ADSENSE_PUBLISHER_ID || DEFAULT_PUBLISHER_ID)
    .trim()
    .replace(/^ca-/i, '')
  const publisherId = /^pub-\d+$/.test(configuredId) ? configuredId : DEFAULT_PUBLISHER_ID

  return new NextResponse(`google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=300, s-maxage=300',
    },
  })
}
