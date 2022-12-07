const path = import.meta.url.split('/').slice(0, -1).join('/');
const parser = new DOMParser();
ODA({is: 'oda-icon',
    template: /*html*/`
        <style>
            :host {
                will-change: transform;
                @apply --horizontal;
                @apply --no-flex;
                display: flex;
                align-items: center;
                position: relative;
            }
            :host > div[bubble]::before{
                content: attr(bubble);
                position: absolute;
                top: -0px;
                right: -2px;
                width: 40%;
                height: 40%;
                text-align: center;
                font-weight: bold;
                background-color: red;
                color: white;
                border: 1px solid purple;
                border-radius: 50%;
                padding: 1px;
                font-size: {{iconSize/3}}px;
                z-index: 1;
                writing-mode: initial;
                transform: rotate({{rotate}}deg);
            }
            :host > div {
                position: relative;
            }
            .subicon {
                padding: {{iconSize/16}}px;
                position: absolute;
                left: {{iconSize/2}}px;
                border-radius: {{iconSize/16}}px;
                @apply --content;
                @apply --raised;
                margin: {{getComputedStyle(this)['padding']?.toString() || 'unset'}};
                bottom: 0px;
            }
            svg {
                pointer-events: none;
                top: 0px;
                left: 0px;
                position: absolute;
                fill: {{fill || 'unset'}};
                will-change: transform;
            }
        </style>
        <div :bubble="bubble>0?(bubble>9?'9+':bubble):''" class="icon no-flex" ~style="_style">
            <svg ~style="_svgStyle" :stroke :view-box="">
                <defs ~if="blink">
                    <g is="style" type="text/css">
                        @keyframes blinker { 100% { opacity: 0; } }
                        g { animation: {{blink}}ms ease blinker infinite; }
                    </g>
                </defs>
                <g ~html="_icon?.body"></g>
            </svg>
        </div>
        <oda-icon class="subicon" ~if="subIcon"  ~show="!!sub?._icon" :icon="subIcon" :icon-size="iconSize/3"></oda-icon>
    `,
    get viewBox(){
        const size = this._icon?.size || 0;
        return  `0 0 ${size} ${size}`;
    },
    get _style(){
        const w = this.iconSize+'px';
        return {minWidth: w, minHeight: w, height: w, width: w};
    },
    get sub(){
        return this.$('.subicon');
    },
    get _icon() {
        return this._obj?.body || this._def?.body;
    },
    get _rotate() {
        let n = this.icon;
        if (/:[0-9]+$/.test(n)) {
            let s = n.match(/:[0-9]+$/)[0];
            return +s.substring(1);
        }
        return 0;
    },
    get _obj() {
        if (this.icon) {
            let obj = icons[this.icon] ??= loadIcon.call(this, this.icon);
            if (obj?.then) {
                obj.then(res => {
                    return (this._obj = res);
                }).catch(e => {
                    console.log(e)
                    return (this._obj = {});
                })
                // obj = null;
            }
            return obj;
        }
    },
    get _def() {
        if (this.default) {
            let obj = icons[this.default] ??= loadIcon.call(this, this.default);
            if (obj?.then) {
                obj.then(res => {
                    return (this._def = res);
                }).catch(e => {
                    console.log(e)
                    return (this._def = {});
                })
                // obj = null;
            }
            return obj;
        }
    },
    props: {
        default: '',
        bubble: {
            type: Number,
            reflectToAttribute: true
        },
        rotate: 0,
        icon: '',
        iconSize: 24,
        stroke: '',
        fill: '',
        blink: 0,
        subIcon: '',
    },
    get _svgStyle() {
        const s = this.iconSize + 'px';
        const obj = { width: s, height: s, minHeight: s };
        const r = this.rotate + (this._rotate || 0);

        obj.transform = `rotate(${r || 0}deg)`;

        obj.backgroundRepeat = 'unset';
        obj.backgroundSize = 'unset';
        obj.backgroundImage = 'unset';
        obj.backgroundPosition = 'unset';

        if (typeof this._icon === 'string') {
            obj.backgroundImage = `url("${this._icon}")`;
            obj.backgroundRepeat = 'no-repeat';
            obj.backgroundSize = 'contain';
            obj.backgroundPosition = 'center';
        }
        return obj;
    }
});
function loadIcon(n){
    if (/:[0-9]+$/.test(n)) {
        let s = n.match(/:[0-9]+$/)[0];
        n = n.replace(s, '');
    }
    let object = icons[n] ??= new Promise((resolve, reject)=>{
        resolves[n] = resolve;
        worker.postMessage(n);
        return icons[n];
    })
    return object;
}
const resolves = {};
const icons = {};
let worker = new SharedWorker(path+'/icon-ww.js');
worker = worker.port || worker;
worker.start?.();
worker.onmessage = function (e){
    switch (e.data?.type){
        case 'svg':{
            const dom = parser.parseFromString(e.data.doc, 'text/html');
            const template = dom.querySelector('template');
            const size = +template.getAttribute('size') || 0
            e.data.svg = Array.prototype.reduce.call(template.content.children, (res, i)=>{
                res[i.id] = {body: {body: i.outerHTML, size: (+i.getAttribute('size') || size)}};
                return res
            }, {})
            worker.postMessage(e.data);
        } break;
        case 'request':{
            worker.postMessage(e.data.icon);
        } break;
        default:{
            icons[e.data.icon] = e.data;
            resolves[e.data.icon]?.(e.data);
            delete resolves[e.data.icon];
        } break;
    }
}
worker.onmessageerror = function (e) {
    console.error(e);
}
worker.postMessage({type: 'init', url: ODA.rootPath})