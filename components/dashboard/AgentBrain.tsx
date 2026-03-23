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
    // If Venice returns an executed payment result, surface it
    if ((decision as any)?.payment) {
      setLastPayment((decision as any).payment)
    }
    setTask('')
  }

  const getDecisionColor = (action: string) => {
    if (action === 'execute') return 'accent-green'
    if (action === 'hold') return 'accent-purple'
    return 'accent-pink'
  }

  const getStatusDot = (action: string) => {
    if (action === 'execute') return 'status-ok'
    if (action === 'hold') return 'status-priv'
    return 'status-block'
  }

  return (
    <div className="agent-brain">

      {/* Task input */}
      <div className="task-input-section">
        <span className="section-tag">[Venice AI] Private Inference</span>
        <div className="task-row">
          <input
            type="text"
            value={task}
            onChange={e => setTask(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleThink()}
            placeholder="Give your agent a task..."
            className="task-input"
            disabled={isThinking}
          />
          <button
            onClick={handleThink}
            disabled={isThinking || !task.trim()}
            className="btn-primary"
          >
            {isThinking ? 'Thinking...' : 'Run Agent ↗'}
          </button>
        </div>
        <p className="privacy-note">
          ◆ Inference runs privately via Venice — your task is never logged externally
        </p>
      </div>

      {/* Last decision */}
      {lastDecision && (
        <div className={`decision-card decision-${lastDecision.action}`}>
          <div className="decision-header">
            <span className={`decision-badge ${getDecisionColor(lastDecision.action)}`}>
              {lastDecision.action.toUpperCase()}
            </span>
            <span className="confidence">
              {Math.round(lastDecision.confidence * 100)}% confidence
            </span>
          </div>
          <p className="reasoning">{lastDecision.reasoning}</p>
          {lastDecision.tool && (
            <span className="tool-used">via {lastDecision.tool}</span>
          )}
        </div>
      )}

      {/* Locus payment result */}
      {lastPayment && (
        <div style={{
          margin: '1rem 0',
          padding: '1rem 1.25rem',
          border: `1px solid ${lastPayment.pendingApproval ? 'rgba(167,139,250,0.25)' : 'rgba(126,255,212,0.2)'}`,
          backgroundColor: lastPayment.pendingApproval ? 'rgba(167,139,250,0.04)' : 'rgba(126,255,212,0.04)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: lastPayment.pendingApproval ? '#a78bfa' : '#7effd4' }}>
              {lastPayment.pendingApproval ? '[Locus] Awaiting your approval' : '[Locus] Payment queued'}
            </span>
            <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.72rem', fontWeight: 700, color: lastPayment.pendingApproval ? '#a78bfa' : '#7effd4' }}>
              ${lastPayment.amountUsd?.toFixed(2)} USDC
            </span>
          </div>
          <div style={{ fontFamily: 'Space Mono, monospace', fontSize: '0.6rem', color: 'rgba(255,255,255,0.35)', marginBottom: lastPayment.approvalUrl ? '0.75rem' : '0' }}>
            → {lastPayment.toAddress?.slice(0, 10)}...{lastPayment.toAddress?.slice(-6)} · {lastPayment.status}
          </div>
          {lastPayment.approvalUrl && (
            <a
              href={lastPayment.approvalUrl}
              target="_blank"
              rel="noreferrer"
              style={{ display: 'inline-block', fontFamily: 'Space Mono, monospace', fontSize: '0.65rem', color: '#a78bfa', textDecoration: 'none', border: '1px solid rgba(167,139,250,0.3)', padding: '0.4rem 0.8rem', marginBottom: '0.4rem' }}
            >
              Approve payment on Locus ↗
            </a>
          )}
          <button
            onClick={() => setLastPayment(null)}
            style={{ display: 'block', fontFamily: 'Space Mono, monospace', fontSize: '0.55rem', color: 'rgba(255,255,255,0.25)', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: '0.3rem' }}
          >
            dismiss
          </button>
        </div>
      )}

      {/* Execution log */}
      {log.length > 0 && (
        <div className="execution-log">
          <div className="log-title">Execution log</div>
          {log.map(entry => (
            <div key={entry.id} className="log-item">
              <div className="log-left">
                <span className={`log-status ${getStatusDot(entry.decision)}`} />
                <span className="log-action">{entry.action}</span>
                {entry.private_inference && (
                  <span className="private-badge">private</span>
                )}
              </div>
              <div className="log-right">
                {entry.amount_usd && (
                  <span className="log-amount">${entry.amount_usd}</span>
                )}
                <span className="log-time">
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
