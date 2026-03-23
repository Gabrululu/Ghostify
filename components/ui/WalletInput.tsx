'use client'

import { useState, useEffect } from 'react'
import { useENSAddress } from '@/hooks/useENS'
import { isAddress } from 'viem'

interface WalletInputProps {
  value: string
  onChange: (address: string, displayValue: string) => void
  placeholder?: string
}

export function WalletInput({
  value,
  onChange,
  placeholder = '0x... or name.eth',
}: WalletInputProps) {
  const [input, setInput] = useState(value)
  const { address, isLoading, isENSName } = useENSAddress(
    input.length > 3 ? input : undefined
  )

  useEffect(() => {
    if (address) {
      onChange(address, input)
    } else if (isAddress(input)) {
      onChange(input, input)
    }
  }, [address, input])

  const isValid = isAddress(address ?? '') || isAddress(input)
  const isInvalid = input.length > 3 && !isLoading && !isValid

  return (
    <div className="wallet-input-wrapper">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder={placeholder}
        className={`wallet-input ${isValid ? 'valid' : ''} ${isInvalid ? 'invalid' : ''}`}
      />
      {isLoading && (
        <span className="input-hint muted">Resolving ENS...</span>
      )}
      {isValid && address && isENSName && (
        <span className="input-hint accent-green">
          ✓ {address.slice(0, 6)}...{address.slice(-4)}
        </span>
      )}
      {isInvalid && (
        <span className="input-hint accent-pink">
          Invalid address or ENS name
        </span>
      )}
    </div>
  )
}