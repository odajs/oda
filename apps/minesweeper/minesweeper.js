import confetti from "https://cdn.skypack.dev/canvas-confetti";
ODA({ is: 'oda-minesweeper', imports: '../date-timer/date-timer.js',
    template: /*html*/`
        <style>
            :host{
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
                box-shadow: 0 4px 8px 0 rgba(0,0,0,0.2);
            }
            .container {
                position: absolute;
                margin: auto;
                width: 200px;
                left: 50%;
                margin-left: -100px;
                margin-top: 92px;
                z-index: 99;
                opacity: .5;
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
        <div class="container" ~if="endGame">
            <svg id="svg" viewbox="0 0 120 120">
                <g id="face" transform='translate(60 60)'>
                    <circle id="facecircle" cx="0" cy="0" r="50" stroke="#000000" stroke-width="2" fill="#fc6b2c"/>
                    <circle cx="-20" cy="-10" r="5" fill="#000000"/>
                    <circle cx="20" cy="-10" r="5" fill="#000000"/>
                    <g id="smile" transform="translate(0, 25)">
                        <path id="smilepath" fill="none" stroke="#000000" stroke-width="3" stroke-linecap="round" d="M-20,0.40000000000000036 C-20,-0.40000000000000036 20,-0.40000000000000036 20,0.40000000000000036"/>
                    </g>
                </g>
            </svg>
        </div>
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
            default: 15,
            save: true
        },
        babyMode: {
            default: false,
            save: true
        },
        iconSize: 48,
        iconSizeDefault: 48
    },
    _iconSize() {
        let h = this.offsetParent?.offsetHeight - 140;
        h = (h / this.rows > this.iconSizeDefault) ? this.iconSizeDefault : h / this.rows;
        let w = this.offsetParent?.offsetWidth - 20;
        w = (w / this.cols > this.iconSizeDefault) ? this.iconSizeDefault : w / this.cols;
        return Math.min(h, w);
    },
    end: 0,
    today: 0,
    toUpdate: false,
    timerStartInterval: undefined,
    hideLabel: false,
    model: [],
    endGame: false,
    listeners: {
        resize: '_resize'
    },
    _resize() {
        this.iconSize = this._iconSize();
        this.hideLabel = this.offsetParent?.offsetWidth < 600;
    },
    init() {
        this._confetti && clearInterval(this._confetti);
        this.end = this.today = 0;
        this.endGame = false;
        this.toUpdate = !this.toUpdate
        this.clearTimerStartInterval();

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

        this.rows = this.rows < 3 ? 3 : this.rows > 20 ? 20 : this.rows;
        this.cols = this.cols < 3 ? 3 : this.cols > 20 ? 20 : this.cols;
        this.mineCount = this.mineCount < 1 ? 1 : this.mineCount > (this.rows * this.cols) / 5 ? (this.rows * this.cols) / 5 : this.mineCount;
        this.mineCount = Math.floor(this.mineCount);
        this._resize();

        this.debounce('_init', () => {
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
        }, 500)
    },
    clearTimerStartInterval() {
        this.timerStartInterval && clearInterval(this.timerStartInterval);
        this.timerStartInterval = undefined;
    },
    get self() { return this },
    ready() {
        this._winAudio = new Audio('./win.mp3');
        this._winAudio.volume = 0.2;
        this._errAudio ||= new Audio('./err.mp3');
        this._errAudio.volume = 0.2;
    },
    bang(isVictory) {
        this.clearTimerStartInterval();
        this.model.forEach(i => {
            i.status = (i.status === 'locked' && i.mine) ? 'locked' : (i.mine ? 'bang' : 'opened');
        })
        this.endGame = true;
        let count = 50;
        let i = 1;
        if (isVictory) {
            console.log('Это Победа !!!');
            this.self._winAudio.play();
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
        }
        const sInt = setInterval(() => {
            this.animateSmile.call(this.self, count);
            count += i;
            if (count >= 100 || count <= 0)
                clearInterval(sInt);
        }, 50);
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
    },
    animateSmile(val) {
        const interpolateColor = (color1, color2, scale) => {
            const r1 = parseInt(color1.substr(1, 2), 16);
            const g1 = parseInt(color1.substr(3, 2), 16);
            const b1 = parseInt(color1.substr(5, 2), 16);
            const r2 = parseInt(color2.substr(1, 2), 16);
            const g2 = parseInt(color2.substr(3, 2), 16);
            const b2 = parseInt(color2.substr(5, 2), 16);
            const r = Math.round(r1 + scale * (r2 - r1));
            const g = Math.round(g1 + scale * (g2 - g1));
            const b = Math.round(b1 + scale * (b2 - b1));
            const hex = val => val.toString(16).padStart(2, '0');
            return `#${hex(r)}${hex(g)}${hex(b)}`;
        }
        const smilePoints = (scale) => {
            const factor = scale * 2 - 1;
            const p1 = { x: -20, y: -10 * factor };
            const c1 = { x: -20, y: 10 * factor };
            const p2 = { x: 20, y: -10 * factor };
            const c2 = { x: 20, y: 10 * factor };
            return [p1, c1, c2, p2];
        }
        const writeSmilePoints = (points) => {
            const p = p => `${p.x},${p.y}`;
            return `M${p(points[0])} C${p(points[1])} ${p(points[2])} ${p(points[3])}`;
        }
        const scale = parseInt(val, 10) / 100;
        const points = writeSmilePoints(smilePoints(scale));
        const svg = this.$('#svg');
        if (!svg) return;
        const smilePath = this.$('#smilepath');
        const animate = document.createElementNS(svg.namespaceURI, 'animate');
        animate.setAttribute('attributeName', 'd');
        animate.setAttribute('attributeType', 'XML');
        animate.setAttribute('to', points);
        animate.setAttribute('dur', '0.3s');
        animate.setAttribute('repeatCount', '1');
        animate.setAttribute('fill', 'freeze');
        smilePath.appendChild(animate);
        animate.beginElement();
        const faceCircle = this.$('#facecircle');
        const a = document.createElementNS(svg.namespaceURI, 'animate');
        a.setAttribute('attributeName', 'fill');
        a.setAttribute('attributeType', 'CSS');
        a.setAttribute('dur', '0.3s');
        a.setAttribute('to', interpolateColor('#FF0000', '#FAD257', scale));
        a.setAttribute('fill', 'freeze');
        faceCircle.appendChild(a);
        a.beginElement();
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
        <oda-button icon="icons:refresh" icon-size=24 @tap="domHost.init()" title="refresh"></oda-button>
    `,
    _init(e) {
        if (e !== 'mineCount') {
            this.mineCount = (this.rows * this.cols) / 5 - (this.rows * this.cols) / 20;
        }
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
                border: 1px solid lightgray;
                opacity: {{babyMode ? .75 : 1}};
                cursor: {{mine?.status === 'opened' ? 'default' : 'pointer'}}
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
                .tmp {}
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
        if (!this.mine || this.mine.mine) return ''
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
    listeners: {
        touchstart(e) {
            e.stopPropagation();
            this.timerStart();
            this.touchstartTimeout = setTimeout(() => {
                if (!this._touchstart && this.mine.status !== 'opened')
                    if (this.mine.status !== 'locked') {
                        this.mine.status = 'locked';
                        this.checkStatus();
                    }
                this._touchstart = true;
            }, 300);
        },
        touchend(e) {
            this.async(() => {
                clearTimeout(this.touchstartTimeout);
                this._touchstart = false;
            }, 100)
        }
    },
    timerStart() {
        if (!this.timerStartInterval) {
            this.end = (new Date()).getTime();
            this.timerStartInterval = setInterval(() => {
                this.today = (new Date()).getTime();
                this.toUpdate = !this.toUpdate;
            }, 16);
        }
    },
    onDown(e) {
        this.timerStart();
        if (this._touchstart) return;
        if (e.detail.sourceEvent.button > 0)
            if (this.mine.status !== 'locked') {
                this.mine.status = 'locked';
                this.checkStatus();
            }
    },
    onTap(e) {
        if (this._touchstart) return;
        if (this.mine.status === 'locked') {
            this.mine.status = '';
            this.checkStatus();
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
