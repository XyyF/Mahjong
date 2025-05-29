import { Tile } from './Tile.js';

/**
 * UI管理类
 */
export class UIManager {
    constructor(game) {
        this.game = game;
        this.selectedTileIndex = -1;
        this.initializeElements();
        this.bindEvents();
    }

    /**
     * 初始化DOM元素引用
     */
    initializeElements() {
        // 游戏信息元素
        this.currentPlayerElement = document.getElementById('current-player');
        this.remainingTilesElement = document.getElementById('remaining-tiles');
        
        // 玩家区域元素
        this.playerElements = {
            north: document.getElementById('player-north'),
            east: document.getElementById('player-east'),
            west: document.getElementById('player-west'),
            south: document.getElementById('player-south')
        };
        
        // 当前玩家手牌和碰杠区域
        this.currentHandElement = document.getElementById('current-hand');
        this.currentMeldedElement = document.getElementById('current-melded');
        
        // 弃牌区域
        this.discardedTilesElement = document.getElementById('discarded-tiles');
        
        // 操作按钮
        this.drawTileBtn = document.getElementById('draw-tile');
        this.discardTileBtn = document.getElementById('discard-tile');
        this.pengBtn = document.getElementById('peng');
        this.gangBtn = document.getElementById('gang');
        this.huBtn = document.getElementById('hu');
        
        // 控制按钮
        this.newGameBtn = document.getElementById('new-game');
        this.autoSortBtn = document.getElementById('auto-sort');
        this.gameRulesBtn = document.getElementById('game-rules');
        
        // 模态框
        this.rulesModal = document.getElementById('rules-modal');
        this.closeBtn = this.rulesModal.querySelector('.close');
        
        // 验证所有必需元素是否存在
        const requiredElements = [
            'currentPlayerElement', 'remainingTilesElement',
            'currentHandElement', 'currentMeldedElement', 'discardedTilesElement',
            'drawTileBtn', 'discardTileBtn', 'pengBtn', 'gangBtn', 'huBtn',
            'newGameBtn', 'autoSortBtn', 'gameRulesBtn', 'rulesModal'
        ];
        
        for (const elementName of requiredElements) {
            if (!this[elementName]) {
                console.error(`Required element not found: ${elementName}`);
            }
        }
        
        // 验证玩家元素
        for (const [position, element] of Object.entries(this.playerElements)) {
            if (!element) {
                console.error(`Player element not found: ${position}`);
            }
        }
    }

    /**
     * 绑定事件监听器
     */
    bindEvents() {
        // 游戏控制按钮
        this.drawTileBtn.addEventListener('click', () => this.handleDrawTile());
        this.discardTileBtn.addEventListener('click', () => this.handleDiscardTile());
        this.pengBtn.addEventListener('click', () => this.handlePeng());
        this.gangBtn.addEventListener('click', () => this.handleGang());
        this.huBtn.addEventListener('click', () => this.handleHu());
        
        // 控制面板按钮
        this.newGameBtn.addEventListener('click', () => this.handleNewGame());
        this.autoSortBtn.addEventListener('click', () => this.handleAutoSort());
        this.gameRulesBtn.addEventListener('click', () => this.showRules());
        
        // 模态框关闭
        this.closeBtn.addEventListener('click', () => this.hideRules());
        this.rulesModal.addEventListener('click', (e) => {
            if (e.target === this.rulesModal) {
                this.hideRules();
            }
        });
    }

    /**
     * 更新整个游戏界面
     */
    updateUI() {
        this.updateGameInfo();
        this.updateAllPlayers();
        this.updateDiscardedTiles();
        this.updateActionButtons();
    }

    /**
     * 更新游戏信息显示
     */
    updateGameInfo() {
        const gameInfo = this.game.getGameInfo();
        this.currentPlayerElement.textContent = `当前玩家: ${gameInfo.currentPlayer}`;
        this.remainingTilesElement.textContent = `剩余牌数: ${gameInfo.remainingTiles}`;
    }

    /**
     * 更新所有玩家显示
     */
    updateAllPlayers() {
        const positions = ['north', 'east', 'west', 'south'];
        
        positions.forEach((position, index) => {
            this.updatePlayer(index, position);
        });
    }

