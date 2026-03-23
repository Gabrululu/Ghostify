import { createConfig, http } from 'wagmi'
import { base, baseSepolia, mainnet } from 'wagmi/chains'
import { metaMask, injected } from 'wagmi/connectors'

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID

export const config = createConfig({
  chains: [mainnet, base, baseSepolia],
  connectors: [metaMask(), injected()],
  transports: {
    // ENS always resolves on mainnet
    [mainnet.id]: http(
      alchemyId
        ? `https://eth-mainnet.g.alchemy.com/v2/${alchemyId}`
        : undefined
    ),
    [base.id]: http(
      alchemyId
        ? `https://base-mainnet.g.alchemy.com/v2/${alchemyId}`
        : undefined
    ),
    [baseSepolia.id]: http(
      alchemyId
        ? `https://base-sepolia.g.alchemy.com/v2/${alchemyId}`
        : undefined
    ),
  },
})
