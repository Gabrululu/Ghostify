import { NextRequest, NextResponse } from 'next/server'
import { askVenice, AgentContext } from '@/lib/venice'

export async function POST(req: NextRequest) {
  try {
    const context: AgentContext = await req.json()

    if (!context.task || !context.dailyLimit) {
      return NextResponse.json(
        { error: 'Missing required context fields' },
        { status: 400 }
      )
    }

    const apiKey = process.env.VENICE_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'Venice API key not configured' },
        { status: 500 }
      )
    }

    const decision = await askVenice(context, apiKey)

    console.log('[Ghostify Agent]', {
      action: decision.action,
      tool: decision.tool,
      policy_check: decision.policy_check,
      confidence: decision.confidence,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json(decision)

  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Venice Error]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
