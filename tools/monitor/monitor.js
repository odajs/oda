import '../../oda.js';
const CONSOLE = ODA.regTool('console');
ODA.regHotKey('ctrl+m', (e)=>{
    const elem = window.top.document.body.querySelector('oda-monitor')
    if (elem)
        window.top.document.body.removeChild(elem);
    else
        window.top.document.body.appendChild(ODA.createComponent('oda-monitor'));
})
ODA({
    is: 'oda-monitor', template: `
    <style>
        :host {
            @apply --header;
            @apply --border;
            @apply --shadow;
            position: fixed;
            bottom: 0;
            right: 0;
            margin: 8px;
            z-index: 9;
            width: {{monitorWidth}}px;
            padding: 2px;
            cursor: pointer;
            transform: {{_translate}};
            zoom: {{1 / devicePixelRatio}};
        }
        .bars {
            justify-content: flex-end; 
            align-items: flex-end;
            height: {{barHeight}}px;
        }
        .bar {
            border:solid 1px gray;
            margin-right:1px;
        }
    </style>
        <div class="horizontal" style="justify-content: space-between; margin-bottom: 2px;">
            <div style="color: gray" @tap.prev="_clearSecond">{{showSecond?"sec: " + second:""}}</div>
            <div>{{fps}} fps</div>
        </div>
        <div class="horizontal bars">
            <div class="bar" ~for="_fpsArr" :style="{height:(item*barHeight/_fpsMax) > barHeight ? barHeight : (item*barHeight/_fpsMax) +'px'}"></div>
        </div>
        <div class="horizontal" style="justify-content: flex-end; margin: 2px 0;">{{memory}}</div>
        <div class="horizontal bars">
            <div class="bar" ~for="_memoryArr" :style="{height:item*barHeight/_memoryMax+'px'}"></div>
        </div>
    `,
    props: {
        monitorWidth: 180,
        barHeight: 10,
        showSecond: true,
        second: '',
        fps: '',
        memory: '',
        _fpsMax: 60,
        _fpsArr: [],
        _memoryMax: 0,
        _memoryArr: [],
        _frame: 0,
        _startTime: Object,
        _perf: Object,
        translateX: {
            default: 0,
            save: true
        },
        translateY: {
            default: 0,
            save: true
        },
        _translate() { return `translate3d(${this.translateX || 0}px, ${this.translateY || 0}px, 0px)` }
    },
    listeners: {
        track(e) {
            if (e.detail.state === 'track') {
                this.translateX += e.detail.ddx;
                this.translateY += e.detail.ddy;
            }
        }
    },
    attached() {
        this._second = performance.now();
        let _perf = this._perf = window.performance || {};
        if (!_perf && !_perf.memory) _perf.memory = { usedJSHeapSize: 0 };
        if (_perf && !_perf.memory) _perf.memory = { usedJSHeapSize: 0 };
        this._startTime = performance.now();
        this.tick();
    },
    _zoom() {
        return 1 / window.devicePixelRatio
    },
    tick() {
        requestAnimationFrame(() => this.tick());
        let time = performance.now();
        this._frame++;
        if (time - this._startTime > 500) {
            this.second = ((time - this._second) / 1000).toFixed(0);
            let ms = this._perf.memory.usedJSHeapSize;
            this.memory = this.bytesToSize(ms, 2);
            this._memoryMax = ms > this._memoryMax ? ms : this._memoryMax;
            this._memoryArr.push(ms);
            if (this._memoryArr.length > this.monitorWidth / 3) this._memoryArr = this._memoryArr.splice(-this.monitorWidth / 3);
            this.fps = (this._frame / ((time - this._startTime) / 500) * 2).toFixed(1);
            this._fpsMax = this.fps > this._fpsMax ? this.fps : this._fpsMax;
            this._fpsArr.push(this.fps);
            if (this._fpsArr.length > this.monitorWidth / 3) this._fpsArr = this._fpsArr.splice(-this.monitorWidth / 3);
            this._startTime = time;
            this._frame = 0;
            this.render();
        }
    },
    bytesToSize(bytes, nFractDigit) {
        if (bytes == 0) return 'n/a';
        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        nFractDigit = nFractDigit !== undefined ? nFractDigit : 0;
        let precision = Math.pow(10, nFractDigit);
        let i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes * precision / Math.pow(1024, i)) / precision + ' ' + sizes[i];
    },
    _clearSecond() {
        this._second = performance.now();
        this.second = 0;
    }
})
