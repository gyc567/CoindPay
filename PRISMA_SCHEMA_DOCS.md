# Prisma Schema 文档

## 概述

这是 CoindPay 的完整 Prisma 数据模型定义，设计用于支持 Web3 支付和钱包功能。

**数据库**：MongoDB  
**ORM**：Prisma  
**Schema 文件**：`prisma/schema.prisma`

---

## 核心模块

### 1. 用户管理模块

#### User（用户）
```typescript
// 核心用户数据
- id: 用户唯一ID
- walletAddress: 主要钱包地址（可唯一识别）
- email: 邮箱（可选）
- username: 用户名（可选）
- avatar: 头像 URL
- bio: 个人介绍
- verified: 是否验证
- createdAt/updatedAt: 时间戳

// 关系
- profile: 一对一 UserProfile
- wallets: 一对多 Wallet
- payments: 一对多 Payment
- transactions: 一对多 Transaction
- NFTs: 一对多 NFT
```

#### UserProfile（用户资料）
```typescript
// 扩展用户信息
- userId: 关联用户 ID
- twitter/discord/telegram: 社交媒体
- theme: UI 主题偏好
- language: 语言设置
- kycStatus: KYC 认证状态
- kycData: KYC 数据（JSON）
- preferredChain: 偏好链
```

**数据流**：
```
用户注册 → User 创建 → UserProfile 创建 → KYC 流程
```

---

### 2. 钱包管理模块

#### Wallet（钱包）
```typescript
// 用户的加密钱包
- userId: 关联用户
- address: 钱包地址
- chain: 区块链类型（ethereum, solana, base...）
- chainId: 链 ID
- balance: 主币余额
- isActive: 是否活跃
- isPrimary: 是否主钱包

// 关系
- tokens: 一对多 WalletToken
- transactions: 一对多 Transaction
```

**唯一性**：`(userId, address, chain)` 组合唯一

#### WalletToken（代币）
```typescript
// 钱包中的代币余额
- walletId: 关联钱包
- tokenAddress: 代币合约（null 表示原生币）
- symbol: 代币符号（ETH, SOL, USDC...）
- balance: 代币余额
- usdValue: USD 估值
- decimals: 小数位数
```

**唯一性**：`(walletId, tokenAddress, symbol)` 组合唯一

#### NFT（NFT）
```typescript
// 用户拥有的 NFT
- userId: 所有者
- contractAddress: NFT 合约
- tokenId: NFT 代币 ID
- chain: 所在链
- metadata: NFT 元数据（JSON）
- floorPrice: 地板价
```

**数据流**：
```
用户连接钱包 → Wallet 创建
  ↓
获取链上数据 → WalletToken 更新（余额）
  ↓
扫描 NFT → NFT 记录创建
```

---

### 3. 支付交易模块

#### Payment（支付）
```typescript
// 用户发起的支付
- userId: 支付者
- amount: 金额
- currency: 货币（USD, ETH, SOL, USDC...）
- chain: 支付链
- recipientAddress/recipientEmail: 收款信息
- status: 支付状态（pending, processing, completed, failed）
- txHash: 交易哈希
- gasFee: 燃气费
- description: 支付描述
```

**支付状态流**：
```
pending → processing → completed
              ↓
           failed (with errorMessage)
```

#### Transaction（交易）
```typescript
// 所有链上交易记录
- userId: 用户
- walletId: 使用的钱包
- fromAddress/toAddress: 交易双方
- amount: 金额
- txHash: 交易哈希（唯一）
- blockNumber: 区块号
- status: 状态（pending, confirmed, failed）
- confirmations: 确认数
- type: 交易类型（sent, received, contract_call, swap）
- gasFee: 燃气费
```

**交易类型**：
- `sent`: 转账发送
- `received`: 转账接收
- `contract_call`: 合约调用
- `swap`: DEX 交换
- 其他 DeFi 操作

#### DeFiPosition（DeFi 头寸）
```typescript
// 用户在 DeFi 中的头寸
- userId/walletId: 关联信息
- protocol: 协议（compound, lido, aave...）
- chain: 所在链
- tokenAddress/tokenSymbol: 代币信息
- amount: 头寸金额
- apy: 年化收益率
- rewards: 已获得奖励
```

