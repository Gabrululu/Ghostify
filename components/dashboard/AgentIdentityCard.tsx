'use client';

import { useState, useEffect } from 'react';
import { useAgentIdentity } from '@/hooks/useAgentIdentity';
import { useAgentWallet } from '@/hooks/useAgentWallet';
import { ENSAddress } from '@/components/ui/ENSAddress';

export default function AgentIdentityCard() {
  const { registerAgent, isRegistering, txHash, error } = useAgentIdentity();
  const { address, isConnected } = useAgentWallet();
  const [agent, setAgent] = useState<Record<string, any> | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('ghostify_agent');
    if (stored) setAgent(JSON.parse(stored));
  }, [txHash]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 1500);
  };

  const manifestPreview = agent
    ? JSON.stringify(
        {
          schema: agent.schema,
          name: agent.name,
          operator: agent.operator,
          capabilities: agent.capabilities,
        },
        null,
        2
      )
    : null;

  return (
    <div
      style={{
        backgroundColor: '#04060f',
        border: '1px solid rgba(167,139,250,0.15)',
      }}
    >
      {/* Header */}
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
            color: agent ? '#7effd4' : '#a78bfa',
            backgroundColor: agent ? 'rgba(126,255,212,0.08)' : 'rgba(167,139,250,0.1)',
            padding: '0.3rem 0.7rem',
            border: `1px solid ${agent ? 'rgba(126,255,212,0.2)' : 'rgba(167,139,250,0.2)'}`,
          }}
        >
          {agent ? '✓ Registered' : 'Unregistered'}
        </div>
      </div>

      <div style={{ padding: '1.5rem' }}>
        {agent ? (
          /* ── Registered state ── */
          <>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1px',
                marginBottom: '1.5rem',
                border: '1px solid rgba(167,139,250,0.1)',
              }}
            >
              {/* Operator row — uses ENSAddress for avatar + name resolution */}
              <div
                style={{
                  padding: '1rem',
                  borderRight: '1px solid rgba(167,139,250,0.08)',
                  borderBottom: '1px solid rgba(167,139,250,0.08)',
                }}
              >
                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.25)', marginBottom: '0.35rem' }}>
                  Operator
                </div>
                {address ? (
                  <ENSAddress
                    address={address}
                    showAvatar
                    showFull
                    className="accent-green"
                  />
                ) : (
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', color: '#7effd4' }}>
                    {String(agent.operator?.address ?? '').slice(0, 10)}...
                  </span>
                )}
              </div>

              {[
                { label: 'Chain', value: 'Base Mainnet', color: '#7effd4' },
                { label: 'Tx Hash', value: `${String(agent.txHash).slice(0, 8)}...${String(agent.txHash).slice(-6)}`, color: '#a78bfa', copy: agent.txHash },
                { label: 'Registered', value: new Date(agent.created_at).toLocaleDateString(), color: 'rgba(255,255,255,0.4)' },
              ].map((field, i) => (
                <div
                  key={field.label}
                  style={{
                    padding: '1rem',
                    // Chain=col2/row1, TxHash=col1/row2, Registered=col2/row2
                    borderRight: i === 1 ? '1px solid rgba(167,139,250,0.08)' : 'none',
                    borderBottom: i === 0 ? '1px solid rgba(167,139,250,0.08)' : 'none',
                    cursor: field.copy ? 'crosshair' : 'default',
                  }}
                  onClick={() => field.copy && copyToClipboard(String(field.copy), field.label)}
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
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

            {/* Badges */}
            <div style={{ display: 'flex', gap: '0.6rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              {[
                { label: 'ERC-8004 Active', color: '#7effd4' },
                { label: 'Operator Verified', color: '#a78bfa' },
                { label: 'Base Mainnet', color: '#f472b6' },
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

            {/* Basescan link */}
            <div style={{ marginBottom: '1.5rem' }}>
              <a
                href={`https://basescan.org/tx/${agent.txHash}`}
                target="_blank"
                rel="noreferrer"
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '0.62rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#a78bfa',
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(167,139,250,0.3)',
                  paddingBottom: '0.1rem',
                }}
              >
                View on Basescan ↗
              </a>
            </div>

            {/* Manifest preview */}
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
                  onClick={() => copyToClipboard(manifestPreview!, 'manifest')}
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
                    color: 'rgba(167,139,250,0.7)',
                    margin: 0,
                    lineHeight: 1.7,
                    whiteSpace: 'pre',
                  }}
                >
                  {manifestPreview}
                </pre>
              </div>
            </div>
          </>
        ) : (
          /* ── Unregistered state ── */
          <div>
            <p
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.45)',
                lineHeight: 1.7,
                marginBottom: '1.25rem',
              }}
            >
              Register your agent onchain with ERC-8004 identity.
              This creates a verifiable manifest anchored to your wallet on Base.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginBottom: '1.5rem' }}>
              {[
                'Onchain operator proof',
                'Verifiable manifest hash in calldata',
                'Protocol Labs bounty eligible',
              ].map((feat) => (
                <div
                  key={feat}
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '0.62rem',
                    color: '#7effd4',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span style={{ opacity: 0.6 }}>✓</span> {feat}
                </div>
              ))}
            </div>

            <button
              onClick={registerAgent}
              disabled={isRegistering || !isConnected}
              className="cta-primary"
              style={{
                padding: '0.6rem 1.5rem',
                fontSize: '0.65rem',
                fontWeight: 700,
                cursor: isRegistering || !isConnected ? 'not-allowed' : 'crosshair',
                opacity: !isConnected ? 0.4 : 1,
                width: '100%',
              }}
            >
              {isRegistering
                ? 'Registering on Base...'
                : !isConnected
                ? 'Connect Wallet to Register'
                : 'Register Agent Identity ↗'}
            </button>

            {error && (
              <p
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '0.62rem',
                  color: '#f472b6',
                  marginTop: '0.75rem',
                }}
              >
                {error}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
