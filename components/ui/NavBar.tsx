'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Ghost } from 'lucide-react';
import { ConnectKitButton } from 'connectkit';

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        borderBottom: scrolled ? '1px solid rgba(126,255,212,0.12)' : '1px solid transparent',
        backgroundColor: scrolled ? 'rgba(4,6,15,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: '0 auto',
          padding: '0 1.5rem',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link href="/" style={{ textDecoration: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div
              style={{
                width: 30,
                height: 30,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
              }}
            >
              <Ghost size={22} color="#7effd4" strokeWidth={1.5} />
              <span
                style={{
                  position: 'absolute',
                  bottom: 2,
                  right: 1,
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: '#7effd4',
                  boxShadow: '0 0 6px #7effd4',
                }}
              />
            </div>
            <span
              style={{
                fontFamily: 'Unbounded, sans-serif',
                fontWeight: 700,
                fontSize: '0.95rem',
                color: '#fff',
                letterSpacing: '0.05em',
              }}
            >
              Ghostify
            </span>
          </div>
        </Link>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
          }}
          className="hidden-mobile"
        >
          {[
            { label: 'How it works', href: '/#how-it-works' },
            { label: 'Stack', href: '/#stack' },
            { label: 'Docs', href: '/llms.txt' },
          ].map((link) => (
            <Link
              key={link.label}
              href={link.href}
              prefetch={false}
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.75rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)',
                textDecoration: 'none',
                transition: 'color 0.2s ease',
              }}
              onMouseEnter={(e) => { (e.target as HTMLElement).style.color = '#7effd4'; }}
              onMouseLeave={(e) => { (e.target as HTMLElement).style.color = 'rgba(255,255,255,0.5)'; }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <ConnectKitButton.Custom>
          {({ isConnected, isConnecting, show, address, ensName }) => (
            <button
              onClick={show}
              className={isConnected ? 'cta-outline' : 'cta-primary'}
              style={{
                padding: '0.5rem 1.25rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                cursor: 'crosshair',
                fontFamily: 'Space Mono, monospace',
              }}
            >
              {isConnecting
                ? 'Connecting...'
                : isConnected
                ? ensName ?? `${address?.slice(0, 6)}...${address?.slice(-4)}`
                : 'Connect Wallet'}
            </button>
          )}
        </ConnectKitButton.Custom>
      </div>
    </nav>
  );
}
