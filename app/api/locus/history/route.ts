import { NextRequest, NextResponse } from 'next/server'
import { getLocusHistory } from '@/lib/locus'

export async function GET(req: NextRequest) {
  const apiKey = process.env.LOCUS_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'Locus API key not configured' }, { status: 500 })
  }

  const limit = Number(req.nextUrl.searchParams.get('limit') ?? '10')

  try {
    const transactions = await getLocusHistory(apiKey, limit)
    return NextResponse.json({ transactions })
  } catch {
    return NextResponse.json({ transactions: [] })
  }
}
