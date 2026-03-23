'use client';

import { useState } from 'react';

const agentManifest = `{
  "schema": "erc-8004",
  "version": "1.0.0",
  "agent": {
    "id": "ghost.eth",
    "address": "0x4e2a...3f91",
    "type": "spending-agent",
    "created": "2026-01-15T00:00:00Z"
  },
  "policies": {
    "daily_limit": 400,
    "tx_threshold": 50,
    "time_window": "24h",
    "allowlist_enforced": true,
    "weekend_disabled": true
  },
  "inference": {
    "provider": "venice.ai",
    "privacy": "encrypted",
    "model": "mistral-31-24b"
  },
  "identity": {
    "ens": "ghost.eth",
    "zk_verified": true,
    "self_protocol": "0x9b3c...d8e2",
    "attestation": "urn:self:v2:8d4f"
  },
  "chain": "base",
  "audit": "locus.xyz/ghost.eth"
}`;

export default function AgentIdentityCard() {
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  return (
    <div
      style={{
        backgroundColor: '#04060f',
        border: '1px solid rgba(167,139,250,0.15)',
      }}
    >
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
              fontFamily: 'Unbounded, sans-serif',
              fontWeight: 700,
              fontSize: '0.85rem',
              color: '#fff',
            }}
          >
            Agent Identity
          </div>
          <div
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.6rem',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'rgba(167,139,250,0.6)',
              marginTop: '0.2rem',
            }}
          >
            ERC-8004 · ENS · ZK Verified
          </div>
        </div>
        <div
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.6rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#a78bfa',
            backgroundColor: 'rgba(167,139,250,0.1)',
            padding: '0.3rem 0.7rem',
            border: '1px solid rgba(167,139,250,0.2)',
          }}
        >
          ghost.eth
        </div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '1px',
            marginBottom: '1.5rem',
            border: '1px solid rgba(167,139,250,0.1)',
          }}
        >
          {[
            { label: 'ENS Name', value: 'ghost.eth', color: '#a78bfa' },
            { label: 'Chain', value: 'Base Mainnet', color: '#7effd4' },
            { label: 'ERC-8004 ID', value: '0x4e2a...3f91', color: '#a78bfa', copy: '0x4e2a7c3d8b1e6f4a2d9c5e8f1a3b7d9f3f91' },
            { label: 'Self Protocol', value: '0x9b3c...d8e2', color: '#f472b6', copy: '0x9b3c4f7a2e1d5c8b6a4f9e2d7c1b3a5f8d8e2' },
          ].map((field, i) => (
            <div
              key={field.label}
              style={{
                padding: '1rem',
                borderRight: i % 2 === 0 ? '1px solid rgba(167,139,250,0.08)' : 'none',
                borderBottom: i < 2 ? '1px solid rgba(167,139,250,0.08)' : 'none',
              }}
            >
              <div
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '0.58rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.25)',
                  marginBottom: '0.35rem',
                }}
              >
                {field.label}
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: field.copy ? 'crosshair' : 'default',
                }}
                onClick={() => field.copy && copyToClipboard(field.copy, field.label)}
              >
                <span
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    color: field.color,
                  }}
                >
                  {copiedField === field.label ? 'COPIED!' : field.value}
                </span>
                {field.copy && (
                  <span style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)' }}>⊕</span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '0.75rem' }}>
            {[
              { label: 'ZK Verified', color: '#7effd4' },
              { label: 'Self Protocol ✓', color: '#a78bfa' },
              { label: 'ERC-8004 Active', color: '#f472b6' },
            ].map((badge) => (
              <div
                key={badge.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.3rem 0.65rem',
                  backgroundColor: `${badge.color}10`,
                  border: `1px solid ${badge.color}30`,
                  borderRadius: 999,
                }}
              >
                <div style={{ width: 5, height: 5, backgroundColor: badge.color, borderRadius: '50%' }} />
                <span
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '0.58rem',
                    letterSpacing: '0.05em',
                    color: badge.color,
                  }}
                >
                  {badge.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.6rem',
            }}
          >
            <span
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
              }}
            >
              agent.json manifest
            </span>
            <button
              onClick={() => copyToClipboard(agentManifest, 'manifest')}
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.58rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#a78bfa',
                backgroundColor: 'rgba(167,139,250,0.08)',
                border: '1px solid rgba(167,139,250,0.2)',
                padding: '0.2rem 0.6rem',
                cursor: 'crosshair',
                transition: 'all 0.15s ease',
              }}
            >
              {copiedField === 'manifest' ? 'Copied!' : 'Copy'}
            </button>
          </div>
          <div
            style={{
              backgroundColor: '#020408',
              border: '1px solid rgba(167,139,250,0.12)',
              padding: '1rem',
              overflowX: 'auto',
              maxHeight: 200,
              overflowY: 'auto',
            }}
          >
            <pre
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.62rem',
                color: 'rgba(255,255,255,0.5)',
                margin: 0,
                lineHeight: 1.7,
                whiteSpace: 'pre',
              }}
            >
              <span style={{ color: 'rgba(167,139,250,0.7)' }}>{agentManifest}</span>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
