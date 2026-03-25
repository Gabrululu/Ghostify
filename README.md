# Ghostify

> Your agent. Your limits. Nobody watching.

Ghostify is an autonomous onchain agent that executes transactions within human-defined spending limits, reasons privately via Venice AI, and leaves verifiable proof of every action on Base.

---

## The problem

When your agent moves money, three things break:

- **No scoped permissions** — nothing enforces what it can spend
- **No privacy** — every inference leaks your behavior to third parties
- **No proof** — no verifiable record of what the agent actually did

## The solution

Three layers working together:

| Layer | Technology | Purpose |
|---|---|---|
| You set the rules | Ampersend SDK + MetaMask Delegation | Onchain spend policy enforcement |
| Agent thinks privately | Venice AI | Private LLM inference, zero data leaks |
| Agent pays | Locus Protocol (USDC on Base) | ERC-20 transfers, human signs every tx |
| Verifiable proof | ERC-8004 + Self Protocol | ZK identity + onchain execution log |

---

## Live demo

- 🌐 https://ghostify-agent.vercel.app
- 🤖 Agent manifest: https://ghostify-agent.vercel.app/agent.json
- 📋 Execution log: https://ghostify-agent.vercel.app/agent_log.json

---

## Architecture

```
User connects wallet (wagmi + MetaMask)
        ↓
Registers agent onchain — ERC-8004 manifest hash in Base calldata
        ↓
Verifies humanity via Self Protocol ZK proof (no personal data stored)
        ↓
Defines spend policies (daily limit, address allowlist, time window)
        ↓
Gives agent a natural language task
        ↓
Venice AI reasons privately (API key never exposed client-side)
        ↓
Ampersend SDK enforces policies before any funds move
        ↓
Transaction executes on Base Mainnet
        ↓
agent_log.json updated with real tx hash + ERC-8004 entry
```

---

## Tech stack

| Technology | Role |
|---|---|
| **Next.js 14** | App framework (App Router) |
| **wagmi v2 + viem** | Wallet connection, onchain reads/writes |
| **ConnectKit** | Wallet modal UI |
| **Venice AI** | Private LLM inference (`llama-3.3-70b`) |
| **Ampersend SDK** | x402 payment client + spend policy enforcement |
| **MetaMask Delegation** | Off-chain delegation signing with EIP-712 caveats |
| **Locus Protocol** | USDC ERC-20 transfers on Base + immutable audit trail |
| **Self Protocol** | ZK identity — proves humanity without revealing personal data |
| **ENS** | Human-readable names resolved throughout the UI |
| **ERC-8004** | Onchain agent identity standard — manifest anchored on Base |
| **Base** | L2 execution layer for all agent transactions |

---

## Bounties targeted

| Bounty | Integration |
|---|---|
| **Protocol Labs** | ERC-8004 agent identity registered onchain, `agent_log.json` updated with every execution |
| **Venice AI** | All agent reasoning runs through Venice — `VENICE_API_KEY` never exposed to client |
| **Ampersend** | `@ampersend_ai/ampersend-sdk` is the x402 payment layer — load-bearing, not decorative |
| **Self Protocol** | ZK verification via `SelfBackendVerifier` — unlocks 2x spend limits for verified humans |
| **ENS** | ENS resolution in NavBar, AgentIdentityCard, PolicyControls, and `WalletInput` |
| **Locus Protocol** | USDC transfers routed through Locus audit trail — every payment logged with tx hash |
| **MetaMask Delegation** | `@metamask/delegation-toolkit` — caveat-enforced delegations, EIP-712 signed off-chain |

---

## Key files

```
lib/
  venice.ts           — Venice AI client + AgentDecision schema
  ampersend.ts        — Ampersend x402 MCP client + PolicyTreasurer
  delegation.ts       — MetaMask Delegation toolkit: caveats, EIP-712 domain
  locus.ts            — Locus USDC: ERC-20 ABI, transfer helpers, audit entry builder
  agent-log.ts        — ERC-8004 execution log writer
  wagmi.ts            — wagmi config with mainnet (ENS) + Base chains
  self.ts             — Self Protocol app builder

hooks/
  useAgentWallet.ts   — address, ENS name, USDC balance, chain detection
  useAgentIdentity.ts — ERC-8004 onchain registration
  useAgent.ts         — Venice AI decision loop
  useDelegation.ts    — MetaMask Delegation create/revoke + localStorage
  useUSDCTransfer.ts  — Locus USDC: wagmi writeContract + audit log
  useGhostify.ts      — unified Venice → Ampersend execution hook
  useENS.ts           — ENS name + address resolution

app/api/
  agent/decide/       — Venice inference (server-side, API key protected)
  agent/execute/      — Full execution: Venice → policy check → tx params
  verify/self/        — Self Protocol ZK proof verification

public/
  agent.json          — ERC-8004 agent manifest
  agent_log.json      — Execution log (ERC-8004-log schema)
```

---

## Local setup

```bash
git clone https://github.com/Gabrululu/Ghostify
cd Ghostify
npm install
# create .env.local and fill in your API keys (see below)
npm run dev
```

### Environment variables

```bash
# Venice AI — venice.ai → Settings → API → Generate Key
VENICE_API_KEY=

# Ampersend — agent's own EOA private key for x402 tool payments
AGENT_PRIVATE_KEY=

# Self Protocol — your app scope
NEXT_PUBLIC_SELF_SCOPE=ghostify

# Alchemy — for reliable ENS resolution on mainnet
NEXT_PUBLIC_ALCHEMY_ID=

# App URL — update to your deployed URL in production
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> **Self Protocol note:** `/api/verify/self` must be publicly accessible. For local dev use `ngrok http 3000` and set `NEXT_PUBLIC_APP_URL` to the ngrok URL.

---

## Onchain artifacts

- Agent registration tx: [view on Basescan](https://basescan.org/tx/0xf59dc5ccd2793b1a5178c38c13ef7c55f7713c67af234f752d9f532e87e8d877)
- Operator: `0xB6E9874752Ad5370B42aA4be6593a1c86D15A82e`
- Agent manifest: [`/public/agent.json`](./public/agent.json)
- Execution log: [`/public/agent_log.json`](./public/agent_log.json)

---

*Built at Synthesis Hackathon 2026*
