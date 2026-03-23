import {
  createCaveat,
  getDeleGatorEnvironment,
  ROOT_AUTHORITY,
  type CreateDelegationOptions,
} from '@metamask/delegation-toolkit'

// Real contract addresses for Base Mainnet (chain ID 8453)
const env = getDeleGatorEnvironment(8453)

export const DELEGATION_MANAGER_ADDRESS = env.DelegationManager as `0x${string}`

export const ENFORCER_ADDRESSES = {
  allowedTargets: env.caveatEnforcers.AllowedTargetsEnforcer as `0x${string}`,
  nativeTokenTransfer: env.caveatEnforcers.NativeTokenTransferAmountEnforcer as `0x${string}`,
  timestamp: env.caveatEnforcers.TimestampEnforcer as `0x${string}`,
} as const

export { ROOT_AUTHORITY, createCaveat }
export type { CreateDelegationOptions }

// ─── Types ───────────────────────────────────────────────────────────────────

export interface GhostifyDelegation {
  delegate: `0x${string}`    // agent wallet
  delegator: `0x${string}`   // human operator (you)
  caveats: Caveat[]
  signature: `0x${string}`
  salt: bigint
}

export interface Caveat {
  enforcer: `0x${string}`
  terms: `0x${string}`
  args: `0x${string}`
}

// ─── Caveat builders ─────────────────────────────────────────────────────────

/**
 * Build spending caveats using real enforcer addresses from Base Mainnet.
 */
export function buildSpendingCaveats(policies: {
  dailyLimitWei: bigint
  approvedAddresses: `0x${string}`[]
  expiryTimestamp: number
}): Caveat[] {
  const caveats: Caveat[] = []

  // Caveat 1: native token transfer limit
  if (policies.dailyLimitWei > 0n) {
    caveats.push(
      createCaveat(
        ENFORCER_ADDRESSES.nativeTokenTransfer,
        `0x${policies.dailyLimitWei.toString(16).padStart(64, '0')}` as `0x${string}`,
      ) as Caveat
    )
  }

  // Caveat 2: expiry timestamp
  if (policies.expiryTimestamp > 0) {
    // TimestampEnforcer expects: afterThreshold (uint128) + beforeThreshold (uint128)
    const before = policies.expiryTimestamp.toString(16).padStart(32, '0')
    const after = '0'.padStart(32, '0')
    caveats.push(
      createCaveat(
        ENFORCER_ADDRESSES.timestamp,
        `0x${after}${before}` as `0x${string}`,
      ) as Caveat
    )
  }

  // Caveat 3: allowed target addresses
  if (policies.approvedAddresses.length > 0) {
    const encoded = policies.approvedAddresses
      .map(addr => addr.slice(2).padStart(64, '0'))
      .join('')
    caveats.push(
      createCaveat(
        ENFORCER_ADDRESSES.allowedTargets,
        `0x${encoded}` as `0x${string}`,
      ) as Caveat
    )
  }

  return caveats
}
