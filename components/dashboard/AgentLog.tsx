'use client';

import { useState, useEffect, useCallback } from 'react';

type LogStatus = 'approved' | 'private' | 'blocked';

interface LogEntry {
  id: string;
  status: LogStatus;
  action: string;
  timestamp: string;
  amount: string | null;
  hash: string | null;
}

const statusConfig = {
  approved: { color: '#7effd4', label: 'APPROVED', dotBg: 'rgba(126,255,212,0.15)' },
  private:  { color: '#a78bfa', label: 'PRIVATE',  dotBg: 'rgba(167,139,250,0.15)' },
  blocked:  { color: '#f472b6', label: 'BLOCKED',  dotBg: 'rgba(244,114,182,0.15)' },
};

function resultToStatus(result: string): LogStatus {
  if (result === 'blocked' || result === 'policy_blocked') return 'blocked';
  if (result === 'hold' || result === 'private_inference') return 'private';
  return 'approved';
}

export default function AgentLog() {
  const [filter, setFilter] = useState<'all' | LogStatus>('all');
  const [log, setLog] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLog = useCallback(async () => {
    try {
      const res = await fetch('/api/agent/log');
      if (!res.ok) return;
      const data = await res.json();
      const entries: LogEntry[] = (data.entries ?? []).map((e: any) => ({
        id: e.id,
        status: resultToStatus(e.result),
        action: e.action,
        timestamp: new Date(e.timestamp).toLocaleTimeString('en-US', { hour12: false }),
        amount: e.amount_usd != null ? `$${Number(e.amount_usd).toFixed(2)}` : null,
        hash: e.tx_hash ?? null,
      }));
      setLog(entries);
    } catch {
      // silent — API may not have entries yet
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLog();
    // Poll every 15s to pick up new executions
    const interval = setInterval(fetchLog, 15000);
    return () => clearInterval(interval);
  }, [fetchLog]);

  const filtered = filter === 'all' ? log : log.filter((e) => e.status === filter);

  return (
    <div style={{ backgroundColor: '#04060f', border: '1px solid rgba(126,255,212,0.12)' }}>
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
            <div style={{ width: 6, height: 6, backgroundColor: '#7effd4', animation: 'pulse-dot 2s ease-in-out infinite' }} />
            <span style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: '#fff' }}>
              Execution Log
            </span>
          </div>
          <div className="section-label" style={{ marginTop: '0.2rem' }}>
            ERC-8004 · Live agent activity
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
                border: `1px solid ${filter === f ? (f === 'all' ? 'rgba(126,255,212,0.5)' : `${statusConfig[f]?.color}80`) : 'rgba(255,255,255,0.1)'}`,
                backgroundColor: filter === f ? (f === 'all' ? 'rgba(126,255,212,0.1)' : `${statusConfig[f]?.color}12`) : 'transparent',
                color: filter === f ? (f === 'all' ? '#7effd4' : statusConfig[f]?.color) : 'rgba(255,255,255,0.3)',
                transition: 'all 0.15s ease',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div style={{ maxHeight: 420, overflowY: 'auto' }}>
        {isLoading ? (
          <div style={{ padding: '2rem 1.5rem', fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
            Loading log...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: '2rem 1.5rem', fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', color: 'rgba(255,255,255,0.2)', textAlign: 'center', lineHeight: 1.8 }}>
            No entries yet.<br />
            Run your first agent task above.
          </div>
        ) : (
          filtered.map((entry) => {
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
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = `${cfg.color}05`; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'; }}
              >
                <div style={{ width: 8, height: 8, borderRadius: '50%', backgroundColor: cfg.color, flexShrink: 0 }} />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', color: 'rgba(255,255,255,0.75)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '0.15rem' }}>
                    {entry.action}
                  </div>
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)' }}>
                    {entry.hash ? `tx ${entry.hash.slice(0, 8)}...` : 'no tx hash'}
                  </div>
                </div>

                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  {entry.amount && (
                    <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.72rem', fontWeight: 700, color: entry.status === 'blocked' ? '#f472b6' : 'rgba(255,255,255,0.7)', marginBottom: '0.15rem' }}>
                      {entry.amount}
                    </div>
                  )}
                  <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.58rem', color: 'rgba(255,255,255,0.25)' }}>
                    {entry.timestamp}
                  </div>
                </div>

                <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', letterSpacing: '0.08em', color: cfg.color, backgroundColor: cfg.dotBg, padding: '0.2rem 0.5rem', flexShrink: 0 }}>
                  {cfg.label}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
