'use client';

import { useState, useEffect } from 'react';

type LogStatus = 'approved' | 'private' | 'blocked';

interface LogEntry {
  id: string;
  status: LogStatus;
  action: string;
  timestamp: string;
  amount: string | null;
  hash: string;
}

const initialLog: LogEntry[] = [
  {
    id: '1',
    status: 'approved',
    action: 'USDC transfer to 0x4e2a...3f91 via Ampersend',
    timestamp: '14:32:07',
    amount: '$18.40',
    hash: '0xd4f2e1',
  },
  {
    id: '2',
    status: 'private',
    action: 'Venice inference — market condition analysis',
    timestamp: '14:31:44',
    amount: null,
    hash: '0xc3a1b9',
  },
  {
    id: '3',
    status: 'approved',
    action: 'ERC-20 swap USDC → ETH on Base DEX',
    timestamp: '14:28:12',
    amount: '$42.00',
    hash: '0xb7f830',
  },
  {
    id: '4',
    status: 'blocked',
    action: 'TX blocked — exceeds single threshold ($50)',
    timestamp: '14:25:03',
    amount: '$73.20',
    hash: '0xa9c442',
  },
  {
    id: '5',
    status: 'private',
    action: 'ZK proof generation — Self Protocol attestation',
    timestamp: '14:22:55',
    amount: null,
    hash: '0x9e8b21',
  },
  {
    id: '6',
    status: 'approved',
    action: 'Recurring payment to gas.eth via policy rule #3',
    timestamp: '14:18:30',
    amount: '$5.00',
    hash: '0x8d7c10',
  },
  {
    id: '7',
    status: 'approved',
    action: 'NFT mint fee on Base — allowlisted contract',
    timestamp: '14:15:02',
    amount: '$12.50',
    hash: '0x7f6d09',
  },
  {
    id: '8',
    status: 'private',
    action: 'Venice inference — portfolio rebalance decision',
    timestamp: '14:11:18',
    amount: null,
    hash: '0x6e5c08',
  },
];

const statusConfig = {
  approved: {
    color: '#7effd4',
    label: 'APPROVED',
    dotBg: 'rgba(126,255,212,0.15)',
  },
  private: {
    color: '#a78bfa',
    label: 'PRIVATE',
    dotBg: 'rgba(167,139,250,0.15)',
  },
  blocked: {
    color: '#f472b6',
    label: 'BLOCKED',
    dotBg: 'rgba(244,114,182,0.15)',
  },
};

export default function AgentLog() {
  const [filter, setFilter] = useState<'all' | LogStatus>('all');
  const [log, setLog] = useState<LogEntry[]>(initialLog);
  const [liveCount, setLiveCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCount((c) => c + 1);
      const newEntry: LogEntry = {
        id: Date.now().toString(),
        status: (['approved', 'private', 'approved', 'blocked'] as LogStatus[])[
          Math.floor(Math.random() * 4)
        ],
        action: [
          'Venice inference — strategy evaluation',
          'USDC transfer via Ampersend policy',
          'ENS resolution for recipient address',
          'Onchain proof sealed via ERC-8004',
        ][Math.floor(Math.random() * 4)],
        timestamp: new Date().toLocaleTimeString('en-US', { hour12: false }),
        amount:
          Math.random() > 0.5
            ? `$${(Math.random() * 40 + 2).toFixed(2)}`
            : null,
        hash: `0x${Math.random().toString(16).slice(2, 8)}`,
      };
      setLog((prev) => [newEntry, ...prev.slice(0, 19)]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const filtered = filter === 'all' ? log : log.filter((e) => e.status === filter);

  return (
    <div
      style={{
        backgroundColor: '#04060f',
        border: '1px solid rgba(126,255,212,0.12)',
      }}
    >
      <div
        style={{
          padding: '1.25rem 1.5rem',
          borderBottom: '1px solid rgba(126,255,212,0.08)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div
              style={{
                width: 6,
                height: 6,
                backgroundColor: '#7effd4',
                animation: 'pulse-dot 2s ease-in-out infinite',
              }}
            />
            <span
              style={{
                fontFamily: 'Unbounded, sans-serif',
                fontWeight: 700,
                fontSize: '0.85rem',
                color: '#fff',
              }}
            >
              Execution Log
            </span>
          </div>
          <div className="section-label" style={{ marginTop: '0.2rem' }}>
            Live agent activity feed
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {(['all', 'approved', 'private', 'blocked'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.58rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                padding: '0.3rem 0.7rem',
                cursor: 'crosshair',
                border: `1px solid ${
                  filter === f
                    ? f === 'all'
                      ? 'rgba(126,255,212,0.5)'
                      : `${statusConfig[f]?.color}80`
                    : 'rgba(255,255,255,0.1)'
                }`,
                backgroundColor:
                  filter === f
                    ? f === 'all'
                      ? 'rgba(126,255,212,0.1)'
                      : `${statusConfig[f]?.color}12`
                    : 'transparent',
                color:
                  filter === f
                    ? f === 'all'
                      ? '#7effd4'
                      : statusConfig[f]?.color
                    : 'rgba(255,255,255,0.3)',
                transition: 'all 0.15s ease',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxHeight: 420, overflowY: 'auto' }}>
        {filtered.map((entry, i) => {
          const cfg = statusConfig[entry.status];
          return (
            <div
              key={entry.id}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '0.9rem 1.5rem',
                borderBottom: '1px solid rgba(126,255,212,0.05)',
                transition: 'background-color 0.15s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = `${cfg.color}05`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent';
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: '50%',
                  backgroundColor: cfg.color,
                  flexShrink: 0,
                  animation: i === 0 && liveCount > 0 ? 'pulse-dot 1.5s ease-in-out 3' : undefined,
                }}
              />

              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '0.7rem',
                    color: 'rgba(255,255,255,0.75)',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    marginBottom: '0.15rem',
                  }}
                >
                  {entry.action}
                </div>
                <div
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '0.6rem',
                    color: 'rgba(255,255,255,0.2)',
                  }}
                >
                  tx {entry.hash}
                </div>
              </div>

              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                {entry.amount && (
                  <div
                    style={{
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: entry.status === 'blocked' ? '#f472b6' : 'rgba(255,255,255,0.7)',
                      marginBottom: '0.15rem',
                    }}
                  >
                    {entry.amount}
                  </div>
                )}
                <div
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '0.58rem',
                    color: 'rgba(255,255,255,0.25)',
                  }}
                >
                  {entry.timestamp}
                </div>
              </div>

              <div
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '0.55rem',
                  letterSpacing: '0.08em',
                  color: cfg.color,
                  backgroundColor: cfg.dotBg,
                  padding: '0.2rem 0.5rem',
                  flexShrink: 0,
                }}
              >
                {cfg.label}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
