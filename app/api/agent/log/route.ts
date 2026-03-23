import { NextRequest, NextResponse } from 'next/server'
import { appendToAgentLog, getAgentLog } from '@/lib/agent-log'

export async function POST(req: NextRequest) {
  try {
    const entry = await req.json()

    if (!entry.action || !entry.result) {
      return NextResponse.json(
        { error: 'Missing required fields: action, result' },
        { status: 400 }
      )
    }

    const newEntry = await appendToAgentLog({
      action: entry.action,
      tool: entry.tool ?? null,
      amount_usd: entry.amount_usd ?? null,
      tx_hash: entry.tx_hash ?? null,
      policy_check: entry.policy_check ?? 'passed',
      private_inference: entry.private_inference ?? false,
      result: entry.result,
      reasoning: entry.reasoning,
      block_reason: entry.block_reason,
    })

    return NextResponse.json({ success: true, entry: newEntry })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function GET() {
  try {
    const entries = await getAgentLog()
    return NextResponse.json({ entries })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
