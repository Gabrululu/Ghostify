import { chaosCasing } from '@/lib/chaos';

const stack = [
  {
    name: 'Venice AI',
    role: 'Private Inference',
    description: 'Censorship-resistant AI reasoning that never exposes your data to third parties.',
    accent: '#7effd4',
    icon: '⬡',
  },
  {
    name: 'ERC-8004',
    role: 'Agent Identity',
    description: 'On-chain agent identity standard that records verifiable proof of every action.',
    accent: '#a78bfa',
    icon: '◈',
  },
  {
    name: 'Self Protocol',
    role: 'ZK Verification',
    description: 'Zero-knowledge proof system for identity attestation without revealing private data.',
    accent: '#f472b6',
    icon: '◎',
  },
  {
    name: 'MetaMask',
    role: 'Delegation Toolkit',
    description: 'MetaMask smart account delegation for scoped spending authority.',
    accent: '#7effd4',
    icon: '◇',
  },
  {
    name: 'Ampersend',
    role: 'Policy Execution',
    description: 'Programmable policy engine that enforces spending rules at the smart contract level.',
    accent: '#a78bfa',
    icon: '⬟',
  },
  {
    name: 'ENS',
    role: 'Human Identity',
    description: 'Ethereum Name Service resolves agent addresses to readable human names.',
    accent: '#f472b6',
    icon: '◆',
  },
  {
    name: 'Base',
    role: 'L2 Network',
    description: 'Coinbase L2 for low-cost, high-speed onchain agent transactions.',
    accent: '#7effd4',
    icon: '▣',
  },
  {
    name: 'Locus Protocol',
    role: 'Audit Trail',
    description: 'Immutable audit trail indexer for agent action history and compliance.',
    accent: '#a78bfa',
    icon: '◉',
  },
];

export default function StackGrid() {
  return (
    <section
      id="stack"
      style={{
        backgroundColor: '#04060f',
        padding: '7rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          left: '0%',
          width: 400,
          height: 400,
          backgroundColor: 'rgba(126,255,212,0.04)',
          borderRadius: '50%',
          filter: 'blur(90px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: '4rem' }}>
          <span className="section-label">[02] — Tech stack</span>
          <h2
            style={{
              fontFamily: 'Unbounded, sans-serif',
              fontWeight: 800,
              fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
              marginTop: '1rem',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
            }}
          >
            <span style={{ color: '#fff' }}>Built on the</span>
            <br />
            <span className="text-outline-purple">{chaosCasing('best primitives.')}</span>
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
            gap: '1px',
            border: '1px solid rgba(126,255,212,0.1)',
          }}
        >
          {stack.map((item, i) => (
            <div
              key={item.name}
              className="ghost-border-hover"
              style={{
                padding: '2rem',
                backgroundColor: '#04060f',
                border: 'none',
                borderRight: '1px solid rgba(126,255,212,0.08)',
                borderBottom: '1px solid rgba(126,255,212,0.08)',
                transition: 'background-color 0.2s ease',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <span
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '1.2rem',
                    color: item.accent,
                    lineHeight: 1,
                  }}
                >
                  {item.icon}
                </span>
                <span
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '0.6rem',
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    color: item.accent,
                    backgroundColor: `${item.accent}15`,
                    padding: '0.2rem 0.5rem',
                    borderRadius: 999,
                  }}
                >
                  {item.role}
                </span>
              </div>

              <h3
                style={{
                  fontFamily: 'Unbounded, sans-serif',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  color: '#fff',
                  marginBottom: '0.6rem',
                  letterSpacing: '0.01em',
                }}
              >
                {item.name}
              </h3>

              <p
                style={{
                  fontFamily: 'Space Mono, monospace',
                  fontSize: '0.7rem',
                  color: 'rgba(255,255,255,0.38)',
                  lineHeight: 1.85,
                }}
              >
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
