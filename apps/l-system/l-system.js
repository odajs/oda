import '../../components/layouts/app-layout/app-layout.js';
import '../../tools/property-grid/property-grid.js';
import { data } from './data.js';

let url = import.meta.url;

ODA({ is: 'oda-l-system', extends: 'oda-app-layout',
    template: `
        <style>
            :host {
                height: 100%;
            }
        </style>
        <div slot="title" class="horizontal no-flex header border" style="width:100%">
            <div class="flex"></div>
            <div>
                <a target="_blank" href="https://ru.wikipedia.org/wiki/L-%D1%81%D0%B8%D1%81%D1%82%D0%B5%D0%BC%D0%B0" style="margin: 4px; font-size: x-large; font-weight: 600">L-System</a>
                <div style="text-align:center;color:gray">[{{_lenght}}]</div>
            </div>
            <div class="flex"></div>
            <oda-button icon="av:play-arrow:180" @tap="animation=!animation;_sign=-1;loop(true)"></oda-button>
            <oda-button icon="av:play-arrow" @tap="animation=!animation;_sign=1;loop(true)"></oda-button>
            <oda-button icon="icons:chevron-left" @tap="rotate -= speed;loop()"></oda-button>
            <oda-button icon="icons:chevron-right" @tap="rotate += speed;loop()"></oda-button>
            <oda-button icon="icons:refresh" @tap="getCommands(name, true)" title="refresh params"></oda-button>
            <oda-button icon="icons:launch" @tap="toUrl()" title="open in new window"></oda-button>
        </div>
        <div slot="left-panel" class="vertical flex border" style="overflow: auto;">
            <oda-button ~for="_data" @tap="name=item" ~class="{header:item===name}">{{item}}</oda-button>
        </div>
        <canvas :canvas slot="main" :width="innerWidth" :height="innerHeight" @down="this.animation=true" @up="animation=false"
                @touchstart="animation=true" @touchend="animation=false" style="cursor: pointer" @resize="_resizeCanvas"></canvas>
        <oda-property-grid slot="right-panel" class="vertical flex border" label="l-system" :inspected-object="this" style="padding:0" :categories :show-buttons="showButtons"></oda-property-grid>
    `,
    props: {
        name: {
            type: String, default: 'tree', category: 'actions', save: true,
            set(v) {
                this._refreshPage();
                this.getCommands(v, true);
            }
        },
        animation: {
            type: Boolean, category: 'actions',
            set(v) { if (v) this.loop(true) }
        },
        inverse: {
            type: Boolean, category: 'actions',
            set(v) {
                this.canvas.style.background = v ? 'black' : 'white';
                this.lineColor = v ? 'white' : 'black';
                this.loop();
            }
        },
        x: { type: Number, default: 0, category: 'offset' },
        y: { type: Number, default: 0, category: 'offset' },
        orientation: { type: Number, default: 0, category: 'offset' },
        levels: {
            type: Number, default: 0, category: 'params',
            set(v) { this.getCommands() }
        },
        sizeValue: { type: Number, default: 0, category: 'params' },
        angleValue: { type: Number, default: 0, category: 'params' },
        rules: {
            type: Object, category: 'params',
            set(v) { this.getCommands() }
        },
        symbols: {
            type: Object, category: 'params',
            default: { 'F': 'F', '+': '+', '-': '-', '[': '[', ']': ']', '|': '|', '!': '!', '<': '<', '>': '>', '(': '(', ')': ')' },
            set(v) { this.getCommands() }
        },
        extSymbols: {
            type: String, default: '', category: 'params',
            set(v) {
                const o = {};
                if (v) {
                    v.split(',').forEach(i => {
                        i = i.split(':');
                        o[i[0]] = i[1];
                    })
                }
                this.symbols = { ...o, ...this._symbolsDefault };
                this.getCommands();
            }
        },
        rotate: { type: Number, default: 0, category: 'params' },
        lineWidth: { type: Number, default: 0.218, category: 'variables' },
        lineColor: {
            type: String, default: 'black', category: 'variables',
            list: ['red', 'blue', 'green', 'orange', 'lightblue', 'lightgreen', 'lightyellow', 'yellow', 'darkgray', 'gray', 'darkgray', 'lightgray', 'white', 'black'],
        },
        colorStep: { type: Number, default: 0, category: 'variables' },
        depth: { type: Number, default: 0, category: 'variables' },
        sizeGrowth: { type: Number, default: 0, category: 'variables' },
        angleGrowth: { type: Number, default: 0, category: 'variables' },
        speed: { type: Number, default: 1, category: 'variables' },
        _lenght: 0,
        categories: {
            type: Array,
            default: ['actions', 'offset', 'params', 'variables']
        },
        showButtons: Boolean,
        canvas: {
            get() {
                return this.$$('canvas')[0];
            }
        }
    },
    _data() {
        return Object.keys(data);
    },
    observers: [
        function update(sizeValue, angleValue, x, y, orientation, rotate, sizeGrowth, angleGrowth, lineWidth, lineColor, colorStep) {
            this.loop();
        },
        function initCanvas(canvas) {
            if (!canvas) return;
            this._sign = 1;
            this.ctx = canvas.getContext('2d');
            this._location = window.location.href;
            this._symbolsDefault = this.symbols;
            this.getCommands(this.name, true);
        }
    ],
    _resizeCanvas() {
        this.debounce('resizeCanvas', () => this.loop(), 100);
    },
    // attached() {
    //     this._sign = 1;
    //     this.canvas = this.$refs.canvas;
    //     this.ctx = this.canvas.getContext('2d');
    //     this._location = window.location.href;
    //     this._symbolsDefault = this.symbols;
    //     this.getCommands(this.name, true);
    // },
    getCommands(name = this.name, refreshData = false) {
        if (!this.ctx) return;
        this._isReady = false;
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        if (this._isGetCommands) return;
        this._isGetCommands = true;

        if (refreshData) {
            let s = data[name] || data['tree'];
            this.rotate = 0;
            let _s = this._location.split('?')[1];
            if (_s && !this._isReady) {
                if (data[_s]) {                                                                                 // pollenanate  || tree || re-coil || ...
                    s = data[_s];
                } else if (_s?.includes('p.size') && _s?.includes('p.angle') && _s?.split('&').length >= 4) {   // ...i=30...&r=...&p.size=0,0...&p.angle=0,0...
                    s = _s;
                } else if (_s.split('=').length === 2) {                                                        // spirograph=210
                    let arr = _s.split('=');
                    let val = arr[0].replace(/\s/g, '');
                    if (data[val]) {
                        this.rotate = Number(arr[1]) || 0;
                        s = data[val];
                    }
                }
            }
            this.fromUrl(s);
        }

        this.textRules = [];
        this.rules.replace(/\s|\n/g, '').split(",").forEach((r) => { if (r.includes(':')) this.textRules.push(r.split(':')) });
        this.seed = this.textRules[0][0];
        this.ruleMap = {};
        this.textRules.forEach(r => this.ruleMap[r[0]] = r[1]);
        this._commands = this.makeCommands(this.levels, this.seed, '', 0, 0, 400000);
        this.commands = []
        this._commands.split('').forEach(c => {
            c = this.symbols[c];
            if (c && Object.keys(this.symbols).includes(c)) this.commands.push(c);
        })
        this._lenght = this.commands.length;
        setTimeout(() => {
            this._isReady = true;
            this.loop(true);
        }, 100);
    },
    makeCommands(levelNum, levelExpr, acc, start, processed, count) {
        let end, i, reachesEndOfLevel, remaining, symbol;
        while (processed < count) {
            if (levelNum === 0) return levelExpr;
            remaining = count - processed;
            reachesEndOfLevel = remaining >= (levelExpr.length - start);
            if (reachesEndOfLevel) remaining = levelExpr.length - start;
            i = start;
            end = start + remaining;
            while (i < end) {
                symbol = levelExpr[i];
                acc += this.ruleMap[symbol] || symbol;
                i++;
            }
            processed += remaining;
            start += remaining;
            if (reachesEndOfLevel) {
                levelNum--;
                levelExpr = acc;
                acc = '';
                start = 0;
            }
        }
        return levelExpr;
    },
    fromUrl(url) {
        if (!url) return;
        const convertor = {
            'name': v => { this.name = decodeURIComponent(v || 'l-system') },
            'i': v => { this.levels = parseInt(v) },
            'r': v => { this.rules = decodeURIComponent(v.replaceAll('%0A', ', ')) },
            'p.size': v => { this.sizeValue = parseFloat(v[0] ? v[0] : 0); this.sizeGrowth = parseFloat(v[1] ? v[1] : 0.01) },
            'p.angle': v => { this.angleValue = parseFloat(v[0] ? v[0] : 0); this.angleGrowth = parseFloat(v[1] ? v[1] : 0.05) },
            's.size': v => { this.sensSizeValue = parseFloat(v[0] ? v[0] : 0); this.sensSizeGrowth = parseFloat(v[1] ? v[1] : 0.01) },
            's.angle': v => { this.sensAngleValue = parseFloat(v[0] ? v[0] : 0); this.sensAngleGrowth = parseFloat(v[1] ? v[1] : 0.05) },
            'offsets': v => { this.x = parseFloat(v[0] ? v[0] : 0); this.y = parseFloat(v[1] ? v[1] : 0); this.orientation = parseFloat(v[2] ? v[2] : 0); },
            'w': v => { this.lineWidth = parseFloat(v || 0.218) },
            'c': v => { this.lineColor = v || 'black' },
            'cstep': v => { this.colorStep = parseFloat(v || 0) },
            'depth': v => { this.depth = parseFloat(v || 0) },
            'speed': v => { this.speed = parseFloat(v || 0) },
            's': v => {
                const s = decodeURIComponent(v);
                this.extSymbols = s;
                const o = {};
                s.split(',').forEach(i => {
                    i = i.split(':');
                    o[i[0]] = i[1];
                })
                this.symbols = { ...o, ...this._symbolsDefault };
            },
            'rotate': v => { this.rotate = parseFloat(v) },
            'animation': v => { this.animation = v === 'true' ? true : false },
            'inverse': v => {
                this.inverse = v === 'true' ? true : false
                this.canvas.style.background = this.inverse ? 'black' : 'white';
                this.lineColor = this.inverse ? 'white' : 'black';
            },
            'sign': v => { this._sign = parseFloat(v) },
        }
        this.lineWidth = 0.218;
        this.x = this.y = 0;
        this.orientation = -90;
        this.sizeValue = this.angleValue = this.sensSizeValue = this.sensAngleValue = 0;
        this.lineColor = 'black';
        this.colorStep = this.depth = 0;
        this.speed = 1;
        this.extSymbols = '';
        this.animation = this.inverse = false;
        this.symbols = { ...[], ...this._symbolsDefault };
        const d = url.split('&');
        d.map(p => {
            let v = p.split('=')
            if (['p.size', 'p.angle', 's.size', 's.angle', 'offsets'].includes(v[0]))
                v[1] = v[1].split(',');
            if (convertor[v[0]])
                convertor[v[0]](v[1]);
        })
    },
    toUrl() {
        let url =
            `#?name=${encodeURIComponent(this.name)}` +
            `&i=${this.levels}` +
            `&r=${encodeURIComponent(this.rules)}` +
            `&p.size=${this.sizeValue},${this.sizeGrowth}` +
            `&p.angle=${this.angleValue},${this.angleGrowth}` +
            `&s.size=${this.sensSizeValue},${this.sensSizeGrowth}` +
            `&s.angle=${this.sensAngleValue},${this.sensAngleGrowth}` +
            `&offsets=${this.x},${this.y},${this.orientation}` +
            `&w=${this.lineWidth}` +
            `&c=${this.lineColor}` +
            `&cstep=${this.colorStep}` +
            `&depth=${this.depth}` +
            `&speed=${this.speed}` +
            `&rotate=${this.rotate}` +
            `&animation=${this.animation}` +
            `&inverse=${this.inverse}` +
            `&sign=${this._sign}`;
        if (this.extSymbols)
            url += `&s=${encodeURIComponent(this.extSymbols)}`;
        url = this.$url.replace('l-system.js', url);
        navigator.clipboard.writeText(url);
        window.open(url, '_blank').focus();
        return url;
    },
    _icon() {
        return url.replace('l-system.js', 'icon.webp');
    },
    _refreshPage(sure = false) {
        if (!this._isReady) return;
        const url = this.$url.replace('l-system.js', 'index.html');
        if (sure)
            window.location.href = url;
        else
            this._location = url;
    },
    state() {
        return {
            levels: this.levels,
            orientation: this.orientation,
            stepSize: this.sizeValue,
            stepAngle: this.angleValue,
            sizeGrowth: this.sizeGrowth,
            angleGrowth: this.angleGrowth,
            lineWidth: this.lineWidth,
            lineColor: this.lineColor,
            x: innerWidth / 2 + Number(this.x),
            y: innerHeight / 2 + Number(this.y),
            sensSizeValue: Math.pow(10, (this.sensSizeValue || 7.7) - 10) * this.depth,
            sensSizeGrowth: Math.pow(10, (this.sensSizeGrowth || 7.53) - 10) * this.depth,
            sensAngleValue: Math.pow(10, (this.sensAngleValue || 7.6) - 10) * this.depth,
            sensAngleGrowth: Math.pow(10, (this.sensAngleGrowth || 4) - 10) * this.depth,
            animation: this.animation,
            colorStep: this.colorStep
        }
    },
    loop(sure = false) {
        if (!this._isReady || (!sure && this.animation)) return;
        draw(this.state(), this.commands, this.ctx, this.rotate);
        this._isGetCommands = false;
        if (this.animation) {
            this.rotate += this.speed * this._sign;
            requestAnimationFrame(this.loop.bind(this));
        }
    }
})

