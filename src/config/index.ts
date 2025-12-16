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
    cdn: process.env.NEXT_PUBLIC_CDN_URL || '',
  },
}
