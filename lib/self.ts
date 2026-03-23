// SelfAppBuilder lives in @selfxyz/qrcode, not @selfxyz/core
import { SelfAppBuilder } from '@selfxyz/qrcode'

export const SELF_SCOPE = process.env.NEXT_PUBLIC_SELF_SCOPE ?? 'ghostify'
export const SELF_ENDPOINT = `${process.env.NEXT_PUBLIC_APP_URL}/api/verify/self`

/**
 * Build a Self app configured for a specific wallet address.
 * userId binds the ZK proof to the operator's wallet.
 */
export function buildSelfApp(userAddress: string) {
  return new SelfAppBuilder({
    version: 2,
    appName: 'Ghostify',
    scope: SELF_SCOPE,
    endpoint: SELF_ENDPOINT,
    userId: userAddress,
    userIdType: 'hex',          // Ethereum address format
    endpointType: 'staging_https', // use 'https' in production
    disclosures: {
      minimumAge: 18,
      nationality: false,
      name: false,
      date_of_birth: false,
      ofac: false,
    },
  }).build()
}
