'use client';

import { useState, useEffect } from 'react';
import { useDelegation } from '@/hooks/useDelegation';
import { useAgentWallet } from '@/hooks/useAgentWallet';
import { WalletInput } from '@/components/ui/WalletInput';

// Ghostify agent wallet — the EOA that executes transactions
const GHOSTIFY_AGENT_ADDRESS =
  (process.env.NEXT_PUBLIC_AGENT_ADDRESS as `0x${string}`) ??
  '0x0000000000000000000000000000000000000001'

interface SliderRowProps {
  label: string;
  value: number;
  min: number;
  max: number;
  unit: string;
  color: string;
  onChange: (v: number) => void;
}

function SliderRow({ label, value, min, max, unit, color, onChange }: SliderRowProps) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div style={{ padding: '1.2rem 0', borderBottom: '1px solid rgba(126,255,212,0.07)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
          {label}
        </span>
        <span style={{ fontFamily: 'Space Mono, monospace', fontWeight: 700, fontSize: '0.8rem', color }}>
          {unit === '$' ? `${unit}${value}` : `${value}${unit}`}
        </span>
      </div>
      <div style={{ position: 'relative' }}>
        <div style={{ height: 2, backgroundColor: `${color}18`, position: 'relative', marginBottom: '0.25rem' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, height: '100%', width: `${pct}%`, backgroundColor: color, transition: 'width 0.1s ease' }} />
        </div>
        <input type="range" className="slider-thumb" min={min} max={max} value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{ position: 'absolute', top: -7, left: 0, width: '100%', background: 'transparent', margin: 0 }}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)' }}>
          {unit === '$' ? `${unit}${min}` : `${min}${unit}`}
        </span>
        <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', color: 'rgba(255,255,255,0.2)' }}>
          {unit === '$' ? `${unit}${max}` : `${max}${unit}`}
        </span>
      </div>
    </div>
  );
}

