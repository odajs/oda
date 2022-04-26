let _mapParents;
ODA({is: 'oda-dropdown', imports: '@oda/title, @tools/modal',
    template: /*html*/`
        <style>
            :host {
                pointer-events: {{pointerEvents}};
                z-index: 100;
                transition: background-color 5s;
            }
            :host([is-ready]){
                background-color: rgba(0,0,0,.1);
            }
            :host>div{
                visibility: hidden;
                pointer-events: auto;
                position: fixed;
                overflow: hidden;
            }
            :host([is-ready]) div{
                visibility: visible;
                overflow: hidden;
            }
        </style>
        <div class="vertical shadow content" ~style="_style" id="main">
            <div @resize="setSize" class="vertical flex">
                <oda-title ~if="title" allow-close :icon :title @pointerdown="_pointerdown($event, this)">
                    <div slot="title-left">
                        <slot class="no-flex" name="dropdown-title"></slot>
                    </div>
                </oda-title>
                <div class="flex vertical">
                    <slot @slotchange="onSlot"></slot>
                </div>
            </div>
        </div>
    `,
    onSlot(e) {
        this.controls = e.target.assignedNodes();
        if (this.focused && this.controls?.length) {
            this.controls[0].setAttribute('tabindex', 0);
            this.controls[0].setAttribute('autofocus', true);
            // this.async(() => {
                this.controls?.[0]?.focus();
            // }, 100);
        }
    },
    controls: undefined,
    attached() {
        if (this.parent) {
            _mapParents ||= new Map();
            const show = _mapParents.get(this.parent);
            if (show) {
                this.fire('cancel');
            }
            _mapParents = new Map();
            this.async(() => {
                const dd = document.body.getElementsByTagName('oda-dropdown');
                if (dd.length) {
                    for (let i = 0; i < dd.length; i++) {
                        const elm = dd[i];
                        _mapParents.set(elm.parent, true);
                    }
                }
            }, 50)
        }
        this.setListen();
    },
    setListen() {
        let win = window;
        this.windows = [];
        while (win.window !== win) {
            this.windows.push(win)
            win = win.window;
        }
        this.windows.push(win);
        this.async(() => {
            this.windows.forEach(w => {
                this.listen('scroll', '_close', { target: w, useCapture: true });
                this.listen('resize', '_close', { target: w, useCapture: true });
                this.listen('pointerdown', '_close', { target: w, useCapture: true });
            });
        }, 500)
    },
    detached() {
        this.windows.forEach(w => {
            this.unlisten('pointerdown', '_close', { target: w, useCapture: true });
            this.unlisten('resize', '_close', { target: w, useCapture: true });
            this.unlisten('scroll', '_close', { target: w, useCapture: true });
        });
    },
    resolveEvent: 'ok',
    observers: [
        function setEvent(controls, resolveEvent) {
            for (let el of controls) {
                this.listen(resolveEvent, (e) => {
                    this.fire('ok');
                }, { target: el })

            }
        }
    ],
    listeners: {
        pointerleave: function cancel() {
             if (this.cancelAfterLeave) this.fire('cancel');
        },
        'pointerdown': '_pointerdown'
    },
    _pointerdown(e, d) {
        e.stopPropagation();
        e.preventDefault();
        let parent = d || e.target.parentElement;
        if (parent?.localName !== 'oda-dropdown') return;
        let idx = 0;
        const dd = document.body.getElementsByTagName('oda-dropdown');
        if (dd.length) {
            for (let i = 0; i < dd.length; i++)
                if (dd[i] === parent)
                    idx = i;
            for (let i = 0; i < dd.length; i++) {
                const elm = dd[i];
                if (i > idx)
                    elm.fire('cancel');
            }
        }
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
        minHeight: 0,
        isReady: {
            default: false,
            reflectToAttribute: true,
        },
        cancelAfterLeave: false,
        pointerEvents: 'unset'
    },
    contentRect: null,
    get _style() {
        const rect = new ODARect(this.parent);
        // this.contentRect = this.control?.getBoundingClientRect()
        // this.contentRect = e.target.getBoundingClientRect();
        let height = this.contentRect?.height || 0;
        let width = this.contentRect?.width || 0;
        let winWidth = window.innerWidth;
        let winHeight = window.innerHeight;
        let top = this.align === 'modal' ? winHeight / 2 - height / 2 : rect.top;
        let left = this.align === 'modal' ? winWidth / 2 - width / 2 : rect.left
        if (!height || !width)
            return { top: top + 'px', left: left + 'px' };
        let maxHeight = winHeight;
        let maxWidth = winWidth;
        let minHeight = height || this.minHeight;
        let minWidth = width || this.minWidth;
        let right = left + width;
        let bottom = top + height;

        let parentWidth = rect.width;
        if (rect.right > winWidth)
            parentWidth += winWidth - rect.right;
        if (rect.left < 0)
            parentWidth += rect.left;
        let size = {};
        this._steps = this._steps || [];
        this.align = ['left', 'right', 'top', 'bottom', 'modal'].includes(this.align) ? this.align : 'bottom';
        switch (this.align) {
            case 'left': {
                right = this.intersect ? rect.right : rect.left;
                left = right - width;
                if (this.parent) {
                    if (left < 0) {
                        this.align = this._steps.includes('right') ? 'bottom' : 'right';
                        this._steps.push('left');
                        return undefined;
                    }
                }
            } break;
            case 'right': {
                left = this.intersect ? rect.left : rect.right;
                right = left + width;
                if (this.parent) {
                    if (right > winWidth) {
                        this.align = this._steps.includes('left') ? 'bottom' : 'left';
                        this._steps.push('right');
                        return undefined;
                    }
                }
            } break;
            case 'top': {
                bottom = this.intersect ? rect.bottom : rect.top;
                top = bottom - height - (this.title ? 34 : 0);
                if (this.parent) {
                    top = top < 0 ? 0 : top;
                    maxHeight = bottom - top;
                    if (height > maxHeight && winHeight - rect.bottom > rect.top) {
                        this.align = this._steps.includes('bottom') ? 'top' : 'bottom';
                        if (this.align === 'bottom') {
                            this._steps.push('top');
                            return undefined;
                        }
                    }
                }
            } break;
            case 'bottom': {
                top = this.intersect ? rect.top : rect.bottom;
                bottom = top + height + (this.title ? 34 : 0);
                if (this.parent) {
                    top = top < 0 ? 0 : top;
                    maxHeight = winHeight - top;
                    if (height > maxHeight && rect.top > winHeight - rect.bottom) {
                        this.align = this._steps.includes('top') ? 'bottom' : 'top';
                        if (this.align === 'top') {
                            this._steps.push('bottom');
                            return undefined;
                        }
                    }
                }
            } break;
        }

        if (!this.parent) {
            top = top < 0 ? 0 : top;
            left = left < 0 ? 0 : left;
            if (bottom > winHeight) size.bottom = 0
            if (right > winWidth) size.right = 0;
        } else {
            if (this.align === 'left' || this.align === 'right') {
                if (this.useParentWidth) minWidth = maxWidth = parentWidth;
                if ((height && top) > winHeight - top) {
                    top = rect.bottom - height;
                    top = top < 0 ? 0 : top;
                    maxHeight = winHeight - top;
                } else if (bottom >= winHeight) size.bottom = 0;
            } else if (this.align === 'top' || this.align === 'bottom') {
                if (this.useParentWidth) minWidth = maxWidth = parentWidth;
                else {
                    if (width < parentWidth) minWidth = parentWidth;
                    if (right > winWidth) size.right = 0;
                }
                left = left < 0 ? 0 : left;
                if (bottom > winHeight) size.bottom = 0;
            }
        }
        minWidth = minWidth > maxWidth ? maxWidth : minWidth;
        minHeight = minHeight > maxHeight ? maxHeight : minHeight;

        size = { ...size, ...{ maxWidth, minWidth, minHeight, maxHeight } };
        if (!size.hasOwnProperty('bottom')) size.top = top;
        if (!size.hasOwnProperty('right')) size.left = left;
        Object.keys(size).forEach(k => size[k] += 'px');
        this._steps = [];

        this.async(() => {
            const main = this.$('#main');
            if (main.style.bottom === '0px')
                main.style.top = 'unset';
            if (main.style.right === '0px')
                main.style.left = 'unset';
        }, 10)
        return size;
    },
    get control(){
        return this.controls?.[0];
    },
    setSize(e) {
        this['#_style'] = undefined;
        this.contentRect = this.control.getBoundingClientRect();
        this.interval('set-size', () => {
            this.isReady = true;
        })
    },
    _close(e) {
        if (this.windows.some(w => e.target instanceof w.Node)) {
            let dd = this;
            while (e?.target && dd) {
                if (dd.contains?.(e.target))
                    return;
                dd = dd.nextElementSibling;
            }
        }
        this.windows.map(i => {
            if (i === e.target)
                this.fire('cancel');
        }) 
    }
});
