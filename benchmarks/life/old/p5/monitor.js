import { LitElement, html, css } from 'https://cdn.skypack.dev/lit-element';

customElements.define('lit-monitor', class LitMonitor extends LitElement {
    static get properties() {
        return {
            monitorWidth: { type: Number },
            barHeight: { type: Number },
            second: { type: String },
            fps: { type: String },
            memory: { type: String },
            translateX: { type: Number },
            translateY: { type: Number },
            storeLocal: { type: Boolean },
            _fpsMax: { type: Number },
            _fpsArr: { type: Array },
            _memoryMax: { type: Number },
            _memoryArr: { type: Array },
            _frame: { type: Number },
        }
    }

    constructor() {
        super();
        this.monitorWidth = 180;
        this.barHeight = 10;
        this._fpsMax = 60;
        this._fpsArr = [];
        this._memoryMax = 0;
        this._memoryArr = [];
        this.translateX = this.translateY = this._frame = 0;
        this.storeLocal = true;
        if (this.storeLocal) {
            let m_t = localStorage.getItem('monitor_translate');
            if (m_t) {
                m_t = JSON.parse(m_t);
                this.translateX = m_t.x;
                this.translateY = m_t.y;
            }
        }
    }

    static get styles() {
        return css`
            .monitor {
                font-family: sans-serif;
                border: 1px solid gray;
                background: lightgray;
                box-shadow: 0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12), 0 5px 5px -3px rgba(0, 0, 0, 0.2);
                position: fixed;
                left: 0;
                top: 0;
                margin: 8px;
                z-index: 9;
                padding: 2px;
                display: flex;
                flex-direction: column;
                justify-content: center;
                padding: 2px;
                -webkit-touch-callout: none; /* iOS Safari */
                -webkit-user-select: none; /* Safari */
                -khtml-user-select: none; /* Konqueror HTML */
                -moz-user-select: none; /* Firefox */
                -ms-user-select: none; /* Internet Explorer/Edge */
                user-select: none;
            }
            .horizontal {
                display: flex;
            }
            .bars {
                justify-content: flex-end; 
                align-items: flex-end;
            }
            .bar {
                border:solid 1px gray;
                margin-right:1px;
            }
        `;
    }

    render() {
        return html`
            <div class="monitor" style="width:${this.monitorWidth}px; transform :translate3d(${this.translateX}px, ${this.translateY}px, 0px); cursor: pointer;" 
                    @mousedown="${this._down}">
                <div class="horizontal" style="justify-content: space-between; margin-bottom: 2px;">
                    <div style="color: gray" @click="${this._clearSecond}">sec: ${this.second}</div>
                    <div>${this.fps} fps</div>
                </div>
                <div class="horizontal bars" style="height:${this.barHeight}px">
                    ${this._fpsArr.map(f => html`<div class="bar" style="height:${f * this.barHeight / this._fpsMax}px"></div>`)}
                </div>
                <div class="horizontal" style="justify-content: flex-end; margin: 2px 0;">${this.memory}</div>
                <div class="horizontal bars" style="height:${this.barHeight}px">
                    ${this._memoryArr.map(m => html`<div class="bar" style="height:${m * this.barHeight / this._memoryMax}px"></div>`)}
                </div>
            </div>
        `;
    }

    firstUpdated() {
        super.firstUpdated();
        document.addEventListener('mouseup', this._up.bind(this));
        document.addEventListener('mousemove', this._move.bind(this));
        this._second = performance.now();
        let perf = this._perf = window.performance || {};
        if (!perf && !perf.memory) perf.memory = { usedJSHeapSize: 0 };
        if (perf && !perf.memory) perf.memory = { usedJSHeapSize: 0 };
        this._startTime = performance.now();
        this.tick();
    }

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
            this.fps = this.fps > this._fpsMax ? this._fpsMax : this.fps;
            this._fpsArr.push(this.fps);
            if (this._fpsArr.length > this.monitorWidth / 3) this._fpsArr = this._fpsArr.splice(-this.monitorWidth / 3);
            this._startTime = time;
            this._frame = 0;
        }
    }

    bytesToSize(bytes, nFractDigit) {
        if (bytes == 0) return 'n/a';
        let sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        nFractDigit = nFractDigit !== undefined ? nFractDigit : 0;
        let precision = Math.pow(10, nFractDigit);
        let i = Math.floor(Math.log(bytes) / Math.log(1024));
        return Math.round(bytes * precision / Math.pow(1024, i)) / precision + ' ' + sizes[i];
    }

    _clearSecond() {
        this._second = performance.now();
        this.second = 0;
    }

    _down(e) {
        this.detail = {
            x: e.clientX - this.translateX,
            y: e.clientY - this.translateY
        };
    }
    _up(e) {
        this.detail = undefined;
    }
    _move(e) {
        if (this.detail) {
            const x = this.translateX = e.clientX - this.detail.x;
            const y = this.translateY = e.clientY - this.detail.y;
            if (this.storeLocal) localStorage.setItem('monitor_translate', JSON.stringify({ x, y }));
        }
    }
});