export default function PolicyControls() {
  const { address } = useAgentWallet();
  const { createDelegation, revokeDelegation, getStoredDelegation, isCreating, error } = useDelegation();

  const [dailyLimitEth, setDailyLimitEth] = useState(0.1);
  const [durationDays, setDurationDays] = useState(1);
  const [newAddress, setNewAddress] = useState('');
  const [approvedAddresses, setApprovedAddresses] = useState<`0x${string}`[]>([]);
  const [delegation, setDelegationState] = useState<any>(null);

  const spent = 247.80;
  const spentPct = (spent / (dailyLimitEth * 3500)) * 100; // approx ETH→USD

  useEffect(() => {
    const stored = getStoredDelegation();
    if (stored) setDelegationState(stored);
  }, []);

  const handleCreate = async () => {
    const result = await createDelegation(GHOSTIFY_AGENT_ADDRESS, {
      dailyLimitEth,
      approvedAddresses,
      durationDays,
    });
    if (result) setDelegationState(result);
  };

  const handleRevoke = async () => {
    await revokeDelegation();
    setDelegationState(null);
  };

  const addAddress = (addr: string) => {
    if (!addr || approvedAddresses.includes(addr as `0x${string}`)) return;
    setApprovedAddresses(prev => [...prev, addr as `0x${string}`]);
    setNewAddress('');
  };

  return (
    <div style={{ backgroundColor: '#04060f', border: '1px solid rgba(126,255,212,0.12)' }}>
      {/* Header */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid rgba(126,255,212,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontFamily: 'Unbounded, sans-serif', fontWeight: 700, fontSize: '0.85rem', color: '#fff', letterSpacing: '0.01em' }}>
            Policy Controls
          </div>
          <div className="section-label" style={{ marginTop: '0.2rem' }}>
            MetaMask Delegation Framework
          </div>
        </div>
        <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: delegation ? '#7effd4' : 'rgba(255,255,255,0.3)', backgroundColor: delegation ? 'rgba(126,255,212,0.1)' : 'rgba(255,255,255,0.05)', padding: '0.3rem 0.7rem', border: `1px solid ${delegation ? 'rgba(126,255,212,0.2)' : 'rgba(255,255,255,0.1)'}` }}>
          {delegation ? 'Active' : 'Not Set'}
        </div>
      </div>

      <div style={{ padding: '0 1.5rem' }}>
        {delegation ? (
          /* ── Active delegation ── */
          <>
            {/* Spend usage bar */}
            <div style={{ padding: '1.2rem 0', borderBottom: '1px solid rgba(126,255,212,0.07)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)' }}>
                  Usage vs Daily Limit
                </span>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.75rem', color: spentPct > 80 ? '#f472b6' : '#7effd4', fontWeight: 700 }}>
                  ${spent.toFixed(2)} / ${(delegation.policies?.dailyLimitEth * 3500).toFixed(0)}
                </span>
              </div>
              <div style={{ height: 6, backgroundColor: 'rgba(126,255,212,0.08)', position: 'relative' }}>
                <div style={{ height: '100%', width: `${Math.min(spentPct, 100)}%`, backgroundColor: spentPct > 80 ? '#f472b6' : '#7effd4', transition: 'width 0.4s ease' }} />
              </div>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.25)', marginTop: '0.4rem' }}>
                {spentPct.toFixed(1)}% consumed · expires {delegation.expiryTimestamp ? new Date(delegation.expiryTimestamp * 1000).toLocaleDateString() : '—'}
              </div>
            </div>

            {/* Policy summary */}
            {[
              { label: 'Daily limit', value: `${delegation.policies?.dailyLimitEth} ETH`, color: '#7effd4' },
              { label: 'Duration', value: `${delegation.policies?.durationDays} day(s)`, color: '#a78bfa' },
              { label: 'Approved wallets', value: `${delegation.policies?.approvedAddresses?.length ?? 0}`, color: '#f472b6' },
            ].map(row => (
              <div key={row.label} style={{ padding: '0.9rem 0', borderBottom: '1px solid rgba(126,255,212,0.07)', display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{row.label}</span>
                <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.72rem', fontWeight: 700, color: row.color }}>{row.value}</span>
              </div>
            ))}

            <div style={{ padding: '1.25rem 0' }}>
              <button onClick={handleRevoke} className="cta-outline" style={{ width: '100%', padding: '0.75rem', fontSize: '0.7rem', fontWeight: 700, cursor: 'crosshair', borderColor: 'rgba(244,114,182,0.4)', color: '#f472b6' }}>
                Revoke Delegation
              </button>
            </div>
          </>
        ) : (
          /* ── Create delegation ── */
          <>
            <SliderRow label="Daily Spend Limit" value={dailyLimitEth} min={0.01} max={1} unit=" ETH" color="#7effd4" onChange={setDailyLimitEth} />
            <SliderRow label="Delegation Duration" value={durationDays} min={1} max={7} unit=" days" color="#a78bfa" onChange={setDurationDays} />

            {/* Approved wallets */}
            <div style={{ padding: '1.2rem 0', borderBottom: '1px solid rgba(126,255,212,0.07)' }}>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.7rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem' }}>
                Approved Wallets
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <WalletInput value={newAddress} onChange={(addr) => setNewAddress(addr)} placeholder="0x... or name.eth" />
                </div>
                <button onClick={() => addAddress(newAddress)} style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', color: '#7effd4', backgroundColor: 'rgba(126,255,212,0.08)', border: '1px solid rgba(126,255,212,0.2)', padding: '0.4rem 0.75rem', cursor: 'crosshair' }}>
                  Add
                </button>
              </div>
              {approvedAddresses.map(addr => (
                <div key={addr} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.3rem 0.5rem', backgroundColor: 'rgba(126,255,212,0.04)', border: '1px solid rgba(126,255,212,0.1)', marginBottom: '0.3rem' }}>
                  <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', color: 'rgba(255,255,255,0.5)' }}>
                    {addr.slice(0, 6)}...{addr.slice(-4)}
                  </span>
                  <button onClick={() => setApprovedAddresses(prev => prev.filter(a => a !== addr))} style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: '#f472b6', backgroundColor: 'transparent', border: 'none', cursor: 'crosshair' }}>
                    ✕
                  </button>
                </div>
              ))}
            </div>

            {error && (
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.62rem', color: '#f472b6', padding: '0.5rem 0' }}>
                {error}
              </p>
            )}

            <div style={{ padding: '1.25rem 0' }}>
              <button onClick={handleCreate} disabled={isCreating || !address} className="cta-primary" style={{ width: '100%', padding: '0.75rem', fontSize: '0.7rem', fontWeight: 700, cursor: isCreating || !address ? 'not-allowed' : 'crosshair', opacity: !address ? 0.4 : 1 }}>
                {isCreating ? 'Signing delegation...' : 'Create Delegation ↗'}
              </button>
              <p style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', marginTop: '0.6rem', lineHeight: 1.5 }}>
                ◆ Signs off-chain via MetaMask — no gas required to set policies
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
