'use client'

import { useENSName } from '@/hooks/useENS'

interface ENSAddressProps {
  address: `0x${string}`
  showAvatar?: boolean
  showFull?: boolean
  className?: string
}

export function ENSAddress({
  address,
  showAvatar = false,
  showFull = false,
  className = '',
}: ENSAddressProps) {
  const { ensName, displayName, avatar, isLoading } = useENSName(address)

  if (isLoading) {
    return (
      <span className={`ens-loading ${className}`}>
        {address.slice(0, 6)}...
      </span>
    )
  }

  return (
    <span className={`ens-address ${className}`}>
      {showAvatar && avatar && (
        <img
          src={avatar}
          alt={displayName}
          className="ens-avatar"
          width={20}
          height={20}
        />
      )}
      {showFull && ensName ? ensName : displayName}
    </span>
  )
}