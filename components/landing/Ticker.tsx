const items = [
  'ERC-8004',
  'Venice AI',
  'MetaMask',
  'Self Protocol',
  'Ampersend',
  'Base Network',
  'USDC',
  'ENS',
  'Locus Protocol',
  'ZK Proofs',
  'Onchain Identity',
  'Private Inference',
  'Delegation Toolkit',
  'Agent Manifest',
];

export default function Ticker() {
  const doubled = [...items, ...items, ...items, ...items];

  return (
    <div
      style={{
        backgroundColor: '#080d1a',
        borderTop: '1px solid rgba(126,255,212,0.1)',
        borderBottom: '1px solid rgba(126,255,212,0.1)',
        padding: '0.85rem 0',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <div
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: 80,
          background: 'linear-gradient(to right, #080d1a 40%, transparent 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: 0,
          bottom: 0,
          width: 80,
          background: 'linear-gradient(to left, #080d1a 40%, transparent 100%)',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      <div className="ticker-track">
        {doubled.map((item, i) => (
          <div
            key={i}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1.5rem',
              paddingRight: '1.5rem',
            }}
          >
            <span
              style={{
                fontFamily: 'Space Mono, monospace',
                fontSize: '0.72rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                color:
                  i % 3 === 0
                    ? '#7effd4'
                    : i % 3 === 1
                    ? 'rgba(255,255,255,0.3)'
                    : '#a78bfa',
              }}
            >
              {item}
            </span>
            <span
              style={{
                color: 'rgba(126,255,212,0.2)',
                fontSize: '0.5rem',
              }}
            >
              ◆
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
