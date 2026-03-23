import { NextRequest, NextResponse } from 'next/server'
import {
  SelfBackendVerifier,
  AllIds,
  DefaultConfigStore,
} from '@selfxyz/core'

const SCOPE = process.env.NEXT_PUBLIC_SELF_SCOPE ?? 'ghostify'
const ENDPOINT = `${process.env.NEXT_PUBLIC_APP_URL}/api/verify/self`

const verifier = new SelfBackendVerifier(
  SCOPE,
  ENDPOINT,
  false, // false = mainnet docs, true = staging/mock passport
  AllIds,
  new DefaultConfigStore({
    minimumAge: 18,
    excludedCountries: [],
    ofac: false,
  }),
  'hex' // userIdentifierType — wallet address format
)

// In-memory store (replace with a DB in production)
const verifiedAddresses = new Map<string, { verifiedAt: string }>()

export async function POST(req: NextRequest) {
  try {
    const { attestationId, proof, publicSignals, userContextData } = await req.json()

    if (!proof || !publicSignals || !attestationId || !userContextData) {
      return NextResponse.json(
        { status: 'error', result: false, reason: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await verifier.verify(attestationId, proof, publicSignals, userContextData)

    if (!result.isValidDetails.isValid) {
      return NextResponse.json(
        { status: 'error', result: false, reason: 'Proof verification failed', details: result.isValidDetails },
        { status: 200 }
      )
    }

    // userContextData is the hex-encoded wallet address
    verifiedAddresses.set(userContextData.toLowerCase(), {
      verifiedAt: new Date().toISOString(),
    })

    console.log('[Ghostify Self ZK] Verified human operator:', userContextData)

    return NextResponse.json({
      status: 'success',
      result: true,
      credentialSubject: result.discloseOutput,
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Self Verify Error]', message)
    return NextResponse.json(
      { status: 'error', result: false, reason: message },
      { status: 200 } // Self expects 200 even on error
    )
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const address = searchParams.get('address')

  if (!address) {
    return NextResponse.json({ error: 'Missing address' }, { status: 400 })
  }

  const verification = verifiedAddresses.get(address.toLowerCase())

  return NextResponse.json({
    verified: !!verification,
    verifiedAt: verification?.verifiedAt ?? null,
  })
}
