ODA({is: 'oda-splitter', template: /*html*/`
    <style>
        :host([align=vertical]){
            width: 4px;
            cursor: col-resize;
            @apply --vertical;
            max-width: 4px;
            min-width: 4px;
        }
        :host([align=horizontal]){
            height: 4px;
            max-height: 4px;
            cursor: row-resize;
            @apply --horizontal;
        }
        :host(:active) {
            z-index: 1;
            pointer-events: none;
        }
        :host{
            @apply --dark;
            overflow: visible;
            opacity: .3;
            transition: background-color .4s;
            align-items: center;
            justify-content: center;
        }
        :host(:hover){
            opacity: 1;
            z-index: 1;
        }
    </style>
    `,
    props: {
        max: {
            default: 0,
            reflectToAttribute: true
        },
        align: {
            default: 'vertical',
            reflectToAttribute: true,
            list: ['horizontal', 'vertical'],
        },
        sign: 0,
        reverse: false,
        width: {
            type: Number,
            set(n){
                if (this.max && n>this.max)
                    this.width = this.max;
            }
        },
        height: Number
    },
    listeners: {
        track: '_onTrack',
        pointerdown(e){
            this._mover = this.create('oda-splitter-mover', {align: this.align });
            document.body.appendChild(this._mover);
        }
    },
    attached(){
        if (this.parentElement){
            this.sign = Array.from(this.parentElement.children).indexOf(this)?-1:1;
        }
    },
    _onTrack(e, d) {
        switch (d.state) {
            case 'start': {
                this._mover.pos = d;
            } break;
            case 'end': {
                this._mover?.remove();
                switch (this.align) {
                    case 'horizontal': {
                        this.parentElement.style.height = this.parentElement.offsetHeight - d.dy * this.sign + 'px';

                    } break;
                    default: {
                        this.parentElement.style.width = this.parentElement.offsetWidth - d.dx * this.sign + 'px';
                    } break;
                }
                this.width = Math.max(0, this.width - (d.dx * this.sign));
                this.height = Math.max(0, this.height - (d.dy * this.sign));
                this.fire('split', { dx: d.dx * this.sign, dy: d.dy * this.sign });
                this.async(()=>{
                    const event = document.createEvent('Event');
                    event.initEvent('resize', true, true);
                    window.dispatchEvent(event);
                });

            } break;
            case 'track': {
                switch (this.align) {
                    case 'horizontal': {
                        if (d.y > 0 && d.y < window.innerHeight) {
                            this._mover.pos = d;
                            this._mover.tracked = true;
                        }
                    } break;
                    default: {
                        if (d.x > 0 && d.x < window.innerWidth) {
                            this._mover.pos = d;
                            this._mover.tracked = true;
                        }
                    } break;
                }
            } break;
        }
    }
});

ODA({ is: 'oda-splitter-mover', template: /*html*/`
    <style>
        :host{
            position: fixed;
            width: 100%;
            height: 100%;
            animation: fadin 5s ease-in-out;
            background-color: rgba(0, 0, 0, 0.4);
            z-index: 1000;
        }
        :host div{
            position: absolute;
            z-index: 1001;
            @apply --header;
        }
        @keyframes fadin {
            from {background-color: rgba(0, 0, 0, 0)}
            to {background-color: rgba(0, 0, 0, 0.4)}
        }
    </style>
    <div class="border" ~style="_getStyle(pos)"></div>
    `,
    align: '',
    pos: null,
    _getStyle(e) {
        if (e) {
            switch (this.align) {
                case 'vertical':
                    return `left:${(e.x - 2)}px; height: 100%; width: 2px; cursor: col-resize;`;
                case 'horizontal':
                    return `top:${(e.y - 2)}px; height: 2px; width: 100%; cursor: row-resize;`;
            }
        }
    }
});

