// Type definitions for chain configuration
export interface ChainConfig {
  name: string
  chainId: number
  rpcUrl?: string
  explorerUrl?: string
  type?: 'EVM' | 'SVM' | 'SOON' | 'ICP'
  [key: string]: any
}

export interface ChainExplorer {
  name: string
  url: string
  standard?: string
}

export interface NativeChain {
  id: number
  name: string
  nativeCurrency: {
    decimals: number
    name: string
    symbol: string
  }
  rpcUrls: {
    default: { http: string[] }
    public?: { http: string[] }
  }
  blockExplorers?: {
    default: ChainExplorer
    [key: string]: ChainExplorer
  }
}

// Supported chains configuration
export const _supportChains: ChainConfig[] = [
  { name: 'ethereum', chainId: 1 },
  { name: 'solana', chainId: 0 },
  { name: 'base', chainId: 8453 },
]

export const chainIdToNetWork: Record<number, string> = {
  1: 'ethereum',
  0: 'solana',
  8453: 'base',
}

export const nftAvailableChains: string[] = ['ethereum', 'base']

export const payChains: ChainConfig[] = _supportChains

export default {
  _supportChains,
  chainIdToNetWork,
  nftAvailableChains,
  payChains,
}

