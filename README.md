# 四川麻将

用程序实现四川麻将的逻辑，采用纯前端技术栈，无需后端服务。

## 项目特点

- 🎮 **纯前端实现** - 使用HTML + CSS + JavaScript，无需后端服务
- 📦 **ESM模块化** - 采用ES6模块规范，代码结构清晰
- 🎨 **现代UI设计** - 美观的界面和流畅的动画效果
- 🎯 **完整游戏逻辑** - 实现四川麻将的核心规则和玩法
- 📱 **响应式设计** - 支持桌面和移动设备

## 技术栈

- **HTML5** - 页面结构
- **CSS3** - 样式和动画
- **JavaScript (ES6+)** - 游戏逻辑
- **ESM** - 模块化管理
- **Node.js + Express** - 开发服务器（可选）

## 项目结构

```
Mahjong/
├── index.html              # 主页面
├── package.json           # 项目配置
├── README.md             # 项目说明
├── start-server.sh       # Node.js服务器启动脚本
├── styles/               # 样式文件
│   ├── main.css         # 主样式
│   └── mahjong.css      # 麻将牌样式
├── js/                  # JavaScript文件
│   └── main.js         # 主入口文件
├── modules/            # 模块文件
│   ├── Tile.js        # 麻将牌类
│   ├── Player.js      # 玩家类
│   ├── Game.js        # 游戏逻辑
│   └── UI.js          # 界面管理
└── server/            # Node.js服务器
    ├── package.json   # 服务器依赖
    ├── server.js      # Express服务器
    ├── start.sh       # 服务器启动脚本
    └── README.md      # 服务器说明
```

## 游戏规则

### 四川麻将特点
- 使用108张牌（万、条、筒各36张，1-9每张4张）
- 没有风牌和箭牌
- 支持碰、杠、胡等基本操作
- 胡牌需要满足基本牌型（4个顺子/刻子 + 1个对子）

### 基本操作
- **摸牌** - 从牌堆中摸取一张牌
- **出牌** - 打出手中的一张牌
- **碰** - 用手中的两张相同牌加上别人打出的牌组成刻子
- **杠** - 用四张相同的牌组成杠子
- **胡** - 满足胡牌条件时可以胡牌获胜

## 快速开始

### 方法一：Node.js服务器（推荐）

**优势：** 完美支持ES6模块，无跨域问题，开发体验最佳

```bash
# 1. 克隆项目
git clone <repository-url>
cd Mahjong

# 2. 启动Node.js服务器
./start-server.sh

# 或者使用npm命令
npm run server
```

访问地址：`http://localhost:3000`

### 方法二：Python服务器

**适用于：** 没有Node.js环境的情况

```bash
# Python 3
python3 -m http.server 8080

# 或者使用npm脚本
npm run dev
```

访问地址：`http://localhost:8080`

### 方法三：其他HTTP服务器

```bash
# 使用Node.js http-server
npx http-server -p 8080

# 使用其他工具
# - Live Server (VS Code插件)
# - nginx
# - Apache
```

## 启动方式对比

| 方式 | 优势 | 劣势 | 推荐度 |
|------|------|------|--------|
| Node.js服务器 | ✅ 完美支持ES6模块<br>✅ 自动处理CORS<br>✅ 正确的MIME类型 | ❌ 需要Node.js环境 | ⭐⭐⭐⭐⭐ |
| Python服务器 | ✅ 简单易用<br>✅ 无需额外依赖 | ❌ 可能有CORS问题<br>❌ MIME类型问题 | ⭐⭐⭐ |
| 其他服务器 | ✅ 灵活选择 | ❌ 配置复杂 | ⭐⭐ |

## 游戏操作指南

### 开始游戏
1. 点击"新游戏"按钮开始
2. 系统自动发牌，每人13张
3. 庄家先摸一张牌开始游戏

### 基本操作
1. **摸牌** - 点击"摸牌"按钮
2. **出牌** - 点击选择手牌，然后点击"出牌"
3. **碰牌** - 当别人出牌时，如果可以碰，点击"碰"按钮
4. **杠牌** - 当别人出牌时，如果可以杠，点击"杠"按钮
5. **胡牌** - 当满足胡牌条件时，点击"胡"按钮

### 辅助功能
- **自动理牌** - 自动排序手牌
- **游戏规则** - 查看详细规则说明

## 开发说明

### 模块说明

#### Tile.js - 麻将牌模块
- `Tile` 类：表示单张麻将牌
- `TileFactory` 类：牌组工厂，负责创建、洗牌、排序等操作

#### Player.js - 玩家模块
- `Player` 类：管理玩家状态、手牌、操作等

#### Game.js - 游戏逻辑模块
- `MahjongGame` 类：核心游戏逻辑，管理游戏流程和规则

#### UI.js - 界面管理模块
- `UIManager` 类：处理界面更新和用户交互

### 服务器说明

项目包含一个简单的Node.js Express服务器，用于解决ES6模块的跨域问题：

- **位置：** `server/` 目录
- **功能：** 静态文件服务、CORS支持、正确的MIME类型
- **端口：** 默认3000，可通过环境变量修改
- **详细说明：** 查看 `server/README.md`

### 扩展开发

如需添加新功能，可以：

1. **添加新的牌型检查** - 在 `Player.js` 中扩展胡牌逻辑
2. **增加游戏模式** - 在 `Game.js` 中添加新的游戏规则
3. **优化UI效果** - 在 `UI.js` 和CSS文件中添加动画和样式
4. **添加音效** - 集成Web Audio API
5. **多人联机** - 集成WebSocket或WebRTC

## 故障排除

### 问题1：模块加载失败
```
Failed to load module script: CORS error
```
**解决方案：** 使用HTTP服务器访问，推荐使用Node.js服务器

### 问题2：JavaScript文件无法加载
```
Refused to execute script from '...' because its MIME type ('text/plain') is not executable
```
**解决方案：** 使用Node.js服务器，它会自动设置正确的MIME类型

### 问题3：端口被占用
```
Error: listen EADDRINUSE: address already in use
```
**解决方案：** 更换端口或停止占用端口的进程

## 浏览器兼容性

- Chrome 61+
- Firefox 60+
- Safari 10.1+
- Edge 16+

## 许可证

MIT License

## 贡献

欢迎提交Issue和Pull Request来改进这个项目！

## 更新日志

### v1.0.0
- 初始版本发布
- 实现基本的四川麻将游戏逻辑
- 完整的UI界面和交互
- 支持碰、杠、胡等基本操作
- 添加Node.js服务器支持
