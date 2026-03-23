'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { chaosCasing } from '@/lib/chaos';

const GridNode = ({ x, y, size = 48, glow = false }: { x: number; y: number; size?: number; glow?: boolean }) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width: size,
      height: size,
      background: glow
        ? 'linear-gradient(135deg, rgba(126,255,212,0.18), rgba(126,255,212,0.04))'
        : 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
      border: glow
        ? '1px solid rgba(126,255,212,0.35)'
        : '1px solid rgba(255,255,255,0.06)',
      boxShadow: glow ? '0 0 18px rgba(126,255,212,0.18), inset 0 0 8px rgba(126,255,212,0.06)' : 'none',
      transform: 'perspective(600px) rotateX(45deg) rotateZ(-45deg)',
    }}
  />
);

const ServerRack = ({
  x,
  y,
  width = 56,
  height = 90,
  accent = false,
}: {
  x: number;
  y: number;
  width?: number;
  height?: number;
  accent?: boolean;
}) => (
  <div
    style={{
      position: 'absolute',
      left: x,
      top: y,
      width,
      height,
      background: accent
        ? 'linear-gradient(180deg, rgba(126,255,212,0.12) 0%, rgba(126,255,212,0.04) 100%)'
        : 'linear-gradient(180deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)',
      border: accent
        ? '1px solid rgba(126,255,212,0.3)'
        : '1px solid rgba(255,255,255,0.08)',
      boxShadow: accent
        ? '0 0 24px rgba(126,255,212,0.15), 0 4px 20px rgba(0,0,0,0.6)'
        : '0 4px 20px rgba(0,0,0,0.5)',
      transform: `perspective(800px) rotateX(${accent ? 48 : 45}deg) rotateZ(-45deg)`,
    }}
  >
    {Array.from({ length: Math.floor(height / 14) }).map((_, i) => (
      <div
        key={i}
        style={{
          height: 2,
          marginBottom: 10,
          marginTop: i === 0 ? 6 : 0,
          marginLeft: 6,
          marginRight: 6,
          backgroundColor: accent
            ? `rgba(126,255,212,${0.15 + (i % 3) * 0.1})`
            : `rgba(255,255,255,${0.04 + (i % 4) * 0.02})`,
          boxShadow: accent && i % 2 === 0 ? '0 0 4px rgba(126,255,212,0.4)' : 'none',
        }}
      />
    ))}
  </div>
);

