/**
 * 麻将牌类
 */
export class Tile {
    constructor(suit, number) {
        this.suit = suit; // 'wan', 'tiao', 'tong'
        this.number = number; // 1-9
        this.id = `${suit}_${number}`;
    }

    /**
     * 获取牌的显示文本
     */
    getDisplayText() {
        const suitSymbols = {
            'wan': '万',
            'tiao': '条',
            'tong': '筒'
        };
        
        const numberTexts = {
            1: '一', 2: '二', 3: '三', 4: '四', 5: '五',
            6: '六', 7: '七', 8: '八', 9: '九'
        };
        
        return `${numberTexts[this.number]}${suitSymbols[this.suit]}`;
    }

    /**
     * 获取牌的简化显示
     */
    getShortText() {
        return `${this.number}${this.suit.charAt(0).toUpperCase()}`;
    }

    /**
     * 比较两张牌是否相同
     */
    equals(other) {
        return this.suit === other.suit && this.number === other.number;
    }

    /**
     * 获取牌的排序权重
     */
    getSortWeight() {
        const suitWeights = { 'wan': 0, 'tiao': 100, 'tong': 200 };
        return suitWeights[this.suit] + this.number;
    }

    /**
     * 创建牌的DOM元素
     */
    createElement(isBack = false, isClickable = true) {
        const tileElement = document.createElement('div');
        tileElement.className = `tile ${this.suit}`;
        tileElement.dataset.suit = this.suit;
        tileElement.dataset.number = this.number;
        tileElement.dataset.id = this.id;

        if (isBack) {
            tileElement.classList.add('back');
        } else {
            const content = document.createElement('div');
            content.className = 'tile-content';
            
            const number = document.createElement('div');
            number.className = 'tile-number';
            number.textContent = this.number;
            
            const suit = document.createElement('div');
            suit.className = 'tile-suit';
            suit.textContent = this.suit.charAt(0).toUpperCase();
            
            content.appendChild(number);
            content.appendChild(suit);
            tileElement.appendChild(content);
        }

        if (!isClickable) {
            tileElement.classList.add('disabled');
        }

        return tileElement;
    }

    /**
     * 克隆牌
     */
    clone() {
        return new Tile(this.suit, this.number);
    }

    /**
     * 转换为JSON
     */
    toJSON() {
        return {
            suit: this.suit,
            number: this.number,
            id: this.id
        };
    }

    /**
     * 从JSON创建牌
     */
    static fromJSON(json) {
        return new Tile(json.suit, json.number);
    }
}

/**
 * 牌组工厂类
 */
export class TileFactory {
    /**
     * 创建一副完整的四川麻将牌
     */
    static createFullDeck() {
        const tiles = [];
        const suits = ['wan', 'tiao', 'tong'];
        
        // 每种花色1-9，每张牌4张
        for (const suit of suits) {
            for (let number = 1; number <= 9; number++) {
                for (let count = 0; count < 4; count++) {
                    tiles.push(new Tile(suit, number));
                }
            }
        }
        
        return tiles;
    }

    /**
     * 洗牌
     */
    static shuffle(tiles) {
        const shuffled = [...tiles];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    /**
     * 按花色和数字排序
     */
    static sort(tiles) {
        return [...tiles].sort((a, b) => a.getSortWeight() - b.getSortWeight());
    }

    /**
     * 创建指定的牌
     */
    static createTile(suit, number) {
        return new Tile(suit, number);
    }

    /**
     * 从字符串创建牌（如 "1w", "5t", "9p"）
     */
    static fromString(str) {
        const number = parseInt(str.charAt(0));
        const suitChar = str.charAt(1).toLowerCase();
        
        const suitMap = {
            'w': 'wan',
            't': 'tiao',
            'p': 'tong',
            'c': 'tong' // 筒的另一种表示
        };
        
        const suit = suitMap[suitChar];
        if (!suit || number < 1 || number > 9) {
            throw new Error(`Invalid tile string: ${str}`);
        }
        
        return new Tile(suit, number);
    }
} 