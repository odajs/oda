import confetti from "https://cdn.skypack.dev/canvas-confetti";
ODA({ is: 'oda-minesweeper', imports: '../date-timer/date-timer.js',
    template: /*html*/`
        <style>
            :host {
                @apply --vertical;
                position: relative;
                box-sizing: border-box;
                -webkit-touch-callout: none;
                -webkit-user-select: none;
                -moz-user-select: none;
                -ms-user-select: none;
                user-select: none;
            }
            .clock {
                opacity: .7;
            }
            .field {
                box-shadow: 0 4px 8px 0 rgba(0, 0, 0, .3);
            }
            .smile {
                position: absolute;
                margin: auto;
                width: 200px;
                left: 50%;
                margin-left: -100px;
                margin-top: 74px;
                z-index: 99;
                visibility: hidden;
                opacity: 0;
                cursor: pointer;
            }
            .smile.show {
                opacity: .5;
                visibility: visible;
                transition: opacity 3s linear, visibility .5s linear;
            }
            .smile-win {
                fill: yellow;
            }
            .smile-lose {
                fill: red;
            }
            oda-button {
                border: 1px solid gray;
                border-radius: 50%;
                font-size: 12px;
                width: 14px;
                height: 14px;
                margin: 0 8px;
            }
        </style>
        <oda-minesweeper-title></oda-minesweeper-title>
        <div class="horizontal center clock">
            <oda-button allow-toggled :toggled="level === 1" @tap="setLevel(1)">1</oda-button>
            <oda-button allow-toggled :toggled="level === 2" @tap="setLevel(2)">2</oda-button>
            <oda-date-timer-circle type="hour" size=40 height=60></oda-date-timer-circle>
            <oda-date-timer-circle type="min" size=40 height=60></oda-date-timer-circle>
            <oda-date-timer-circle type="sec" size=40 height=60></oda-date-timer-circle>
            <oda-date-timer-circle size=40 height=60></oda-date-timer-circle>
            <oda-button allow-toggled :toggled="level === 3" @tap="setLevel(3)">3</oda-button>
            <oda-button allow-toggled :toggled="level === 4" @tap="setLevel(4)">4</oda-button>
        </div>
        <oda-minesweeper-field ~if="isReady" class="flex center field"></oda-minesweeper-field>
        <div class="smile" ~class="{show:endGame}" @tap="init">
            <svg viewbox="0 0 120 120">
                <g transform='translate(60 60)'>
                    <circle cx="0" cy="0" r="50" stroke="#000000" stroke-width="2" fill="transparent" ~class="{'smile-lose':endGame==='lose', 'smile-win':endGame==='win'}"/>
                    <circle cx="-20" cy="-10" r="5" fill="#000000"/>
                    <circle cx="20" cy="-10" r="5" fill="#000000"/>
                    <g>
                        <path fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round" :d="'M-25,20 Q0,'+ smileQY + ' 25,20'"/>
                    </g>
                </g>
            </svg>
        </div>
    `,
    props: {
        colors: ['', 'blue', 'green', 'red', 'magenta', 'orange'],
        cols: {
            default: 10,
            save: true
        },
        rows: {
            default: 10,
            save: true
        },
        mineCount: {
            default: 15,
            save: true
        },
        babyMode: {
            default: false,
            save: true
        },
        level: {
            default: '1',
            save: true
        },
        cellSize: 48,
        cellSizeDefault: 48,
        maxCells: 50
    },
    end: 0,
    today: 0,
    toUpdate: false,
    timerStartInterval: undefined,
    hideLabel: false,
    model: [],
    endGame: '',
    smileQY: 25,
    isReady: false,
    get game() { return this },
    listeners: { 
        resize: '_resize' 
    },
    ready() {
        this._winAudio = new Audio('./win.mp3');
        this._winAudio.volume = .2;
        this._errAudio ||= new Audio('./err.mp3');
        this._errAudio.volume = 0.2;
    },
    attached() {
        this.init();
    },
    setLevel(level) {
        this.level = level;
        switch (level) {
            case 1:
                this.rows = this.cols = 9;
                this.mineCount = 10;
                break;
            case 2:
                this.rows = this.cols = 16;
                this.mineCount = 40;
                break;
            case 3:
                this.cols = 30;
                this.rows = 16;
                this.mineCount = 99;
                break;
            case 4:
                let h = this.offsetParent.offsetHeight - 110;
                this.rows = Math.floor(h / this.cellSizeDefault);
                let w = this.offsetParent.offsetWidth - 30;
                this.cols = Math.floor(w / this.cellSizeDefault);
                this.mineCount = (this.rows * this.cols) / 5 - (this.game.rows * this.game.cols) / 20;
                break;
        }
        this.init();
    },
    _cellSize() {
        let h = this.offsetParent?.offsetHeight - 110;
        h = (h / this.rows) > this.cellSizeDefault ? this.cellSizeDefault : h / this.rows;
        let w = this.offsetParent?.offsetWidth - 30;
        w = (w / this.cols) > this.cellSizeDefault ? this.cellSizeDefault : w / this.cols;
        return Math.min(h, w);
    },
    _resize() {
        this.cellSize = this._cellSize();
        this.hideLabel = this.offsetParent?.offsetWidth < 600;
    },
    generateModel(mine) {
        const model = [];
        let idx = 0;
        for (let x = 0; x < this.rows; x++) {
            for (let y = 0; y < this.cols; y++) {
                model.push({ x, y, idx });
                idx++;
            }
        }
        if (mine) {
            const idx = mine.idx;
            let cells = [idx];
            if (this.rows >= 5 || this.cols >= 5) {
                const cols = this.cols;
                cells = [ idx, idx + 1, idx - 1, idx - cols, idx - cols - 1, idx - cols + 1, idx + cols, idx + cols - 1, idx + cols + 1];
            }
            for (let i = 0; i < this.mineCount; i++) {
                let pos;
                do {
                    pos = Math.floor(Math.random() * model.length);
                } while (model[pos].mine || cells.includes(pos));
                model[pos].mine = true;
            }
            this._start = true;
        }
        this.model = model;
        this.isReady = true;
    },
    init() {
        this._start = false;
        this.endGame = '';
        this._confetti && clearInterval(this._confetti);
        this.end = this.today = 0;
        this.clearGameStartInterval();
        if (!this.firstInit) {
            const url = new URL(document.location.href);
            this.rows = url.searchParams.get('rows') || this.rows;
            this.cols = url.searchParams.get('cols') || this.cols;
            this.mineCount = url.searchParams.get('mine') || this.mineCount;
            const babyMode = url.searchParams.get('baby');
            if (babyMode)
                this.babyMode = babyMode !== 'false' ? true : false;
            this.firstInit = true;
        }
        this.rows = this.rows < 3 ? 3 : this.rows > this.maxCells ? this.maxCells : this.rows;
        this.cols = this.cols < 3 ? 3 : this.cols > this.maxCells ? this.maxCells : this.cols;
        this.mineCount = this.mineCount < 1 ? 1 : this.mineCount > (this.rows * this.cols) / 4 ? (this.rows * this.cols) / 4 : this.mineCount;
        this.mineCount = Math.floor(this.mineCount);
        this._resize();
        this.generateModel();  
    },
    clearGameStartInterval() {
        this.game.gameStartInterval && clearInterval(this.game.gameStartInterval);
        this.game.gameStartInterval = undefined;
    },
    bang(isWin) {
        if (this.endGame) return;
        this.clearGameStartInterval();
        this.model.forEach(i => {
            i.status = (i.status === 'locked' && i.mine) ? 'locked' : (i.status === 'locked' && !i.mine) ? 'error' : (i.mine ? 'bang' : 'opened');
        })
        this.smileQY = 25;
        let i = 1;
        if (isWin) {
            console.log('Это Победа !!!');
            this.game._winAudio.play();
            this.endGame = 'win';
            const randomInRange = (min, max) => { return Math.random() * (max - min) + min }
            this._confetti = setInterval(() =>
                confetti({
                    angle: randomInRange(30, 150), spread: randomInRange(50, 70),
                    particleCount: randomInRange(50, 100), origin: { y: .25 }
                }), 300);
            setTimeout(() => this._confetti && clearInterval(this._confetti), 3000);
        } else {
            i = -1;
            console.log('Повезет в следующий раз ...');
            this._errAudio.play();
            this.endGame = 'lose';
        }
        const sInt = setInterval(() => {
            this.smileQY += i;
            if (this.smileQY > 45 || this.smileQY < -5)
                clearInterval(sInt);
        }, 100);
    },
    checkStatus(opened) {
        let error = 0;
        let mine = this.mineCount;
        if (opened) {
            let error = 0;
            for (const i of this.model) {
                error += (i.status !== 'opened' && i.el.count) ? 1 : 0;
                if (error) return;
            }
            if (error === 0) this.bang(true);
        } else {
            for (const i of this.model) {
                mine -= (i.status === 'locked' && i.mine) ? 1 : 0;
                error += (i.status === 'locked' && !i.mine) ? 1 : 0;
                if (error) return;
            }
            if (error === 0 && mine === 0) this.bang(true);
        }
    }
})

