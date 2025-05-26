#!/bin/bash

# 四川麻将游戏 - 服务器启动脚本

echo "🀄 四川麻将游戏 - Node.js服务器"
echo "📁 项目目录: $(pwd)"

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 未找到Node.js，请先安装Node.js"
    echo "💡 下载地址: https://nodejs.org/"
    exit 1
fi

# 进入server目录
cd server

# 检查是否已安装依赖
if [[ ! -d "node_modules" ]]; then
    echo "📦 正在安装服务器依赖..."
    npm install
    
    if [[ $? -ne 0 ]]; then
        echo "❌ 依赖安装失败"
        exit 1
    fi
    
    echo "✅ 依赖安装完成"
fi

echo ""
echo "🚀 启动Node.js服务器..."
echo "🔗 游戏地址: http://localhost:3000"
echo "⏹️  按 Ctrl+C 停止服务器"
echo ""

# 启动服务器
npm start 