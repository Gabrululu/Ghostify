'use client'

import { useState, useEffect } from 'react'
import { SelfQRcodeWrapper } from '@selfxyz/qrcode'
import { buildSelfApp } from '@/lib/self'
import { useAgentWallet } from '@/hooks/useAgentWallet'

export function ZKVerification() {
  const { address, displayName } = useAgentWallet()
  const [isVerified, setIsVerified] = useState(false)
  const [verifiedAt, setVerifiedAt] = useState<string | null>(null)
  const [showQR, setShowQR] = useState(false)
  const [isChecking, setIsChecking] = useState(true)

  // Chequear si ya está verificado al montar
  useEffect(() => {
    if (!address) return
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

  if (isChecking) {
    return (
      <div className="zk-card">
        <span className="section-tag">[Self Protocol] ZK Identity</span>
        <p className="muted">Checking verification status...</p>
      </div>
    )
  }

  return (
    <div className="zk-card">
      <span className="section-tag">[Self Protocol] ZK Identity</span>

      {isVerified ? (
        /* Estado verificado */
        <div className="verified-state">
          <div className="verified-badge">
            <span className="badge-icon">✓</span>
            <div>
              <p className="badge-title">Human operator verified</p>
              <p className="badge-sub">
                ZK proof anchored · No personal data stored
              </p>
            </div>
          </div>

          <div className="identity-details">
            <div className="identity-row">
              <span className="label">Operator</span>
              <span className="value accent-green">{displayName}</span>
            </div>
            <div className="identity-row">
              <span className="label">Method</span>
              <span className="value">Self Protocol ZK</span>
            </div>
            <div className="identity-row">
              <span className="label">Verified at</span>
              <span className="value muted">
                {verifiedAt
                  ? new Date(verifiedAt).toLocaleString()
                  : 'Unknown'}
              </span>
            </div>
            <div className="identity-row">
              <span className="label">Data stored</span>
              <span className="value accent-pink">None — ZK only</span>
            </div>
          </div>

          <div className="perks-unlocked">
            <p className="perks-title">Unlocked by verification</p>
            <div className="perks-grid">
              <span className="perk">✓ 2x daily spend limit</span>
              <span className="perk">✓ Anti-sybil access</span>
              <span className="perk">✓ Higher tx threshold</span>
              <span className="perk">✓ ERC-8004 trust signal</span>
            </div>
          </div>
        </div>

      ) : (
        /* Estado no verificado */
        <div className="unverified-state">
          <p className="verify-desc">
            Prove you're human without revealing who you are.
            Scan with the Self app to generate a ZK proof from your ID.
          </p>

          <div className="verify-perks">
            <span>✓ No personal data stored</span>
            <span>✓ ZK proof only</span>
            <span>✓ Unlocks higher limits</span>
            <span>✓ Required for ERC-8004 trust signal</span>
          </div>

          {showQR && address ? (
            <div className="qr-wrapper">
              <SelfQRcodeWrapper
                selfApp={buildSelfApp(address)}
                onSuccess={handleVerificationSuccess}
                onError={(err) => console.error('[Self QR Error]', err)}
                darkMode={true}
                size={220}
              />
              <p className="qr-instruction">
                Scan with the Self app on your phone
              </p>
              <button
                className="btn-ghost"
                onClick={() => setShowQR(false)}
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              className="btn-primary"
              onClick={() => setShowQR(true)}
            >
              Verify with Self ↗
            </button>
          )}
        </div>
      )}
    </div>
  )
}