ODA({ is: 'oda-minesweeper-title', imports: '@oda/button',
    template:/*html*/`
        <style>
            :host {
                display: flex;
                max-width: 100%;
                min-width: 100%;
                align-items: center;
                border-bottom: 1px solid lightgray;
                padding: 2px;
                z-index: 9;
                max-height: 44px;
                overflow: hidden;
                box-sizing: border-box;
                text-align: center;
            }
        </style>
        <oda-button icon="icons:remove" icon-size=24 @tap="--rows;_init()"></oda-button><div class="txt" title="rows">{{rows}}</div><oda-button icon="icons:add" icon-size=24  @tap="++rows;_init()"></oda-button>
        <oda-button icon="icons:remove" icon-size=24 @tap="--cols;_init()"></oda-button><div class="txt" title="columns">{{cols}}</div><oda-button icon="icons:add" icon-size=24  @tap="++cols;_init()"></oda-button>
        <div class="txt horizontal center" style="width: 100%;">{{hideLabel?'':'oda-minesweeper'}}</div>
        <oda-button icon="icons:face" icon-size=24 @tap="babyMode = !babyMode" title="baby mode" allow-toggled :toggled="babyMode"></oda-button>
        <oda-button icon="icons:remove" icon-size=24 @tap="--mineCount;_init('mineCount')"></oda-button><div class="txt" title="level">{{mineCount}}</div><oda-button icon="icons:add" icon-size=24  @tap="++mineCount;_init('mineCount')"></oda-button>
        <oda-button icon="icons:launch" icon-size=24 @tap="_share" title="share"></oda-button>
    `,
    _init(e) {
        if (e !== 'mineCount') {
            this.mineCount = (this.rows * this.cols) / 5 - (this.rows * this.cols) / 20;
        }
        this.game.level = 0;
        this.game.init();
    },
    _share() {
        let url = this.game.$url.replace('minesweeper.js', 'index.html');
        url += `?rows=${this.rows}&cols=${this.cols}&mine=${this.mineCount}&baby=${this.babyMode}`;
        window.open(url, '_blank').focus();
    }
})