    /**
     * 更新指定玩家的显示
     */
    updatePlayer(playerIndex, position) {
        const player = this.game.players[playerIndex];
        const playerElement = this.playerElements[position];
        const handTilesElement = playerElement.querySelector('.hand-tiles');
        
        // 清空现有内容
        handTilesElement.innerHTML = '';
        
        if (position === 'south') {
            // 当前玩家（南），显示具体牌面
            this.updateCurrentPlayerHand(player);
            this.updateCurrentPlayerMelds(player);
        } else {
            // 其他玩家，显示牌背
            for (let i = 0; i < player.getHandSize(); i++) {
                const tileElement = document.createElement('div');
                tileElement.className = 'tile back';
                handTilesElement.appendChild(tileElement);
            }
            
            // 显示碰杠的牌
            this.updatePlayerMelds(player, playerElement);
        }
        
        // 更新玩家状态指示
        this.updatePlayerStatus(player, playerElement);
    }

    /**
     * 更新当前玩家手牌
     */
    updateCurrentPlayerHand(player) {
        this.currentHandElement.innerHTML = '';
        
        player.handTiles.forEach((tile, index) => {
            const tileElement = tile.createElement(false, true);
            tileElement.addEventListener('click', () => this.handleTileClick(index));
            
            if (index === this.selectedTileIndex) {
                tileElement.classList.add('selected');
            }
            
            this.currentHandElement.appendChild(tileElement);
        });
    }

    /**
     * 更新当前玩家的碰杠牌
     */
    updateCurrentPlayerMelds(player) {
        this.currentMeldedElement.innerHTML = '';
        
        player.meldedTiles.forEach(meld => {
            const meldElement = document.createElement('div');
            meldElement.className = `meld ${meld.type}`;
            
            meld.tiles.forEach(tile => {
                const tileElement = tile.createElement(false, false);
                meldElement.appendChild(tileElement);
            });
            
            this.currentMeldedElement.appendChild(meldElement);
        });
    }

    /**
     * 更新其他玩家的碰杠牌
     */
    updatePlayerMelds(player, playerElement) {
        let meldsElement = playerElement.querySelector('.melded-tiles');
        if (!meldsElement) {
            meldsElement = document.createElement('div');
            meldsElement.className = 'melded-tiles';
            playerElement.appendChild(meldsElement);
        }
        
        meldsElement.innerHTML = '';
        
        player.meldedTiles.forEach(meld => {
            const meldElement = document.createElement('div');
            meldElement.className = `meld ${meld.type}`;
            
            meld.tiles.forEach(tile => {
                const tileElement = tile.createElement(false, false);
                meldElement.appendChild(tileElement);
            });
            
            meldsElement.appendChild(meldElement);
        });
    }

    /**
     * 更新玩家状态指示
     */
    updatePlayerStatus(player, playerElement) {
        const nameElement = playerElement.querySelector('.player-name');
        
        // 重置状态类
        nameElement.classList.remove('current', 'can-action');
        
        if (player.isCurrentPlayer) {
            nameElement.classList.add('current');
        }
        
        if (player.canPeng || player.canGang || player.canHu) {
            nameElement.classList.add('can-action');
        }
    }

    /**
     * 更新弃牌区域
     */
    updateDiscardedTiles() {
        this.discardedTilesElement.innerHTML = '';
        
        this.game.discardPile.forEach(tile => {
            const tileElement = document.createElement('div');
            tileElement.className = 'discarded-tile';
            
            const content = document.createElement('div');
            content.className = 'tile-content';
            
            const number = document.createElement('div');
            number.className = 'tile-number';
            number.textContent = tile.number;
            
            const suit = document.createElement('div');
            suit.className = 'tile-suit';
            suit.textContent = tile.suit.charAt(0).toUpperCase();
            
            content.appendChild(number);
            content.appendChild(suit);
            tileElement.appendChild(content);
            
            this.discardedTilesElement.appendChild(tileElement);
        });
    }

    /**
     * 更新操作按钮状态
     */
    updateActionButtons() {
        const currentPlayer = this.game.getCurrentPlayer();
        const gameState = this.game.state;
        
        // 摸牌按钮
        this.drawTileBtn.disabled = gameState !== 'playing' || !currentPlayer.isCurrentPlayer;
        
        // 出牌按钮
        this.discardTileBtn.disabled = this.selectedTileIndex === -1 || !currentPlayer.isCurrentPlayer;
        
        // 碰杠胡按钮
        this.pengBtn.disabled = !currentPlayer.canPeng;
        this.gangBtn.disabled = !currentPlayer.canGang;
        this.huBtn.disabled = !currentPlayer.canHu;
    }

