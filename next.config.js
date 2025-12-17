/**
 * @type {import('next').NextConfig}
 */
const path = require('path')

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  // 添加缓存清理和重新验证策略
  register: true,
  skipWaiting: true,
  clientsClaim: true,
  navigateFallback: '/',
  navigateFallbackAllowlist: [/^\/(?!\/)/, /\/manifest\.webmanifest$/],
  // 禁用 PWA 在不同域名间的缓存冲突
  publicExcludes: ['!sw.js', '!workbox-*.js'],
})

const nextConfig = withPWA({
  // 严格模式，以防止在useEffect中的方法被执行两次，https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
  reactStrictMode: false,
  swcMinify: true,
  trailingSlash: true,
  //https://nextjs.org/docs/api-reference/next/image#blurdataurl
  images: {
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    config.externals.push('pino-pretty', 'lokijs', 'encoding')
    config.resolve.fallback = { fs: false, net: false, tls: false }

    config.module.rules.push({
      test: /\.svg$/i,
      oneOf: [
        {
          issuer: /\.[jt]sx?$/,
          use: ['@svgr/webpack'],
        },
        {
          type: 'asset/resource',
          generator: {
            filename: 'static/media/[name].[hash][ext]',
          },
        },
      ],
    })
    return config
  },
  i18n: {
    locales: ['en'],
    defaultLocale: 'en',
  },
  experimental: {
    esmExternals: true,
  },
  transpilePackages: [
    'ahooks',
    '@connect2ic/react',
    '@connect2ic/core',
    '@dfinity/principal',
    '@vanilla-extract/css',
    '@vanilla-extract/sprinkles',
    '@rainbow-me/rainbowkit',
  ],
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  compiler: {
    styledComponents: true,
    // removeConsole: {
    //   exclude: ['error'],
    // },
  },
  eslint: { ignoreDuringBuilds: true },
  typescript: { tsconfigPath: './tsconfig.json', ignoreBuildErrors: true },
  productionBrowserSourceMaps: false,
  onDemandEntries: {
    maxInactiveAge: 60 * 60 * 1000,
    pagesBufferLength: 5,
  },
  async headers() {
    return [
      // API CORS 头
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,OPTIONS,PATCH,DELETE,POST,PUT' },
          { key: 'Access-Control-Allow-Headers', value: '*' },
        ],
      },
      // 静态资源缓存策略 - 长期缓存
      {
        source: '/static/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
      // 页面缓存策略 - 24小时缓存
      {
        source: '/:path*',
        headers: [
          { key: 'Cache-Control', value: 'public, max-age=86400, s-maxage=86400' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
        ],
      },
    ]
  },
})

module.exports = nextConfig
