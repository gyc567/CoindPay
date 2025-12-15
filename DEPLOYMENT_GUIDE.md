# CoindPay 部署文档 - 新手指南

## 📋 目录
1. [快速开始](#快速开始)
2. [环境准备](#环境准备)
3. [本地开发](#本地开发)
4. [项目配置](#项目配置)
5. [数据库配置](#数据库配置)
6. [生产部署](#生产部署)
7. [常见问题](#常见问题)
8. [故障排查](#故障排查)

---

## 🚀 快速开始

### 最简单的 3 步启动
```bash
# 第一步：克隆项目
git clone https://github.com/your-repo/coindpay.git
cd coindpay

# 第二步：安装依赖
npm install
# 或使用 yarn（推荐，项目配置指定 yarn）
yarn install

# 第三步：启动开发服务器
npm run dev
# 访问 http://localhost:3000
```

**完成！** 🎉 您现在已经看到 CoindPay 在运行了。

---

## 💻 环境准备

### 系统要求
```
操作系统：Linux / macOS / Windows (WSL2)
Node.js：v16+ (推荐 v18 LTS 或更高)
包管理器：yarn 1.22.22+ 或 npm 8+
硬盘空间：最少 2GB
内存：最少 4GB (开发)，8GB (生产编译)
```

### 检查环境
```bash
# 检查 Node 版本
node --version
# 输出示例：v18.17.0

# 检查 npm 版本
npm --version
# 输出示例：9.8.1

# 检查 yarn 版本（如果使用）
yarn --version
# 输出示例：1.22.22
```

### 安装依赖工具

#### Windows 用户
```bash
# 推荐使用 Windows Terminal（现代终端）
# 下载：https://www.microsoft.com/en-us/p/windows-terminal/9n0dx20hk701

# 启用 WSL2（Windows 子系统 for Linux）
wsl --install
wsl --set-default-version 2

# 安装 Ubuntu
# 在 Microsoft Store 中搜索 Ubuntu 并安装

# 在 WSL2 中运行本指南的所有命令
```

#### macOS 用户
```bash
# 使用 Homebrew 管理依赖
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# 安装 Node.js（使用 nvm 推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
nvm install 18
nvm use 18
```

#### Linux 用户
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install -y nodejs npm

# 或使用 NVM（推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
```

---

## 📖 本地开发

### 项目启动

#### 方式 1：标准开发（推荐）
```bash
# 启动开发服务器（带热重载）
npm run dev

# 输出示例：
# > next dev
# ▲ Next.js 13.5.6
# ▲ Local: http://localhost:3000
```

**打开浏览器访问**：http://localhost:3000

#### 方式 2：Vercel 本地环境
```bash
# 先配置 Vercel 环境变量
npm run dev:vercel

# 然后启动 Vercel 开发服务器
npm run dev:pre
```

### 开发中的常用命令

| 命令 | 用途 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产包 |
| `npm run lint:fix` | 自动修复代码格式 |
| `npm run lint:prettier` | 格式化代码 |
| `npm run lint:ts` | 检查 TypeScript 错误 |
| `npm run generate-prisma` | 生成 Prisma 类型 |

### 代码规范检查
```bash
# 检查所有代码
npm run lint:ts

# 自动修复代码
npm run lint:fix

# 格式化所有文件
npm run lint:prettier
```

### 提交代码（Git Hooks）
```bash
# 项目配置了 Husky pre-commit 钩子
# 当你运行 git commit 时，会自动运行：
# 1. ESLint 检查
# 2. Prettier 格式化

# 如果出现检查失败：
git add .
npm run lint:fix
git commit -m "fix: resolve linting issues"
```

---

## ⚙️ 项目配置

### 环境变量设置

#### 1. 创建 .env.local 文件
```bash
# 在项目根目录创建
touch .env.local
```

#### 2. 添加必需的环境变量
```env
# ========== Web3 RPC 配置 ==========
# QuickNode API Key（Solana RPC）
NEXT_PUBLIC_QUICKNODE_ID=your_quicknode_id_here

# ========== 身份认证 ==========
# JWT 密钥（用于 Token 签名）
API_JWT_SECRET=your_super_secret_jwt_key_min_32_chars

# ========== 数据库配置 ==========
# MongoDB 连接字符串
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/coindpay

# Prisma 数据库 URL
DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/coindpay

# ========== Redis 缓存 ==========
# Upstash Redis（无服务器 Redis）
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token_here

# ========== 邮件服务 ==========
# Resend API Key（用于发送邮件）
RESEND_API_KEY=your_resend_api_key

# ========== AWS S3（可选，用于文件存储）==========
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_S3_BUCKET_NAME=your_bucket_name
AWS_S3_REGION=us-east-1

# ========== Google Analytics（可选）==========
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX

# ========== 应用设置 ==========
# 环境标识
NODE_ENV=development

# API 基础 URL
NEXT_PUBLIC_API_URL=http://localhost:3000
```

#### 3. 说明
```
🔐 安全提示：
- .env.local 文件包含敏感信息，不要提交到 Git
- 使用 .env.local.example 作为模板分享给团队
- 在 .gitignore 中已配置忽略 .env.local

NEXT_PUBLIC_* 前缀的变量会暴露给浏览器，不要放敏感信息！
```

### TypeScript 配置

#### tsconfig.json 说明
```json
{
  "compilerOptions": {
    "baseUrl": "",                    // 基础路径
    "target": "ESNext",               // 编译目标
    "strict": false,                  // 建议改为 true
    "jsx": "preserve",                // Next.js JSX 处理
    "moduleResolution": "Node",       // 模块解析方式
    "paths": {
      "@/*": ["src/*"]                // 别名：@/ 代表 src/
    }
  }
}
```

**导入示例**：
```typescript
// ✅ 推荐（使用别名）
import { chains } from '@/lib/chains'
import { store } from '@/lib/store'

// ❌ 避免（相对路径）
import { chains } from '../../../lib/chains'
```

### Next.js 配置

#### next.config.js 关键配置
```javascript
// 图片优化
images: {
  remotePatterns: [
    { protocol: 'https', hostname: '**' }
  ]
}

// PWA 支持
withPWA({
  dest: 'public'  // PWA 清单文件位置
})

// 样式处理
sassOptions: {
  includePaths: ['styles']
}

// TypeScript 路径别名
paths: {
  '@/*': ['src/*']
}
```

### Tailwind CSS 配置

#### tailwind.config.js 说明
```javascript
// 自定义响应式断点
screens: {
  'max-sm': { max: '639px' },    // 小于 640px
  'min-lg': { min: '1024px' }    // 大于等于 1024px
}

// 自定义颜色
colors: {
  'theme-primary': '#570DF8',    // 主色调
  'theme-error': '#FD2929'       // 错误色
}

// 动画配置
animation: {
  aurora: 'aurora 60s linear infinite'
}
```

---

## 🗄️ 数据库配置

### MongoDB 配置

#### 本地 MongoDB
```bash
# macOS（使用 Homebrew）
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community

# 访问 MongoDB
mongosh
```

#### 云端 MongoDB Atlas
```bash
# 1. 注册 MongoDB Atlas
# https://www.mongodb.com/cloud/atlas

# 2. 创建集群
# - 选择免费层 M0
# - 选择云提供商和区域

# 3. 配置网络
# - 添加您的 IP 地址到白名单
# - 或使用 0.0.0.0/0（任何地址）

# 4. 创建数据库用户
# - 用户名：coindpay_user
# - 密码：生成强密码

# 5. 获取连接字符串
# mongodb+srv://user:password@cluster.mongodb.net/coindpay

# 6. 添加到 .env.local
MONGODB_URI=mongodb+srv://coindpay_user:password@cluster.mongodb.net/coindpay
DATABASE_URL=mongodb+srv://coindpay_user:password@cluster.mongodb.net/coindpay
```

### Prisma 配置

#### 1. 生成 Prisma 客户端
```bash
npm run generate-prisma
```

#### 2. 迁移数据库（如果有 schema）
```bash
npx prisma migrate dev --name init
```

#### 3. 查看数据库
```bash
npx prisma studio
# 打开 http://localhost:5555
```

### Redis 配置

#### 使用 Upstash Redis（推荐，无需本地安装）
```bash
# 1. 注册 Upstash
# https://upstash.com

# 2. 创建 Redis 数据库
# - 选择区域（离用户最近）
# - 启用 TLS

# 3. 复制连接信息
UPSTASH_REDIS_REST_URL=https://xxx.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_token

# 4. 添加到 .env.local
```

#### 本地 Redis（可选）
```bash
# macOS
brew install redis
brew services start redis

# Linux
sudo apt install -y redis-server
sudo service redis-server start

# 验证
redis-cli ping
# 输出：PONG
```

### 数据库迁移

```bash
# 拉取数据库 Schema
npm run pull-prisma

# 生成 Prisma 类型
npm run generate-prisma

# 创建新迁移
npx prisma migrate dev --name migration_name

# 部署迁移
npx prisma migrate deploy

# 查看迁移状态
npx prisma migrate status
```

---

## 🌐 生产部署

### 方式 1：Vercel 部署（推荐，最简单）

#### 前置条件
- GitHub 账户
- Vercel 账户（https://vercel.com）

#### 部署步骤

**步骤 1：推送代码到 GitHub**
```bash
git add .
git commit -m "feat: prepare for production"
git push origin main
```

**步骤 2：连接 Vercel**
```bash
# 方式 A：使用 Vercel CLI（推荐）
npm install -g vercel
vercel login
vercel

# 方式 B：在 Vercel 网站连接
# 1. 访问 https://vercel.com/new
# 2. 导入 GitHub 仓库
# 3. 配置环境变量
# 4. 点击部署
```

**步骤 3：配置环境变量**
```bash
# 在 Vercel 控制面板
Settings → Environment Variables

添加所有生产环境变量：
- MONGODB_URI
- API_JWT_SECRET
- UPSTASH_REDIS_REST_URL
- 其他敏感信息
```

**步骤 4：自动部署**
```bash
# 之后每次推送 main 分支都会自动部署
git commit -m "fix: some changes"
git push origin main
# ✅ Vercel 自动部署完成
```

#### 验证部署
```bash
# 查看部署日志
vercel logs

# 访问生产环境
# https://your-project-name.vercel.app
```

### 方式 2：Docker 容器部署

#### 创建 Dockerfile
```dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app

# 复制 package 文件
COPY package*.json ./
COPY yarn.lock ./

# 安装依赖
RUN yarn install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN npm run build

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["npm", "start"]
```

#### 创建 Docker Compose
```yaml
# docker-compose.yml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - MONGODB_URI=${MONGODB_URI}
      - API_JWT_SECRET=${API_JWT_SECRET}
      - UPSTASH_REDIS_REST_URL=${UPSTASH_REDIS_REST_URL}
      - UPSTASH_REDIS_REST_TOKEN=${UPSTASH_REDIS_REST_TOKEN}
    depends_on:
      - mongodb
      - redis

  mongodb:
    image: mongo:6
    ports:
      - "27017:27017"
    volumes:
      - mongo_data:/data/db
    environment:
      MONGO_INITDB_ROOT_USERNAME: root
      MONGO_INITDB_ROOT_PASSWORD: password

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  mongo_data:
```

#### 使用 Docker 部署
```bash
# 构建镜像
docker build -t coindpay:latest .

# 运行容器
docker run -p 3000:3000 --env-file .env.production coindpay:latest

# 使用 Docker Compose
docker-compose up -d

# 停止容器
docker-compose down
```

### 方式 3：传统服务器部署（AWS EC2 / 腾讯云 / 阿里云）

#### 服务器准备
```bash
# SSH 连接到服务器
ssh user@your-server-ip

# 安装 Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 Git
sudo apt-get install -y git

# 安装 PM2（进程管理）
sudo npm install -g pm2

# 安装 Nginx（反向代理）
sudo apt-get install -y nginx
```

#### 克隆项目
```bash
cd /home/ubuntu
git clone https://github.com/your-repo/coindpay.git
cd coindpay

# 安装依赖
npm install
# 或
yarn install
```

#### 构建项目
```bash
# 生成环境变量文件
nano .env.production
# 粘贴生产环境变量

# 构建
npm run build

# 输出：
# > next build
# ▲ Creating an optimized production build...
```

#### 使用 PM2 启动
```bash
# 创建 ecosystem.config.js
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'coindpay',
    script: './node_modules/.bin/next',
    args: 'start',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOF

# 启动应用
pm2 start ecosystem.config.js

# 设置自启
pm2 startup
pm2 save

# 查看日志
pm2 logs coindpay
```

#### Nginx 反向代理
```nginx
# /etc/nginx/sites-available/coindpay
upstream app {
  server 127.0.0.1:3000;
}

server {
  listen 80;
  server_name your-domain.com;

  location / {
    proxy_pass http://app;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }
}
```

#### SSL 证书（HTTPS）
```bash
# 安装 Certbot
sudo apt-get install -y certbot python3-certbot-nginx

# 获取免费 SSL 证书
sudo certbot certonly --standalone -d your-domain.com

# 自动配置 Nginx
sudo certbot install --nginx
```

---

## ❓ 常见问题

### Q1: 启动时报错 "Cannot find module"
**原因**：依赖未安装
```bash
# 解决
rm -rf node_modules package-lock.json
npm install

# 或使用 yarn
rm -rf node_modules yarn.lock
yarn install
```

### Q2: 开发服务器无法访问
**检查步骤**：
```bash
# 1. 确认服务器在运行
# 应该看到：▲ Local: http://localhost:3000

# 2. 查看端口是否被占用
lsof -i :3000
# 如果被占用，修改端口：
npm run dev -- -p 3001

# 3. 检查防火墙
# Windows: 确保 3000 端口在防火墙白名单
# macOS: 可能需要授予权限

# 4. 尝试重启
npm run dev
```

### Q3: Prisma 生成错误
```bash
# 清除缓存
rm -rf .prisma

# 重新生成
npm run generate-prisma

# 或者
npx prisma generate --no-engine
```

### Q4: MongoDB 连接失败
```bash
# 检查连接字符串格式
# ✅ 正确：mongodb+srv://user:password@cluster.mongodb.net/dbname
# ❌ 错误：mongodb://localhost:27017

# 检查网络访问
# - 确保 IP 在 MongoDB Atlas 白名单中
# - 或添加 0.0.0.0/0 允许所有

# 测试连接
mongosh "mongodb+srv://user:password@cluster.mongodb.net/dbname"
```

### Q5: 部署后样式不显示
```bash
# 问题通常是 Tailwind CSS 路径配置
# 检查 tailwind.config.js

// 确保包含所有源文件
content: ['./src/**/*.{ts,tsx,js,jsx,mdx,html}']

// 重新构建
npm run build
```

### Q6: 内存不足，构建失败
```bash
# 增加 Node 内存限制
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

---

## 🔧 故障排查

### 日志查看

#### 开发环境日志
```bash
# 查看浏览器控制台
# F12 → Console 标签

# 查看终端日志
npm run dev
# 所有服务器日志显示在终端
```

#### 生产环境日志（Vercel）
```bash
# 实时日志
vercel logs --follow

# 特定部署日志
vercel logs --follow <deployment-url>
```

#### 生产环境日志（PM2）
```bash
# 查看日志
pm2 logs coindpay

# 查看错误日志
pm2 logs coindpay --err

# 清除日志
pm2 flush coindpay
```

### 性能诊断

```bash
# 分析包大小
npm run build
# 查看 .next/static/ 目录大小

# 生成分析报告（需要安装）
npm install --save-dev @next/bundle-analyzer

# 修改 next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})
module.exports = withBundleAnalyzer({ /* ... */ })

# 生成报告
ANALYZE=true npm run build
```

### 内存泄漏检测

```bash
# 使用 Chrome DevTools
# 1. 打开 DevTools（F12）
# 2. 转到 Memory 标签
# 3. 拍摄堆快照
# 4. 进行操作后再拍一次
# 5. 比较内存增长

# 或使用 clinic.js（专业诊断）
npm install -g clinic
clinic doctor -- npm start
```

---

## 📚 有用的命令速查

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 构建生产包 |
| `npm start` | 启动生产服务器 |
| `npm run lint:fix` | 修复代码格式 |
| `npm run generate-prisma` | 生成 Prisma 类型 |
| `npx prisma studio` | 打开数据库管理界面 |
| `npm run db` | 运行数据库脚本 |
| `vercel` | Vercel CLI 部署 |
| `docker build .` | 构建 Docker 镜像 |
| `pm2 start ecosystem.config.js` | 使用 PM2 启动 |

---

## 🎓 学习资源

| 资源 | 链接 |
|------|------|
| Next.js 官方文档 | https://nextjs.org/docs |
| React 官方文档 | https://react.dev |
| TypeScript 手册 | https://www.typescriptlang.org/docs |
| Prisma 文档 | https://www.prisma.io/docs |
| Tailwind CSS 文档 | https://tailwindcss.com/docs |
| Web3.js 指南 | https://docs.web3js.org |
| Wagmi 文档 | https://wagmi.sh |

---

## 📞 获取帮助

### 常见问题社区
- GitHub Issues：项目 Issues 页面
- Discord：CoindPay 官方 Discord
- 文档：https://docs.coindpay.xyz

### 紧急支持
- 生产故障：紧急团队
- 技术问题：开发者论坛
- 安全问题：security@coindpay.xyz

---

**祝您部署顺利！** 🚀

如有问题，参考本文档或联系开发团队。

---

文档版本：1.0  
最后更新：2025-12-15  
适用于：CoindPay v0.0.1+
