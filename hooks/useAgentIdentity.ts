'use client'

import { useState } from 'react'
import { useAccount, useWalletClient, usePublicClient, useEnsName } from 'wagmi'
import { keccak256, toHex } from 'viem'

export function useAgentIdentity() {
  const { address } = useAccount()
  const { data: walletClient } = useWalletClient()
  const publicClient = usePublicClient()
  const { data: ensName } = useEnsName({ address, chainId: 1 })
  const [isRegistering, setIsRegistering] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const registerAgent = async () => {
    if (!walletClient || !address) return

    setIsRegistering(true)
    setError(null)

    try {
      // 1. Construir el manifiesto con datos reales
      const manifest = {
        schema: 'ERC-8004',
        version: '1.0.0',
        name: 'Ghostify Agent',
        operator: {
          address: address,
          ens: ensName ?? '',
        },
        capabilities: [
          'onchain_payments',
          'private_inference',
          'spend_policy_enforcement',
          'zk_identity_verification',
        ],
        tools: ['venice_ai', 'ampersend_sdk', 'locus_usdc', 'self_protocol_zk'],
        safety: {
          spend_limit_enforced: true,
          human_in_the_loop: true,
          max_single_tx_usd: 100,
        },
        links: {
          repository: 'https://github.com/TU_USUARIO/ghostify',
          manifest: 'https://ghostify-agent.vercel.app/agent.json',
          log: 'https://ghostify-agent.vercel.app/agent_log.json',
        },
        created_at: new Date().toISOString(),
      }

      // 2. Hashear el manifiesto
      const manifestString = JSON.stringify(manifest)
      const manifestHash = keccak256(toHex(manifestString))

      // 3. Firmar el hash — prueba de que el operador es el dueño de la wallet
      const signature = await walletClient.signMessage({
        message: `Ghostify Agent Registration\nManifest Hash: ${manifestHash}\nOperator: ${address}`,
      })

      // 4. Self-tx con el hash en calldata — artefacto onchain sin necesitar contrato propio
      const hash = await walletClient.sendTransaction({
        to: address,
        value: 0n,
        data: toHex(`ERC-8004:${manifestHash}:${signature.slice(0, 20)}`),
      })

      // 5. Esperar confirmación
      await publicClient?.waitForTransactionReceipt({ hash })

      setTxHash(hash)

      // 6. Persistir en localStorage para el dashboard
      const fullManifest = { ...manifest, txHash: hash, signature }
      localStorage.setItem('ghostify_agent', JSON.stringify(fullManifest))

      return { txHash: hash, manifest: fullManifest }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Registration failed'
      setError(message)
    } finally {
      setIsRegistering(false)
    }
  }

  const getStoredAgent = (): Record<string, unknown> | null => {
    if (typeof window === 'undefined') return null
    const stored = localStorage.getItem('ghostify_agent')
    return stored ? JSON.parse(stored) : null
  }

  return {
    registerAgent,
    isRegistering,
    txHash,
    error,
    getStoredAgent,
  }
}
