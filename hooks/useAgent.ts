'use client'

import { useState, useCallback } from 'react'
import { AgentContext, AgentDecision } from '@/lib/venice'

export interface LogEntry {
  id: string
  timestamp: string
  action: string
  tool: string | null
  amount_usd: number | null
  policy_check: string
  private_inference: boolean
  tx_hash: string | null
  decision: 'execute' | 'hold' | 'block'
  reasoning: string
}

export function useAgent() {
  const [isThinking, setIsThinking] = useState(false)
  const [lastDecision, setLastDecision] = useState<AgentDecision | null>(null)
  const [log, setLog] = useState<LogEntry[]>([])
  const [error, setError] = useState<string | null>(null)

  const think = useCallback(async (context: AgentContext) => {
    setIsThinking(true)
    setError(null)

    try {
      const res = await fetch('/api/agent/decide', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(context),
      })

      if (!res.ok) throw new Error('Agent API failed')

      const decision: AgentDecision = await res.json()
      setLastDecision(decision)

      // Agregar al log local
      const entry: LogEntry = {
        id: crypto.randomUUID(),
        timestamp: new Date().toISOString(),
        action: decision.log_entry.action,
        tool: decision.log_entry.tool,
        amount_usd: decision.log_entry.amount_usd,
        policy_check: decision.log_entry.policy_check,
        private_inference: true,
        tx_hash: null, // se llena cuando se ejecuta la tx
        decision: decision.action,
        reasoning: decision.reasoning,
      }

      setLog(prev => [entry, ...prev])

      return decision

    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setIsThinking(false)
    }
  }, [])

  const clearLog = () => setLog([])

  return {
    think,
    isThinking,
    lastDecision,
    log,
    error,
    clearLog,
  }
}