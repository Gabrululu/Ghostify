'use client'

import { useState } from 'react'
import { useAgent } from '@/hooks/useAgent'
import { useAgentWallet } from '@/hooks/useAgentWallet'

export function AgentBrain() {
  const { think, isThinking, lastDecision, log } = useAgent()
  const { usdcBalance } = useAgentWallet()
  const [task, setTask] = useState('')

  const [policies] = useState({
    dailyLimit: 400,
    spentToday: 247.80,
    approvedWallets: [],
    timeWindow: { start: '00:00', end: '23:59' },
  })

  const handleThink = async () => {
    if (!task.trim()) return
    await think({
      task,
      usdcBalance,
      ...policies,
      recentActions: log.slice(0, 3).map(e => ({
        action: e.action,
        amount: e.amount_usd ?? 0,
        timestamp: e.timestamp,
      })),
    })
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

      {/* Input de tarea */}
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

      {/* Última decisión */}
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

      {/* Log de ejecuciones */}
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