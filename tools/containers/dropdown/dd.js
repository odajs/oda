ODA({
    is: 'oda-dropdown',
    imports: ['@oda/title'],
    template: /*html*/`
        <style>
            :host {
                pointer-events: none;
                opacity: 0;
                z-index: 100;
            }
            :host>div{
                pointer-events: auto;
                overflow: hidden;
                z-index: 100;
                position: fixed;
            }
            :host([ready]){
                transition: opacity 0.2s;
                opacity: 1 !important;
            }
        </style>
        <div class="shadow vertical content" @tap.stop="fire('ok')" tabindex="1" @resize="setSize" ~style="_style" style="overflow:auto">
            <oda-title ~if="title" allow-close :icon :title style="position:relative"></oda-title>
            <slot></slot>
        </div>

    `,
    attached() {
        // this.removeAttribute('ready');
        const windows = [...Array.prototype.map.call(window.top, w => w), window];
        if (window !== window.top) windows.push(window.top);
        windows.forEach(w => {
            this.listen('resize', '_close', { target: w, useCapture: true });
            this.listen('wheel', '_close', { target: w, useCapture: true });
        });
    },
    detached() {
        const windows = [...Array.prototype.map.call(window.top, w => w), window];
        if (window !== window.top) windows.push(window.top);
        windows.forEach(w => {
            this.unlisten('resize', '_close', { target: w, useCapture: true });
            this.unlisten('wheel', '_close', { target: w, useCapture: true });
        });
    },
    props: {
        parent: { type: [HTMLElement, Object] },
        intersect: false,
        align: {
            default: 'bottom',
            list: ['bottom', 'top', 'left', 'right']
        },
        useParentWidth: false,
        title: '',
        icon: '',
        iconSize: 24,
        minWidth: 100,
        minHeight: 0
    },
    contentRect: null,
    get _style() {
        if (!this.contentRect) return null;
        let winWidth = window.top.innerWidth;
        let winHeight = window.top.innerHeight;
        let height = this.contentRect.height;
        let width = this.contentRect.width;
        let maxHeight = winHeight > height ? height : winHeight;
        let maxWidth = +(this.useParentWidth && this.parent?.offsetWidth) || winWidth > width ? width : winWidth;
        let minHeight = +this.parent?.offsetHeight || this.minHeight;
        let minWidth = +this.parent?.offsetWidth || this.minWidth;
        const rect = new ODARect(this.parent);
        let top = rect.top;
        let left = rect.left
        let right = left + width;
        let bottom = top + height;
        let shift = 32;
        switch (this.align) {
            case 'top': {
                bottom = this.intersect ? rect.bottom : rect.top;
                top = bottom - height;
                if (this.parent) {
                    if (bottom > height / 2 - shift) {
                        top = top < 0 ? 0 : top;
                    } else {
                        top = !this.intersect ? rect.bottom : rect.top;
                        bottom = top + height;
                        bottom = bottom > winHeight ? winHeight : bottom;
                    }
                    maxHeight = bottom - top;
                    minHeight = minHeight < maxHeight ? minHeight : maxHeight;
                } else if (top < 0) {
                    top = 0;
                    maxHeight = winHeight;
                }
            } break;
            case 'bottom':
            default: {
                top = this.intersect ? rect.top : rect.bottom;
                bottom = top + height;
                if (this.parent) {
                    if (winHeight - top > height / 2 - shift) {
                        bottom = bottom > winHeight ? winHeight : bottom;
                        maxHeight = winHeight - top;
                    } else {
                        bottom = this.intersect ? rect.bottom : rect.top;
                        top = bottom - height;
                        if (top < 0) {
                            top = 0;
                            maxHeight = bottom;
                        }
                    }
                    minHeight = minHeight < maxHeight ? minHeight : maxHeight;
                } else if (bottom > winHeight) {
                    bottom = winHeight;
                    top = bottom - height;
                    if (top < 0) {
                        top = 0;
                        maxHeight = winHeight;
                    }
                }
            } break;
            case 'left': {
                right = this.intersect ? rect.right : rect.left;
                left = right - width;
                if (left < 0) {
                    left = 0;
                    right = width;
                }
                if (bottom > winHeight) {
                    top -= bottom - winHeight;
                    if (top < 0) {
                        top = 0;
                        maxHeight = winHeight;
                    }
                }
                if (this.parent && right > rect.left) {
                    left = !this.intersect ? rect.right : rect.left;
                    right = left + width;
                }
            } break;
            case 'right': {
                left = this.intersect ? rect.left : rect.right;
                right = left + width;
                if (right > winWidth) {
                    right = winWidth;
                    left = winWidth - width;
                }
                if (right > winWidth) {
                    left = right - winWidth;
                    right = winWidth;
                    if (left < 0)
                        left = 0;
                }
                if (bottom > winHeight) {
                    top -= bottom - winHeight;
                    if (top < 0) {
                        top = 0;
                        maxHeight = winHeight;
                    }
                }
                if (this.parent && winWidth - rect.right < width) {
                    right = !this.intersect ? rect.left : rect.right;
                    left = right - width;
                }
            } break;
        }

        if (left < 0) {
            left = 0;
            right = witdth;
            if (right > winWidth) right = winWidth;
        }
        if (right > winWidth) {
            right = winWidth;
            left = winWidth - width;
            if (left < 0) left = 0;
        }


        const size = { top, left, right, bottom, width, height, maxHeight, minHeight, maxWidth, minWidth };
        Object.keys(size).forEach(k => size[k] += 'px');
        return size;
    },
    setSize(e) {
        this.removeAttribute('ready');
        this.contentRect = e.target.getBoundingClientRect();
        this.async(() => {
            this.setAttribute('ready', '');
            this.render();
        })
    },
    _close(e) {
        if (e.target instanceof Node) {
            let dd = this;
            while (e?.target && dd) {
                try {
                    if (dd.contains?.(e.target))
                        return;
                    dd = dd.nextElementSibling;
                }
                catch (ev) {
                    console.error(ev)
                    break;
                }
            }
        }
        this.fire('cancel');
    }
});
