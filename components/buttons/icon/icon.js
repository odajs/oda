const path = import.meta.url.split('/').slice(0, -1).join('/');
const libs = {};
const icons = {};
ODA({is: 'oda-icon', template: `
    <style>
        :host {
            @apply --horizontal;
            @apply --no-flex;
            display: flex;
            align-items: center;
            position: relative;
        }
        :host([bubble]) > div:not([bubble="-"])::before{
            content: attr(bubble);
            position: absolute;
            top: -2px;
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
            font-size: .7em;
            z-index: 1;
        }
        :host > div {
            position: relative;
        }
        .subicon {
            @apply --content;
            opacity: .9;
            position: absolute;
            @apply --shadow;
            left: {{iconSize/2}}px;
            top: {{iconSize/2}}px;
            border-radius: {{iconSize/16}}px;
        }
        svg{
            top: 0px;
            left: 0px;
            position: absolute;
        }
    </style>
    <div :bubble="_bubble" class="icon no-flex" ~style="{minWidth: iconSize+'px', minHeight: iconSize+'px', height: iconSize+'px', width: iconSize+'px'}">
        <svg ~show="_icon" ~style="_style" :stroke :fill :view-box="\`0 0 \${svgSize || 0} \${svgSize || 0}\`">
            <defs ~if="blink">
                <g is="style" type="text/css">
                    @keyframes blinker { 100% { opacity: 0; } }
                    g { animation: {{blink}}ms ease blinker infinite; }
                </g>
            </defs>
            <g ~html="_icon?.body"></g>
        </svg> 
    </div>
    <oda-icon class="subicon" ~if="subIcon" :icon="subIcon" :icon-size="iconSize/2.5"></oda-icon>
    `,
    get _icon() {
        return this._obj?.body || this._def?.body;
    },
    get _rotate() {
        return this._obj?.rotate || 0;
    },
    get _obj() {
        if (this.icon) {
            const obj = icons[this.icon];
            if (obj === undefined) {
                getIcon.call(this, this.icon).then(res => {
                    return (this._obj = icons[this.icon] || res);
                }).catch(e => {
                    console.log(e)
                })
                return null;
            }
            return obj;
        }
    },
    get _def() {
        if (this.default) {
            const obj = icons[this.default];
            if (obj === undefined) {
                getIcon.call(this, this.default).then(res => {
                    return (this._def = icons[this.default] || res);
                }).catch(e => {
                    console.log(e)
                })
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
        subIcon: ''
    },
    get _bubble() {
        if (this.bubble > 1) {
            if (this.bubble > 9)
                return '9+';
            else return String(this.bubble);
        } else return '-';
    },
    get _style() {
        const s = this.iconSize + 'px';
        const obj = { width: s, height: s, minHeight: s };
        const r = this.rotate + (this._rotate || 0);
        if (r)
            obj.transform = `rotate(${r}deg)`;
        if (typeof this._icon === 'string') {
            obj.backgroundImage = `url("${this._icon}")`;
            obj.backgroundRepeat = 'no-repeat';
            obj.backgroundSize = 'contain';
            obj.backgroundPosition = 'center';
        }
        return obj;
    },
    get svgSize() {
        return this._icon?.size || 0;
    },
});
async function loadIcons(name) {
    let content = libs[name];
    if (!content) {
        try {
            const doc = await ODA.loadHTML(ODA.rootPath + '/icons/svg/' + name + '.html');
            const tmp = doc.querySelector('template');
            libs[name] = content = tmp.content;
            content.size = +tmp.getAttribute('size') || 0;
        }
        catch (e) {
            console.error(e);
        }
    }
    return content;
}
async function getIcon(n) {
    const key = n;
    let obj = icons[key];
    if (!obj) {
        obj = Object.create(null);
        if (/:[0-9]+$/.test(n)) {
            let s = n.match(/:[0-9]+$/)[0];
            n = n.replace(s, '');
            obj.rotate = +s.substring(1);
        }
        else
            obj.rotate = 0;
        if (isSVG(n)) {
            n = n.split(':');
            let name = n.shift();
            let content = await loadIcons(name);
            n = n[0];
            const g = content?.getElementById(n);
            if (g)
                obj.body = { body: g.outerHTML, size: (+g.getAttribute('size') || content.size) };
        }
        else {
            if (!n.includes('.'))
                n += '.png';
            if (!n.includes('/'))
                n = ODA.rootPath + '/icons/png/' + n;
            try {
                let file = await fetch(n);
                if (!file.ok)
                    throw new Error(`icon file "${n}" not found!`)
                file = await file.blob();
                obj.body = await new Promise(async resolve => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onloadend = function () {
                        resolve(reader.result);
                    }
                });
            }
            catch (err) {
                console.warn(err);
                if (this.default !== this.icon)
                    this.icon = this.default;
                //     obj.body = (await getIcon.call(this, this.default)).body;
                // else
                //     obj.body = null;
            }
        }
        icons[key] = obj;
    }
    return obj;
}
function isSVG(str) {
    return (str.includes(':') && !str.includes('/'));
}