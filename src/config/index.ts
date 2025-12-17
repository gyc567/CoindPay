/**
 * 应用配置
 * 所有 NEXT_PUBLIC_* 环境变量在这里集中管理
 * 保证开发、测试、生产环境的一致性
 */

// 获取当前环境的基础 URL
const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.origin
  }
  // 服务端环境
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL
  }
  return 'http://localhost:3000'
}

export default {
  prefix: 'coindpay_',
  title: 'CoindPay - Web3 Payment Platform',
  mission: 'Send, Receive, Swap, and Invest in Consumer Crypto on any chain',
  logo: {
    light: '/logo-light.svg',
    dark: '/logo-dark.svg',
  },
  domains: {
    ethereum: 'https://ethereum.org',
    solana: 'https://solana.com',
    base: 'https://base.org',
    cdn: process.env.NEXT_PUBLIC_CDN_URL || getBaseUrl(),
    dev: 'http://localhost:3000',
  },
  // Web3 环境变量配置
  web3: {
    walletConnectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_ID || '3d12101dba08549e9b5eb1d59b5d1fbe',
    alchemyId: process.env.NEXT_PUBLIC_ALCHEMY_ID || '',
    quicknodeId: process.env.NEXT_PUBLIC_QUICKNODE_ID || 'QN_fad03d5999c146c1aa10eb66ab3852b8',
    thirdwebKey: process.env.NEXT_PUBLIC_THIRDWEB_KEY || '',
    rpc1Key: process.env.NEXT_PUBLIC_RPC1_KEY || '',
  },
  // API 配置
  api: {
    url: process.env.NEXT_PUBLIC_API_URL || getBaseUrl(),
  },
  // 环境标识
  env: {
    isDevelopment: process.env.NODE_ENV === 'development',
    isProduction: process.env.NODE_ENV === 'production',
    isVercel: !!process.env.VERCEL,
    gaId: process.env.NEXT_PUBLIC_GA_ID || '',
  },
}