**数据流**：
```
用户存款 → DeFiPosition 创建
  ↓
定期更新 APY、收益
  ↓
用户提取 → 位置关闭或更新
```

---

### 4. 支付配置模块

#### PaymentChain（支付链）
```typescript
// 支持的支付链
- name: 链名称（ethereum, solana, base...）
- displayName: 显示名称
- chainId: 链 ID
- chainType: 链类型（EVM, SVM, ICP）
- isActive: 是否活跃
- rpcUrl: RPC 端点
- explorerUrl: 区块浏览器
- nativeToken: 原生币符号
```

**预置链**（应在初始化时创建）：
- Ethereum (1)
- Solana (101)
- Base (8453)
- Arbitrum (42161)
- Polygon (137)
- 等等...

#### SupportedToken（代币）
```typescript
// 每条链支持的代币
- symbol: 符号（ETH, SOL, USDC...）
- name: 名称
- contractAddress: 合约地址（null 表示原生币）
- chain: 所在链
- decimals: 小数位数
- coingeckoId: CoinGecko 数据源 ID（用于价格数据）
```

#### TokenPrice（代币价格）
```typescript
// 代币价格历史
- symbol/chain/contractAddress: 代币标识
- price: USD 价格
- priceChange24h: 24h 涨跌幅
- marketCap: 市值
- volume24h: 24h 交易量
- timestamp: 价格时间戳
```

**用途**：
- 实时价格显示
- 资产估值计算
- 价格历史分析
- 数据索引：`(symbol, chain, timestamp)`

---

### 5. 审计系统模块

#### ActivityLog（活动日志）
```typescript
// 用户活动审计
- userId: 用户（可选，系统事件为 null）
- action: 操作（login, send_payment, connect_wallet...）
- entity: 实体类型（user, payment, wallet...）
- entityId: 相关实体 ID
- description: 描述
- details: 详情（JSON）
- ipAddress: IP 地址
- userAgent: 用户代理
- status: 结果（success, failed）
- errorMessage: 错误信息
```

**应用场景**：
- 登录审计
- 支付追踪
- 钱包操作记录
- 安全事件日志

---

### 6. 系统管理模块

#### SystemConfig（系统配置）
```typescript
// 应用配置存储
- key: 配置键（唯一）
- value: 配置值
- type: 值类型（string, number, boolean, json）
- description: 描述

// 示例配置
{
  "key": "MIN_PAYMENT_AMOUNT",
  "value": "0.01",
  "type": "number"
}

{
  "key": "SUPPORTED_CHAINS",
  "value": "[\"ethereum\", \"solana\", \"base\"]",
  "type": "json"
}
```

---

## 索引策略

### 自动索引（@unique）
以下字段自动创建唯一索引：
- `User.walletAddress`
- `User.email`
- `User.username`
- `UserProfile.userId`
- `Wallet.(userId, address, chain)` 组合
- `WalletToken.(walletId, tokenAddress, symbol)` 组合
- `NFT.(userId, contractAddress, tokenId, chain)` 组合
- `Payment.txHash`
- `Transaction.txHash`
- `SupportedToken.(chain, contractAddress, symbol)` 组合
- `PaymentChain.name`
- `SystemConfig.key`

### 查询索引（@@index）
常用查询字段：
```
User:
  - createdAt (时间序列查询)

Wallet:
  - userId (用户的所有钱包)
  - chain (链上的所有钱包)

Payment:
  - userId (用户支付历史)
  - status (按状态过滤)
  - chain (链上支付)

Transaction:
  - userId/walletId (用户交易)
  - status (待确认交易)
  - type (交易类型过滤)

ActivityLog:
  - userId (用户活动)
  - action (操作类型)
  - createdAt (时间范围查询)
```

---

## 关键设计决策

### 1. MongoDB ObjectId
```typescript
id String @id @default(auto()) @map("_id") @db.ObjectId
```
- 使用 MongoDB 的 ObjectId 作为主键
- `@map("_id")` 映射到 MongoDB 的标准 _id 字段
- 性能优化和 MongoDB 原生支持

