const path = import.meta.url.split('/').slice(0, -1).join('/');
const DEF_ICON_SIZE = 24;
ODA({is: 'oda-icon',
    template: /*html*/`
        <style>
            :host {
                @apply --horizontal;
                @apply --no-flex;
                align-items: center;
                position: relative;
            }
            :host > div {
                position: relative;
            }
            .subicon {
                position: absolute;
                @apply --content;
                @apply --raised;
                bottom: 0px;
            }
            svg {
                pointer-events: none;
                top: 0px;
                left: 0px;
                position: absolute;

                .text-icon{
                    color: {{fill}};
                    font-size: 600%;
                    font-weight: bold;
                }
            }
        </style>
        <div is="style" ~if="bubble">
            :host > div[bubble]::before {
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
                pointer-events: none;
            }
        </div>
        <div
            :bubble="bubble>0?(bubble>9?'9+':bubble):''"
            class="icon no-flex"
            ~style="_style"
        >
            <svg
                ~style="_svgStyle"
                :stroke
                :view-box
                :fill
            >
                <defs ~if="blink">
                    <g is="style" type="text/css">
                        @keyframes blinker { 100% { opacity: 0; } }
                        g { animation: {{blink}}ms ease blinker infinite; }
                    </g>
                </defs>
                <g ~html="_body?.body"></g>
            </svg>
        </div>
        <oda-icon
            :title="subTitle"
            class="subicon"
            ~if="subIcon"
            :blink
            :icon="subIcon"
            :default="subDefault"
            :icon-size="iconSize/3"
            ~style="{borderRadius: iconSize/16 + 'px', padding: iconSize/16 + 'px', left: iconSize/2 + 'px', margin: getComputedStyle(this)['padding']?.toString() || 'unset'}"
        ></oda-icon>
    `,
    get viewBox() {
        const size = this._body?.size || 0;
        return `0 0 ${size} ${size}`;
    },
    get _style() {
        const w = (this.iconSize ?? DEF_ICON_SIZE) + 'px';
        return { minWidth: w, minHeight: w, height: w, width: w };
    },
    get _body() {
        return this._obj?.body || this._def?.body || null;
    },
    get _rotate() {
        let n = this._obj?.body?this.icon:this.default;
        if (/:[0-9]+$/.test(n)) {
            let s = n.match(/:[0-9]+$/)[0];
            return +s.substring(1);
        }
        return 0;
    },
    _obj: {
        $def: null,
        get() {
            if (this.icon) {
                let obj = icons[this._icon];
                if (obj === undefined) {
                    obj = icons[this._icon] = loadIcon.call(this, this._icon);
                }
                if (obj?.then)
                    return obj?.then?.(res => {
                        if (!res?.body)
                            throw new Error(res);
                        icons[res.icon] = res
                        return icons[this._icon];
                    }).catch(e => {
                        icons[e.icon] = null;
                        return icons[this._icon];
                    })
                return obj;
            }
            return null;
        }
    },
    _def: {
        $def: null,
        get() {
            if (this.default) {
                let obj = icons[this._default] ??= loadIcon.call(this, this._default);
                if (obj?.then)
                    return obj?.then?.(res => {
                        if (!res?.body)
                            throw new Error(res);
                        icons[res.icon] = res
                        return icons[this._default];
                    }).catch(e => {
                        icons[e.icon] = null;
                        return icons[this._default];
                    })
                return obj;
            }
            return null;
        }
    },
    $public: {
        subTitle: {
            $def: '',
            $attr: true
        },
        default: '',
        bubble: {
            $type: Number,
            $attr: true
        },
        rotate: 0,
        icon: {
            $def: '',
            $attr: true
        },
        iconSize: DEF_ICON_SIZE,
        stroke: '',
        fill: '',
        blink: 0,
        subIcon: '',
        subDefault: ''
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

        if (typeof this._body === 'string') {
            obj.backgroundImage = `url("${this._body}")`;
            obj.backgroundRepeat = 'no-repeat';
            obj.backgroundSize = 'contain';
            obj.backgroundPosition = 'center';
        }
        return obj;
    },
    extractIconName(icon){
        if (icon && /:[0-9]+$/.test(icon)) {
            let s = icon.match(/:[0-9]+$/)[0];
            icon = icon.replace(s, '');
        }
        return icon;
    },
    extractIconRotate(icon) {
        if (icon && /:[0-9]+$/.test(icon)) {
            let s = icon.match(/:[0-9]+$/)[0];
            return +s.substring(1);
        }
        return 0;
    },
    get _icon() {
        return this.extractIconName(this.icon);
    },
    get _default() {
        return this.extractIconName(this.default);
    }
});
function loadIcon(icon) { //todo сделать обобщение
    let object = new Promise((resolve, reject) => {
        if (icon.startsWith('@:')) {
            icons[icon] = { body: { body: `<text x="50%" y="55%" text-anchor="middle" dominant-baseline="middle" class="text-icon">${icon.substring(2).toUpperCase()}</text>`, size: 100 } };
            return resolve(icons[icon]);
        }
        resolves[icon] = (a) => {
            delete resolves[icon];
            if (a)
                resolve(a);
            else
                reject({icon})
            this.$render();
        }
        worker.postMessage(icon);
    })
    return object;
}
const resolves = {};
const icons = {};
let worker = new ODA.Worker(path + '/icon-ww.js');
worker.onmessage = async function (e) {
    switch (e.data?.type) {
        case 'svg': {
            await new Promise(resolve=>{
                const parser = new DOMParser();
                const dom = parser.parseFromString(e.data.doc, 'text/html');
                const template = dom.querySelector('template');
                const size = +template?.getAttribute('size') || 0
                e.data.svg = Array.prototype.reduce.call(template.content.children, (res, i) => {
                    res[i.id] = { body: { body: i.outerHTML, size: (+i.getAttribute('size') || size) } };
                    return res
                }, {})
                worker.postMessage(e.data);
                resolve();
            })

        } break;
        case 'request': {
            worker.postMessage(e.data.icon);
        } break;
        default: {
            // icons[e.data.icon] = e.data;
            if (e.data.body)
                resolves[e.data.icon]?.(e.data);
            else
                resolves[e.data.icon]?.();
            // delete resolves[e.data.icon];
        } break;
    }
}
worker.onmessageerror = function (e) {
    console.error(e);
}
worker.postMessage({ type: 'init', url: ODA.rootPath })