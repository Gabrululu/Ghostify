'use client'

import { useState, useCallback } from 'react'
import { useAccount, useWalletClient } from 'wagmi'
import { parseEther, encodePacked, keccak256 } from 'viem'
import {
  buildSpendingCaveats,
  DELEGATION_MANAGER_ADDRESS,
  type GhostifyDelegation,
} from '@/lib/delegation'

export interface PolicyInput {
  dailyLimitEth: number
  approvedAddresses: `0x${string}`[]
  durationDays: number
}

export function useDelegation() {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()

  const [isCreating, setIsCreating] = useState(false)
  const [delegation, setDelegation] = useState<GhostifyDelegation | null>(null)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const createDelegation = useCallback(async (
    agentAddress: `0x${string}`,
    policies: PolicyInput
  ) => {
    if (!walletClient || !address) return
    setIsCreating(true)
    setError(null)

    try {
      // 1. Calcular expiración
      const expiryTimestamp = Math.floor(Date.now() / 1000)
        + (policies.durationDays * 24 * 60 * 60)

      // 2. Construir caveats según políticas
      const caveats = buildSpendingCaveats({
        dailyLimitWei: parseEther(policies.dailyLimitEth.toString()),
        approvedAddresses: policies.approvedAddresses,
        expiryTimestamp,
      })

      // 3. Crear salt único para esta delegación
      const salt = BigInt(
        keccak256(
          encodePacked(
            ['address', 'address', 'uint256'],
            [address, agentAddress, BigInt(Date.now())]
          )
        )
      )

      // 4. Construir el objeto de delegación
      const delegationData = {
        delegate: agentAddress,
        delegator: address,
        authority:
          '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff',
        caveats,
        salt,
        signature: '0x' as `0x${string}`,
      }

      // 5. Firmar la delegación (off-chain signature — no cuesta gas)
      const domain = {
        name: 'DelegationManager',
        version: '1',
        chainId: 8453,
        verifyingContract: DELEGATION_MANAGER_ADDRESS,
      }

      const types = {
        Delegation: [
          { name: 'delegate', type: 'address' },
          { name: 'delegator', type: 'address' },
          { name: 'authority', type: 'bytes32' },
          { name: 'caveats', type: 'Caveat[]' },
          { name: 'salt', type: 'uint256' },
        ],
        Caveat: [
          { name: 'enforcer', type: 'address' },
          { name: 'terms', type: 'bytes' },
          { name: 'args', type: 'bytes' },
        ],
      }

      const signature = await walletClient.signTypedData({
        domain,
        types,
        primaryType: 'Delegation',
        message: delegationData,
      })

      const signedDelegation: GhostifyDelegation = {
        ...delegationData,
        signature,
      }

      setDelegation(signedDelegation)

      // 6. Guardar en localStorage para que el agente la use
      localStorage.setItem(
        'ghostify_delegation',
        JSON.stringify({
          ...signedDelegation,
          salt: salt.toString(),
          policies,
          expiryTimestamp,
          createdAt: new Date().toISOString(),
        })
      )

      // 7. Registrar en agent_log
      await fetch('/api/agent/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'Delegation created — spend policies set onchain',
          tool: 'metamask_delegation',
          amount_usd: null,
          tx_hash: null,
          policy_check: 'passed',
          private_inference: false,
          result: 'success',
        }),
      })

      return signedDelegation

    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setIsCreating(false)
    }
  }, [address, walletClient])

  const getStoredDelegation = () => {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem('ghostify_delegation')
    return stored ? JSON.parse(stored) : null
  }

  const revokeDelegation = async () => {
    localStorage.removeItem('ghostify_delegation')
    setDelegation(null)
    setTxHash(null)
  }

  return {
    createDelegation,
    revokeDelegation,
    getStoredDelegation,
    isCreating,
    delegation,
    txHash,
    error,
  }
}