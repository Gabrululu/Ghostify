'use client';

import Link from 'next/link';
import { Ghost } from 'lucide-react';

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#04060f',
        borderTop: '1px solid rgba(126,255,212,0.1)',
        padding: '4rem 1.5rem 2rem',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '3rem',
            marginBottom: '3rem',
            alignItems: 'start',
          }}
        >
          <div style={{ maxWidth: 300 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ position: 'relative', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ghost size={20} color="#7effd4" strokeWidth={1.5} />
                <span
                  style={{
                    position: 'absolute',
                    bottom: 1,
                    right: 0,
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    backgroundColor: '#7effd4',
                    boxShadow: '0 0 5px #7effd4',
                  }}
                />
              </div>
              <span style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>
                Ghostify
              </span>
            </div>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.9 }}>
              Autonomous Web3 agent with private reasoning and verifiable onchain proof.
            </p>
          </div>

          <div>
              <div className="section-label" style={{ marginBottom: '1.25rem' }}>Protocol</div>
              {['ERC-8004', 'Venice AI', 'Self Protocol', 'Ampersend', 'Base Network'].map((item) => (
                <div key={item} style={{ marginBottom: '0.65rem' }}>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', cursor: 'crosshair' }}>
                    {item}
                  </span>
                </div>
              ))}
            </div>

            <div>
              <div className="section-label" style={{ marginBottom: '1.25rem' }}>Resources</div>
              {['Documentation', 'Agent Manifest', 'ENS Registry', 'Audit Report', 'GitHub'].map((item) => (
                <div key={item} style={{ marginBottom: '0.65rem' }}>
                  <Link
                    href="#"
                    style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#7effd4'; }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}
                  >
                    {item}
                  </Link>
                </div>
              ))}
            </div>

            <div>
              <div className="section-label" style={{ marginBottom: '1.25rem' }}>Community</div>
              {['Twitter / X', 'Discord', 'Mirror', 'Telegram', 'Farcaster'].map((item) => (
                <div key={item} style={{ marginBottom: '0.65rem' }}>
                  <Link
                    href="#"
                    style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#7effd4'; }}
                    onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}
                  >
                    {item}
                  </Link>
                </div>
              ))}
            </div>
        </div>

        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.06)',
            paddingTop: '1.5rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>
            © 2026 GHOSTIFY — ALL RIGHTS RESERVED
          </span>
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.05em' }}>
            BUILT ON BASE · POWERED BY VENICE
          </span>
        </div>
      </div>
    </footer>
  );
}
