import { useRouter } from 'next/router'
import Head from 'next/head'
import Script from 'next/script'
import type { AppProps } from 'next/app'
import { useEffect } from 'react'
import ChainsMobile from '@/components/card-group/chains-card/chains-mobile'
import { GlobalContextProvider } from '@/components/context'
import { Analytics } from '@vercel/analytics/react'
import NmMetaHead from '@/components/nm-meta-head'

import config from '@/config'

import 'animate.css'
import 'swiper/css'
import 'swiper/css/scrollbar'
import '@rainbow-me/rainbowkit/styles.css'
import '@/styles/index.scss'

const { title, mission } = config

/**
 * 环境变量校验函数
 * 在开发环境中验证关键的环境变量是否配置正确
 */
const validateEnvironmentVariables = () => {
  if (config.env.isDevelopment) {
    const warnings: string[] = []

    // 检查 Web3 配置
    if (!config.web3.walletConnectId || config.web3.walletConnectId === '3d12101dba08549e9b5eb1d59b5d1fbe') {
      warnings.push('⚠️ NEXT_PUBLIC_WALLET_CONNECT_ID 未配置或使用默认值')
    }

    if (!config.web3.quicknodeId || config.web3.quicknodeId === 'QN_fad03d5999c146c1aa10eb66ab3852b8') {
      warnings.push('⚠️ NEXT_PUBLIC_QUICKNODE_ID 未配置或使用默认值')
    }

    // 检查 API 配置
    if (!config.api.url) {
      warnings.push('⚠️ NEXT_PUBLIC_API_URL 未配置')
    }

    // 检查 CDN 配置
    if (!config.domains.cdn) {
      warnings.push('⚠️ NEXT_PUBLIC_CDN_URL 未配置')
    }

    // 输出警告
    if (warnings.length > 0) {
      console.warn('🔍 CoindPay 环境变量配置检查：')
      warnings.forEach(warn => console.warn(warn))
    }
  }
}

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()

  // 应用启动时验证环境变量
  useEffect(() => {
    validateEnvironmentVariables()
  }, [])

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <meta name="robots" content="index,follow" />
        <meta property="description" content={mission} />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="en_US" />
        <meta property="og:site_name" content={title} />
        <meta property="og:image:type" content="image/jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:alt" content={mission} />
      </Head>
      <NmMetaHead userInfo={pageProps} />
      <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#72db5a" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Courgette&family=Poppins&family=Righteous&family=Satisfy&family=Chillax&family=Arimo&family=Lato&family=Fira+Sans&display=swap"
      />

      <Script
        id="iframely-init"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            function loadIframelyEmbedJs() {
              // Replace 'iframe.ly' with your custom CDN if available.
              if (document.querySelectorAll("[data-iframely-url]").length === 0
                  && document.querySelectorAll("iframe[src*='iframe.ly']").length === 0) return;
              var iframely = window.iframely = window.iframely || {};
              if (iframely.load) {
                  iframely.load();
              } else {
                  var ifs = document.createElement('script'); ifs.type = 'text/javascript'; ifs.async = true;
                  ifs.src = ('https:' == document.location.protocol ? 'https:' : 'http:') + '//cdn.iframe.ly/embed.js';
                  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ifs, s);
              }
            }
            // Run after DOM ready.
            loadIframelyEmbedJs();
          `,
        }}
      />
      <GlobalContextProvider>
        <Component {...pageProps} />
        <Analytics />
        <ChainsMobile />
      </GlobalContextProvider>
    </>
  )
}
