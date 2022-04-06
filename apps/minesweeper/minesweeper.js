ODA({ is: 'oda-minesweeper', imports: '../date-timer/date-timer.js',
    template: /*html*/`
        <style>
            :host{
                @apply --vertical;
                position: relative;
            }
            .clock {
                opacity: .7;
            }
            .field {
                box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
            }
        </style>
        <oda-minesweeper-title></oda-minesweeper-title>
        <div class="horizontal center clock">
            <oda-date-timer-circle type="hour"></oda-date-timer-circle>
            <oda-date-timer-circle type="min"></oda-date-timer-circle>
            <oda-date-timer-circle type="sec"></oda-date-timer-circle>
            <oda-date-timer-circle></oda-date-timer-circle>
        </div>
        <oda-minesweeper-field class="flex center field"></oda-minesweeper-field>
    `,
    get game() {
        return this;
    },
    attached() {
        this.init();
    },
    props: {
        colors: ['', 'blue', 'green', 'red', 'magenta'],
        cols: {
            default: 10,
            save: true
        },
        rows: {
            default: 10,
            save: true
        },
        mineCount: {
            default: 20,
            save: true
        },
        babyMode: {
            default: false,
            save: true
        },
        iconSize: 44
    },
    _iconSize() {
        let h = this.offsetParent?.offsetHeight - 140;
        h = (h / this.rows > 44) ? 44 : h / this.rows;
        let w = this.offsetParent?.offsetWidth - 20;
        w = (w / this.cols > 44) ? 44 : w / this.cols;
        return Math.min(h, w);
    },
    end: 0, 
    today: 0, 
    toUpdate: false,
    handleInterval: undefined,
    hideLabel: false,
    model: [],
    listeners: {
        resize: '_resize'
    },
    _resize() {
        this.iconSize = this._iconSize() 
        this.hideLabel = this.offsetParent?.offsetWidth < 600;
    },
    init() {
        this.end = this.today = 1;
        this.handleInterval && clearInterval(this.handleInterval);
        this.handleInterval = undefined;

        this.rows = this.rows < 3 ? 3 : this.rows > 20 ? 20 : this.rows;
        this.cols = this.cols < 3 ? 3 : this.cols > 20 ? 20 : this.cols;
        this.mineCount = this.mineCount < 1 ? 1 : this.mineCount > (this.rows * this.cols) / 5 ? (this.rows * this.cols) / 5 : this.mineCount;
        this.mineCount = Math.floor(this.mineCount);
        this._resize();
        const model = [];
        for (let x = 0; x < this.cols; x++) {
            for (let y = 0; y < this.rows; y++) {
                model.push({ x, y })
            }
        }
        for (let i = 0; i < this.mineCount; i++) {
            let pos;
            do {
                pos = Math.floor(Math.random() * model.length);
            } while (model[pos].mine);
            model[pos].mine = true;
        }
        this.model = model;
    },
    bang() {
        this.model.forEach(i => {
            i.status = (i.mine ? 'bang' : 'opened');
        })
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
        <oda-button icon="icons:remove" icon-size=24 @tap="--mineCount;_init()"></oda-button><div class="txt" title="level">{{mineCount}}</div><oda-button icon="icons:add" icon-size=24  @tap="++mineCount;_init()"></oda-button>
        <oda-button icon="icons:refresh" icon-size=24 @tap="document.location.reload()" title="refresh"></oda-button>
    `,
    _init() {
        this.domHost.init();
    }
})

ODA({ is: 'oda-minesweeper-field',
    template: /*html*/`
        <style>
            :host {
                flex-wrap: wrap;
                width: {{iconSize * cols}}px;
                @apply --horizontal;
                @apply --header;
            }
        </style>
        <div ~for="(row, rowIdx) in rows" class="horizontal flex">
            <oda-minesweeper-mine class="no-flex" :icon-size ~for="(col, colIdx) in cols" :mine="model.find(i=>(i.y === rowIdx && i.x === colIdx))" ~style="{width: iconSize+'px', height: iconSize+'px'}"></oda-minesweeper-mine>
        </div>
    `
})

ODA({ is: 'oda-minesweeper-mine', imports: '@oda/icon',
    template: /*html*/`
        <style>
            :host{
                position: relative;
                align-items: center;
                outline: 1px solid lightgray;
                @apply --horizontal;
            }
            .btn{
                width: 100%;
                height: 100%;
                align-items: center;
                z-index: 1;
                opacity: {{babyMode ? .8 : 1}};
            }
            .floor{
                position: absolute;
                width: 100%;
                height: 100%;
                left: 0px;
                top: 0px;
                text-align: center;
                font-size: {{12 + ((iconSize - 32) > 0 ? iconSize - 32 : 0)}}px;
                align-items: center;

            }
        </style>
        <div ~if="count !== 0" class="horizontal floor">
            <span class="flex" ~style="{color: colors[count]}">{{count}}</span>
        </div>
        <button :error="mine?.error && 'bang!!!'" class="flex vertical btn" style="padding: 0px;" ~if="mine?.status !== 'opened'" @tap="onTap" @down="onDown" :icon :icon-size fill="red">
            <oda-icon class="flex" :icon :icon-size="iconSize*.5"  fill="red"></oda-icon>
        </button>
    `,
    set mine(n) {
        if (n)
            n.el = this;
    },
    get count() {
        if (this.mine.mine) return ''
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
        return count;
    },
    get icon() {
        switch (this.mine?.status) {
            case 'opened':
                return 'odant:spin';
            case 'locked':
                return 'icons:block';
            case 'bang':
                return 'icons:error';
        }
        return '';
    },
    onDown(e) {
        if (e.detail.sourceEvent.button > 0) {
            if (this.mine.status !== 'locked')
                this.mine.status = 'locked';
            else
                this.mine.status = '';
        }
    },
    onTap(e) {
        if (!this.handleInterval ) {
            this.end = (new Date()).getTime();
            this.handleInterval = setInterval(() => {
                this.toUpdate = !this.toUpdate;
                this.today = (new Date()).getTime();
            }, 16);
        }
        if (this.mine.status === 'locked')
            return;
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
    }
})
