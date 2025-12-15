# Prisma 初始化指南

## 当前状态

⚠️ **项目中没有 `prisma/schema.prisma` 文件**

这是正常的，因为：
- Prisma schema 根据项目需求自定义
- 不同团队可能有不同的数据模型
- 构建命令已配置为可选（schema 不存在时跳过）

---

## 何时需要初始化 Prisma？

如果你需要在项目中使用 Prisma ORM，按照以下步骤初始化：

### 第 1 步：初始化 Prisma
```bash
npx prisma init
```

这将创建：
- `prisma/schema.prisma` - Prisma 数据模型定义
- `.env` 文件（但项目已使用 `.env.local`，可删除）

### 第 2 步：配置数据库连接

编辑 `prisma/schema.prisma`：
```prisma
// This is your Prisma schema file,
// learn more about it in the docs: https://pris.ly/d/prisma-schema

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

// 定义你的数据模型
model User {
  id    String     @id @default(auto()) @map("_id") @db.ObjectId
  email String     @unique
  name  String?
  posts Post[]
}

model Post {
  id    String     @id @default(auto()) @map("_id") @db.ObjectId
  title String
  authorId String @db.ObjectId
  author   User   @relation(fields: [authorId], references: [id])
}
```

### 第 3 步：生成 Prisma 客户端
```bash
npm run generate-prisma
```

### 第 4 步：创建迁移（可选）
```bash
# 将 schema 同步到数据库
npx prisma db push

# 或创建迁移文件
npx prisma migrate dev --name init
```

### 第 5 步：使用 Prisma
```typescript
// src/lib/db/prisma/index.ts 已配置

import prisma from '@/lib/db/prisma'

// 查询
const users = await prisma.user.findMany()

// 创建
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John'
  }
})
```

---

## 当前构建配置

项目已配置为 **Prisma 可选**：

```json
// package.json
"generate-prisma": "test -f prisma/schema.prisma && prisma generate --no-engine || echo 'Skipping...'"
```

含义：
- ✅ 如果存在 `prisma/schema.prisma` → 生成客户端
- ✅ 如果不存在 → 跳过，继续构建

这允许项目：
1. 在没有 Prisma 的情况下构建
2. 团队成员可选择是否使用 Prisma
3. 不同环境可有不同配置

---

## 推荐的数据模型（为 CoindPay）

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}

// 用户模型
model User {
  id            String     @id @default(auto()) @map("_id") @db.ObjectId
  walletAddress String     @unique
  email         String?    @unique
  username      String?    @unique
  avatar        String?
  bio           String?
  createdAt     DateTime   @default(now())
  updatedAt     DateTime   @updatedAt
  
  payments      Payment[]
  transactions  Transaction[]
  wallet        Wallet?
}

// 钱包模型
model Wallet {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @unique @db.ObjectId
  user      User     @relation(fields: [userId], references: [id])
  
  address   String   @unique
  chain     String   // "ethereum", "solana", "base", etc.
  balance   String   @default("0")
  tokens    WalletToken[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// 钱包代币
model WalletToken {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  walletId  String   @db.ObjectId
  wallet    Wallet   @relation(fields: [walletId], references: [id])
  
  tokenAddress String
  symbol    String
  balance   String
  
  createdAt DateTime @default(now())
}

// 支付记录
model Payment {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  user      User     @relation(fields: [userId], references: [id])
  
  amount    String
  currency  String   // "USD", "ETH", "SOL", etc.
  chain     String
  
  status    String   @default("pending")  // pending, completed, failed
  txHash    String?  @unique
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

// 交易记录
model Transaction {
  id        String   @id @default(auto()) @map("_id") @db.ObjectId
  userId    String   @db.ObjectId
  user      User     @relation(fields: [userId], references: [id])
  
  fromAddress String
  toAddress   String
  amount      String
  chain       String
  tokenAddress String?
  
  txHash    String   @unique
  blockNumber Int?
  
  status    String   @default("pending")  // pending, confirmed, failed
  
  createdAt DateTime @default(now())
  confirmedAt DateTime?
}
```

---

## 快速命令

```bash
# 初始化 Prisma
npx prisma init

# 生成客户端
npm run generate-prisma

# 打开 Prisma Studio（数据库 UI）
npx prisma studio

# 创建迁移
npx prisma migrate dev --name migration_name

# 部署迁移
npx prisma migrate deploy

# 查看迁移历史
npx prisma migrate status

# 拉取现有数据库 schema
npx prisma db pull

# 将 schema 推送到数据库
npx prisma db push

# 查看 schema 差异
npx prisma migrate diff --from-schema-datasource --to-schema-file ./prisma/schema.prisma
```

---

## 故障排查

### Q: 如何修复 `schema not found` 错误？

**解决**：
```bash
# 初始化 Prisma
npx prisma init

# 编辑 prisma/schema.prisma

# 生成客户端
npm run generate-prisma
```

### Q: MongoDB 连接不工作？

**检查步骤**：
1. 验证 `DATABASE_URL` 在 `.env.local` 中正确
2. 在 `schema.prisma` 中使用 MongoDB provider
3. 运行 `npm run db:test` 测试连接
4. 运行 `npx prisma db push` 同步 schema

### Q: 如何重置 Prisma？

**完全清除**：
```bash
# 删除 Prisma 文件
rm -rf prisma/

# 重新初始化
npx prisma init
```

---

## 相关文档

- Prisma 官方文档：https://www.prisma.io/docs
- MongoDB 指南：https://www.prisma.io/docs/orm/overview/databases/mongodb
- Schema 参考：https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference

---

**注意**：Prisma 配置是可选的。如果项目当前不需要 ORM，可以继续使用 MongoDB 驱动或其他方案。

时间：2025-12-15
