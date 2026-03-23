const VENICE_API_URL = 'https://api.venice.ai/api/v1'

export interface AgentContext {
  task: string
  usdcBalance: string
  dailyLimit: number
  spentToday: number
  approvedWallets: string[]
  timeWindow: { start: string; end: string }
  recentActions: Array<{
    action: string
    amount: number
    timestamp: string
  }>
}

export interface AgentDecision {
  action: 'execute' | 'hold' | 'block'
  reasoning: string
  tool: string | null
  amount: number | null
  destination: string | null
  confidence: number
  policy_check: 'passed' | 'failed' | 'warning'
  log_entry: {
    action: string
    tool: string | null
    amount_usd: number | null
    policy_check: string
    private_inference: true
  }
}

export async function askVenice(
  context: AgentContext,
  apiKey: string
): Promise<AgentDecision> {
  const systemPrompt = `You are Ghostify's autonomous agent. You make spending decisions on behalf of a user who has defined strict policies.

RULES YOU MUST FOLLOW:
- Never exceed the daily spend limit
- Only send funds to approved wallet addresses
- Never execute transactions outside the allowed time window
- Always return valid JSON matching the AgentDecision schema
- Be conservative: when in doubt, hold

RESPONSE FORMAT (strict JSON, no markdown):
{
  "action": "execute" | "hold" | "block",
  "reasoning": "brief explanation",
  "tool": "locus_usdc" | "ampersend" | "uniswap" | null,
  "amount": number | null,
  "destination": "0x..." | null,
  "confidence": 0.0-1.0,
  "policy_check": "passed" | "failed" | "warning",
  "log_entry": {
    "action": string,
    "tool": string | null,
    "amount_usd": number | null,
    "policy_check": string,
    "private_inference": true
  }
}`

  const userPrompt = `Current agent context:
- Task: ${context.task}
- USDC Balance: $${context.usdcBalance}
- Daily limit: $${context.dailyLimit}
- Spent today: $${context.spentToday} (${Math.round((context.spentToday / context.dailyLimit) * 100)}% used)
- Approved wallets: ${context.approvedWallets.join(', ') || 'none set'}
- Time window: ${context.timeWindow.start} - ${context.timeWindow.end}
- Recent actions: ${JSON.stringify(context.recentActions.slice(-3))}

Analyze this context and decide what action to take.`

  const response = await fetch(`${VENICE_API_URL}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.1, // low temp = consistent decisions
      max_tokens: 500,
      venice_parameters: {
        include_venice_system_prompt: false, // usamos el nuestro
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Venice API error: ${response.status}`)
  }

  const data = await response.json()
  const content = data.choices[0].message.content

  try {
    return JSON.parse(content) as AgentDecision
  } catch {
    throw new Error(`Invalid JSON from Venice: ${content}`)
  }
}