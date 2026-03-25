'use client'

import { useState, useEffect } from 'react'
import { SelfQRcodeWrapper } from '@selfxyz/qrcode'
import { buildSelfApp } from '@/lib/self'
import { useAgentWallet } from '@/hooks/useAgentWallet'

const PURPLE = '#a78bfa'
const MINT = '#7effd4'
const MONO = 'Space Mono, monospace'

const PERKS = [
  { label: '2x daily spend limit', icon: '↑' },
  { label: 'Anti-sybil access', icon: '◆' },
  { label: 'Higher tx threshold', icon: '↑' },
  { label: 'ERC-8004 trust signal', icon: '✓' },
]

export function ZKVerification() {
  const { address, displayName } = useAgentWallet()
  const [isVerified, setIsVerified] = useState(false)
  const [verifiedAt, setVerifiedAt] = useState<string | null>(null)
  const [showQR, setShowQR] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    if (!address) { setIsChecking(false); return }
    checkVerification()
  }, [address])

  const checkVerification = async () => {
    setIsChecking(true)
    try {
      const res = await fetch(`/api/verify/self?address=${address}`)
      const data = await res.json()
      setIsVerified(data.verified)
      setVerifiedAt(data.verifiedAt)
    } catch {
      // silencioso
    } finally {
      setIsChecking(false)
    }
  }

  const handleVerificationSuccess = async () => {
    setShowQR(false)
    await checkVerification()
  }

  return (
    <div
      style={{
        backgroundColor: '#04060f',
        border: `1px solid rgba(167,139,250,0.15)`,
        display: 'flex',
        flexDirection: 'column' as const,
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(167,139,250,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: '0.6rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase' as const,
              color: 'rgba(167,139,250,0.7)',
              marginBottom: '0.3rem',
            }}
          >
            [Self Protocol] ZK Identity
          </div>
          <div
            style={{
              fontFamily: 'Unbounded, sans-serif',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: '#fff',
              letterSpacing: '-0.01em',
            }}
          >
            Human Verification
          </div>
        </div>

        {/* Status badge */}
        {isChecking ? (
          <div
            style={{
              fontFamily: MONO,
              fontSize: '0.58rem',
              color: 'rgba(255,255,255,0.25)',
              letterSpacing: '0.08em',
            }}
          >
            checking...
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.35rem 0.75rem',
              border: `1px solid ${isVerified ? 'rgba(126,255,212,0.2)' : 'rgba(167,139,250,0.2)'}`,
              backgroundColor: isVerified ? 'rgba(126,255,212,0.04)' : 'rgba(167,139,250,0.04)',
            }}
          >
            <div
              style={{
                width: 5,
                height: 5,
                borderRadius: '50%',
                backgroundColor: isVerified ? MINT : PURPLE,
                boxShadow: `0 0 6px ${isVerified ? MINT : PURPLE}`,
              }}
            />
            <span
              style={{
                fontFamily: MONO,
                fontSize: '0.58rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase' as const,
                color: isVerified ? MINT : PURPLE,
              }}
            >
              {isVerified ? 'Verified' : 'Unverified'}
            </span>
          </div>
        )}
      </div>

      {/* ── Body ── */}
      <div style={{ padding: '1.5rem', flex: 1 }}>
        {isChecking ? (
          <p
            style={{
              fontFamily: MONO,
              fontSize: '0.68rem',
              color: 'rgba(255,255,255,0.25)',
              margin: 0,
            }}
          >
            Checking verification status...
          </p>
        ) : isVerified ? (
          /* ── Verified state ── */
          <div>
            {/* Badge */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.85rem',
                padding: '0.85rem 1rem',
                border: '1px solid rgba(126,255,212,0.2)',
                backgroundColor: 'rgba(126,255,212,0.04)',
                marginBottom: '1.25rem',
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  border: `1px solid ${MINT}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  color: MINT,
                  fontFamily: MONO,
                  fontSize: '0.9rem',
                }}
              >
                ✓
              </div>
              <div>
                <p
                  style={{
                    fontFamily: MONO,
                    fontSize: '0.72rem',
                    fontWeight: 700,
                    color: '#fff',
                    margin: 0,
                    marginBottom: '0.2rem',
                  }}
                >
                  Human operator verified
                </p>
                <p
                  style={{
                    fontFamily: MONO,
                    fontSize: '0.58rem',
                    color: 'rgba(255,255,255,0.3)',
                    margin: 0,
                  }}
                >
                  ZK proof anchored · No personal data stored
                </p>
              </div>
            </div>

            {/* Identity rows */}
            {[
              { label: 'Operator', value: displayName ?? '—', color: MINT },
              { label: 'Method', value: 'Self Protocol ZK', color: 'rgba(255,255,255,0.65)' },
              {
                label: 'Verified at',
                value: verifiedAt ? new Date(verifiedAt).toLocaleString() : 'Unknown',
                color: 'rgba(255,255,255,0.35)',
              },
              { label: 'Data stored', value: 'None — ZK only', color: PURPLE },
            ].map(({ label, value, color }) => (
              <div
                key={label}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '0.55rem 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: '0.6rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase' as const,
                    color: 'rgba(255,255,255,0.25)',
                  }}
                >
                  {label}
                </span>
                <span style={{ fontFamily: MONO, fontSize: '0.68rem', color }}>
                  {value}
                </span>
              </div>
            ))}

            {/* Perks unlocked */}
            <div style={{ marginTop: '1.25rem' }}>
              <div
                style={{
                  fontFamily: MONO,
                  fontSize: '0.58rem',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase' as const,
                  color: 'rgba(255,255,255,0.2)',
                  marginBottom: '0.6rem',
                }}
              >
                Unlocked by verification
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '0.4rem',
                }}
              >
                {PERKS.map(({ label, icon }) => (
                  <div
                    key={label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.4rem 0.6rem',
                      border: '1px solid rgba(126,255,212,0.12)',
                      backgroundColor: 'rgba(126,255,212,0.03)',
                    }}
                  >
                    <span style={{ color: MINT, fontSize: '0.62rem' }}>{icon}</span>
                    <span
                      style={{
                        fontFamily: MONO,
                        fontSize: '0.6rem',
                        color: 'rgba(255,255,255,0.5)',
                      }}
                    >
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* ── Unverified state ── */
          <div>
            <p
              style={{
                fontFamily: MONO,
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.5)',
                lineHeight: 1.75,
                margin: 0,
                marginBottom: '1.25rem',
              }}
            >
              Prove you're human without revealing who you are.
              Scan with the Self app to generate a ZK proof from your ID.
            </p>

            {/* Perks */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.4rem',
                marginBottom: '1.5rem',
              }}
            >
              {[
                'No personal data stored',
                'ZK proof only',
                'Unlocks higher limits',
                'ERC-8004 trust signal',
              ].map((perk) => (
                <div
                  key={perk}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.4rem 0.6rem',
                    border: '1px solid rgba(167,139,250,0.12)',
                    backgroundColor: 'rgba(167,139,250,0.03)',
                  }}
                >
                  <span style={{ color: PURPLE, fontSize: '0.6rem' }}>◆</span>
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: '0.6rem',
                      color: 'rgba(255,255,255,0.45)',
                    }}
                  >
                    {perk}
                  </span>
                </div>
              ))}
            </div>

            {/* QR or CTA */}
            {showQR && address ? (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column' as const,
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1.25rem',
                  border: '1px solid rgba(167,139,250,0.15)',
                  backgroundColor: 'rgba(167,139,250,0.04)',
                }}
              >
                <SelfQRcodeWrapper
                  selfApp={buildSelfApp(address)}
                  onSuccess={handleVerificationSuccess}
                  onError={(err) => console.error('[Self QR Error]', err)}
                  darkMode={true}
                  size={200}
                />
                <p
                  style={{
                    fontFamily: MONO,
                    fontSize: '0.62rem',
                    color: 'rgba(255,255,255,0.35)',
                    textAlign: 'center' as const,
                    margin: 0,
                  }}
                >
                  Scan with the Self app on your phone
                </p>
                <button
                  onClick={() => setShowQR(false)}
                  style={{
                    fontFamily: MONO,
                    fontSize: '0.6rem',
                    letterSpacing: '0.08em',
                    color: 'rgba(255,255,255,0.3)',
                    background: 'none',
                    border: '1px solid rgba(255,255,255,0.1)',
                    padding: '0.4rem 1rem',
                    cursor: 'crosshair',
                  }}
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowQR(true)}
                style={{
                  width: '100%',
                  fontFamily: MONO,
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase' as const,
                  padding: '0.8rem 1.25rem',
                  backgroundColor: PURPLE,
                  color: '#04060f',
                  border: `1px solid ${PURPLE}`,
                  cursor: 'crosshair',
                  transition: 'opacity 0.2s ease',
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '0.85' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.opacity = '1' }}
              >
                Verify with Self ↗
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
