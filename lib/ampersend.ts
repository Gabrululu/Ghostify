/**
 * Ampersend integration for Ghostify
 *
 * The SDK uses the x402 payment protocol for agent-to-agent / agent-to-tool payments.
 * Role split:
 *   - Ampersend x402 client  → agent pays for external MCP tool services (e.g. data APIs)
 *   - Local policy enforcement → daily spend limits, address allowlists, time windows
 *   - wagmi (frontend)        → user USDC transfers signed by their own wallet
 */
import {
  AccountWallet,
  type X402Treasurer,
  type Authorization,
  type PaymentStatus,
} from '@ampersend_ai/ampersend-sdk/x402'
import {
  Client,
  StreamableHTTPClientTransport,
} from '@ampersend_ai/ampersend-sdk/mcp/client'
import type { PaymentRequirements } from 'x402/types'

// ─── Policy types ────────────────────────────────────────────────────────────

export interface SpendPolicy {
  dailyLimitUsd: number
  singleTxLimitUsd: number
  approvedAddresses: string[]
  allowWeekends: boolean
  timeWindowStart: string // "HH:MM"
  timeWindowEnd: string   // "HH:MM"
}

export interface PolicyCheckResult {
  allowed: boolean
  reason?: string
}

export interface PaymentResult {
  txHash: string | null
  amountUsd: number
  status: 'approved' | 'blocked'
  blockReason?: string
  timestamp: string
}

// ─── Policy enforcement (runs before any payment) ────────────────────────────

export function checkSpendPolicy(
  policy: SpendPolicy,
  amountUsd: number,
  to: string,
  spentTodayUsd: number
): PolicyCheckResult {
  if (amountUsd > policy.singleTxLimitUsd) {
    return { allowed: false, reason: `Amount $${amountUsd} exceeds single-tx limit $${policy.singleTxLimitUsd}` }
  }

  if (spentTodayUsd + amountUsd > policy.dailyLimitUsd) {
    return { allowed: false, reason: `Would exceed daily limit $${policy.dailyLimitUsd} (spent $${spentTodayUsd})` }
  }

  if (policy.approvedAddresses.length > 0 && !policy.approvedAddresses.includes(to.toLowerCase())) {
    return { allowed: false, reason: `Address ${to} is not on the approved list` }
  }

  if (!policy.allowWeekends) {
    const day = new Date().getDay()
    if (day === 0 || day === 6) {
      return { allowed: false, reason: 'Transactions blocked on weekends per policy' }
    }
  }

  const now = new Date()
  const [startH, startM] = policy.timeWindowStart.split(':').map(Number)
  const [endH, endM] = policy.timeWindowEnd.split(':').map(Number)
  const currentMinutes = now.getHours() * 60 + now.getMinutes()
  const startMinutes = startH * 60 + startM
  const endMinutes = endH * 60 + endM

  if (currentMinutes < startMinutes || currentMinutes > endMinutes) {
    return { allowed: false, reason: `Outside allowed time window ${policy.timeWindowStart}–${policy.timeWindowEnd}` }
  }

  return { allowed: true }
}

// ─── Ampersend x402 MCP client ────────────────────────────────────────────────
// The agent uses this to call external paid tool servers (MCP + x402 protocol).
// Requires AGENT_PRIVATE_KEY — an EOA funded on Base for tool service payments.

/**
 * Custom treasurer that enforces spend policy before approving x402 payments.
 */
class PolicyTreasurer implements X402Treasurer {
  private wallet: AccountWallet
  private policy: SpendPolicy
  private spentToday: number

  constructor(wallet: AccountWallet, policy: SpendPolicy, spentTodayUsd: number) {
    this.wallet = wallet
    this.policy = policy
    this.spentToday = spentTodayUsd
  }

  async onPaymentRequired(
    requirements: ReadonlyArray<PaymentRequirements>
  ): Promise<Authorization | null> {
    const req = requirements[0]
    const amountUsd = Number(req.maxAmountRequired) / 1_000_000 // USDC 6 decimals

    const check = checkSpendPolicy(this.policy, amountUsd, req.payTo, this.spentToday)
    if (!check.allowed) {
      console.warn('[Ghostify PolicyTreasurer] Payment blocked:', check.reason)
      return null
    }

    const payment = await this.wallet.createPayment(req)
    return { payment, authorizationId: crypto.randomUUID() }
  }

  async onStatus(
    _status: PaymentStatus,
    _authorization: Authorization
  ): Promise<void> {
    // Future: persist status to agent_log
  }
}

/**
 * Create an x402 MCP client for the agent to call paid external tool servers.
 *
 * @example
 * const client = createMcpPaymentClient(serverUrl, policy, spentToday)
 * await client.connect(transport)
 * const result = await client.callTool({ name: 'query', arguments: { q: '...' } })
 */
export function createMcpPaymentClient(
  policy: SpendPolicy,
  spentTodayUsd: number
): Client {
  const privateKey = process.env.AGENT_PRIVATE_KEY as `0x${string}` | undefined
  if (!privateKey) throw new Error('AGENT_PRIVATE_KEY not set')

  const wallet = AccountWallet.fromPrivateKey(privateKey)
  const treasurer = new PolicyTreasurer(wallet, policy, spentTodayUsd)

  return new Client(
    { name: 'Ghostify Agent', version: '1.0.0' },
    { mcpOptions: { capabilities: { tools: {} } }, treasurer }
  )
}

/**
 * Connect a client to a paid MCP server and call a tool.
 */
export async function callPaidMcpTool(
  serverUrl: string,
  toolName: string,
  toolArgs: Record<string, unknown>,
  policy: SpendPolicy,
  spentTodayUsd: number
): Promise<unknown> {
  const client = createMcpPaymentClient(policy, spentTodayUsd)
  const transport = new StreamableHTTPClientTransport(new URL(serverUrl))

  try {
    await client.connect(transport)
    const result = await client.callTool({ name: toolName, arguments: toolArgs })
    return result
  } finally {
    await client.close()
  }
}
