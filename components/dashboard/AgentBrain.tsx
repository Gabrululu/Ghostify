'use client'

import { useState, useEffect } from 'react'
import { useAgent } from '@/hooks/useAgent'
import { useAgentWallet } from '@/hooks/useAgentWallet'
import { useLocus } from '@/hooks/useLocus'

interface PaymentResult {
  transactionId: string
  status: string
  amountUsd: number
  toAddress: string
  approvalUrl?: string | null
  pendingApproval?: boolean
}

const MINT = '#7effd4'
const PURPLE = '#a78bfa'
const PINK = '#f472b6'
const MONO = 'Space Mono, monospace'

export function AgentBrain() {
  const { think, isThinking, lastDecision, log } = useAgent()
  const { usdcBalance } = useAgentWallet()
  const { transactions } = useLocus()
  const [task, setTask] = useState('')
  const [lastPayment, setLastPayment] = useState<PaymentResult | null>(null)
  const [dailyLimit, setDailyLimit] = useState(400)

  useEffect(() => {
    const stored = localStorage.getItem('ghostify_delegation')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        if (parsed.policies?.dailyLimitEth) {
          setDailyLimit(Math.round(parsed.policies.dailyLimitEth * 3500))
        }
      } catch {}
    }
  }, [])

  const spentToday = transactions
    .filter((tx) => new Date(tx.created_at ?? '').toDateString() === new Date().toDateString())
    .reduce((sum, tx) => sum + parseFloat(tx.amount_usdc ?? '0'), 0)

  const approvedWallets: string[] = (() => {
    try {
      const stored = localStorage.getItem('ghostify_delegation')
      return stored ? JSON.parse(stored).policies?.approvedAddresses ?? [] : []
    } catch { return [] }
  })()

  const handleThink = async () => {
    if (!task.trim()) return
    const decision = await think({
      task,
      usdcBalance,
      dailyLimit,
      spentToday,
      approvedWallets,
      timeWindow: { start: '00:00', end: '23:59' },
      recentActions: log.slice(0, 3).map(e => ({
        action: e.action,
        amount: e.amount_usd ?? 0,
        timestamp: e.timestamp,
      })),
    })
    if ((decision as any)?.payment) {
      setLastPayment((decision as any).payment)
    }
    setTask('')
  }

  const decisionColor = (action: string) =>
    action === 'execute' ? MINT : action === 'hold' ? PURPLE : PINK

  const decisionBg = (action: string) =>
    action === 'execute'
      ? 'rgba(126,255,212,0.04)'
      : action === 'hold'
      ? 'rgba(167,139,250,0.04)'
      : 'rgba(244,114,182,0.04)'

  const decisionBorder = (action: string) =>
    action === 'execute'
      ? 'rgba(126,255,212,0.2)'
      : action === 'hold'
      ? 'rgba(167,139,250,0.2)'
      : 'rgba(244,114,182,0.2)'

  const logDot = (decision: string) =>
    decision === 'execute' ? MINT : decision === 'hold' ? PURPLE : PINK

  return (
    <div
      style={{
        backgroundColor: '#04060f',
        border: '1px solid rgba(126,255,212,0.15)',
      }}
    >
      {/* ── Header ── */}
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
              fontFamily: MONO,
              fontSize: '0.6rem',
              letterSpacing: '0.14em',
              textTransform: 'uppercase' as const,
              color: 'rgba(126,255,212,0.6)',
              marginBottom: '0.3rem',
            }}
          >
            [Venice AI] Private Inference
          </div>
          <div
            style={{
              fontFamily: 'Unbounded, sans-serif',
              fontWeight: 700,
              fontSize: '0.9rem',
              color: '#fff',
              letterSpacing: '-0.01em',
            }}
          >
            Agent Brain
          </div>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.75rem',
            border: `1px solid rgba(126,255,212,0.15)`,
            backgroundColor: 'rgba(126,255,212,0.04)',
          }}
        >
          <div
            style={{
              width: 5,
              height: 5,
              borderRadius: '50%',
              backgroundColor: MINT,
              boxShadow: `0 0 6px ${MINT}`,
              animation: 'pulse-dot 2s ease-in-out infinite',
            }}
          />
          <span
            style={{
              fontFamily: MONO,
              fontSize: '0.58rem',
              letterSpacing: '0.1em',
              textTransform: 'uppercase' as const,
              color: MINT,
            }}
          >
            llama-3.3-70b
          </span>
        </div>
      </div>

      {/* ── Task input ── */}
      <div style={{ padding: '1.5rem' }}>
        <div
          style={{
            display: 'flex',
            gap: '0.75rem',
            alignItems: 'stretch',
            marginBottom: '0.75rem',
          }}
        >
          <input
            type="text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleThink()}
            placeholder="Give your agent a task..."
            disabled={isThinking}
            style={{
              flex: 1,
              fontFamily: MONO,
              fontSize: '0.78rem',
              color: isThinking ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.88)',
              backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(126,255,212,0.15)',
              padding: '0.75rem 1rem',
              outline: 'none',
              transition: 'border-color 0.2s ease',
              cursor: isThinking ? 'not-allowed' : 'text',
            }}
            onFocus={(e) => { e.target.style.borderColor = 'rgba(126,255,212,0.4)' }}
            onBlur={(e) => { e.target.style.borderColor = 'rgba(126,255,212,0.15)' }}
          />
          <button
            onClick={handleThink}
            disabled={isThinking || !task.trim()}
            style={{
              fontFamily: MONO,
              fontSize: '0.65rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase' as const,
              padding: '0.75rem 1.25rem',
              backgroundColor: isThinking || !task.trim() ? 'rgba(126,255,212,0.15)' : MINT,
              color: isThinking || !task.trim() ? 'rgba(255,255,255,0.3)' : '#04060f',
              border: `1px solid ${isThinking || !task.trim() ? 'rgba(126,255,212,0.15)' : MINT}`,
              cursor: isThinking || !task.trim() ? 'not-allowed' : 'crosshair',
              transition: 'all 0.2s ease',
              whiteSpace: 'nowrap' as const,
            }}
          >
            {isThinking ? (
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ animation: 'pulse-dot 1s ease-in-out infinite' }}>◆</span>
                Thinking...
              </span>
            ) : (
              'Run Agent ↗'
            )}
          </button>
        </div>

        {/* Privacy note */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 0.75rem',
            backgroundColor: 'rgba(126,255,212,0.03)',
            borderLeft: `2px solid rgba(126,255,212,0.25)`,
          }}
        >
          <span style={{ color: MINT, fontSize: '0.6rem' }}>◆</span>
          <span
            style={{
              fontFamily: MONO,
              fontSize: '0.62rem',
              color: 'rgba(255,255,255,0.35)',
              letterSpacing: '0.02em',
            }}
          >
            Inference runs privately via Venice — your task is never logged externally
          </span>
        </div>
      </div>

      {/* ── Last decision ── */}
      {lastDecision && (
        <div
          style={{
            margin: '0 1.5rem 1.5rem',
            padding: '1rem 1.25rem',
            border: `1px solid ${decisionBorder(lastDecision.action)}`,
            backgroundColor: decisionBg(lastDecision.action),
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.6rem',
            }}
          >
            <span
              style={{
                fontFamily: MONO,
                fontSize: '0.6rem',
                fontWeight: 700,
                letterSpacing: '0.14em',
                textTransform: 'uppercase' as const,
                color: decisionColor(lastDecision.action),
                padding: '0.2rem 0.5rem',
                border: `1px solid ${decisionColor(lastDecision.action)}30`,
                backgroundColor: `${decisionColor(lastDecision.action)}08`,
              }}
            >
              {lastDecision.action}
            </span>
            <span
              style={{
                fontFamily: MONO,
                fontSize: '0.58rem',
                color: 'rgba(255,255,255,0.3)',
              }}
            >
              {Math.round(lastDecision.confidence * 100)}% confidence
            </span>
          </div>
          <p
            style={{
              fontFamily: MONO,
              fontSize: '0.72rem',
              color: 'rgba(255,255,255,0.65)',
              lineHeight: 1.7,
              margin: 0,
              marginBottom: lastDecision.tool ? '0.5rem' : 0,
            }}
          >
            {lastDecision.reasoning}
          </p>
          {lastDecision.tool && (
            <span
              style={{
                fontFamily: MONO,
                fontSize: '0.58rem',
                color: 'rgba(255,255,255,0.25)',
                letterSpacing: '0.06em',
              }}
            >
              via {lastDecision.tool}
            </span>
          )}
        </div>
      )}

      {/* ── Locus payment result ── */}
      {lastPayment && (
        <div
          style={{
            margin: '0 1.5rem 1.5rem',
            padding: '1rem 1.25rem',
            border: `1px solid ${lastPayment.pendingApproval ? 'rgba(167,139,250,0.25)' : 'rgba(126,255,212,0.2)'}`,
            backgroundColor: lastPayment.pendingApproval ? 'rgba(167,139,250,0.04)' : 'rgba(126,255,212,0.04)',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.4rem',
            }}
          >
            <span
              style={{
                fontFamily: MONO,
                fontSize: '0.6rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase' as const,
                color: lastPayment.pendingApproval ? PURPLE : MINT,
              }}
            >
              {lastPayment.pendingApproval ? '[Locus] Awaiting approval' : '[Locus] Payment queued'}
            </span>
            <span
              style={{
                fontFamily: MONO,
                fontSize: '0.72rem',
                fontWeight: 700,
                color: lastPayment.pendingApproval ? PURPLE : MINT,
              }}
            >
              ${lastPayment.amountUsd?.toFixed(2)} USDC
            </span>
          </div>
          <div
            style={{
              fontFamily: MONO,
              fontSize: '0.6rem',
              color: 'rgba(255,255,255,0.3)',
              marginBottom: lastPayment.approvalUrl ? '0.75rem' : '0.5rem',
            }}
          >
            → {lastPayment.toAddress?.slice(0, 10)}...{lastPayment.toAddress?.slice(-6)} · {lastPayment.status}
          </div>
          {lastPayment.approvalUrl && (
            <a
              href={lastPayment.approvalUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-block',
                fontFamily: MONO,
                fontSize: '0.62rem',
                color: PURPLE,
                textDecoration: 'none',
                border: '1px solid rgba(167,139,250,0.3)',
                padding: '0.4rem 0.8rem',
                marginBottom: '0.5rem',
              }}
            >
              Approve payment on Locus ↗
            </a>
          )}
          <button
            onClick={() => setLastPayment(null)}
            style={{
              display: 'block',
              fontFamily: MONO,
              fontSize: '0.55rem',
              color: 'rgba(255,255,255,0.2)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: 0,
            }}
          >
            dismiss
          </button>
        </div>
      )}

      {/* ── Execution log ── */}
      {log.length > 0 && (
        <div
          style={{
            borderTop: '1px solid rgba(126,255,212,0.08)',
          }}
        >
          <div
            style={{
              padding: '0.75rem 1.5rem',
              borderBottom: '1px solid rgba(126,255,212,0.06)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span
              style={{
                fontFamily: MONO,
                fontSize: '0.6rem',
                letterSpacing: '0.12em',
                textTransform: 'uppercase' as const,
                color: 'rgba(255,255,255,0.25)',
              }}
            >
              Session log
            </span>
            <span
              style={{
                fontFamily: MONO,
                fontSize: '0.58rem',
                color: 'rgba(255,255,255,0.2)',
              }}
            >
              {log.length} entries
            </span>
          </div>
          {log.map((entry) => (
            <div
              key={entry.id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.65rem 1.5rem',
                borderBottom: '1px solid rgba(255,255,255,0.04)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <div
                  style={{
                    width: 5,
                    height: 5,
                    borderRadius: '50%',
                    backgroundColor: logDot(entry.decision),
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: '0.68rem',
                    color: 'rgba(255,255,255,0.6)',
                  }}
                >
                  {entry.action}
                </span>
                {entry.private_inference && (
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: '0.52rem',
                      color: PURPLE,
                      border: '1px solid rgba(167,139,250,0.25)',
                      padding: '0.1rem 0.35rem',
                      letterSpacing: '0.08em',
                    }}
                  >
                    private
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {entry.amount_usd && (
                  <span
                    style={{
                      fontFamily: MONO,
                      fontSize: '0.68rem',
                      fontWeight: 700,
                      color: MINT,
                    }}
                  >
                    ${entry.amount_usd}
                  </span>
                )}
                <span
                  style={{
                    fontFamily: MONO,
                    fontSize: '0.58rem',
                    color: 'rgba(255,255,255,0.25)',
                  }}
                >
                  {new Date(entry.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