function draw(state, commands, ctx, rotate) {
    if (!commands) return;
    const cmd = {
        'F': () => {
            const ang = ((state.orientation % 360) / 180) * Math.PI;
            state.x += Math.cos(ang) * (state.stepSize + state.sensSizeValue);
            state.y += Math.sin(ang) * (state.stepSize + state.sensSizeValue);
            ctx.lineTo(state.x, state.y);
        },
        'S': () => { },
        '+': () => { state.orientation += (state.stepAngle + rotate + state.sensAngleValue) },
        '-': () => { state.orientation -= (state.stepAngle - rotate - state.sensAngleValue) },
        '[': () => { context.stack.push({ orientation: state.orientation, stepAngle: state.stepAngle, stepSize: state.stepSize, x: state.x, y: state.y }) },
        ']': () => {
            context.state = state = { ...state, ...context.stack.pop() };
            ctx.moveTo(state.x, state.y);
        },
        '|': () => { state.orientation += 180 },
        '!': () => { state.stepAngle *= -1 },
        '<': () => { state.stepSize *= 1 + state.sizeGrowth + state.sensSizeGrowth },
        '>': () => { state.stepSize *= 1 - state.sizeGrowth - state.sensSizeGrowth },
        '(': () => { state.stepAngle *= 1 - state.angleGrowth - state.sensAngleGrowth },
        ')': () => { state.stepAngle *= 1 + state.angleGrowth + state.sensAngleGrowth }
    }
    const context = { stack: [] };
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.strokeStyle = state.colorStep ? `hsla(${rotate * state.colorStep},50%, 50%, .8)` : state.lineColor;
    ctx.lineWidth = state.lineWidth;
    ctx.beginPath();
    ctx.moveTo(state.x, state.y);
    commands.forEach(c => { cmd[c]() });
    ctx.stroke();
}
