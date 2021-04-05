ODA({
    is: 'oda-dropdown', template: /*html*/`
        <style>
            :host {
                pointer-events: none;
            }
            :host>.container{
                pointer-events: auto;
                overflow: hidden;
                z-index: 100;
                position: fixed;
                opacity: 0;
                transition: opacity 0.25s;
            }
        </style>
        <div class="shadow content border flex vertical container" @tap.stop="fire('ok')" tabindex="1" ref="container" ~show="_ready" ~style="_size">
            <slot @slotchange="_setSize(0)"></slot>
        </div>
    `,
    attached() {
        const windows = [...Array.prototype.map.call(window.top, w => w), window];
        if (window !== window.top) windows.push(window.top);
        windows.forEach( w =>{
            this.listen('resize', '_close', { target: w, useCapture: true });
            this.listen('wheel', '_close', { target: w, useCapture: true });
        });
    },
    detached() {
        const windows = [...Array.prototype.map.call(window.top, w => w), window];
        if (window !== window.top) windows.push(window.top);
        windows.forEach( w => {
            this.unlisten('resize', '_close', { target: w, useCapture: true });
            this.unlisten('wheel', '_close', { target: w, useCapture: true });
        });
    },
    props: {
        parent: { type: [HTMLElement, Object] },
        minWidth: 100,
        maxWidth: 0,
        maxHeight: 0,
        intersect: false,
        _size: null,
        _ready: false,
        useParentWidth: false
    },
    _setSize(repeat = 0) {
        requestAnimationFrame(() => {
            let size,
                container = this.$refs.container,
                containerSize = container.getBoundingClientRect();
            const rect = new ODARect(this.parent),
                h = containerSize.height,
                w = containerSize.width + container.scrollWidth,
                l = rect.left,
                t = this.intersect ? rect.top : rect.bottom,
                r = window.innerWidth - rect.left,
                b = window.innerHeight - t;
            size = {};
            size.minWidth = this.parent && this.parent.offsetWidth > this.minWidth ? this.parent.offsetWidth - 2 : this.minWidth || w;
            if (this.useParentWidth && this.parent) size.maxWidth = this.parent.offsetWidth - 2;
            else if (this.maxWidth) size.maxWidth = this.maxWidth > size.minWidth ? this.maxWidth : size.minWidth;
            if (this.maxHeight) size.maxHeight = this.maxHeight;
            if (b > h + 12) {
                size.maxHeight = b;
                size.top = t;
            } else {
                if (this.parent) {
                    if (h >= t && b >= t) {
                        size.top = t;
                        size.bottom = 0;
                    } else {
                        size.top = (rect.top - h < 2 ? 2 : rect.top - h);
                        size.maxHeight = rect.top - 4;
                    }
                } else {
                    size.bottom = 0;
                }
            }
            if (r > w + 12) {
                size.left = l;
            } else {
                if (this.parent && this.useParentWidth) {
                    size.left = l;
                } else {
                    size.right = 0;
                }
            }
            Object.keys(size).forEach(k => size[k] += 'px');
            this._size = { ...size };
            if (repeat === 1) {
                this._ready = true;
                this.debounce('set-opacity', () => {
                    this.$refs.container.style.setProperty('opacity', 1);
                }, 100);
            }
            else {
                this._setSize(++repeat);
            }
        });
    },
    _close(e) {
        let dd = this;
        while (dd) {
            if (dd.contains?.(e.target)) {
                if (e.type === 'resize' && this._offsetHeight !== e.target.offsetHeight) {
                    dd._setSize();
                    this._offsetHeight = e.target.offsetHeight;
                }
                return;
            }
            dd = dd.nextElementSibling;
        }
        this.fire('cancel');
    }
});