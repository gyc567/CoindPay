# 🚀 CoindPay Vercel 部署指南

本文档说明如何将 CoindPay 部署到 Vercel 云服务器。

## 快速开始

### 方法 1：使用部署脚本（推荐）

#### 基础部署脚本

```bash
./deploy.sh
```

这个脚本提供：

- ✓ Vercel CLI 检查
- ✓ Git 状态验证
- ✓ 本地构建检查
- ✓ 环境选择（预览/生产）
- ✓ 一键部署

#### 完整部署脚本（包含诊断）

```bash
./deploy-vercel.sh
```

这个脚本提供更多功能：

- ✓ 所有基础脚本功能
- ✓ 环境变量检查和诊断
- ✓ 详细的故障排查指南
- ✓ 部署后引导和后续步骤
- ✓ 构建失败时的错误诊断

### 方法 2：手动部署

```bash
# 1. 登录 Vercel
vercel login

# 2. 预览环境部署
vercel

# 3. 生产环境部署
vercel --prod
```

## 环境变量配置

部署前需要在 Vercel 仪表板配置环境变量。

### 必需的环境变量

1. **Web3 配置**
   - `NEXT_PUBLIC_WALLET_CONNECT_ID` - WalletConnect 项目 ID
   - `NEXT_PUBLIC_ALCHEMY_ID` - Alchemy API Key
   - `NEXT_PUBLIC_THIRDWEB_KEY` - Thirdweb API Key
   - `NEXT_PUBLIC_QUICKNODE_ID` - Solana RPC Key

2. **身份认证**
   - `API_JWT_SECRET` - JWT 密钥（最少 32 字符）

3. **数据库**
   - `DATABASE_URL` - MongoDB 连接字符串

4. **缓存**
   - `UPSTASH_REDIS_REST_URL` - Redis URL
   - `UPSTASH_REDIS_REST_TOKEN` - Redis Token

5. **邮件服务**
   - `RESEND_API_KEY` - Resend API Key

### 配置步骤

1. 访问 Vercel 仪表板：https://vercel.com/dashboard

2. 找到 `coind-pay` 项目，点击 **Settings**

3. 选择 **Environment Variables**

4. 根据 `.env.example` 添加所有必需的变量

5. 保存并重新部署

## 构建配置

项目的 Vercel 构建配置定义在 `vercel.json` 中：

```json
{
  "buildCommand": "npm run build",
  "devCommand": "next dev",
  "installCommand": "npm install --legacy-peer-deps",
  "env": {
    "NODE_ENV": "production",
    "NODE_OPTIONS": "--max-old-space-size=4096",
    "NEXT_PUBLIC_CDN_URL": ""
  }
}
```

## 部署状态检查

### 查看部署仪表板

https://vercel.com/dashboard/coind-pay/deployments

### 查看日志

Vercel 仪表板 → Deployments → 选择部署 → Logs

### 监控性能

Vercel 仪表板 → Analytics → Web Vitals

## 常见问题

### Q: 部署失败 - "npm run build" exited with 1

**原因**：通常是环境变量配置不完整

**解决方案**：

1. 检查 Vercel 仪表板中的 Environment Variables
2. 确认所有必需的 Web3 API Keys 都已配置
3. 在本地运行 `npm run build` 验证
4. 重新部署

### Q: 部署后页面空白

**原因**：可能是运行时环境变量不匹配

**解决方案**：

1. 打开浏览器开发者工具 (F12)
2. 查看 Console 标签中的错误信息
3. 在 Vercel 仪表板查看 Function Logs
4. 确保所有环境变量已应用（可能需要重新部署）

### Q: 如何处理预发布版本？

1. 创建新分支：`git checkout -b staging`
2. 推送到 GitHub
3. Vercel 会自动创建预览 URL
4. 测试完成后合并到 master 分支

### Q: 如何回滚到之前的版本？

在 Vercel 仪表板 → Deployments 中：

1. 找到想要回滚的部署
2. 点击 "Redeploy"

## 部署流程图

```
┌─────────────────────┐
│  本地代码修改       │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  git push origin    │
│     master          │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  Vercel 自动检测    │
│  新提交             │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│  运行构建命令       │
│  npm run build      │
└──────────┬──────────┘
           │
      ┌────┴────┐
      │          │
      ▼          ▼
   ✓成功      ✗失败
      │          │
      ▼          ▼
   部署    查看日志修复
      │          │
      ▼          ▼
   生成URL    重新部署
      │          │
      └────┬─────┘
           │
           ▼
      ✓部署完成
```

## 性能优化

### 构建时间优化

1. **使用 CDN**
   - 在 vercel.json 配置 `NEXT_PUBLIC_CDN_URL`
   - 所有静态资源会通过 CDN 加速

2. **减少包大小**
   - 使用 `next/dynamic` 进行代码分割
   - 优化第三方依赖

3. **缓存策略**
   - 配置 HTTP 缓存头
   - 使用 ISR（增量静态生成）

### 运行时性能

1. **内存配置**
   - vercel.json 中配置: `NODE_OPTIONS: --max-old-space-size=4096`

2. **函数超时**
   - Vercel Hobby 计划: 10 秒超时
   - 考虑升级计划或使用异步处理

3. **数据库连接池**
   - 使用 MongoDB Atlas connection pooling
   - 在 Vercel 函数中复用数据库连接

## 监控和告警

### 设置告警

1. Vercel 仪表板 → Alerts
2. 配置监控规则：
   - 构建失败
   - 部署失败
   - 错误率过高
   - 响应时间过长

### 查看指标

- **Deployment Analytics**: 每个部署的详细指标
- **Web Vitals**: Core Web Vitals 监控
- **Function Logs**: 服务器函数执行日志

## 自动部署 CI/CD

Vercel 已自动集成 GitHub，所有 push 到 master 的提交都会自动部署。

### 配置 Git 集成

1. 在 Vercel 仪表板 → Project Settings → Git Integration
2. 选择要自动部署的分支（默认为 master）
3. 配置预览分支（PR 预览）

## 安全性

### 环境变量安全

✓ 所有环境变量都加密存储
✓ 不要在代码中硬编码 API Keys
✓ 定期轮换 secret keys
✓ 使用 `.env.local` 本地测试（不提交到 Git）

### 部署保护

1. **限制部署权限**
   - Vercel 仪表板 → Settings → Permissions
   - 配置团队成员权限

2. **启用 Vercel 保护**
   - Vercel for GitHub 集成
   - 需要 PR 审核才能部署

## 获取帮助

- **Vercel 文档**: https://vercel.com/docs
- **Next.js 部署**: https://nextjs.org/learn/basics/deploying-nextjs-app
- **部署脚本帮助**: 运行 `./deploy-vercel.sh` 查看故障排查指南
- **GitHub Issues**: https://github.com/gyc567/CoindPay/issues

## 相关文件

- `vercel.json` - Vercel 构建配置
- `deploy.sh` - 基础部署脚本
- `deploy-vercel.sh` - 完整部署脚本（含诊断）
- `.env.example` - 环境变量模板
- `.vercelignore` - Vercel 忽略文件（如果存在）

---

**最后更新**: 2025-12-17
**维护者**: CoindPay Team
