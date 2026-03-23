'use client';

import Link from 'next/link';
import { Ghost } from 'lucide-react';

const linkStyle = {
  fontFamily: 'Space Mono, monospace',
  fontSize: '0.72rem',
  color: 'rgba(255,255,255,0.35)' as const,
  textDecoration: 'none',
  transition: 'color 0.2s',
};

function FooterLink({ href, label, external }: { href: string; label: string; external?: boolean }) {
  return (
    <div style={{ marginBottom: '0.65rem' }}>
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        style={linkStyle}
        onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#7effd4'; }}
        onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.35)'; }}
      >
        {label}
      </a>
    </div>
  );
}

export default function Footer() {
  return (
    <footer
      style={{
        backgroundColor: '#04060f',
        borderTop: '1px solid rgba(126,255,212,0.1)',
        padding: '4rem 1.5rem 2rem',
      }}
    >
      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr 1fr 1fr',
            gap: '3rem',
            marginBottom: '3rem',
            alignItems: 'start',
          }}
        >
          {/* Brand */}
          <div style={{ maxWidth: 300 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <div style={{ position: 'relative', width: 26, height: 26, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Ghost size={20} color="#7effd4" strokeWidth={1.5} />
                <span style={{ position: 'absolute', bottom: 1, right: 0, width: 5, height: 5, borderRadius: '50%', backgroundColor: '#7effd4', boxShadow: '0 0 5px #7effd4' }} />
              </div>
              <span style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>
                Ghostify
              </span>
            </div>
            <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)', lineHeight: 1.9 }}>
              Autonomous Web3 agent with private reasoning and verifiable onchain proof.
            </p>
          </div>

          {/* Protocol */}
          <div>
            <div className="section-label" style={{ marginBottom: '1.25rem' }}>Protocol</div>
            <FooterLink href="https://eips.ethereum.org/EIPS/eip-8004" label="ERC-8004" external />
            <FooterLink href="https://venice.ai" label="Venice AI" external />
            <FooterLink href="https://self.xyz" label="Self Protocol" external />
            <FooterLink href="https://paywithlocus.com" label="Locus Protocol" external />
            <FooterLink href="https://metamask.io/developer/" label="MetaMask Delegation" external />
            <FooterLink href="https://base.org" label="Base Network" external />
          </div>

          {/* Resources */}
          <div>
            <div className="section-label" style={{ marginBottom: '1.25rem' }}>Resources</div>
            <FooterLink href="/llms.txt" label="Documentation" />
            <FooterLink href="/agent.json" label="Agent Manifest" />
            <FooterLink href="/agent_log.json" label="Execution Log" />
            <FooterLink href="https://github.com/Gabrululu/Ghostify" label="GitHub" external />
          </div>

          {/* Community */}
          <div>
            <div className="section-label" style={{ marginBottom: '1.25rem' }}>Community</div>
            <FooterLink href="https://github.com/Gabrululu/Ghostify" label="GitHub ↗" external />
            <FooterLink href="https://ghostify-eight.vercel.app" label="Live Demo ↗" external />
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