### 2. 级联删除
```typescript
user  User  @relation(fields: [userId], references: [id], onDelete: Cascade)
```
- 删除用户时自动删除相关数据
- 保持数据一致性
- 避免孤立记录

### 3. 可选关系
```typescript
profile UserProfile?  // 用户可能没有资料
```
- 某些关系是可选的
- 灵活的数据结构

### 4. JSON 字段
```typescript
metadata    Json?   // 灵活存储元数据
details     Json?   // 无模式数据
```
- 用于存储非结构化数据
- MongoDB 原生 JSON 支持

### 5. 时间戳
```typescript
createdAt DateTime @default(now())
updatedAt DateTime @updatedAt
```
- 所有记录都有时间戳
- 自动跟踪创建和更新时间

---

## 使用示例

### 创建用户
```typescript
const user = await prisma.user.create({
  data: {
    walletAddress: '0x...',
    email: 'user@example.com',
    username: 'john_doe',
    profile: {
      create: {
        theme: 'dark',
        language: 'en'
      }
    }
  }
})
```

### 查询用户的钱包和代币
```typescript
const wallet = await prisma.wallet.findUnique({
  where: {
    userId_address_chain: {
      userId: 'user-id',
      address: '0x...',
      chain: 'ethereum'
    }
  },
  include: {
    tokens: true,
    transactions: {
      where: { status: 'confirmed' }
    }
  }
})
```

### 记录支付
```typescript
const payment = await prisma.payment.create({
  data: {
    userId: 'user-id',
    amount: '100',
    currency: 'USDC',
    chain: 'ethereum',
    recipientAddress: '0x...',
    status: 'pending'
  }
})

// 更新支付状态
await prisma.payment.update({
  where: { id: payment.id },
  data: {
    status: 'completed',
    txHash: '0x...',
    completedAt: new Date()
  }
})
```

### 查询用户活动
```typescript
const activities = await prisma.activityLog.findMany({
  where: {
    userId: 'user-id',
    action: 'send_payment',
    createdAt: {
      gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)  // 最近 7 天
    }
  },
  orderBy: { createdAt: 'desc' }
})
```

---

## 初始化步骤

### 1. 生成 Prisma 客户端
```bash
npm run generate-prisma
```

### 2. 推送 schema 到数据库
```bash
npx prisma db push
```

### 3. 初始化配置数据
```bash
npx prisma db seed  # 如果配置了 seed.ts
```

### 4. 查看数据库
```bash
npx prisma studio
```

---

## 常见查询

### 获取用户完整信息
```typescript
const user = await prisma.user.findUnique({
  where: { id: 'user-id' },
  include: {
    profile: true,
    wallets: { include: { tokens: true } },
    payments: { orderBy: { createdAt: 'desc' }, take: 10 }
  }
})
```

### 计算用户总资产
```typescript
const wallets = await prisma.wallet.findMany({
  where: { userId: 'user-id' },
  include: { tokens: true }
})

const totalUsd = wallets
  .flatMap(w => w.tokens)
  .reduce((sum, t) => sum + Number(t.usdValue || 0), 0)
```

### 获取待确认交易
```typescript
const pending = await prisma.transaction.findMany({
  where: {
    userId: 'user-id',
    status: 'pending',
    createdAt: {
      gte: new Date(Date.now() - 24 * 60 * 60 * 1000)  // 最近 24 小时
    }
  }
})
```

---

## 数据库迁移

### 修改 schema
```bash
# 1. 修改 prisma/schema.prisma
# 2. 生成迁移文件
npx prisma migrate dev --name description_of_changes

# 3. 或直接推送（开发环境）
npx prisma db push
```

### 生产环境
```bash
# 部署迁移
npx prisma migrate deploy
```

---

## 性能优化

1. **查询优化**
   - 使用 `include` 而非多个单独查询
   - 使用 `select` 只获取需要的字段
   - 合理使用 `orderBy` 和 `take` 分页

2. **索引**
   - 频繁查询的字段都有索引
   - 组合查询字段使用复合索引

3. **批量操作**
   ```typescript
   await prisma.walletToken.createMany({
     data: tokensArray
   })
   ```

---

时间：2025-12-15  
版本：1.0  
作者：Claude Code
