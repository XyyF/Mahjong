#!/bin/bash

# 四川麻将游戏服务器启动脚本

echo "🀄 四川麻将游戏服务器启动脚本"
echo "📁 当前目录: $(pwd)"

# 检查是否在server目录
if [[ ! -f "server.js" ]]; then
    echo "❌ 请在server目录下运行此脚本"
    echo "💡 正确用法: cd server && ./start.sh"
    exit 1
fi

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 未找到Node.js，请先安装Node.js"
    echo "💡 下载地址: https://nodejs.org/"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 未找到npm，请先安装npm"
    exit 1
fi

echo "✅ Node.js版本: $(node --version)"
echo "✅ npm版本: $(npm --version)"

# 检查是否已安装依赖
if [[ ! -d "node_modules" ]]; then
    echo "📦 正在安装依赖..."
    npm install
    
    if [[ $? -ne 0 ]]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    
    echo "✅ 依赖安装完成"
else
    echo "✅ 依赖已安装"
fi

echo ""
echo "🚀 启动服务器..."
echo "🔗 游戏地址: http://localhost:3000"
echo "⏹️  按 Ctrl+C 停止服务器"
echo ""

# 启动服务器
npm start 