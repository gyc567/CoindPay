# MongoDB 配置指南

## 📝 配置完成状态

✅ **已完成的配置**：
- [x] `.env.local` - 开发环境配置（包含你的 MongoDB 连接）
- [x] `.env.example` - 模板文件（不含敏感信息）
- [x] `.env.production` - 生产环境配置
- [x] `test-mongodb.js` - 连接测试脚本
- [x] `package.json` - 添加了测试命令

---

## 🔐 你的 MongoDB 配置

### 连接字符串
```
mongodb+srv://gyc567_db_user:MMxhQtBoYVlY6974@cluster0.ayeox9c.mongodb.net/?appName=Cluster0
```

### 配置位置
这个连接字符串已添加到以下文件：
```
.env.local
├── MONGODB_URI = 你的连接字符串
└── DATABASE_URL = 你的连接字符串

.env.production
├── MONGODB_URI = 你的连接字符串
└── DATABASE_URL = 你的连接字符串
```

---

## ✅ 验证连接

### 方式 1：使用 Node.js 脚本（推荐，无需额外工具）
```bash
# 安装 MongoDB 驱动（如果还没安装）
npm install mongodb

# 运行测试
npm run db:test

# 输出示例：
# 🔍 开始测试 MongoDB 连接...
# ⏳ 正在连接到 MongoDB...
# ✅ 已连接到 MongoDB
# ✨ MongoDB 版本：6.0.0
# ✨ 所有数据库：...
# ✅ 测试完成！
```

### 方式 2：使用 mongosh（如果已安装）
```bash
# 连接到你的 MongoDB
mongosh "mongodb+srv://gyc567_db_user:MMxhQtBoYVlY6974@cluster0.ayeox9c.mongodb.net/?appName=Cluster0"

# 查看数据库版本
db.version()

# 列出所有数据库
db.adminCommand('listDatabases')

# 退出
exit
```

### 方式 3：MongoDB Atlas Web 控制面板
```
1. 访问 https://cloud.mongodb.com
2. 登录你的账户
3. 选择 Cluster0
4. 点击 "Connect" → "Drivers"
5. 验证连接字符串
6. 查看数据库状态
```

---

## 🛠️ Next.js 集成

### 数据库访问方式

**使用 Prisma（已配置）**：
```typescript
// src/lib/db/prisma/index.ts
import prisma from '@/lib/db/prisma'

// 查询示例
const users = await prisma.user.findMany()
```

**直接使用 MongoDB 驱动**：
```typescript
import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI)
const db = client.db('coindpay')
const collection = db.collection('users')
```

---

## ⚠️ 安全注意事项

### 🔒 密码安全
**你的连接字符串包含密码**：
```
mongodb+srv://gyc567_db_user:MMxhQtBoYVlY6974@cluster...
                              ↑ 敏感信息
```

✅ **已保护**：
- `.env.local` 已添加到 `.gitignore`（不会提交到 Git）
- `.env.example` 不含实际密码（可以分享给团队）

❌ **不要做**：
- 不要提交 `.env.local` 到 Git
- 不要在公开渠道分享完整的连接字符串
- 不要在代码中硬编码密码

### 🌐 IP 白名单检查
```
MongoDB Atlas → Cluster0 → Security → Network Access

检查项：
✓ 你的开发机 IP 是否在白名单中
✓ 或者允许 0.0.0.0/0（任何 IP，仅用于测试）
✓ 生产环境建议指定具体 IP
```

---

## 🚀 下一步操作

### 1. 测试连接
```bash
npm install mongodb  # 如果还没安装
npm run db:test
```

### 2. 生成 Prisma 类型
```bash
npm run generate-prisma
```

### 3. 启动开发服务器
```bash
npm run dev
```

### 4. 查看数据库（Prisma Studio）
```bash
npx prisma studio
# 打开 http://localhost:5555
```

---

## 📊 Prisma 工作流

### 如果有 schema.prisma
```bash
# 1. 从现有数据库拉取 schema
npm run pull-prisma

# 2. 生成 Prisma 客户端
npm run generate-prisma

# 3. 创建迁移
npx prisma migrate dev --name init

# 4. 查看数据库
npx prisma studio
```

### 如果没有 schema（从零开始）
```bash
# 1. 创建 prisma schema
npx prisma init

# 2. 编辑 .prisma/schema.prisma
# 定义你的数据模型

# 3. 推送到数据库
npx prisma db push

# 4. 生成客户端
npx prisma generate
```

---

## 🐛 常见问题

### Q1: 连接超时
```
Error: connect ENOTFOUND cluster0.ayeox9c.mongodb.net
```

**原因**：网络无法连接到 MongoDB Atlas

**解决**：
1. 检查网络连接
2. 检查 IP 白名单设置
3. 检查连接字符串中的用户名和密码是否正确
4. 尝试访问 https://cloud.mongodb.com 确认服务可用

### Q2: 身份验证失败
```
Error: Authentication failed
```

**原因**：用户名或密码错误

**解决**：
1. 检查 `.env.local` 中的连接字符串
2. 确保用户名是 `gyc567_db_user`
3. 确保密码是 `MMxhQtBoYVlY6974`
4. 检查是否有特殊字符需要 URL 编码

### Q3: 连接字符串格式错误
```
Error: Invalid URI
```

**正确格式**：
```
mongodb+srv://用户名:密码@集群名.区域代码.mongodb.net/?appName=应用名
mongodb+srv://gyc567_db_user:MMxhQtBoYVlY6974@cluster0.ayeox9c.mongodb.net/?appName=Cluster0
```

---

## 📞 获取帮助

### MongoDB Atlas 帮助
- 官方文档：https://docs.mongodb.com/manual/
- Atlas 文档：https://docs.atlas.mongodb.com/

### Prisma 帮助
- 官方文档：https://www.prisma.io/docs
- Prisma Schema：https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference

### 项目特定帮助
- 查看 DEPLOYMENT_GUIDE.md
- 查看 ARCHITECTURE_ANALYSIS.md
- 查看项目的 docs/

---

## ✨ 配置总结

| 文件 | 用途 | 包含密码 |
|------|------|---------|
| `.env.local` | 开发环境（本地） | ✅ 是 |
| `.env.production` | 生产环境 | ✅ 是 |
| `.env.example` | 模板（分享给团队） | ❌ 否 |

---

**配置完成！** 🎉

现在可以运行 `npm run dev` 启动开发服务器，MongoDB 已准备好使用。

---

时间：2025-12-15
