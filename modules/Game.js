import { Tile, TileFactory } from './Tile.js';
import { Player } from './Player.js';

/**
 * 游戏状态枚举
 */
export const GameState = {
    WAITING: 'waiting',
    DEALING: 'dealing',
    PLAYING: 'playing',
    WAITING_ACTION: 'waiting_action',
    GAME_OVER: 'game_over'
};

/**
 * 四川麻将游戏类
 */
export class MahjongGame {
    constructor() {
        this.state = GameState.WAITING;
        this.players = [];
        this.currentPlayerIndex = 0;
        this.deck = [];
        this.discardPile = [];
        this.lastDiscardedTile = null;
        this.lastDiscardedPlayer = null;
        this.round = 1;
        this.dealer = 0; // 庄家索引
        
        this.initializePlayers();
    }

    /**
     * 初始化四个玩家
     */
    initializePlayers() {
        const positions = ['east', 'south', 'west', 'north'];
        const names = ['东', '南', '西', '北'];
        
        for (let i = 0; i < 4; i++) {
            this.players.push(new Player(names[i], positions[i]));
        }
    }

    /**
     * 开始新游戏
     */
    startNewGame() {
        this.state = GameState.DEALING;
        this.resetGame();
        this.dealTiles();
        this.state = GameState.PLAYING;
        this.setCurrentPlayer(this.dealer);
        
        // 庄家先摸一张牌
        this.drawTileForCurrentPlayer();
    }

    /**
     * 重置游戏状态
     */
    resetGame() {
        // 重置所有玩家
        this.players.forEach(player => player.reset());
        
        // 创建新牌组并洗牌
        this.deck = TileFactory.shuffle(TileFactory.createFullDeck());
        this.discardPile = [];
        this.lastDiscardedTile = null;
        this.lastDiscardedPlayer = null;
        
        // 重置当前玩家
        this.currentPlayerIndex = this.dealer;
    }

    /**
     * 发牌
     */
    dealTiles() {
        // 每个玩家发13张牌
        for (let round = 0; round < 13; round++) {
            for (let playerIndex = 0; playerIndex < 4; playerIndex++) {
                const adjustedIndex = (this.dealer + playerIndex) % 4;
                const tile = this.deck.pop();
                this.players[adjustedIndex].drawTile(tile);
            }
        }
    }

    /**
     * 设置当前玩家
     */
    setCurrentPlayer(playerIndex) {
        // 重置所有玩家的当前状态
        this.players.forEach(player => {
            player.isCurrentPlayer = false;
        });
        
        this.currentPlayerIndex = playerIndex;
        this.players[playerIndex].isCurrentPlayer = true;
    }

    /**
     * 获取当前玩家
     */
    getCurrentPlayer() {
        return this.players[this.currentPlayerIndex];
    }

    /**
     * 获取下一个玩家索引
     */
    getNextPlayerIndex(currentIndex = this.currentPlayerIndex) {
        return (currentIndex + 1) % 4;
    }

    /**
     * 当前玩家摸牌
     */
    drawTileForCurrentPlayer() {
        if (this.deck.length === 0) {
            this.endGame('流局');
            return false;
        }

        const tile = this.deck.pop();
        const currentPlayer = this.getCurrentPlayer();
        currentPlayer.drawTile(tile);
        
        return tile;
    }

    /**
     * 当前玩家出牌
     */
    discardTile(tileIndex) {
        const currentPlayer = this.getCurrentPlayer();
        
        try {
            const discardedTile = currentPlayer.discardTile(tileIndex);
            this.discardPile.push(discardedTile);
            this.lastDiscardedTile = discardedTile;
            this.lastDiscardedPlayer = this.currentPlayerIndex;
            
            // 检查其他玩家是否可以碰、杠、胡
            this.checkOtherPlayersActions(discardedTile);
            
            return discardedTile;
        } catch (error) {
            console.error('出牌失败:', error.message);
            return null;
        }
    }

    /**
     * 检查其他玩家可以进行的操作
     */
    checkOtherPlayersActions(discardedTile) {
        let hasActions = false;
        
        for (let i = 0; i < 4; i++) {
            if (i === this.currentPlayerIndex) continue;
            
            const player = this.players[i];
            
            // 重置操作状态
            player.canPeng = false;
            player.canGang = false;
            player.canHu = false;
            
            // 检查可以进行的操作
            if (player.canPengTile(discardedTile)) {
                player.canPeng = true;
                hasActions = true;
            }
            
            if (player.canGangTile(discardedTile)) {
                player.canGang = true;
                hasActions = true;
            }
            
            // 临时添加这张牌来检查是否可以胡牌
            player.handTiles.push(discardedTile);
            if (player.canWin()) {
                player.canHu = true;
                hasActions = true;
            }
            player.handTiles.pop(); // 移除临时添加的牌
        }
        
        if (hasActions) {
            this.state = GameState.WAITING_ACTION;
        } else {
            // 没有人要牌，轮到下一个玩家
            this.nextTurn();
        }
    }

