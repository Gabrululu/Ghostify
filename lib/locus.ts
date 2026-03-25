/**
 * Locus Protocol — server-side USDC payments via REST API
 * https://paywithlocus.com/SKILL.md
 *
 * API key starts with `claw_` — NEVER expose to client.
 * Locus manages a custodial USDC wallet on Base Mainnet.
 */

const LOCUS_API = 'https://api.paywithlocus.com/api'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface LocusPayment {
  to_address: string
  amount: number
  memo: string
}

export interface LocusSendResult {
  transaction_id: string
  queue_job_id: string
  status: 'QUEUED' | 'PENDING_APPROVAL' | string
  from_address: string
  to_address: string
  amount: number
  token: string
  approval_url?: string   // only present when status === 'PENDING_APPROVAL'
}

export interface LocusTransaction {
  id: string
  created_at: string
  status: string
  amount_usdc: string
  memo: string
  to_address: string
  to_ens_name: string | null
  recipient_email: string | null
  category: string
  tx_hash: string | null
  failure_reason?: string
  error_reason?: string
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

async function locusPost<T>(path: string, body: unknown, apiKey: string): Promise<T> {
  const res = await fetch(`${LOCUS_API}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const json = await res.json()
  if (!json.success) {
    throw new Error(json.message ?? json.error ?? `Locus error ${res.status}`)
  }
  return json.data as T
}

async function locusGet<T>(path: string, apiKey: string): Promise<T> {
  const res = await fetch(`${LOCUS_API}${path}`, {
    headers: { Authorization: `Bearer ${apiKey}` },
  })
  if (!res.ok) {
    throw new Error(`Locus error ${res.status}: ${path}`)
  }
  const json = await res.json()
  if (!json.success) {
    throw new Error(json.message ?? json.error ?? `Locus error ${res.status}`)
  }
  return json.data as T
}

// ─── API calls ───────────────────────────────────────────────────────────────

/**
 * Send USDC to an address on Base.
 * Returns QUEUED immediately, or PENDING_APPROVAL if above approval threshold.
 */
export async function sendUSDC(
  payment: LocusPayment,
  apiKey: string
): Promise<LocusSendResult> {
  return locusPost<LocusSendResult>('/pay/send', payment, apiKey)
}

/**
 * Get the agent's USDC balance from Locus.
 */
export async function getLocusBalance(apiKey: string): Promise<number> {
  const data = await locusGet<{ balance_usdc: string }>('/pay/balance', apiKey)
  return parseFloat(data.balance_usdc)
}

/**
 * List recent transactions from Locus.
 */
export async function getLocusHistory(
  apiKey: string,
  limit = 10
): Promise<LocusTransaction[]> {
  const data = await locusGet<{ transactions: LocusTransaction[] }>(
    `/pay/transactions?limit=${limit}`,
    apiKey
  )
  return data.transactions
}

/**
 * Submit feedback to Locus on error.
 */
export async function submitLocusFeedback(params: {
  category: 'error' | 'general' | 'endpoint' | 'suggestion'
  endpoint?: string
  message: string
  context?: Record<string, unknown>
  source?: 'error' | 'heartbeat' | 'manual'
}, apiKey: string): Promise<void> {
  try {
    await locusPost('/feedback', params, apiKey)
  } catch {
    // best-effort, don't throw on feedback failure
  }
}
