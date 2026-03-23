import { chaosCasing } from '@/lib/chaos';

const steps = [
  {
    number: '01',
    title: 'You set the rules',
    subtitle: chaosCasing('Define Limits'),
    description:
      'Connect your wallet and define spending policies. Daily limits, single transaction thresholds, time windows, and merchant allowlists. Your agent will never exceed what you authorize.',
    tags: ['MetaMask Delegation', 'Ampersend', 'Policy Engine'],
    accent: '#7effd4',
    accentBg: 'rgba(126,255,212,0.04)',
    accentBorder: 'rgba(126,255,212,0.15)',
  },
  {
    number: '02',
    title: 'Agent thinks in private',
    subtitle: chaosCasing('Private Reasoning'),
    description:
      'Every decision runs through Venice AI — a censorship-resistant, privacy-first inference network. Your reasoning data never leaves the encrypted environment.',
    tags: ['Venice AI', 'Self Protocol ZK', 'Private Inference'],
    accent: '#a78bfa',
    accentBg: 'rgba(167,139,250,0.04)',
    accentBorder: 'rgba(167,139,250,0.15)',
  },
  {
    number: '03',
    title: 'Onchain proof, always',
    subtitle: chaosCasing('Verifiable Actions'),
    description:
      'Every approved action is sealed with an ERC-8004 identity proof and resolved to an ENS name. Full audit trail on Base, readable by anyone, owned by you.',
    tags: ['ERC-8004', 'ENS', 'Base', 'Locus'],
    accent: '#f472b6',
    accentBg: 'rgba(244,114,182,0.04)',
    accentBorder: 'rgba(244,114,182,0.15)',
  },
];

export default function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        backgroundColor: '#080d1a',
        padding: '7rem 1.5rem',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          position: 'absolute',
          top: '20%',
          right: '5%',
          width: 350,
          height: 350,
          backgroundColor: 'rgba(167,139,250,0.05)',
          borderRadius: '50%',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: 1280, margin: '0 auto' }}>
        <div style={{ marginBottom: '4rem' }}>
          <span className="section-label">[01] — How it works</span>
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
            <span style={{ color: '#fff' }}>Three steps.</span>
            <br />
            <span className="text-outline-mint">{chaosCasing('Zero compromise.')}</span>
          </h2>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {steps.map((step) => (
            <div
              key={step.number}
              className="ghost-border-hover"
              style={{
                position: 'relative',
                padding: '2.5rem',
                border: `1px solid ${step.accentBorder}`,
                backgroundColor: step.accentBg,
                overflow: 'hidden',
              }}
            >
              <div className="step-number">{step.number}</div>

              <div style={{ position: 'relative', zIndex: 1 }}>
                <div
                  style={{
                    display: 'inline-block',
                    marginBottom: '1.5rem',
                    padding: '0.3rem 0.75rem',
                    border: `1px solid ${step.accentBorder}`,
                    borderColor: step.accent,
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Space Mono, monospace',
                      fontSize: '0.6rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: step.accent,
                    }}
                  >
                    STEP {step.number}
                  </span>
                </div>

                <h3
                  style={{
                    fontFamily: 'Unbounded, sans-serif',
                    fontWeight: 700,
                    fontSize: '1.15rem',
                    color: '#fff',
                    marginBottom: '0.5rem',
                    lineHeight: 1.3,
                  }}
                >
                  {step.title}
                </h3>

                <div
                  style={{
                    fontFamily: 'Unbounded, sans-serif',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    color: step.accent,
                    marginBottom: '1rem',
                    letterSpacing: '0.02em',
                  }}
                >
                  {step.subtitle}
                </div>

                <p
                  style={{
                    fontFamily: 'Space Mono, monospace',
                    fontSize: '0.76rem',
                    color: 'rgba(255,255,255,0.45)',
                    lineHeight: 1.9,
                    marginBottom: '1.5rem',
                  }}
                >
                  {step.description}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {step.tags.map((tag) => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: 'Space Mono, monospace',
                        fontSize: '0.6rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: step.accent,
                        backgroundColor: `${step.accent}12`,
                        border: `1px solid ${step.accent}30`,
                        padding: '0.25rem 0.6rem',
                        borderRadius: 999,
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