ODA({ is: 'oda-minesweeper-field',
    template: /*html*/`
        <style>
            :host {
                box-sizing: border-box;
                width: {{cellSize * cols}}px;
                @apply --vertical;
                @apply --header;
            }
        </style>
        <div ~for="(row, rowIdx) in rows" class="horizontal flex">
                <oda-minesweeper-mine ~for="(col, colIdx) in cols" :mine="model[cols * rowIdx + colIdx]" ~style="{width: cellSize+'px', height: cellSize+'px'}"></oda-minesweeper-mine>
        </div>
    `
})

ODA({ is: 'oda-minesweeper-mine', imports: '@oda/icon',
    template: /*html*/`
        <style>
            :host {
                position: relative;
                box-sizing: border-box;
                width: {{cellSize}}px;
                height: {{cellSize}}px;
                outline: 1px solid gray;
            }
            .btn {
                display: flex;
                justify-content: center;
                z-index: 1;
                width: {{cellSize}}px;
                height: {{cellSize}}px;
                background-color: {{mine?.status === 'error' ? 'transparent' : 'darkgray'}}; 
                opacity: {{babyMode ? .75 : 1}};
                cursor: {{mine?.status === 'opened' ? 'default' : 'pointer'}};
                box-sizing: border-box;
                outline: 1px solid gray;
            }
            .btn:hover {
                background-color: gray;
            }
            .floor {
                box-sizing: border-box;
                outline: 1px solid gray;
                background-color: white;
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0px;
                top: 0px;
                text-align: center;
                align-items: center;
                font-size: {{8 + Math.floor(cellSize / 4)}}px;
            }
            .tmp {}
        </style>
        <div ~if="(babyMode || mine?.status === 'opened') && this.game._start" class="horizontal floor">
            <span class="flex" ~style="{color: colors[count]}">{{count}}</span>
        </div>
        <oda-icon ~if="mine?.status !== 'opened'" fill="red" :icon class="btn" @tap="onTap" @pointerdown="pointerdown" @pointerup="pointerup" :icon-size="cellSize*.6"></oda-icon >
    `,
    count: 0,
    set mine(n) {
        if (n) {
            n.el = this;
            this.setCount();
        }
    },
    get icon() { return this.mine?.status === 'error' ? 'icons:close' : this.mine?.status === 'locked' ? 'icons:check' : this.mine?.status === 'bang' ? 'image:flare' : '' },
    setCount() {
        if (this.mine?.mine) {
            this.count = 0;
            return;
        }
        let count = 0;
        for (let x = (this.mine.x - 1); x <= (this.mine.x + 1); x++) {
            for (let y = (this.mine.y - 1); y <= (this.mine.y + 1); y++) {
                const item = this.model.find(i => (i.y === y && i.x === x))
                if (!item) continue;
                if (item === this.mine) continue;
                if (!item.mine) continue;
                count++;
            }
        }
        this.count = count;
    },
    gameStart() {
        if (!this.game.gameStartInterval && !this.game.endGame) {
            this.game.generateModel(this.mine);
            this.game.end = (new Date()).getTime();
            this.game.gameStartInterval = setInterval(() => {
                this.game.today = (new Date()).getTime();
            }, 48);
        }
    },
    pointerdown(e) {
        this._firstStart = !this.game.gameStartInterval;
        this._pointerdownTime = new Date().getTime();
        if (e.button > 0) this.setLocked();
        this.gameStart();
    },
    pointerup(e) {
        if (new Date().getTime() - this._pointerdownTime > 250) this.setLocked();
    },
    setLocked() {
        if (this._firstStart || !this.game._start || this.endGame) return;
        if (this.mine.status === 'locked') {
            this.mine.status = ''
            this._locked = true;
        } else {
            this.mine.status = 'locked';
        }
        this.checkStatus();
    },
    onTap(e) {
        if (this._locked || this.mine.status === 'locked') {
            this._locked = false;
            return;
        }
        if (this.mine.mine) {
            this.mine.error = true;
            this.game.bang();
        }
        else
            this.open();
    },
    open() {
        if (this.mine.status === 'opened') return;
        if (this.mine.mine) return;
        this.mine.status = 'opened';
        if (this.count === 0) {
            for (let x = (this.mine.x - 1); x <= (this.mine.x + 1); x++) {
                for (let y = (this.mine.y - 1); y <= (this.mine.y + 1); y++) {
                    const item = this.model.find(i => (i.y === y && i.x === x))
                    if (!item) continue;
                    if (item === this.mine) continue;
                    item.el.open();
                }
            }
        }
        this.checkStatus(true);
    }
})
