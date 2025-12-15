#!/usr/bin/env node

/**
 * MongoDB 连接测试脚本
 * 使用：node test-mongodb.js
 */

const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://gyc567_db_user:MMxhQtBoYVlY6974@cluster0.ayeox9c.mongodb.net/?appName=Cluster0';

async function testConnection() {
  const client = new MongoClient(MONGODB_URI);

  try {
    console.log('🔍 开始测试 MongoDB 连接...\n');
    console.log('📡 连接字符串：');
    console.log('   mongodb+srv://gyc567_db_user:***@cluster0.ayeox9c.mongodb.net\n');

    console.log('⏳ 正在连接到 MongoDB...');
    
    // 连接到 MongoDB
    await client.connect();
    console.log('✅ 已连接到 MongoDB\n');

    // 获取管理员客户端
    const adminClient = client.db('admin');

    // 获取服务器信息
    console.log('✨ 服务器信息：');
    const serverStatus = await adminClient.command({ serverStatus: 1 });
    console.log(`   MongoDB 版本：${serverStatus.version}`);
    console.log(`   运行时间：${serverStatus.uptime} 秒\n`);

    // 列出所有数据库
    console.log('✨ 所有数据库：');
    const databases = await adminClient.listDatabases();
    databases.databases.forEach(db => {
      console.log(`   - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });

    console.log('\n✅ 测试完成！MongoDB 连接正常。');

  } catch (error) {
    console.error('\n❌ MongoDB 连接失败！');
    console.error(`\n错误信息：${error.message}\n`);

    console.error('🔧 故障排查步骤：');
    console.error('  1. 检查连接字符串是否正确');
    console.error('  2. 检查用户名和密码');
    console.error('  3. 在 MongoDB Atlas 控制面板检查 IP 白名单');
    console.error('     → Security → Network Access');
    console.error('  4. 如果在本地测试，添加你的 IP 地址到白名单');
    console.error('  5. 或允许任何地址访问（0.0.0.0/0）\n');

    process.exit(1);

  } finally {
    // 关闭连接
    await client.close();
  }
}

testConnection();