const ConnectorLine = ({ x1, y1, x2, y2, accent = false }: { x1: number; y1: number; x2: number; y2: number; accent?: boolean }) => {
  const length = Math.hypot(x2 - x1, y2 - y1);
  const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
  return (
    <div
      style={{
        position: 'absolute',
        left: x1,
        top: y1,
        width: length,
        height: 1,
        backgroundColor: accent ? 'rgba(126,255,212,0.25)' : 'rgba(255,140,60,0.2)',
        transformOrigin: '0 0',
        transform: `rotate(${angle}deg)`,
        boxShadow: accent ? '0 0 4px rgba(126,255,212,0.3)' : '0 0 3px rgba(255,140,60,0.15)',
      }}
    />
  );
};

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-up');
          }
        });
      },
      { threshold: 0.1 }
    );

    const els = heroRef.current?.querySelectorAll('[data-animate]');
    els?.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={heroRef}
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
        backgroundColor: '#04060f',
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 80% 55% at 20% 40%, rgba(126,255,212,0.05) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 35%, rgba(244,114,182,0.05) 0%, transparent 55%), radial-gradient(ellipse 70% 60% at 50% 70%, rgba(30,20,60,0.6) 0%, transparent 70%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      <div
        style={{
          position: 'relative',
          zIndex: 2,
          width: '100%',
          maxWidth: 960,
          margin: '0 auto',
          padding: '10rem 1.5rem 3rem',
          textAlign: 'center',
        }}
      >
        <div
          data-animate
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.6rem',
            marginBottom: '1.5rem',
            opacity: 0,
            animation: 'fade-up 0.6s ease-out 0.1s both',
          }}
        >
          <span
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.7rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              background: 'linear-gradient(90deg, #7effd4, rgba(126,255,212,0.5))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Autonomous Agent Protocol
          </span>
        </div>

        <h1
          data-animate
          style={{
            fontFamily: 'Unbounded, sans-serif',
            fontWeight: 800,
            lineHeight: 1.1,
            marginBottom: '1.5rem',
            opacity: 0,
            animation: 'fade-up 0.7s ease-out 0.2s both',
          }}
        >
          <span
            style={{
              display: 'block',
              fontSize: 'clamp(2.2rem, 5.5vw, 5rem)',
              color: '#fff',
              letterSpacing: '-0.02em',
            }}
          >
            {chaosCasing('Your Agent Acts')}
          </span>
          <span
            className="text-outline-mint"
            style={{
              display: 'block',
              fontSize: 'clamp(2.2rem, 5.5vw, 5rem)',
              letterSpacing: '-0.02em',
            }}
          >
            {chaosCasing('Within Your Rules')}
          </span>
        </h1>

        <p
          data-animate
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: 'clamp(0.75rem, 1.4vw, 0.95rem)',
            color: 'rgba(255,255,255,0.45)',
            lineHeight: 1.9,
            maxWidth: 580,
            margin: '0 auto 2.5rem',
            opacity: 0,
            animation: 'fade-up 0.7s ease-out 0.35s both',
          }}
        >
          Ghostify deploys an autonomous agent that executes within your
          spending limits, reasons privately via Venice AI, and records
          verifiable onchain proof of every action using ERC-8004.
        </p>

        <div
          data-animate
          style={{
            display: 'flex',
            gap: '1rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            opacity: 0,
            animation: 'fade-up 0.7s ease-out 0.5s both',
          }}
        >
          <Link href="/app" style={{ textDecoration: 'none' }}>
            <button
              className="cta-primary"
              style={{
                padding: '0.85rem 2rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'crosshair',
              }}
            >
              Launch Agent
            </button>
          </Link>
          <Link href="#how-it-works" style={{ textDecoration: 'none' }}>
            <button
              className="cta-outline"
              style={{
                padding: '0.85rem 2rem',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'crosshair',
              }}
            >
              How It Works
            </button>
          </Link>
        </div>
      </div>

      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          height: 340,
          marginTop: '-2rem',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 80,
            background: 'linear-gradient(to bottom, #04060f, transparent)',
            zIndex: 3,
            pointerEvents: 'none',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 120,
            background: 'linear-gradient(to top, #04060f, transparent)',
            zIndex: 3,
            pointerEvents: 'none',
          }}
        />

        <div
          style={{
            position: 'absolute',
            left: '50%',
            top: 0,
            transform: 'translateX(-50%)',
            width: 900,
            height: 340,
          }}
        >
          <GridNode x={120} y={60} size={52} />
          <GridNode x={188} y={28} size={44} />
          <GridNode x={256} y={60} size={52} glow />
          <GridNode x={324} y={28} size={44} />
          <GridNode x={392} y={60} size={52} />
          <GridNode x={460} y={28} size={44} glow />
          <GridNode x={528} y={60} size={52} />
          <GridNode x={596} y={28} size={44} />
          <GridNode x={664} y={60} size={52} glow />
          <GridNode x={732} y={28} size={44} />

          <GridNode x={84} y={120} size={48} />
          <GridNode x={152} y={88} size={44} glow />
          <GridNode x={220} y={120} size={52} />
          <GridNode x={288} y={88} size={44} />
          <GridNode x={356} y={120} size={52} glow />
          <GridNode x={424} y={88} size={44} />
          <GridNode x={492} y={120} size={52} />
          <GridNode x={560} y={88} size={44} glow />
          <GridNode x={628} y={120} size={48} />
          <GridNode x={696} y={88} size={44} />
          <GridNode x={764} y={120} size={48} glow />

          <GridNode x={50} y={180} size={44} glow />
          <GridNode x={118} y={148} size={48} />
          <GridNode x={186} y={180} size={52} glow />
          <GridNode x={254} y={148} size={44} />
          <GridNode x={322} y={180} size={52} />
          <GridNode x={390} y={148} size={48} glow />
          <GridNode x={458} y={180} size={52} />
          <GridNode x={526} y={148} size={44} />
          <GridNode x={594} y={180} size={48} glow />
          <GridNode x={662} y={148} size={44} />
          <GridNode x={730} y={180} size={52} />
          <GridNode x={798} y={148} size={44} glow />

          <ServerRack x={280} y={80} width={52} height={110} />
          <ServerRack x={350} y={60} width={58} height={130} accent />
          <ServerRack x={424} y={80} width={52} height={110} />
          <ServerRack x={496} y={55} width={64} height={150} accent />
          <ServerRack x={574} y={80} width={52} height={110} />
          <ServerRack x={244} y={110} width={48} height={90} />
          <ServerRack x={638} y={100} width={52} height={100} accent />

          <ConnectorLine x1={350} y1={150} x2={424} y2={140} accent />
          <ConnectorLine x1={424} y1={145} x2={496} y2={130} accent />
          <ConnectorLine x1={280} y1={160} x2={350} y2={150} />
          <ConnectorLine x1={496} y1={130} x2={574} y2={140} />
          <ConnectorLine x1={574} y1={140} x2={638} y2={145} />
          <ConnectorLine x1={244} y1={165} x2={280} y2={160} />

          <ConnectorLine x1={350} y1={190} x2={496} y2={205} />
          <ConnectorLine x1={424} y1={195} x2={574} y2={190} />
          <ConnectorLine x1={280} y1={200} x2={350} y2={190} />
          <ConnectorLine x1={496} y1={205} x2={638} y2={200} />

          <div
            style={{
              position: 'absolute',
              left: 470,
              top: 20,
              width: 8,
              height: 8,
              borderRadius: '50%',
              backgroundColor: '#7effd4',
              boxShadow: '0 0 12px rgba(126,255,212,0.8)',
              animation: 'pulse-dot 1.8s ease-in-out infinite',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 370,
              top: 40,
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: 'rgba(244,114,182,0.7)',
              boxShadow: '0 0 10px rgba(244,114,182,0.5)',
              animation: 'pulse-dot 2.4s ease-in-out infinite 0.6s',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: 570,
              top: 35,
              width: 6,
              height: 6,
              borderRadius: '50%',
              backgroundColor: 'rgba(126,255,212,0.5)',
              boxShadow: '0 0 8px rgba(126,255,212,0.4)',
              animation: 'pulse-dot 2s ease-in-out infinite 1.2s',
            }}
          />
        </div>

        <div
          style={{
            position: 'absolute',
            left: '30%',
            top: '30%',
            width: 300,
            height: 200,
            background: 'radial-gradient(ellipse, rgba(126,255,212,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '25%',
            top: '20%',
            width: 250,
            height: 180,
            background: 'radial-gradient(ellipse, rgba(244,114,182,0.05) 0%, transparent 70%)',
            pointerEvents: 'none',
            zIndex: 2,
          }}
        />
      </div>

    </section>
  );
}
