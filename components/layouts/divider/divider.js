ODA({ is: 'oda-divider', template: `
        <style>
            :host {
                position: relative;
                max-width: {{direction === 'vertical' ? (+this.size >= 0 ? this.size + 'px' : '1px') : '100%'}};
                max-height: {{direction === 'vertical' ? '100%' : (+this.size >= 0 ? this.size + 'px' : '1px')}};
             }
            .divider_vertical, .divider_horizontal { position: relative; z-index: 999; }
            .divider_vertical { cursor: ew-resize; }
            .divider_horizontal { cursor: ns-resize; }
            .divider_vertical::after, .divider_horizontal::after, .divider_vertical::before, .divider_horizontal::before {
                position: absolute;
                content: "";
                z-index: 999;
                background: black;
                opacity: 0;
            }
            .divider_vertical::after, .divider_vertical::before {  top: 0; bottom: 0; width: 6px;}
            .divider_vertical::after { left: 100%; }
            .divider_vertical::before { right: 100%; }
            .divider_horizontal::after, .divider_horizontal::before { left: 0; right: 0; height: 6px;}
            .divider_horizontal::after { top: 100%; }
            .divider_horizontal::before { bottom: 100%; }
        </style>
        <div ~class="direction === 'vertical' ? 'divider_vertical' : 'divider_horizontal'"
            ~style="{
                background: color || 'var(--border-color)',
                minWidth: direction === 'vertical' ? (+size >= 0 ? size + 'px' : '1px') : '100%',
                minHeight: direction === 'vertical' ? '100%' : (+size >= 0 ? size + 'px' : '1px')
            }"
        ></div>
    `,
    $public: {
        direction: {
            $def: 'vertical',
            $list: ['vertical', 'horizontal']
        },
        size: 1,
        color: 'var(--border-color)',
        resize: false,
        use_px: false,
        reverse: false,
        min: 0,
        max: 0
    },
    attached() {
        const splitter = this;
        let prevSibling, nextSibling;
        let x = 0, y = 0, h = 0, w = 0, prevSiblingHeight = 0, prevSiblingWidth = 0;
        const downHandler = (e) => {
            prevSibling = this.reverse ?  this.nextElementSibling : this.previousElementSibling;
            nextSibling = this.reverse ?  this.previousElementSibling : this.nextElementSibling;
            x = e.clientX;
            y = e.clientY;
            const rect = prevSibling?.getBoundingClientRect() || {};
            prevSiblingHeight = rect?.height || 0;
            prevSiblingWidth = rect?.width || 0;
            document.addEventListener('pointermove', this._moveHandler = this._moveHandler || moveHandler.bind(this));
            document.addEventListener('pointerup', this._upHandler = this._upHandler || upHandler.bind(this));
        }
        const moveHandler = (e) => {
            let dx = e.clientX - x;
            let dy = e.clientY - y;
            if (this.reverse) {
                dx = dx * -1;
                dy = dy * -1;
            }
            if (this.direction === 'vertical') {
                if (this.use_px) {
                    w = prevSiblingWidth + dx;
                    if (this.min >= 0 && w < this.min) w = this.min;
                    if (this.max > 0 && w > this.max) w = this.max;
                    if (prevSibling) prevSibling.style.width = `${w}px`;
                } else {
                    w = ((prevSiblingWidth + dx) * 100) / this.parentNode.getBoundingClientRect().width;
                    if (prevSibling) prevSibling.style.width = `${w}%`;
                }
            } else {
                if (this.resize) {
                    h = prevSiblingHeight + dy;
                    if (this.min >= 0 && h < this.min) h = this.min;
                    if (this.max > 0 && h > this.max) h = this.max;
                    this.parentNode.style.height = `${h}px`;
                } else {
                    if (this.use_px) {
                        h = prevSiblingHeight + dy;
                        if (this.min >= 0 && h < this.min) h = this.min;
                        if (this.max > 0 && h > this.max) h = this.max;
                        if (prevSibling) prevSibling.style.height = `${h}px`;
                    } else {
                        h = ((prevSiblingHeight + dy) * 100) / this.parentNode.getBoundingClientRect().height;
                        if (prevSibling) prevSibling.style.height = `${h}%`;
                    }
                }
            }
            const cursor = this.direction === 'vertical' ? 'col-resize' : 'row-resize';
            splitter.style.cursor = cursor;
            document.body.style.cursor = cursor;
            if (prevSibling) {
                prevSibling.style.userSelect = 'none';
                prevSibling.style.pointerEvents = 'none';
            }
            if (nextSibling) {
                nextSibling.style.userSelect = 'none';
                nextSibling.style.pointerEvents = 'none';
            }

            window.dispatchEvent(new Event('resize'));
            // this.fire('splitterMove', { direction: this.direction, h, w, id: this.id });
            this.fire('splitter-move', { direction: this.direction, h, w, id: this.id });
        }
        const upHandler = (e) => {
            splitter.style.removeProperty('cursor');
            document.body.style.removeProperty('cursor');
            if (prevSibling) {
                prevSibling.style.removeProperty('user-select');
                prevSibling.style.removeProperty('pointer-events');
            }
            if (nextSibling) {
                nextSibling.style.removeProperty('user-select');
                nextSibling.style.removeProperty('pointer-events');
            }
            document.removeEventListener('pointermove', this._moveHandler);
            document.removeEventListener('pointerup', this._upHandler);
            // this.fire('endSplitterMove', { direction: this.direction, resize: this.resize, w, h, id: this.id });
            this.fire('end-splitter-move', { direction: this.direction, resize: this.resize, w, h, id: this.id });
        }
        splitter.addEventListener('pointerdown', downHandler);
    }
})
