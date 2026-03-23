import { promises as fs } from 'fs'
import path from 'path'

const LOG_PATH = path.join(process.cwd(), 'public', 'agent_log.json')

export interface LogEntry {
  id: string
  timestamp: string
  action: string
  tool: string | null
  amount_usd: number | null
  tx_hash: string | null
  policy_check: string
  private_inference: boolean
  result: string
  reasoning?: string
  block_reason?: string
}

interface AgentLog {
  schema: string
  agent: string
  entries: LogEntry[]
}

export async function appendToAgentLog(
  entry: Omit<LogEntry, 'id' | 'timestamp'>
): Promise<LogEntry> {
  let log: AgentLog = { schema: 'ERC-8004-log', agent: 'Ghostify', entries: [] }

  try {
    const existing = await fs.readFile(LOG_PATH, 'utf-8')
    log = JSON.parse(existing)
  } catch {
    // file doesn't exist yet — use default
  }

  const newEntry: LogEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...entry,
  }

  log.entries.unshift(newEntry) // most recent first
  log.entries = log.entries.slice(0, 100) // keep last 100

  await fs.writeFile(LOG_PATH, JSON.stringify(log, null, 2))

  return newEntry
}

export async function getAgentLog(): Promise<LogEntry[]> {
  try {
    const content = await fs.readFile(LOG_PATH, 'utf-8')
    return (JSON.parse(content) as AgentLog).entries
  } catch {
    return []
  }
}
