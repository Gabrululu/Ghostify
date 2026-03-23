'use client';

import { useState, useEffect } from 'react';

const metrics = [
  {
    label: 'Total Spent Today',
    value: '$247.80',
    sub: 'of $400.00 daily limit',
    percent: 61.95,
    color: '#7effd4',
    tag: 'SPENDING',
    trend: '+$18.40 last hour',
  },
  {
    label: 'Transactions',
    value: '34',
    sub: '28 approved · 6 private',
    percent: 82,
    color: '#a78bfa',
    tag: 'ACTIVITY',
    trend: '5 in last 30 min',
  },
  {
    label: 'Identity Status',
    value: 'ghost.eth',
    sub: 'ERC-8004 · ZK Verified',
    percent: 100,
    color: '#f472b6',
    tag: 'IDENTITY',
    trend: 'Self Protocol ✓',
  },
];

export default function MetricCards() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '1px',
        marginBottom: '1.5rem',
        border: '1px solid rgba(126,255,212,0.1)',
      }}
    >
      {metrics.map((m, i) => (
        <div
          key={m.label}
          style={{
            padding: '1.75rem',
            backgroundColor: '#04060f',
            borderRight: i < metrics.length - 1 ? '1px solid rgba(126,255,212,0.08)' : 'none',
            transition: 'background-color 0.2s ease',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateY(0)' : 'translateY(16px)',
            transitionDelay: `${i * 80}ms`,
            transitionProperty: 'opacity, transform, background-color',
            transitionDuration: '0.5s',
            transitionTimingFunction: 'ease',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = `${m.color}05`;
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#04060f';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <span
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.6rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.3)',
              }}
            >
              {m.label}
            </span>
            <span
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.55rem',
                letterSpacing: '0.12em',
                color: m.color,
                backgroundColor: `${m.color}15`,
                padding: '0.2rem 0.5rem',
                borderRadius: 999,
              }}
            >
              {m.tag}
            </span>
          </div>

          <div
            style={{
              fontFamily: 'Unbounded, sans-serif',
              fontWeight: 700,
              fontSize: '1.9rem',
              color: m.color,
              lineHeight: 1,
              marginBottom: '0.5rem',
              letterSpacing: '-0.02em',
            }}
          >
            {m.value}
          </div>

          <div
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.65rem',
              color: 'rgba(255,255,255,0.3)',
              marginBottom: '1.25rem',
            }}
          >
            {m.sub}
          </div>

          <div style={{ marginBottom: '0.6rem' }}>
            <div
              style={{
                height: 2,
                backgroundColor: `${m.color}18`,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  height: '100%',
                  width: visible ? `${m.percent}%` : '0%',
                  backgroundColor: m.color,
                  transition: `width 1s ease ${i * 120}ms`,
                }}
              />
            </div>
          </div>

          <div
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.6rem',
              color: `${m.color}80`,
              letterSpacing: '0.05em',
            }}
          >
            {m.trend}
          </div>
        </div>
      ))}
    </div>
  );
}
