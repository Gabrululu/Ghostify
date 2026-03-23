import { promises as fs } from 'fs'
import path from 'path'

// Vercel serverless: public/ is read-only. Write to /tmp (ephemeral), read from both.
const TMP_PATH = '/tmp/agent_log.json'
const STATIC_PATH = path.join(process.cwd(), 'public', 'agent_log.json')

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

async function readTmpLog(): Promise<AgentLog> {
  try {
    const content = await fs.readFile(TMP_PATH, 'utf-8')
    return JSON.parse(content) as AgentLog
  } catch {
    return { schema: 'ERC-8004-log', agent: 'Ghostify', entries: [] }
  }
}

async function readStaticLog(): Promise<LogEntry[]> {
  try {
    const content = await fs.readFile(STATIC_PATH, 'utf-8')
    return (JSON.parse(content) as AgentLog).entries ?? []
  } catch {
    return []
  }
}

export async function appendToAgentLog(
  entry: Omit<LogEntry, 'id' | 'timestamp'>
): Promise<LogEntry> {
  const log = await readTmpLog()

  const newEntry: LogEntry = {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...entry,
  }

  log.entries.unshift(newEntry) // most recent first
  log.entries = log.entries.slice(0, 100) // keep last 100

  await fs.writeFile(TMP_PATH, JSON.stringify(log, null, 2))

  return newEntry
}

export async function getAgentLog(): Promise<LogEntry[]> {
  const [tmpEntries, staticEntries] = await Promise.all([
    readTmpLog().then((l) => l.entries),
    readStaticLog(),
  ])

  // merge: tmp (runtime) first, then static (demo entries), deduplicated by id
  const seen = new Set<string>()
  const merged: LogEntry[] = []
  for (const e of [...tmpEntries, ...staticEntries]) {
    if (!seen.has(e.id)) {
      seen.add(e.id)
      merged.push(e)
    }
  }
  return merged
}
