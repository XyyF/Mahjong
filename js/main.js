import { MahjongGame } from '../modules/Game.js';
import { UIManager } from '../modules/UI.js';

/**
 * 应用程序主类
 */
class MahjongApp {
    constructor() {
        this.game = null;
        this.ui = null;
        this.init();
    }

    /**
     * 初始化应用程序
     */
    init() {
        // 等待DOM加载完成
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.start());
        } else {
            this.start();
        }
    }

    /**
     * 启动应用程序
     */
    start() {
        try {
            // 创建游戏实例
            this.game = new MahjongGame();
            
            // 创建UI管理器
            this.ui = new UIManager(this.game);
            
            // 初始化界面
            this.ui.updateUI();
            
            console.log('四川麻将游戏初始化完成');
            
            // 显示欢迎消息
            this.ui.showMessage('欢迎来到四川麻将！点击"新游戏"开始游戏。', 5000);
            
        } catch (error) {
            console.error('游戏初始化失败:', error);
            this.showError('游戏初始化失败，请刷新页面重试。');
        }
    }

    /**
     * 显示错误信息
     */
    showError(message) {
        const errorElement = document.createElement('div');
        errorElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #f44336;
            color: white;
            padding: 20px;
            border-radius: 10px;
            font-size: 1.2rem;
            z-index: 3000;
            max-width: 400px;
            text-align: center;
        `;
        errorElement.textContent = message;
        document.body.appendChild(errorElement);
        
        // 5秒后自动移除
        setTimeout(() => {
            if (errorElement.parentNode) {
                errorElement.parentNode.removeChild(errorElement);
            }
        }, 5000);
    }
}

// 创建应用程序实例
const app = new MahjongApp();

// 导出到全局作用域（用于调试）
window.MahjongApp = app; 