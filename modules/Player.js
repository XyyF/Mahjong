import { TileFactory } from './Tile.js';

/**
 * 玩家类
 */
export class Player {
    constructor(name, position) {
        this.name = name;
        this.position = position; // 'east', 'south', 'west', 'north'
        this.handTiles = []; // 手牌
        this.meldedTiles = []; // 碰杠的牌
        this.discardedTiles = []; // 打出的牌
        this.isCurrentPlayer = false;
        this.canPeng = false;
        this.canGang = false;
        this.canHu = false;
    }

    /**
     * 摸牌
     */
    drawTile(tile) {
        this.handTiles.push(tile);
        this.sortHand();
    }

    /**
     * 出牌
     */
    discardTile(tileIndex) {
        if (tileIndex < 0 || tileIndex >= this.handTiles.length) {
            throw new Error('Invalid tile index');
        }
        
        const discardedTile = this.handTiles.splice(tileIndex, 1)[0];
        this.discardedTiles.push(discardedTile);
        return discardedTile;
    }

    /**
     * 出牌（通过牌对象）
     */
    discardTileByObject(tile) {
        const index = this.handTiles.findIndex(t => t.equals(tile));
        if (index === -1) {
            throw new Error('Tile not found in hand');
        }
        return this.discardTile(index);
    }

    /**
     * 碰牌
     */
    peng(tile) {
        // 从手牌中移除两张相同的牌
        const matchingTiles = this.handTiles.filter(t => t.equals(tile));
        if (matchingTiles.length < 2) {
            throw new Error('Not enough matching tiles for peng');
        }

        // 移除两张牌
        for (let i = 0; i < 2; i++) {
            const index = this.handTiles.findIndex(t => t.equals(tile));
            this.handTiles.splice(index, 1);
        }

        // 添加到碰杠区
        this.meldedTiles.push({
            type: 'peng',
            tiles: [tile.clone(), tile.clone(), tile.clone()]
        });

        this.sortHand();
    }

    /**
     * 杠牌
     */
    gang(tile, isConcealed = false) {
        if (isConcealed) {
            // 暗杠：从手牌中移除四张相同的牌
            const matchingTiles = this.handTiles.filter(t => t.equals(tile));
            if (matchingTiles.length < 4) {
                throw new Error('Not enough matching tiles for concealed gang');
            }

            // 移除四张牌
            for (let i = 0; i < 4; i++) {
                const index = this.handTiles.findIndex(t => t.equals(tile));
                this.handTiles.splice(index, 1);
            }
        } else {
            // 明杠：从手牌中移除三张相同的牌
            const matchingTiles = this.handTiles.filter(t => t.equals(tile));
            if (matchingTiles.length < 3) {
                throw new Error('Not enough matching tiles for exposed gang');
            }

            // 移除三张牌
            for (let i = 0; i < 3; i++) {
                const index = this.handTiles.findIndex(t => t.equals(tile));
                this.handTiles.splice(index, 1);
            }
        }

        // 添加到碰杠区
        this.meldedTiles.push({
            type: 'gang',
            tiles: [tile.clone(), tile.clone(), tile.clone(), tile.clone()],
            concealed: isConcealed
        });

        this.sortHand();
    }

    /**
     * 补杠（在已有的碰上加一张牌变成杠）
     */
    addToGang(tile) {
        // 查找对应的碰
        const pengIndex = this.meldedTiles.findIndex(meld => 
            meld.type === 'peng' && meld.tiles[0].equals(tile)
        );

        if (pengIndex === -1) {
            throw new Error('No matching peng found for add gang');
        }

        // 从手牌中移除一张牌
        const handIndex = this.handTiles.findIndex(t => t.equals(tile));
        if (handIndex === -1) {
            throw new Error('Tile not found in hand for add gang');
        }

        this.handTiles.splice(handIndex, 1);

        // 将碰转换为杠
        this.meldedTiles[pengIndex] = {
            type: 'gang',
            tiles: [tile.clone(), tile.clone(), tile.clone(), tile.clone()],
            concealed: false,
            addedGang: true
        };

        this.sortHand();
    }

    /**
     * 理牌（排序）
     */
    sortHand() {
        this.handTiles = TileFactory.sort(this.handTiles);
    }

