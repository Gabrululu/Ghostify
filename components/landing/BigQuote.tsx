import Link from 'next/link';
import { chaosCasing } from '@/lib/chaos';

export default function BigQuote() {
  return (
    <section
      style={{
        backgroundColor: '#080d1a',
        padding: '8rem 1.5rem',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        borderTop: '1px solid rgba(126,255,212,0.08)',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 600,
          height: 600,
          backgroundColor: 'rgba(167,139,250,0.05)',
          borderRadius: '50%',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '20%',
          width: 300,
          height: 300,
          backgroundColor: 'rgba(126,255,212,0.04)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ position: 'relative', zIndex: 1, maxWidth: 1000, margin: '0 auto' }}>
        <span className="section-label" style={{ display: 'block', marginBottom: '2.5rem' }}>
          [03] — The Ethos
        </span>

        <h2
          style={{
            fontFamily: 'Unbounded, sans-serif',
            fontWeight: 900,
            lineHeight: 1.1,
            letterSpacing: '-0.025em',
            marginBottom: '3rem',
          }}
        >
          <span
            style={{
              display: 'block',
              fontSize: 'clamp(2rem, 5.5vw, 5rem)',
              color: '#fff',
            }}
          >
            {chaosCasing('Your Agent.')}
          </span>
          <span
            className="text-outline-mint"
            style={{
              display: 'block',
              fontSize: 'clamp(2rem, 5.5vw, 5rem)',
            }}
          >
            {chaosCasing('Your Limits.')}
          </span>
          <span
            className="text-outline-purple"
            style={{
              display: 'block',
              fontSize: 'clamp(2rem, 5.5vw, 5rem)',
            }}
          >
            {chaosCasing('Nobody Watching.')}
          </span>
        </h2>

        <p
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 'clamp(0.75rem, 1.4vw, 0.9rem)',
            color: 'rgba(255,255,255,0.4)',
            lineHeight: 2,
            maxWidth: 580,
            margin: '0 auto 3rem',
          }}
        >
          Ghostify puts you back in control. Your agent operates autonomously
          within rules you define, reasons without surveillance, and leaves a
          permanent, unforgeable record of everything it does. No custodians. No
          middlemen. No watching.
        </p>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link href="/app" style={{ textDecoration: 'none' }}>
            <button
              className="cta-primary"
              style={{ padding: '0.9rem 2.5rem', fontSize: '0.78rem', fontWeight: 700, cursor: 'crosshair' }}
            >
              Deploy Your Agent
            </button>
          </Link>
          <Link href="#" style={{ textDecoration: 'none' }}>
            <button
              className="cta-outline"
              style={{ padding: '0.9rem 2.5rem', fontSize: '0.78rem', cursor: 'crosshair' }}
            >
              Read the Docs
            </button>
          </Link>
        </div>

        <div
          style={{
            marginTop: '5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '1.5rem',
            maxWidth: 800,
            margin: '5rem auto 0',
          }}
        >
          {[
            { label: 'Non-Custodial', color: '#7effd4' },
            { label: 'Privacy First', color: '#a78bfa' },
            { label: 'Onchain Proof', color: '#f472b6' },
            { label: 'You Own It', color: '#7effd4' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.6rem',
                padding: '0.85rem',
                border: `1px solid ${item.color}20`,
                backgroundColor: `${item.color}06`,
              }}
            >
              <div style={{ width: 6, height: 6, backgroundColor: item.color }} />
              <span
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '0.68rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: item.color,
                }}
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
