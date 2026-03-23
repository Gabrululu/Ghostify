import { NextResponse } from 'next/server'
import { getLocusBalance } from '@/lib/locus'

export async function GET() {
  const apiKey = process.env.LOCUS_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Locus API key not configured' }, { status: 500 })
  }

  try {
    const balance = await getLocusBalance(apiKey)
    return NextResponse.json({ balance })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
