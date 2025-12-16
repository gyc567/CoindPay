// Supported chains configuration
export const _supportChains = [
  { name: 'ethereum', chainId: 1 },
  { name: 'solana', chainId: 0 },
  { name: 'base', chainId: 8453 },
]

export const chainIdToNetWork: Record<number, string> = {
  1: 'ethereum',
  0: 'solana',
  8453: 'base',
}

export const nftAvailableChains = ['ethereum', 'base']

export const payChains = _supportChains

export default {
  _supportChains,
  chainIdToNetWork,
  nftAvailableChains,
  payChains,
}

