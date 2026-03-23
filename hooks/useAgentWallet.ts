'use client'

import { useAccount, useBalance, useEnsName } from 'wagmi'
import { base } from 'wagmi/chains'

export function useAgentWallet() {
  const { address, isConnected, chain } = useAccount()

  const { data: balance } = useBalance({
    address,
    token: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', // USDC en Base
  })

  const { data: ensName } = useEnsName({
    address,
    chainId: 1, // ENS siempre resuelve en mainnet
  })

  const isOnBase = chain?.id === base.id

  return {
    address,
    isConnected,
    isOnBase,
    ensName,
    displayName: ensName ?? (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : null),
    usdcBalance: balance ? parseFloat(balance.formatted).toFixed(2) : '0.00',
  }
}
