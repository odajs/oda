ODA({ is: "oda-scroll-box", template: `
    <style>
        :host::-webkit-scrollbar {
            width: 0 !important;
            height: 0 !important;
        }
        :host {
            --bar-size: 4px;

            overflow: auto;
            scrollbar-width: none;
            -ms-overflow-style: none;
            scrollbar-color: transparent transparent;
            flex: auto;
            position: relative;
        }
        :host(:not([vertical])) {
            @apply --horizontal;
            max-width: 100%;
        }
        :host([vertical]) {
            @apply --vertical;
            max-height: 100%;
        }
        .scroll-bar {
            position: absolute;
            bottom: 0;
            left: 0;
            height: var(--bar-size);
            width: 100%;
            background: #333;
            opacity: 0;
            transition: opacity .3s;
        }
        :host([vertical]) .scroll-bar {
            left: unset;
            right: 0;
            height: 100%;
            width: var(--bar-size);
        }
    </style>
    <div class="scroll-bar" :style="{
            background: \`linear-gradient(to \${vertical ? 'bottom' : 'right'}, \${_barColor} \${_scroll}%, \${_scrollColor} 0%, \${_scrollColor} \${_scroll + _scrollSize}%, \${_barColor} 0%)\`,
            left: vertical ? 'unset' : _scrollPx + 'px',
            top: vertical ? _scrollPx + 'px' : 'unset',
            opacity: _isScrolling ? '.7' : '0',
        }"></div>
    <slot></slot>`,
    props: {
        vertical: {
            type: Boolean,
            reflectToAttribute: true,
        },
        _timer: Number,
        _isScrolling: false,
        _scrollSize: 0,
        _scroll: 0,
        _scrollPx: 0,
        _barColor: '#aaa',
        _scrollColor: '#333',
    },
    listeners: {
        wheel(e) {
            e.stopPropagation();
            e.preventDefault();

            this._isScrolling = true;

            const d = this.vertical ? (e.deltaY || e.deltaX) : (e.deltaX || e.deltaY);
            this.scrollBy(d * Number(!this.vertical), d * Number(this.vertical));

            let scroll = 0;
            let size = 0;
            let visible = 0;

            if (this.vertical) {
                scroll = this.scrollTop;
                size = this.scrollHeight;
                visible = this.clientHeight;
            } else {
                scroll = this.scrollLeft;
                size = this.scrollWidth;
                visible = this.clientWidth;
            }

            this._scrollPx = scroll;
            this._scroll = Math.ceil(scroll / size * 100);
            this._scrollSize = Math.max(5, Math.ceil(visible / size * 100));

            clearTimeout(this._timer);
            this._timer = setTimeout(() => {
                this._isScrolling = false;
            }, 300);
        },
    }
});