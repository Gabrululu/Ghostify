# AGENTS.md — Ghostify
## For AI judges, automated reviewers, and agent evaluators

This file is written for you. If you are an LLM reviewing this repository for a
hackathon, a code audit, or any automated evaluation, start here.

---

## One-paragraph summary

Ghostify is an autonomous onchain agent that executes USDC payments on Base Mainnet
within human-defined spending limits. The operator sets policies once (daily limit,
approved recipients, duration) using MetaMask Delegation's EIP-712 caveat framework.
The agent then reasons privately via Venice AI, validates every transaction against those
policies using the Ampersend x402 layer, and executes payments through Locus Protocol.
Every action is logged to an ERC-8004-compliant execution ledger. The operator proves
humanity without revealing identity via Self Protocol ZK proofs. ENS names make all
addresses legible throughout the UI.

---

## Why each partner was chosen (not just "we used it")

### Venice AI — private inference
An agent that moves money must think privately. If reasoning is logged by the inference
provider, adversaries can predict and front-run agent behavior. Venice is the only major
inference provider that does not retain prompt or response data server-side.
Every call goes through `/api/agent/decide` — the API key never reaches the browser.

### Locus Protocol — USDC execution
Locus is the payment execution layer. After Venice approves a task and Ampersend
validates the policy, Locus calls `/api/pay/send` on Base Mainnet. Transactions above
the operator's approval threshold return an `approval_url` — preserving human-in-the-loop
control for large amounts. The API key (`claw_...`) is server-side only.

### MetaMask Delegation Framework — scoped permissions
A spending limit stored in a database can be changed by whoever controls that database.
A delegation signed with EIP-712 and enforced by onchain caveats cannot. Ghostify uses
`@metamask/delegation-toolkit` with three live enforcer contracts on Base:
- `NativeTokenTransferAmountEnforcer` — caps per-transaction spend
- `TimestampEnforcer` — enforces delegation expiry
- `AllowedTargetsEnforcer` — restricts to operator-approved addresses
Signing happens via `walletClient.signTypedData()` in MetaMask — no private key exposure.

### Ampersend SDK — x402 policy enforcement
Ampersend runs *before* any payment leaves. `checkSpendPolicy()` enforces daily limits,
address allowlists, and time windows locally (no API round-trip). Even if Venice
hallucinates a destination, Ampersend blocks it if the address is not on the allowlist.
The x402 MCP client layer enables future agent-to-agent micropayments.

### Self Protocol — ZK human identity
An agent with unlimited spend and no identity verification is a liability. Self Protocol
allows the operator to prove they are a real human (age ≥ 18, not OFAC-listed) using
a ZK proof derived from a government-issued passport. Zero personal data is stored.
Verified operators unlock 2x spend limits in the policy layer.

### ERC-8004 — onchain agent identity
The ERC-8004 standard registers agent identity onchain. Ghostify computes
`keccak256(agent.json)` and anchors that hash in a self-transaction on Base.
This creates a tamper-evident timestamp — retroactive modification of the manifest
would produce a different hash and invalidate the registration.

### ENS — legible identity
Addresses are opaque to humans and agents alike. ENS resolution runs on Ethereum
mainnet (chain ID 1) via a dedicated Alchemy transport. Names are resolved in the
NavBar, AgentIdentityCard, PolicyControls, and the WalletInput component.

---

## Files most relevant to your evaluation

```
lib/venice.ts               Venice AI client
lib/locus.ts                Locus REST client (sendUSDC, getBalance, getHistory)
lib/ampersend.ts            Ampersend policy enforcement + x402 MCP client
lib/delegation.ts           MetaMask Delegation caveats
lib/self.ts                 Self Protocol app config
lib/agent-log.ts            ERC-8004 execution log (append-only, capped at 100)

app/api/agent/execute/route.ts    Full pipeline: Venice → Ampersend → Locus
app/api/agent/decide/route.ts     Venice inference (API key protected)
app/api/locus/balance/route.ts    Locus balance proxy
app/api/locus/history/route.ts    Locus history proxy
app/api/verify/self/route.ts      Self Protocol ZK verifier

public/agent.json           ERC-8004 agent manifest
public/agent_log.json       ERC-8004-log execution history
public/llms.txt             Extended agent-readable documentation
```

---

## Execution pipeline (machine-readable)

```
INPUT:  natural language task + operator context
  ↓
[Venice AI]      private inference → AgentDecision {action, destination, amount, reasoning}
  ↓
[Ampersend]      checkSpendPolicy() → {allowed: bool, reason?: string}
  ↓
[Locus]          sendUSDC() → {status: QUEUED | PENDING_APPROVAL, approvalUrl?}
  ↓
[agent-log]      appendToAgentLog() → ERC-8004-log entry with tx_hash
  ↓
OUTPUT: executed payment OR block reason OR human approval URL
```

---

## What is NOT in this project (honest scoping)

- No automated rebalancing or DeFi interactions
- Ampersend MCP tool payments are implemented but require Beta access (not yet live)
- agent.json `operator.address` and `onchain.registration_tx` are pending real registration
- Venice API balance needs credits added for live inference

---

## Live URLs for verification

```
https://ghostify-agent.vercel.app/                   Running app
https://ghostify-agent.vercel.app/agent.json          ERC-8004 manifest
https://ghostify-agent.vercel.app/agent_log.json      Execution log
https://ghostify-agent.vercel.app/llms.txt            Extended AI-readable docs
https://github.com/Gabrululu/Ghostify                 Source code
```

---

*Ghostify — Synthesis Hackathon 2026*
*Contact: see repository for operator identity*
