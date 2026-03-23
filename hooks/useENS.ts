'use client'

import { useEnsName, useEnsAddress, useEnsAvatar } from 'wagmi'
import { mainnet } from 'wagmi/chains'
import { isAddress } from 'viem'

// Resolución de address → nombre ENS
export function useENSName(address?: `0x${string}`) {
  const { data: ensName, isLoading } = useEnsName({
    address,
    chainId: mainnet.id,
    query: { enabled: !!address },
  })

  const { data: avatar } = useEnsAvatar({
    name: ensName ?? undefined,
    chainId: mainnet.id,
    query: { enabled: !!ensName },
  })

  const displayName = ensName
    ?? (address ? `${address.slice(0, 6)}...${address.slice(-4)}` : '')

  return { ensName, displayName, avatar, isLoading }
}

// Resolución de nombre ENS → address
export function useENSAddress(name?: string) {
  const isENSName = name?.endsWith('.eth') ?? false

  const { data: address, isLoading } = useEnsAddress({
    name: isENSName ? name : undefined,
    chainId: mainnet.id,
    query: { enabled: isENSName },
  })

  return {
    address: isENSName ? address : (isAddress(name ?? '') ? name as `0x${string}` : null),
    isLoading,
    isENSName,
  }
}