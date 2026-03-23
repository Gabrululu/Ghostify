'use client'

import { useState, useEffect, useCallback } from 'react'
import type { LocusTransaction } from '@/lib/locus'

export function useLocus() {
  const [balance, setBalance] = useState<number | null>(null)
  const [transactions, setTransactions] = useState<LocusTransaction[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchBalance = useCallback(async () => {
    try {
      const res = await fetch('/api/locus/balance')
      if (!res.ok) {
        setBalance(0)
        return
      }
      const data = await res.json()
      setBalance(data.balance ?? 0)
    } catch {
      setBalance(0)
    }
  }, [])

  const fetchHistory = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/locus/history?limit=10')
      if (!res.ok) return
      const data = await res.json()
      setTransactions(data.transactions ?? [])
    } catch {
      // silent
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refetch = useCallback(() => {
    fetchBalance()
    fetchHistory()
  }, [fetchBalance, fetchHistory])

  useEffect(() => {
    fetchBalance()
    fetchHistory()
  }, [fetchBalance, fetchHistory])

  return {
    balance,
    transactions,
    isLoading,
    error,
    refetch,
  }
}
