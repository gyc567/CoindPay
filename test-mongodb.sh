#!/bin/bash

# MongoDB 连接测试脚本
# 使用：bash test-mongodb.sh

echo "🔍 开始测试 MongoDB 连接..."
echo ""

# 检查是否安装了 mongosh
if ! command -v mongosh &> /dev/null
then
    echo "❌ mongosh 未安装"
    echo "📖 安装指南：https://www.mongodb.com/docs/mongodb-shell/install/"
    echo ""
    echo "macOS（Homebrew）:"
    echo "  brew install mongosh"
    echo ""
    echo "Linux（Ubuntu/Debian）:"
    echo "  sudo apt-get install -y mongodb-mongosh"
    echo ""
    exit 1
fi

# 你的 MongoDB 连接字符串
MONGODB_URI="mongodb+srv://gyc567_db_user:MMxhQtBoYVlY6974@cluster0.ayeox9c.mongodb.net/?appName=Cluster0"

echo "📡 连接字符串："
echo "   mongodb+srv://gyc567_db_user:***@cluster0.ayeox9c.mongodb.net"
echo ""

# 尝试连接
echo "⏳ 正在连接到 MongoDB..."
if mongosh "$MONGODB_URI" --eval "db.version()" > /dev/null 2>&1
then
    echo "✅ MongoDB 连接成功！"
    echo ""
    echo "✨ 获取数据库版本："
    mongosh "$MONGODB_URI" --eval "db.version()"
    echo ""
    echo "✨ 列出所有数据库："
    mongosh "$MONGODB_URI" --eval "db.adminCommand('listDatabases')" | head -20
else
    echo "❌ MongoDB 连接失败"
    echo ""
    echo "🔧 故障排查："
    echo "  1. 检查连接字符串是否正确"
    echo "  2. 检查用户名和密码"
    echo "  3. 检查 MongoDB Atlas 白名单设置"
    echo "  4. 确保网络连接正常"
    exit 1
fi

echo ""
echo "✅ 测试完成！"
