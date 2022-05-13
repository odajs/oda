ODA({ is: 'oda-splitter2', template: `
        <style>
            :host {
                height: {{direction === 'vertical' ? '100%' : (size ? size + 'px' : '2px')}};
                min-height: {{(size ? size + 'px' : '2px')}};
                width: {{direction === 'vertical' ? (size ? size + 'px' : '2px') : '100%'}};
                min-width: {{(size ? size + 'px' : '2px')}};
                cursor: {{direction === 'vertical' ? 'ew-resize' : 'ns-resize'}};
                background-color: {{color || 'lightgray'}};
                z-index: 11;
            }
            :host(:hover) {
                filter: brightness(90%);
            }
        </style>
    `,
    props: {
        direction: 'vertical', // 'horizontal'
        size: 2,
        color: 'lightgray',
        resize: false,
        use_px: false,
        reverse: false
    },
    attached() {
        const splitter = this,
            prevSibling = this.reverse ?  this.nextElementSibling : this.previousElementSibling,
            nextSibling = this.reverse ?  this.previousElementSibling : this.nextElementSibling;
        let x = 0, y = 0, prevSiblingHeight = 0, prevSiblingWidth = 0, h = 0, w = 0;

        const downHandler = (e) => {
            x = e.clientX;
            y = e.clientY;
            const rect = prevSibling.getBoundingClientRect();
            prevSiblingHeight = rect.height;
            prevSiblingWidth = rect.width;
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
                    prevSibling.style.width = `${w}px`;
                } else {
                    w = ((prevSiblingWidth + dx) * 100) / this.parentNode.getBoundingClientRect().width;
                    prevSibling.style.width = `${w}%`;
                }
            } else {
                if (this.resize) {
                    h = prevSiblingHeight + dy;
                    this.parentNode.style.height = `${h}px`;
                } else {
                    if (this.use_px) {
                        h = prevSiblingHeight + dy;
                        prevSibling.style.height = `${h}px`;
                    } else {
                        h = ((prevSiblingHeight + dy) * 100) / this.parentNode.getBoundingClientRect().height;
                        prevSibling.style.height = `${h}%`;
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

            this.fire('endSplitterMove', { direction: this.direction, resize: this.resize, w, h });
        }
        splitter.addEventListener('pointerdown', downHandler);
    }
})
