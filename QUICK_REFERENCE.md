# CoindPay 快速参考卡

## 🎯 项目核心一览

```
项目名：CoindPay（Web3 支付+钱包基础设施）
主框架：Next.js 13 + React 18 + TypeScript
状态：Redux Toolkit + Redux Persist
数据库：Prisma ORM + MongoDB + Redis
Web3：wagmi + viem + Solana Web3.js
部署：Vercel（推荐）/ Docker / 传统服务器
```

---

## ⚡ 快速命令

```bash
# 安装依赖
npm install  或  yarn install

# 启动开发
npm run dev

# 修复代码风格
npm run lint:fix

# 生成 Prisma
npm run generate-prisma

# 构建生产
npm run build

# 启动生产
npm start
```

---

## 🏗️ 项目结构（5 秒理解）

```
src/
├── pages/              → 网页（路由）
├── components/         → 组件库
├── lib/
│   ├── chains/        → 区块链配置（核心）
│   ├── db/            → 数据库
│   ├── web3/          → Web3 工具
│   └── store.ts       → Redux 状态
└── styles/            → 样式
```

---

## 🔑 关键概念解析

### 三大模块

| 模块 | 功能 | 文件位置 |
|------|------|----------|
| **Chains** | 支持 30+ 区块链配置 | `lib/chains/` |
| **Web3** | 钱包、交易、地址识别 | `lib/web3/index.ts` |
| **State** | 用户状态管理 | `store/slice/user.ts` |

### 支持的区块链

```
EVM 链（Ethereum 兼容）
├── Ethereum, Base, Arbitrum, Optimism
├── Polygon, BSC, Avalanche, zkSync
└── ...20+ 其他

SVM 链（Solana 兼容）
├── Solana
└── SOON
```

---

## 📦 核心依赖速查

| 包 | 用途 | 版本 |
|----|------|------|
| next | 框架 | 13.5.6 |
| react | UI 库 | 18.3.1 |
| wagmi | EVM 钱包 | 2.14.3 |
| @solana/web3.js | Solana 交互 | 1.98.0 |
| @reduxjs/toolkit | 状态管理 | 2.2.7 |
| @prisma/client | ORM | 6.3.1 |
| tailwindcss | 样式 | 3.4.11 |

---

## 🔐 环境变量（必需）

```env
# 最小配置（开发）
NEXT_PUBLIC_API_URL=http://localhost:3000

# 完整配置（生产）
API_JWT_SECRET=your-secret-key-here
MONGODB_URI=mongodb+srv://...
DATABASE_URL=mongodb+srv://...
UPSTASH_REDIS_REST_URL=https://...
UPSTASH_REDIS_REST_TOKEN=...
NEXT_PUBLIC_QUICKNODE_ID=...
```

---

## 🚀 部署快速指南

### 方式 1：Vercel（1 分钟）
```bash
npm install -g vercel
vercel login
vercel
# 完成！自动部署
```

### 方式 2：Docker
```bash
docker build -t coindpay .
docker run -p 3000:3000 coindpay
```

### 方式 3：PM2（传统服务器）
```bash
npm run build
pm2 start ecosystem.config.js
pm2 save
```

---

## 🐛 常见问题速解

| 问题 | 解决方案 |
|------|---------|
| 模块找不到 | `npm install` 重新安装 |
| 端口被占用 | `npm run dev -- -p 3001` |
| MongoDB 连接失败 | 检查 IP 白名单 |
| 样式不显示 | `npm run build` 重新构建 |
| 内存不足 | `NODE_OPTIONS="--max-old-space-size=4096"` |

---

## 📂 数据流向（核心理解）

```
用户操作
    ↓
Redux 更新状态
    ↓
组件重新渲染
    ↓
调用 Web3 库
    ↓
区块链交互
    ↓
保存数据库
    ↓
展示结果
```

---

## 🔒 安全核心

```
Authentication
├── JWT Token（30天过期）
├── HttpOnly Cookie（防 XSS）
└── SameSite=Strict（防 CSRF）

Environment Variables
├── 敏感数据存 .env.local
└── 不提交 Git

Web3 Wallet
├── 使用官方库（wagmi, solana）
└── 不保管私钥
```

---

## 📊 性能优化要点

```
✓ PWA 支持（离线访问）
✓ Next.js 自动代码分割
✓ 图片优化（Next Image）
✓ Redis 缓存
✓ CDN 加速
✓ SWC 编译（快速）
```

---

## 🎨 文件别名

```typescript
@/lib/chains      // src/lib/chains
@/components      // src/components
@/pages           // src/pages
@/store           // src/store

// 使用
import { payChains } from '@/lib/chains'
import { store } from '@/lib/store'
```

---

## 📖 核心文件导航

| 需求 | 找这里 |
|------|--------|
| 添加新链 | `src/lib/chains/pay.ts` |
| 修改状态 | `src/store/slice/user.ts` |
| 新增页面 | `src/pages/` |
| 新增组件 | `src/components/` |
| 数据库操作 | `src/lib/db/` |
| 工具函数 | `src/lib/utils/` |
| 全局样式 | `src/styles/` |

---

## 🔧 开发工作流

```bash
# 1. 创建新分支
git checkout -b feature/xxx

# 2. 开发并修复
npm run dev
npm run lint:fix

# 3. 提交代码
git add .
git commit -m "feat: description"  # Husky 自动检查

# 4. 推送
git push origin feature/xxx

# 5. 提交 Pull Request

# 6. 合并后自动部署到 Vercel
```

---

## 💡 Linus 的智慧（项目设计原则）

```
1. 消除边界情况 → 配置优先
2. 实用主义 → 解决真实问题
3. 简洁执念 → 代码短小精悍
4. 多链支持 → 策略模式架构
```

---

## 🎓 学习路径建议

```
初级（理解）
├─ 了解 Next.js 基础
├─ React Hooks 概念
└─ 阅读 src/pages/index.tsx

中级（使用）
├─ Redux 状态管理
├─ Tailwind 样式
└─ 修改 chains/pay.ts

高级（扩展）
├─ Web3 合约交互
├─ 数据库设计
└─ API 路由开发
```

---

**快速参考完！** 🎉

遇到问题？  
✅ 参考 DEPLOYMENT_GUIDE.md  
✅ 查看 ARCHITECTURE_ANALYSIS.md  
✅ 检查 package.json scripts  

---

版本：1.0 | 时间：2025-12-15
