import { NextRequest, NextResponse } from 'next/server'
import { askVenice } from '@/lib/venice'
import { checkSpendPolicy, type SpendPolicy } from '@/lib/ampersend'
import { sendUSDC, submitLocusFeedback } from '@/lib/locus'
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

    const veniceKey = process.env.VENICE_API_KEY
    if (!veniceKey) {
      return NextResponse.json({ error: 'Venice API key not configured' }, { status: 500 })
    }

    const locusKey = process.env.LOCUS_API_KEY

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
      veniceKey
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

    // 3. Ampersend local policy enforcement
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

    // 4. Locus executes the USDC payment on Base
    if (locusKey && decision.destination && decision.amount) {
      try {
        const payment = await sendUSDC(
          {
            to_address: decision.destination,
            amount: decision.amount,
            memo: task,
          },
          locusKey
        )

        const isPendingApproval = payment.status === 'PENDING_APPROVAL'

        await appendToAgentLog({
          action: task,
          tool: 'locus_usdc',
          amount_usd: payment.amount,
          tx_hash: null, // Locus sends async — tx_hash arrives later via status poll
          policy_check: 'passed',
          private_inference: true,
          result: isPendingApproval ? 'pending_approval' : 'queued',
          reasoning: decision.reasoning,
        })

        return NextResponse.json({
          executed: true,
          decision,
          payment: {
            transactionId: payment.transaction_id,
            status: payment.status,
            amountUsd: payment.amount,
            toAddress: payment.to_address,
            // If human approval needed, surface the approval URL
            approvalUrl: payment.approval_url ?? null,
            pendingApproval: isPendingApproval,
          },
        })
      } catch (locusErr: unknown) {
        const message = locusErr instanceof Error ? locusErr.message : 'Locus error'
        // Report error to Locus feedback
        if (locusKey) {
          await submitLocusFeedback(
            {
              category: 'error',
              endpoint: '/api/pay/send',
              message,
              context: { task, amount: decision.amount },
              source: 'error',
            },
            locusKey
          )
        }
        // Fall through to pendingSignature if Locus unavailable
        await appendToAgentLog({
          action: task,
          tool: decision.tool,
          amount_usd: decision.amount,
          tx_hash: null,
          policy_check: 'passed',
          private_inference: true,
          result: 'locus_error',
          reasoning: `Locus unavailable: ${message}`,
        })
        return NextResponse.json({ executed: false, decision, locusError: message }, { status: 500 })
      }
    }

    // 5. No Locus key configured — log approval and return tx params for manual signing
    await appendToAgentLog({
      action: task,
      tool: decision.tool,
      amount_usd: decision.amount,
      tx_hash: null,
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
        ? { to: decision.destination, amountUsd: decision.amount, tool: decision.tool }
        : null,
    })

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Ghostify Execute]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
