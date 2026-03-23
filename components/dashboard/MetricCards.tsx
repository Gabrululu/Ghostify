'use client';

import { useState, useEffect } from 'react';
import { useLocus } from '@/hooks/useLocus';
import { useAgentWallet } from '@/hooks/useAgentWallet';

export default function MetricCards() {
  const [visible, setVisible] = useState(false);
  const { balance, transactions } = useLocus();
  const { displayName, isConnected } = useAgentWallet();

  // Read delegation policy from localStorage
  const [dailyLimit, setDailyLimit] = useState<number | null>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [isZKVerified, setIsZKVerified] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);

    const delegation = localStorage.getItem('ghostify_delegation');
    if (delegation) {
      try {
        const parsed = JSON.parse(delegation);
        setDailyLimit(parsed.policies?.dailyLimitEth ?? null);
      } catch {}
    }

    const agent = localStorage.getItem('ghostify_agent');
    setIsRegistered(!!agent);

    const zk = localStorage.getItem('ghostify_zk_verified');
    setIsZKVerified(!!zk);

    return () => clearTimeout(t);
  }, []);

  // Metrics computed from real data
  const spentToday = transactions
    .filter((tx) => {
      const txDate = new Date(tx.created_at ?? '').toDateString();
      return txDate === new Date().toDateString();
    })
    .reduce((sum, tx) => sum + parseFloat(tx.amount_usdc ?? '0'), 0);

  const limitUSD = dailyLimit ? dailyLimit * 3000 : null; // rough ETH→USD for display
  const spendPercent = limitUSD && limitUSD > 0 ? Math.min((spentToday / limitUSD) * 100, 100) : 0;

  const txCount = transactions.length;
  const txApproved = transactions.filter((tx) => tx.status === 'QUEUED' || tx.status === 'SENT').length;

  const identityStatus = !isConnected
    ? '—'
    : displayName ?? '—';

  const identitySubtitle = [
    isRegistered ? 'ERC-8004' : null,
    isZKVerified ? 'ZK Verified' : null,
  ]
    .filter(Boolean)
    .join(' · ') || (isConnected ? 'Not registered' : 'Connect wallet');

  const metrics = [
    {
      label: 'Locus Balance',
      value: balance !== null ? `$${balance.toFixed(2)}` : isConnected ? 'Loading...' : '—',
      sub: limitUSD
        ? `$${spentToday.toFixed(2)} spent · $${limitUSD.toFixed(0)} limit`
        : dailyLimit
        ? `${dailyLimit} ETH/day policy set`
        : 'No policy set yet',
      percent: spendPercent,
      color: '#7effd4',
      tag: 'BALANCE',
      trend: balance !== null ? 'USDC · Base Mainnet' : 'Locus Protocol',
    },
    {
      label: 'Transactions',
      value: txCount > 0 ? String(txCount) : isConnected ? '0' : '—',
      sub: txApproved > 0 ? `${txApproved} executed via Locus` : 'No transactions yet',
      percent: txCount > 0 ? Math.min((txApproved / txCount) * 100, 100) : 0,
      color: '#a78bfa',
      tag: 'ACTIVITY',
      trend: txCount > 0 ? `Last: ${new Date(transactions[0]?.created_at ?? '').toLocaleDateString()}` : 'Venice → Locus',
    },
    {
      label: 'Identity Status',
      value: identityStatus,
      sub: identitySubtitle,
      percent: isRegistered && isZKVerified ? 100 : isRegistered ? 60 : isConnected ? 20 : 0,
      color: '#f472b6',
      tag: 'IDENTITY',
      trend: isZKVerified ? 'Self Protocol ✓' : isRegistered ? 'ERC-8004 Active' : 'Register to activate',
    },
  ];

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