    /**
     * 玩家碰牌
     */
    playerPeng(playerIndex) {
        if (!this.lastDiscardedTile || this.state !== GameState.WAITING_ACTION) {
            return false;
        }
        
        const player = this.players[playerIndex];
        if (!player.canPeng) {
            return false;
        }
        
        try {
            player.peng(this.lastDiscardedTile);
            
            // 移除打出的牌
            this.discardPile.pop();
            
            // 设置当前玩家并等待出牌
            this.setCurrentPlayer(playerIndex);
            this.state = GameState.PLAYING;
            
            // 重置所有玩家的操作状态
            this.resetPlayerActions();
            
            return true;
        } catch (error) {
            console.error('碰牌失败:', error.message);
            return false;
        }
    }

    /**
     * 玩家杠牌
     */
    playerGang(playerIndex, isConcealed = false) {
        const player = this.players[playerIndex];
        
        if (isConcealed) {
            // 暗杠：当前玩家的回合
            if (playerIndex !== this.currentPlayerIndex) {
                return false;
            }
            
            // 这里需要指定要杠的牌，暂时简化处理
            return false;
        } else {
            // 明杠：抢别人打出的牌
            if (!this.lastDiscardedTile || this.state !== GameState.WAITING_ACTION) {
                return false;
            }
            
            if (!player.canGang) {
                return false;
            }
            
            try {
                player.gang(this.lastDiscardedTile, false);
                
                // 移除打出的牌
                this.discardPile.pop();
                
                // 杠牌后需要摸一张牌
                this.setCurrentPlayer(playerIndex);
                this.drawTileForCurrentPlayer();
                this.state = GameState.PLAYING;
                
                // 重置所有玩家的操作状态
                this.resetPlayerActions();
                
                return true;
            } catch (error) {
                console.error('杠牌失败:', error.message);
                return false;
            }
        }
    }

    /**
     * 玩家胡牌
     */
    playerWin(playerIndex) {
        if (!this.lastDiscardedTile || this.state !== GameState.WAITING_ACTION) {
            return false;
        }
        
        const player = this.players[playerIndex];
        if (!player.canHu) {
            return false;
        }
        
        // 添加最后一张牌
        player.handTiles.push(this.lastDiscardedTile);
        
        if (player.canWin()) {
            this.endGame(`${player.name}胡牌！`, playerIndex);
            return true;
        } else {
            // 移除临时添加的牌
            player.handTiles.pop();
            return false;
        }
    }

    /**
     * 玩家过（不要牌）
     */
    playerPass(playerIndex) {
        const player = this.players[playerIndex];
        player.canPeng = false;
        player.canGang = false;
        player.canHu = false;
        
        // 检查是否还有其他玩家有操作
        const hasOtherActions = this.players.some(p => p.canPeng || p.canGang || p.canHu);
        
        if (!hasOtherActions) {
            this.nextTurn();
        }
    }

    /**
     * 重置所有玩家的操作状态
     */
    resetPlayerActions() {
        this.players.forEach(player => {
            player.canPeng = false;
            player.canGang = false;
            player.canHu = false;
        });
    }

    /**
     * 下一回合
     */
    nextTurn() {
        this.state = GameState.PLAYING;
        this.setCurrentPlayer(this.getNextPlayerIndex());
        this.drawTileForCurrentPlayer();
    }

    /**
     * 结束游戏
     */
    endGame(reason, winnerIndex = null) {
        this.state = GameState.GAME_OVER;
        console.log(`游戏结束: ${reason}`);
        
        if (winnerIndex !== null) {
            console.log(`获胜者: ${this.players[winnerIndex].name}`);
        }
    }

    /**
     * 获取剩余牌数
     */
    getRemainingTileCount() {
        return this.deck.length;
    }

    /**
     * 获取游戏状态信息
     */
    getGameInfo() {
        return {
            state: this.state,
            currentPlayer: this.getCurrentPlayer().name,
            remainingTiles: this.getRemainingTileCount(),
            round: this.round,
            dealer: this.players[this.dealer].name
        };
    }

    /**
     * 自动理牌
     */
    autoSortCurrentPlayerHand() {
        this.getCurrentPlayer().sortHand();
    }

    /**
     * 检查游戏是否可以继续
     */
    canContinue() {
        return this.state === GameState.PLAYING || this.state === GameState.WAITING_ACTION;
    }

    /**
     * 获取指定玩家的可见信息（用于UI显示）
     */
    getPlayerVisibleInfo(playerIndex) {
        const player = this.players[playerIndex];
        return {
            name: player.name,
            position: player.position,
            handSize: player.getHandSize(),
            meldedTiles: player.meldedTiles,
            discardedTiles: player.discardedTiles,
            isCurrentPlayer: player.isCurrentPlayer,
            canPeng: player.canPeng,
            canGang: player.canGang,
            canHu: player.canHu
        };
    }
} 