    /**
     * 处理牌点击事件
     */
    handleTileClick(tileIndex) {
        if (this.selectedTileIndex === tileIndex) {
            // 取消选择
            this.selectedTileIndex = -1;
        } else {
            // 选择新牌
            this.selectedTileIndex = tileIndex;
        }
        
        this.updateCurrentPlayerHand(this.game.getCurrentPlayer());
        this.updateActionButtons();
    }

    /**
     * 处理摸牌
     */
    handleDrawTile() {
        const drawnTile = this.game.drawTileForCurrentPlayer();
        if (drawnTile) {
            this.selectedTileIndex = -1; // 重置选择
            this.updateUI();
            this.showMessage(`摸到: ${drawnTile.getDisplayText()}`);
        }
    }

    /**
     * 处理出牌
     */
    handleDiscardTile() {
        if (this.selectedTileIndex === -1) {
            this.showMessage('请先选择要出的牌');
            return;
        }
        
        const discardedTile = this.game.discardTile(this.selectedTileIndex);
        if (discardedTile) {
            this.selectedTileIndex = -1; // 重置选择
            this.updateUI();
            this.showMessage(`出牌: ${discardedTile.getDisplayText()}`);
        }
    }

    /**
     * 处理碰牌
     */
    handlePeng() {
        const currentPlayerIndex = this.game.currentPlayerIndex;
        if (this.game.playerPeng(currentPlayerIndex)) {
            this.selectedTileIndex = -1;
            this.updateUI();
            this.showMessage('碰牌成功！');
        }
    }

    /**
     * 处理杠牌
     */
    handleGang() {
        const currentPlayerIndex = this.game.currentPlayerIndex;
        if (this.game.playerGang(currentPlayerIndex)) {
            this.selectedTileIndex = -1;
            this.updateUI();
            this.showMessage('杠牌成功！');
        }
    }

    /**
     * 处理胡牌
     */
    handleHu() {
        const currentPlayerIndex = this.game.currentPlayerIndex;
        if (this.game.playerWin(currentPlayerIndex)) {
            this.selectedTileIndex = -1;
            this.updateUI();
            this.showMessage('恭喜胡牌！');
        }
    }

    /**
     * 处理新游戏
     */
    handleNewGame() {
        this.game.startNewGame();
        this.selectedTileIndex = -1;
        this.updateUI();
        this.showMessage('新游戏开始！');
    }

    /**
     * 处理自动理牌
     */
    handleAutoSort() {
        this.game.autoSortCurrentPlayerHand();
        this.selectedTileIndex = -1;
        this.updateCurrentPlayerHand(this.game.getCurrentPlayer());
        this.showMessage('理牌完成');
    }

    /**
     * 显示游戏规则
     */
    showRules() {
        this.rulesModal.classList.remove('hidden');
    }

    /**
     * 隐藏游戏规则
     */
    hideRules() {
        this.rulesModal.classList.add('hidden');
    }

    /**
     * 显示消息
     */
    showMessage(message, duration = 3000) {
        // 创建消息元素
        const messageElement = document.createElement('div');
        messageElement.className = 'game-message';
        messageElement.textContent = message;
        messageElement.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: rgba(0, 0, 0, 0.8);
            color: white;
            padding: 15px 30px;
            border-radius: 10px;
            font-size: 1.2rem;
            z-index: 2000;
            animation: fadeInOut 3s ease-in-out;
        `;
        
        // 添加动画样式
        if (!document.querySelector('#message-animation-style')) {
            const style = document.createElement('style');
            style.id = 'message-animation-style';
            style.textContent = `
                @keyframes fadeInOut {
                    0% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                    20% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    80% { opacity: 1; transform: translate(-50%, -50%) scale(1); }
                    100% { opacity: 0; transform: translate(-50%, -50%) scale(0.8); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(messageElement);
        
        // 自动移除消息
        setTimeout(() => {
            if (messageElement.parentNode) {
                messageElement.parentNode.removeChild(messageElement);
            }
        }, duration);
    }

    /**
     * 添加牌的动画效果
     */
    addTileAnimation(tileElement, animationType) {
        tileElement.classList.add(animationType);
        
        setTimeout(() => {
            tileElement.classList.remove(animationType);
        }, 500);
    }
} 