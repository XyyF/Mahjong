# 四川麻将游戏服务器

这是一个简单的Node.js Express服务器，用于解决ES6模块的跨域问题，确保游戏能够正常运行。

## 功能特性

- ✅ **支持ES6模块** - 正确处理 `type="module"` 的JavaScript文件
- ✅ **CORS支持** - 自动设置跨域头，解决跨域问题
- ✅ **正确的MIME类型** - 为不同文件类型设置正确的Content-Type
- ✅ **静态文件服务** - 提供完整的静态文件服务
- ✅ **自动重定向** - 根路径自动重定向到游戏页面

## 快速开始

### 方法一：使用启动脚本（推荐）

在项目根目录运行：
```bash
./start-server.sh
```

或者在server目录运行：
```bash
cd server
./start.sh
```

### 方法二：使用npm命令

在项目根目录运行：
```bash
npm run server
```

### 方法三：手动启动

```bash
# 进入server目录
cd server

# 安装依赖
npm install

# 启动服务器
npm start
```

## 访问游戏

服务器启动后，在浏览器中访问：
```
http://localhost:3000
```

## 技术栈

- **Node.js** - JavaScript运行环境
- **Express** - Web应用框架
- **CORS** - 跨域资源共享中间件

## 配置说明

### 端口配置
默认端口为3000，可以通过环境变量修改：
```bash
PORT=8080 npm start
```

### 静态文件目录
服务器自动将项目根目录设置为静态文件目录，包含：
- `index.html` - 主页面
- `styles/` - 样式文件
- `js/` - JavaScript文件
- `modules/` - 游戏模块

## 解决的问题

### 1. ES6模块跨域问题
浏览器的安全策略不允许从 `file://` 协议加载ES6模块，必须通过HTTP服务器访问。

### 2. MIME类型问题
确保JavaScript文件以正确的 `application/javascript` MIME类型提供服务。

### 3. CORS问题
自动设置必要的CORS头，允许跨域请求。

## 开发说明

### 服务器文件结构
```
server/
├── package.json    # 服务器依赖配置
├── server.js       # Express服务器主文件
├── start.sh        # 启动脚本
└── README.md       # 说明文档
```

### 依赖说明
- `express` - Web框架，提供静态文件服务
- `cors` - CORS中间件，解决跨域问题

## 故障排除

### 问题1：端口被占用
```
Error: listen EADDRINUSE: address already in use :::3000
```
**解决方案：**
- 更换端口：`PORT=8080 npm start`
- 或者停止占用端口的进程

### 问题2：模块加载失败
```
Failed to load module script: CORS error
```
**解决方案：**
- 确保通过HTTP服务器访问（http://localhost:3000）
- 不要直接打开HTML文件

### 问题3：依赖安装失败
```
npm ERR! code ENOTFOUND
```
**解决方案：**
- 检查网络连接
- 尝试使用国内镜像：`npm config set registry https://registry.npmmirror.com`

## 许可证

MIT License 