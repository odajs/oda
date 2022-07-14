ODA({ is: 'oda-dropdown', imports: '@oda/title',
    template: /*html*/`
        <style>
            @keyframes fadin {
                from {background-color: rgba(0, 0, 0, 0)}
                to {background-color: rgba(0, 0, 0, 0.4)}
            }
            :host {
                pointer-events: none;
                z-index: 1000;
 
            }
            :host([fadein]){
                animation: fadin 5s ease-in-out;
                background-color: rgba(0, 0, 0, 0.4);
            }
            :host>div{
                pointer-events: auto;
                position: fixed;
                overflow: hidden;
            }
            oda-title {
                min-height: 34px;
                max-height: 34px;
            }
        </style>
        <div class="vertical shadow content" ~style="_style">
            <div @resize="setSize" class="vertical flex" style="overflow: hidden">
                <oda-title ~if="title" allow-close :icon :title>
                    <div slot="title-left">
                        <slot class="no-flex" name="dropdown-title"></slot>
                    </div>
                </oda-title>
                <div class="flex vertical" style="overflow: auto;">
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
            this.controls?.[0]?.focus();
        }
    },
    controls: undefined,
    // attached() {
    //     this.windows = this.getWindows();
    //     this.async(() => {
    //         this.windows.forEach(w => {
    //             w.addEventListener('mousedown', this.__closeHandler);
    //             w.addEventListener('pointerdown', this.__closeHandler);
    //             w.addEventListener('resize', this.__closeHandler);
    //         });
    //     }, 500)
    // },
    // getWindows(win = window, list = []){
    //     do{
    //         list.add(win);
    //         win = win.window;
    //     } while (win !== win.window)
    //     return list;
    // },
    // get __closeHandler() {
    //     return this._close.bind(this);
    // },
    // detached() {
    //     this.windows.forEach(w => {
    //         w.removeEventListener('pointerdown', this.__closeHandler);
    //         w.removeEventListener('mousedown', this.__closeHandler);
    //         w.removeEventListener('resize', this.__closeHandler);
    //     });
    // },
    // resolveEvent: 'ok',
    // observers: [
    //     function setEvent(controls, resolveEvent) {
    //         for (let el of controls) {
    //             this.listen(resolveEvent, (e) => {
    //                 this.fire('ok');
    //             }, { target: el })
    //         }
    //     }
    // ],
    props: {
        fadein: {
            default: false,
            reflectToAttribute: true
        },
        parent: {
            type: [HTMLElement, Object],
            set(n) {
                if (n) {
                    n.addEventListener('resize', () => {
                        this.setSize();
                    })
                }
            }
        },
        intersect: false,
        cascade: false,
        align: {
            default: 'bottom',
            list: ['bottom', 'top', 'left', 'right', 'modal']
        },
        useParentWidth: false,
        title: '',
        icon: '',
        iconSize: 24,
        minWidth: 100,
        minHeight: 0,
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
        height = height + (this.title ? 34 : 0)
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
                top = bottom - height;
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
                bottom = top + height;
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

        top = top < 0 ? 0 : top;
        left = left < 0 ? 0 : left;
        if (bottom > winHeight) size.bottom = 0;
        if (right > winWidth) size.right = 0;

        if (this.parent && this.useParentWidth)
            minWidth = maxWidth = parentWidth;

        minWidth = minWidth > maxWidth ? maxWidth : minWidth;
        minHeight = minHeight > maxHeight ? maxHeight : minHeight;

        size = { ...size, ...{ maxWidth, minWidth, minHeight, maxHeight } };
        Object.keys(size).forEach(k => size[k] += 'px');
        size.top = size.hasOwnProperty('bottom') ? 'unset' : top + 'px';
        size.left = size.hasOwnProperty('right') ? 'unset' : left + 'px';
        this._steps = [];
        return size;
    },
    get control() {
        const ctrl = this.controls?.[0];
        ctrl?.addEventListener('resize', e => {
            // console.log('resize')
            this.setSize();
        })
        return ctrl;
    },
    setSize(e) {
        if (!this.control) return;
        this['#_style'] = undefined;
        this.contentRect = this.control.getBoundingClientRect();
    },
    // _close(event) {
    //     if (event?.path.includes(this.parent)) return;
    //     for (let element of event.path){
    //         if (!(element instanceof Node)) continue;
    //         if (this.contains(element)) return;
    //     }
    //     const dropDowns = [...document.body.querySelectorAll(this.localName)].reverse()
    //     for (const dd of dropDowns) {
    //         for (let element of event.path){
    //             if (!(element instanceof Node)) continue;
    //             if (dd.contains(element)) return;
    //         }
    //         dd.fire('cancel');
    //     }
    // }
})
