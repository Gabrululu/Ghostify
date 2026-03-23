'use client'

import { useState, useCallback } from 'react'
import { useAgentWallet } from './useAgentWallet'
import type { SpendPolicy } from '@/lib/ampersend'

export interface GhostifyResult {
  executed: boolean
  pendingSignature?: boolean
  blocked?: boolean
  blockReason?: string
  decision?: {
    action: 'execute' | 'hold' | 'block'
    reasoning: string
    tool: string | null
    amount: number | null
    destination: string | null
    confidence: number
    policy_check: string
  }
  tx?: {
    to: string
    amountUsd: number
    tool: string | null
  } | null
  message?: string
}

export interface DailySpend {
  spent: number
  limit: number
  remaining: number
  txCount: number
}

export function useGhostify() {
  const { usdcBalance, address } = useAgentWallet()
  const [isRunning, setIsRunning] = useState(false)
  const [lastResult, setLastResult] = useState<GhostifyResult | null>(null)
  const [dailySpend, setDailySpend] = useState<DailySpend>({
    spent: 247.80,
    limit: 400,
    remaining: 152.20,
    txCount: 34,
  })
  const [error, setError] = useState<string | null>(null)

  const runAgent = useCallback(
    async (
      task: string,
      policy: SpendPolicy,
    ): Promise<GhostifyResult | null> => {
      if (!address) {
        setError('Wallet not connected')
        return null
      }

      setIsRunning(true)
      setError(null)

      try {
        const res = await fetch('/api/agent/execute', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            task,
            policy,
            context: {
              usdcBalance,
              spentToday: dailySpend.spent,
              approvedWallets: policy.approvedAddresses,
              timeWindow: {
                start: policy.timeWindowStart,
                end: policy.timeWindowEnd,
              },
              recentActions: [],
            },
          }),
        })

        if (!res.ok) throw new Error('Agent API failed')

        const result: GhostifyResult = await res.json()
        setLastResult(result)

        // Update local spend tracker when execution is approved
        if (result.pendingSignature && result.tx?.amountUsd) {
          setDailySpend((prev) => ({
            ...prev,
            spent: prev.spent + result.tx!.amountUsd,
            remaining: prev.remaining - result.tx!.amountUsd,
            txCount: prev.txCount + 1,
          }))
        }

        return result
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Unknown error'
        setError(message)
        return null
      } finally {
        setIsRunning(false)
      }
    },
    [address, usdcBalance, dailySpend.spent]
  )

  return {
    runAgent,
    isRunning,
    lastResult,
    dailySpend,
    error,
  }
}
