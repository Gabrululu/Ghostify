import { NextRequest, NextResponse } from 'next/server'
import { askVenice } from '@/lib/venice'
import { checkSpendPolicy, type SpendPolicy } from '@/lib/ampersend'
import { appendToAgentLog } from '@/lib/agent-log'

export async function POST(req: NextRequest) {
  try {
    const { task, context, policy } = await req.json() as {
      task: string
      context: {
        usdcBalance: string
        spentToday: number
        approvedWallets: string[]
        timeWindow: { start: string; end: string }
        recentActions: Array<{ action: string; amount: number; timestamp: string }>
      }
      policy: SpendPolicy
    }

    const apiKey = process.env.VENICE_API_KEY
    if (!apiKey) {
      return NextResponse.json({ error: 'Venice API key not configured' }, { status: 500 })
    }

    // 1. Venice decides (private inference)
    const decision = await askVenice(
      {
        task,
        usdcBalance: context.usdcBalance,
        dailyLimit: policy.dailyLimitUsd,
        spentToday: context.spentToday,
        approvedWallets: context.approvedWallets,
        timeWindow: context.timeWindow,
        recentActions: context.recentActions,
      },
      apiKey
    )

    // 2. If Venice says hold/block — log and return immediately
    if (decision.action !== 'execute') {
      await appendToAgentLog({
        action: task,
        tool: null,
        amount_usd: null,
        tx_hash: null,
        policy_check: decision.policy_check,
        private_inference: true,
        result: decision.action,
        reasoning: decision.reasoning,
      })

      return NextResponse.json({
        executed: false,
        decision,
        message: `Agent decided to ${decision.action}: ${decision.reasoning}`,
      })
    }

    // 3. Local policy enforcement (Ampersend spend policy layer)
    if (decision.destination && decision.amount) {
      const policyCheck = checkSpendPolicy(
        policy,
        decision.amount,
        decision.destination,
        context.spentToday
      )

      if (!policyCheck.allowed) {
        await appendToAgentLog({
          action: task,
          tool: decision.tool,
          amount_usd: decision.amount,
          tx_hash: null,
          policy_check: 'failed',
          private_inference: true,
          result: 'blocked',
          reasoning: decision.reasoning,
          block_reason: policyCheck.reason,
        })

        return NextResponse.json({
          executed: false,
          decision,
          blocked: true,
          blockReason: policyCheck.reason,
        })
      }
    }

    // 4. Policy passed — return unsigned tx params for frontend to sign via wagmi
    await appendToAgentLog({
      action: task,
      tool: decision.tool,
      amount_usd: decision.amount,
      tx_hash: null, // filled in by frontend after wallet signs
      policy_check: 'passed',
      private_inference: true,
      result: 'pending_signature',
      reasoning: decision.reasoning,
    })

    return NextResponse.json({
      executed: false,
      pendingSignature: true,
      decision,
      tx: decision.destination && decision.amount
        ? {
            to: decision.destination,
            amountUsd: decision.amount,
            tool: decision.tool,
          }
        : null,
    })

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Ghostify Execute]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