    /**
     * 检查是否可以碰
     */
    canPengTile(tile) {
        const matchingCount = this.handTiles.filter(t => t.equals(tile)).length;
        return matchingCount >= 2;
    }

    /**
     * 检查是否可以杠
     */
    canGangTile(tile) {
        const matchingCount = this.handTiles.filter(t => t.equals(tile)).length;
        return matchingCount >= 3;
    }

    /**
     * 检查是否可以暗杠
     */
    canConcealedGang(tile) {
        const matchingCount = this.handTiles.filter(t => t.equals(tile)).length;
        return matchingCount >= 4;
    }

    /**
     * 检查是否可以补杠
     */
    canAddGang(tile) {
        // 检查是否有对应的碰
        const hasPeng = this.meldedTiles.some(meld => 
            meld.type === 'peng' && meld.tiles[0].equals(tile)
        );
        
        // 检查手牌中是否有这张牌
        const hasInHand = this.handTiles.some(t => t.equals(tile));
        
        return hasPeng && hasInHand;
    }

    /**
     * 检查是否可以胡牌
     */
    canWin() {
        return this.checkWinningHand();
    }

    /**
     * 检查胡牌牌型
     */
    checkWinningHand() {
        // 简化的胡牌检查：需要14张牌（包括碰杠的牌）
        const totalTiles = this.handTiles.length + this.meldedTiles.length * 3;
        if (totalTiles !== 14) {
            return false;
        }

        // 检查基本牌型：4个顺子/刻子 + 1个对子
        return this.checkBasicWinPattern();
    }

    /**
     * 检查基本胡牌牌型
     */
    checkBasicWinPattern() {
        const tiles = [...this.handTiles];
        
        // 尝试找到对子
        for (let i = 0; i < tiles.length - 1; i++) {
            if (tiles[i].equals(tiles[i + 1])) {
                // 找到对子，移除并检查剩余牌是否都能组成顺子或刻子
                const remainingTiles = [...tiles];
                remainingTiles.splice(i, 2);
                
                if (this.canFormMelds(remainingTiles)) {
                    return true;
                }
            }
        }
        
        return false;
    }

    /**
     * 检查是否能组成顺子或刻子
     */
    canFormMelds(tiles) {
        if (tiles.length === 0) {
            return true;
        }
        
        if (tiles.length % 3 !== 0) {
            return false;
        }

        const sortedTiles = TileFactory.sort(tiles);
        
        // 尝试组成刻子
        if (sortedTiles.length >= 3 && 
            sortedTiles[0].equals(sortedTiles[1]) && 
            sortedTiles[1].equals(sortedTiles[2])) {
            
            const remaining = sortedTiles.slice(3);
            if (this.canFormMelds(remaining)) {
                return true;
            }
        }
        
        // 尝试组成顺子
        if (sortedTiles.length >= 3 && 
            sortedTiles[0].suit === sortedTiles[1].suit && 
            sortedTiles[1].suit === sortedTiles[2].suit &&
            sortedTiles[0].number + 1 === sortedTiles[1].number &&
            sortedTiles[1].number + 1 === sortedTiles[2].number) {
            
            const remaining = sortedTiles.slice(3);
            if (this.canFormMelds(remaining)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * 获取手牌数量
     */
    getHandSize() {
        return this.handTiles.length;
    }

    /**
     * 获取所有牌的数量（包括碰杠的牌）
     */
    getTotalTileCount() {
        return this.handTiles.length + this.meldedTiles.reduce((sum, meld) => sum + meld.tiles.length, 0);
    }

    /**
     * 重置玩家状态
     */
    reset() {
        this.handTiles = [];
        this.meldedTiles = [];
        this.discardedTiles = [];
        this.isCurrentPlayer = false;
        this.canPeng = false;
        this.canGang = false;
        this.canHu = false;
    }

    /**
     * 转换为JSON
     */
    toJSON() {
        return {
            name: this.name,
            position: this.position,
            handTiles: this.handTiles.map(tile => tile.toJSON()),
            meldedTiles: this.meldedTiles,
            discardedTiles: this.discardedTiles.map(tile => tile.toJSON()),
            isCurrentPlayer: this.isCurrentPlayer
        };
    }
} 