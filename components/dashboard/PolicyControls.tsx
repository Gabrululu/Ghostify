'use client';

import { useState } from 'react';

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
    <div
      style={{
        padding: '1.2rem 0',
        borderBottom: '1px solid rgba(126,255,212,0.07)',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '0.75rem',
        }}
      >
        <span
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.7rem',
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.5)',
          }}
        >
          {label}
        </span>
        <span
          style={{
            fontFamily: 'Space Mono, monospace',
            fontWeight: 700,
            fontSize: '0.8rem',
            color,
          }}
        >
          {unit === '$' ? `${unit}${value}` : `${value}${unit}`}
        </span>
      </div>
      <div style={{ position: 'relative' }}>
        <div
          style={{
            height: 2,
            backgroundColor: `${color}18`,
            position: 'relative',
            marginBottom: '0.25rem',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              height: '100%',
              width: `${pct}%`,
              backgroundColor: color,
              transition: 'width 0.1s ease',
            }}
          />
        </div>
        <input
          type="range"
          className="slider-thumb"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          style={{
            position: 'absolute',
            top: -7,
            left: 0,
            width: '100%',
            background: 'transparent',
            margin: 0,
          }}
        />
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginTop: '0.5rem',
        }}
      >
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

interface ToggleRowProps {
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}

function ToggleRow({ label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1.1rem 0',
        borderBottom: '1px solid rgba(126,255,212,0.07)',
      }}
    >
      <div>
        <div
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.7rem',
            letterSpacing: '0.05em',
            color: 'rgba(255,255,255,0.7)',
            marginBottom: '0.2rem',
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.6rem',
            color: 'rgba(255,255,255,0.25)',
          }}
        >
          {description}
        </div>
      </div>
      <label className="toggle-switch">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <span className="toggle-slider" />
      </label>
    </div>
  );
}

export default function PolicyControls() {
  const [dailyLimit, setDailyLimit] = useState(400);
  const [txThreshold, setTxThreshold] = useState(50);
  const [timeWindow, setTimeWindow] = useState(24);
  const [weekendTx, setWeekendTx] = useState(false);
  const [merchantAllowlist, setMerchantAllowlist] = useState(true);

  const spent = 247.80;
  const spentPct = (spent / dailyLimit) * 100;

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
        }}
      >
        <div>
          <div
            style={{
              fontFamily: 'Unbounded, sans-serif',
              fontWeight: 700,
              fontSize: '0.85rem',
              color: '#fff',
              letterSpacing: '0.01em',
            }}
          >
            Policy Controls
          </div>
          <div className="section-label" style={{ marginTop: '0.2rem' }}>
            Agent spending rules
          </div>
        </div>
        <div
          style={{
            fontFamily: 'Space Mono, monospace',
            fontSize: '0.6rem',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#7effd4',
            backgroundColor: 'rgba(126,255,212,0.1)',
            padding: '0.3rem 0.7rem',
            border: '1px solid rgba(126,255,212,0.2)',
          }}
        >
          Active
        </div>
      </div>

      <div style={{ padding: '0 1.5rem' }}>
        <div style={{ padding: '1.2rem 0', borderBottom: '1px solid rgba(126,255,212,0.07)' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.75rem',
            }}
          >
            <span
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.7rem',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.5)',
              }}
            >
              Usage vs Daily Limit
            </span>
            <span
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.75rem',
                color: spentPct > 80 ? '#f472b6' : '#7effd4',
                fontWeight: 700,
              }}
            >
              ${spent.toFixed(2)} / ${dailyLimit}
            </span>
          </div>
          <div style={{ height: 6, backgroundColor: 'rgba(126,255,212,0.08)', position: 'relative' }}>
            <div
              style={{
                height: '100%',
                width: `${Math.min(spentPct, 100)}%`,
                backgroundColor: spentPct > 80 ? '#f472b6' : '#7effd4',
                transition: 'width 0.4s ease',
                position: 'relative',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '50%',
                  transform: 'translateY(-50%)',
                  width: 10,
                  height: 10,
                  backgroundColor: spentPct > 80 ? '#f472b6' : '#7effd4',
                }}
              />
            </div>
          </div>
          <div
            style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '0.6rem',
              color: 'rgba(255,255,255,0.25)',
              marginTop: '0.4rem',
            }}
          >
            {spentPct.toFixed(1)}% of daily limit consumed
          </div>
        </div>

        <SliderRow
          label="Daily Spend Limit"
          value={dailyLimit}
          min={50}
          max={2000}
          unit="$"
          color="#7effd4"
          onChange={setDailyLimit}
        />

        <SliderRow
          label="Single TX Threshold"
          value={txThreshold}
          min={1}
          max={500}
          unit="$"
          color="#a78bfa"
          onChange={setTxThreshold}
        />

        <SliderRow
          label="Time Window"
          value={timeWindow}
          min={1}
          max={168}
          unit="h"
          color="#f472b6"
          onChange={setTimeWindow}
        />

        <ToggleRow
          label="Weekend Transactions"
          description="Allow agent to execute on weekends"
          checked={weekendTx}
          onChange={setWeekendTx}
        />

        <ToggleRow
          label="Merchant Allowlist"
          description="Restrict to pre-approved contract addresses"
          checked={merchantAllowlist}
          onChange={setMerchantAllowlist}
        />

        <div style={{ padding: '1.25rem 0' }}>
          <button
            className="cta-primary"
            style={{
              width: '100%',
              padding: '0.75rem',
              fontSize: '0.7rem',
              fontWeight: 700,
              cursor: 'crosshair',
            }}
          >
            Save Policy
          </button>
        </div>
      </div>
    </div>
  );
}
