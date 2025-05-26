import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 创建Express应用
const app = express();
const PORT = process.env.PORT || 3000;

// 启用CORS
app.use(cors());

// 设置静态文件目录（指向项目根目录）
const staticPath = path.join(__dirname, '..');
app.use(express.static(staticPath));

// 设置正确的MIME类型
app.use((req, res, next) => {
    // 为JavaScript模块设置正确的MIME类型
    if (req.path.endsWith('.js')) {
        res.setHeader('Content-Type', 'application/javascript');
    }
    // 为CSS文件设置正确的MIME类型
    else if (req.path.endsWith('.css')) {
        res.setHeader('Content-Type', 'text/css');
    }
    // 为HTML文件设置正确的MIME类型
    else if (req.path.endsWith('.html')) {
        res.setHeader('Content-Type', 'text/html');
    }
    next();
});

// 根路径重定向到index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(staticPath, 'index.html'));
});

// 处理所有其他路由，返回index.html（用于SPA）
app.get('*', (req, res) => {
    // 如果请求的是文件（有扩展名），则返回404
    if (path.extname(req.path)) {
        res.status(404).send('File not found');
    } else {
        // 否则返回index.html
        res.sendFile(path.join(staticPath, 'index.html'));
    }
});

// 启动服务器
app.listen(PORT, () => {
    console.log('🀄 四川麻将游戏服务器启动成功！');
    console.log(`📁 静态文件目录: ${staticPath}`);
    console.log(`🌐 服务器地址: http://localhost:${PORT}`);
    console.log(`🎮 游戏地址: http://localhost:${PORT}`);
    console.log('⏹️  按 Ctrl+C 停止服务器');
    console.log('');
    console.log('🎯 功能特性:');
    console.log('   ✅ 支持ES6模块 (type="module")');
    console.log('   ✅ 自动设置CORS头');
    console.log('   ✅ 正确的MIME类型');
    console.log('   ✅ 静态文件服务');
    console.log('');
}); 