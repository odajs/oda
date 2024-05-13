ODA({is: 'oda-popup-form',
    template: `
        <style>
            .main::-webkit-scrollbar { width: 0px; height: 0px; }
            :host {
                position: absolute;
                left: {{(popLeft || 0) + 'px'}};
                top: {{(popTop || 0) + 'px'}};
                width: {{(popWidth || 240) + 'px'}};
                height: {{(popHeight || 120) + 'px'}};
                min-width: {{(popMinWidth || 120) + 'px'}};
                min-height: {{(popMinHeight || 60) + 'px'}};
                background: {{back || 'white'}};
                z-index: {{zIdx || 1000000}};
                border: 1px solid gray;
                border-radius: 4px;
                overflow: hidden;
            }
            .to-move {
                position: absolute;
                top: 0px;
                left: 0px;
                height: 30px;
                width: 100%;
                cursor: pointer;
                z-index: 1000001;
                border-bottom: 1px solid lightgray;
            }
            .resize {
                position: absolute;
                z-index: 1000002;
                touch-action: none;
                /* border: 1px solid red; */
            }
            #tl { height: 6px; width: 6px; top: 0; left: 0; cursor: nwse-resize }
            #t { height: 6px; top: 0; left: 6px; right: 6px; cursor: ns-resize }
            #tr { height: 6px; width: 6px; top: 0; right: 0; cursor: nesw-resize }
            #l { width: 6px; top: 6px; left: 0; bottom: 6px; cursor: ew-resize }
            #r { width: 6px; top: 6px; right: 0; bottom: 6px; cursor: ew-resize }
            #br { height: 6px; width: 6px; bottom: 0; right: 0; cursor: nwse-resize }
            #b { height: 6px; bottom: 0; left: 6px; right: 6px; cursor: ns-resize }
            #bl { height: 6px; width: 6px; bottom: 0; left: 0; cursor: nesw-resize }
        </style>
        <div class="top-panel to-move" @pointerdown="_down($event, 'move')"></div>
        <div @pointerdown.stop style="background: #fcfcfc; height: 100%;">
            <div id="tl" class="resize" @pointerdown="_down($event, 'resize')"></div>
            <div id="t"  class="resize" @pointerdown="_down($event, 'resize')"></div>
            <div id="tr" class="resize" @pointerdown="_down($event, 'resize')"></div>
            <div id="l"  class="resize" @pointerdown="_down($event, 'resize')"></div>
            <div id="r"  class="resize" @pointerdown="_down($event, 'resize')"></div>
            <div id="br" class="resize" @pointerdown="_down($event, 'resize')"></div>
            <div id="b"  class="resize" @pointerdown="_down($event, 'resize')"></div>
            <div id="bl" class="resize" @pointerdown="_down($event, 'resize')"></div>
            <div style="position: absolute; top: 31px; left: 0; right: 0; bottom: 0">
                <slot name="popup-main"></slot>
            </div>
        </div>
    `,
    popLeft: { $def: 0, $save: true },
    popTop: { $def: 0, $save: true },
    popWidth: { $def: 240, $save: true },
    popHeight: { $def: 120, $save: true },
    popMinWidth: { $def: 120, $save: true },
    popMinHeight: { $def: 60, $save: true },
    back: { $def: '', $save: true },
    zIdx: { $def: 1000000, $save: true },
    attached() {
        this.__move = this._move.bind(this);
        this.__up = this._up.bind(this);
    },
    _down(e, action) {
        this.action = action;
        this._actionId = e.target.id;
        this._lastX = e.pageX;
        this._lastY = e.pageY;
        document.documentElement.addEventListener("pointermove", this.__move, false);
        document.documentElement.addEventListener("pointerup", this.__up, false);
        document.documentElement.addEventListener("pointercancel", this.__up, false);
    },
    _move(e) {
        const movX = e.pageX - this._lastX,
            movY = e.pageY - this._lastY;
        this._lastX = e.pageX;
        this._lastY = e.pageY;
        if (this.action === 'move') {
            this.popLeft += movX;
            this.popTop += movY;
        }
        if (this.action === 'resize') {
            let x = movX, y = movY, w = this.popWidth, h = this.popHeight, l = this.popLeft, t = this.popTop;
            const move = {
                tl: () => { w = w - x; h = h - y; l += x; t += y; },
                t: () => { h = h - y; t += y; },
                tr: () => { w = w + x; h = h - y; t += y; },
                l: () => { w = w - x; l += x; },
                r: () => { w = w + x; },
                bl: () => { w = w - x; h = h + y; l += x; },
                b: () => { h = h + y; },
                br: () => { w = w + x; h = h + y; },
            }
            move[this._actionId]();
            this.popWidth = w; this.popHeight = h; this.popLeft = l; this.popTop = t;
        }
    },
    _up() {
        document.documentElement.removeEventListener("pointermove", this.__move, false);
        document.documentElement.removeEventListener("pointerup", this.__up, false);
        document.documentElement.removeEventListener("pointercancel", this.__up, false);
        if (!this.action) return;
        this.action = '';
        this.popLeft = Math.round(this.popLeft);
        this.popTop = Math.round(this.popTop);
        this.popWidth = Math.round(this.popWidth);
        this.popHeight = Math.round(this.popHeight);
    }
})
