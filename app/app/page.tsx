'use client';

import { useState } from 'react';
import Link from 'next/link';
import NavBar from '@/components/ui/NavBar';
import MetricCards from '@/components/dashboard/MetricCards';
import PolicyControls from '@/components/dashboard/PolicyControls';
import AgentLog from '@/components/dashboard/AgentLog';
import AgentIdentityCard from '@/components/dashboard/AgentIdentityCard';
import { chaosCasing } from '@/lib/chaos';

export default function AppDashboard() {
  const [connected, setConnected] = useState(false);

  return (
    <div style={{ backgroundColor: '#04060f', minHeight: '100vh' }}>
      <NavBar />

      <div
        style={{
          maxWidth: 1400,
          margin: '0 auto',
          padding: '5.5rem 1.5rem 4rem',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            marginBottom: '2rem',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div className="section-label" style={{ marginBottom: '0.4rem' }}>
              Agent Control Panel
            </div>
            <h1
              style={{
                fontFamily: 'Unbounded, sans-serif',
                fontWeight: 800,
                fontSize: 'clamp(1.4rem, 3vw, 2.2rem)',
                lineHeight: 1.15,
                letterSpacing: '-0.02em',
                color: '#fff',
              }}
            >
              {chaosCasing('Ghost')}
              <span style={{ color: '#7effd4' }}>{chaosCasing('Wallet')}</span>
            </h1>
            <div
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.7rem',
                color: 'rgba(255,255,255,0.3)',
                marginTop: '0.4rem',
              }}
            >
              ghost.eth · Base Mainnet · ERC-8004
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                border: '1px solid rgba(126,255,212,0.2)',
                backgroundColor: 'rgba(126,255,212,0.05)',
              }}
            >
              <div
                style={{
                  width: 6,
                  height: 6,
                  backgroundColor: '#7effd4',
                  borderRadius: '50%',
                  animation: 'pulse-dot 2s ease-in-out infinite',
                }}
              />
              <span
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '0.65rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: '#7effd4',
                }}
              >
                Agent Active
              </span>
            </div>

            <button
              onClick={() => setConnected((c) => !c)}
              className={connected ? 'cta-outline' : 'cta-primary'}
              style={{
                padding: '0.5rem 1.25rem',
                fontSize: '0.65rem',
                fontWeight: 700,
                cursor: 'crosshair',
              }}
            >
              {connected ? 'Disconnect Wallet' : 'Connect Wallet'}
            </button>
          </div>
        </div>

        {!connected && (
          <div
            style={{
              padding: '1rem 1.25rem',
              marginBottom: '1.5rem',
              border: '1px solid rgba(167,139,250,0.2)',
              backgroundColor: 'rgba(167,139,250,0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 6, height: 6, backgroundColor: '#a78bfa' }} />
              <span
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '0.7rem',
                  color: 'rgba(255,255,255,0.5)',
                }}
              >
                Viewing demo data. Connect wallet to activate your agent.
              </span>
            </div>
            <button
              onClick={() => setConnected(true)}
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.62rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: '#a78bfa',
                backgroundColor: 'transparent',
                border: '1px solid rgba(167,139,250,0.4)',
                padding: '0.3rem 0.8rem',
                cursor: 'crosshair',
              }}
            >
              Connect MetaMask
            </button>
          </div>
        )}

        <MetricCards />

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 1fr) 360px',
            gap: '1.5rem',
            marginBottom: '1.5rem',
          }}
        >
          <AgentLog />
          <PolicyControls />
        </div>

        <AgentIdentityCard />

        <div
          style={{
            marginTop: '1.5rem',
            padding: '1.5rem',
            border: '1px solid rgba(126,255,212,0.08)',
            backgroundColor: 'rgba(126,255,212,0.02)',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: '1rem',
          }}
        >
          {[
            { label: 'Total Tx (All Time)', value: '1,847', color: '#7effd4' },
            { label: 'Approved', value: '1,624', color: '#7effd4' },
            { label: 'Private Inference', value: '189', color: '#a78bfa' },
            { label: 'Blocked', value: '34', color: '#f472b6' },
            { label: 'Total Volume', value: '$48.2K', color: '#7effd4' },
            { label: 'ZK Proofs Issued', value: '312', color: '#a78bfa' },
          ].map((stat) => (
            <div key={stat.label}>
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
                {stat.label}
              </div>
              <div
                style={{
                  fontFamily: 'Unbounded, sans-serif',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: stat.color,
                  letterSpacing: '-0.01em',
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
