/*
 * oda-site v1.0
 * (c) 2020 Roman Perepelkin
 * Under the MIT License.
 */
import '../oda.js';
import '../tools/containers/containers.js';
import '../tools/router/router.js';
import '../components/viewers/md-viewer/md-viewer.js';
import '../components/buttons/button/button.js';

const statuses = [
    { id: 'no', icon: '', color: 'lightgray' },
    { id: 'temp', icon: 'image:edit', color: 'lightblue' },
    { id: 'check', icon: 'image:remove-red-eye', color: 'green' },
    { id: 'edit', icon: 'editor:border-color', color: 'red' },
    { id: 'ok', icon: 'icons:check', color: 'lightgreen' }
];

function clone(obj) {
    const res = Object.assign({}, obj);

    res.hideExpander = true;
    res.$expanded = true

    res.items = Object.assign([], res.items).map(i => clone(i));
    return res;
}
let enableRoute = false;
function route(item, idx) {
    if( !enableRoute) return;
    if (item && item.execute) {
        actions[item.execute](item);
    }
    else {
        ODA.router.go("#" + (item.$id || item));
    }
}
const actions = {
    async setStyle(item) {
        try {
            ODA.updateStyle();
            const theme = await ODA.loadJSON(ODA.styles.path + '/' + (item.path || item.$id) + '.json');
            ODA.updateStyle(theme);
        }
        catch (e) { }
    },
    async setLocale(item) {
        try {
            ODA.locale = '';
            // const locale = await ODA.loadJSON(ODA.rootPath + '/' + (item.path || item.$id) + '.json');
            // ODA.updateStyle(theme);
        }
        catch (e) { }
    }
};
let prev = {};
async function loadDir(root, path = '') {
    if (!root.items) {
        const url = ODA.rootPath.replace('/oda', '/' + (path || 'oda')),
            filename = url + (root.path || (root.$id ? ('/' + root.$id) : '')) + '/_.dir';
        try {
            const dirs = await ODA.loadJSON(filename);
            let items = dirs.map(i => {
                i.$parent = i.$parent || root;
                i.$id = (root.$id ? (root.$id + '/') : '') + i.name;
                i.status = statuses.find(s => s.id === (i.status)) || statuses[0];
                i.$expanded = true;
                prev.next = i;
                i.prev = prev;
                prev = i;
                return i.name?.includes('.') || i.content?.link?.includes('.html') || i.execute ? i : loadDir(i, path);
            });
            root.items = await Promise.all(items);
            root._statusReady = { count: 0, ok: 0, percent: 0 };
        }
        catch (e) { root.items = [] }
    }
    return root;
}
site: {
    ODA({ is: 'oda-site', extends: 'oda-app-layout', imports: '@oda/app-layout, @oda/tree',
        hostAttributes: {
            'right.icon': 'icons:warning',
            'left.splitter.hidden': true
        },
        template: /*html */ `
            <div class="horizontal header" slot="header" style="align-items: center;">
                <img ~if="showLogoImage" width="64" class="no-flex" @tap="window.location.hash = ''; focusedItem = null" src="site/icon.png" style="cursor: pointer; margin: 8px;"/>
                <div class="vertical" style="padding: 10px;">
                    <oda-site-search class="no-flex" ::_edit-mode=_editMode ></oda-site-search>
                    <div class="horizontal" style="align-items:center; justify-content: flex-end;">
                        <a ~if="location?.href?.includes('components/') || location?.href?.includes('benchmarks/') || location?.href?.includes('apps/')" class="no-flex" :href="location.href.replace('index.html', '').replace('#', '')" target="_blank">
                            <oda-icon icon="icons:open-in-new" :icon-size="25" title="open in new window"></oda-icon>
                        </a>
                        <div class="flex"></div>
                        <a class="no-flex" :href="sets?.hrefYoutube" target="_blank">
                            <img src="site/youtube.png" height="18" style="padding: 6px 6px 0 0;"/>
                        </a>
                        <a class="no-flex" href="https://github.com/odajs/oda" target="_blank">
                            <oda-icon icon="social-media:github" :icon-size="28"></oda-icon>
                        </a>
                    </div>
                </div>
                <oda-site-header :items ::part></oda-site-header>
            </div>
            <div @activate="_activate(ctrl)" slot="left-panel" ~for="ctrl in leftControls" :icon="ctrl._icon" :title="ctrl._title" class="layout" @tap="_ontap(ctrl)">
                <oda-site-nav-tree :part="items?.[index]" ::focused-node="focusedItem" class="flex" hide-top></oda-site-nav-tree>
            </div>
            <oda-site-content-tree ~show="!_showTester" :slot="part?'main':'?'" :part="focusedItem" ~style="{display: focusedItem?'flex':'none'}"></oda-site-content-tree>
            <oda-nav ~show="!_showTester" :slot="part?'main':'?'" :focused-item=focusedItem></oda-nav>
            <video ~if="!hash && _srcIframe==='video'" @pause="_stop" ref="video" :slot="!focusedItem || part === null?'main':'?'" style="background-color: black; height: 100vh" src="./site/intro.mp4" @tap="_playVideo" poster="site/intro.webp"></video>
            <iframe ~if="_srcIframe!=='video'" :slot="!focusedItem || part === null?'main':'?'" :src="_srcIframe" style="width:100%;height:100vh;border:none;"></iframe>
            <div ~show="_showTester" slot="main" class="flex" style='position:relative'>
                <oda-site-iframe ~if="_showTester" :src="src" style="width:100%; height:100%"></oda-site-iframe>
                <oda-nav :focused-item=focusedItem></oda-nav>
                <oda-modal ~if='modalwin.is' >
                    <oda-button icon='icons:close' style='justify-content: right;' icon-pos="right" @tap="{this.modalwin.is=false}"></oda-button>
                    <oda-md-viewer :src="modalwin.url"></oda-md-viewer>
                </oda-modal>
            </div>
        `,
        get leftControls() {
            return [
                { _icon: 'enterprise:graduation-cap', _title: 'ОБУЧЕНИЕ', _path: 'learn' },
                { _icon: 'icons:apps', _title: 'КОМПОНЕНТЫ', _path: 'components' },
                // { _icon: 'icons:language', _title: 'Языки', _path: 'learn' },
                { _icon: 'image:palette', _title: 'ТЕМЫ', _path: 'themes' },
                { _icon: 'device:devices', _title: 'ТЕСТЫ', _path: 'benchmarks' },
                { _icon: 'av:play-circle-filled', _title: 'ПРИМЕРЫ', _path: 'apps' }
            ]
        },
        _ontap(item) {
            this.selectedSiteHeaderMenu = item._title;
            this.left.smartClose();
        },
        _activate(ctrl) {
            if (!this.hash?.includes(ctrl._path))
                route(ctrl._path);
        },
        selectedSiteHeaderMenu: '',
        ddMenuIndex: -1,
        setLeftDrawerFocus(item) {
            const title = item?.label || item;
            let hash = location.hash;
            hash = hash.replace('#', '').split('/')[0];
            for (const ctrl of this.leftControls)
                if (ctrl._path === hash)
                    this.selectedSiteHeaderMenu = ctrl._title;
            for (const ctrl of this.left.controls) {
                if (ctrl.title === title || ctrl.title === this.selectedSiteHeaderMenu) {
                    if (this.left.focused) {
                        if (this.left.focused !== ctrl) {
                            this.left.setFocus(ctrl);
                        }
                    } else {
                        this.left.lastFocused = ctrl;
                    }
                }
            }
        },
        props: {
            allowCompact: true,
            autoCompact: true,
            modalwin: {
                is: false,
                url: ""
            },
            src: '',
            _editMode: {
                default: false,
                shared: true,
                set(x) { this.$refs.iframe.contentDocument._editMode = x }
            },
            hash: {
                type: String,
                set(v) {
                    // this.part = null;
                    if (!v){
                        window.location.hash = ''; 
                        this.focusedItem = null;
                        this.selectedSiteHeaderMenu = '';
                        // this.left.smartClose();
                        return;
                    }
                    const params = v.split('#');
                    const steps = params[1].split('/');
                    let item = this;
                    while (item && steps.length) {
                        const step = steps.shift();
                        item = item.items.find(i => i.name === step)
                    }
                    this.focusedItem = item;
                    this.setLeftDrawerFocus(item);

                    //console.log((params && params[2] && params[2].length)===1);
                    if (params[2] && params[2].length) {
                        this.modalwin.url = params[2];
                        this.modalwin.is = true;
                        console.log(ODA.rootPath);
                    };
                    //this.part = this.items.find(i=>i.name===steps[0]);

                }
            },
            part: {
                type: Object,
                get() {
                    let p = this.focusedItem;
                    while (p && p.$parent && !Object.equal(p.$parent, this))
                        p = p.$parent;
                    return p;
                }
            },
            items: Array,
            focusedItem: {
                type: Object,
                set(n) {
                    this.src = '';
                    let url;
                    if (n && n.content) url = ODA.rootPath + '/' + (n.path || n.$id) + '/' + (n.content.link || n.content.src);
                    if (url && !url.endsWith('.md')) this.src = url;
                }
            },
            _srcIframe: 'video',
            sets: {
                hrefYoutube: 'https://www.youtube.com/channel/UC37BC2N95knlYcDRK4cQoug'
            },
            _showTester() {
                return (this.focusedItem && (!this.focusedItem.items || this.focusedItem.items.length === 0)) && this.src;
            },
            showLogoImage: true,
        },
        isEditMode: false,
        async ready() {
            ODA.router.create(hash => this.hash = hash);
            // ODA.router.create('#*,', (hash) => {
            //     this.hash = hash;
            // });
            document.addEventListener("setTheme", e => {
                let iframeContent = this.$refs.iframe.contentDocument;
                iframeContent.querySelector('style[group=theme]').textContent = e.detail.value;
            });
        },
        _stop(e) {
            if (document.fullscreen)
                document.exitFullscreen();
        },
        _playVideo(e) {
            if (this._srcIframe !== 'video') return;
            if (!this.$refs.video.src.endsWith('site/intro1.mp4'))
                this.$refs.video.src = 'site/intro1.mp4';
            this.$refs.video.muted = false;
            this.$refs.video.requestFullscreen();
            this.play();
        },
        play() {
            if (this._srcIframe !== 'video') return;
            if (this.$refs.video.currentTime >= this.$refs.video.duration) {
                this.$refs.video.currentTime = 0;
            }
            if (this.$refs.video.paused)
                this.$refs.video.play();
            else
                this.$refs.video.pause();
        },
        attached() {
            this.async(async () => {
                this.focusedItem = null;
                if (this._srcIframe === 'video')
                    this.$refs.video.muted = true;
                await loadDir(this, this.sets?._rootPath);
                this._setStatus(this.items[0]);
                this.hash = window.location.hash;
                if (!this.hash && this._srcIframe === 'video') {
                    this.play();
                }
                this.left.allowPin = true;
                this.async(() => enableRoute = true, 1000)
            }, 100);
        },
        _setStatus(root) {
            if (root._statusReady) {
                this._setCount(root, root);
                root._statusReady.percent = root._statusReady.ok * 100 / root._statusReady.count;
            }
            if (root.items) {
                root.items.forEach(e => {
                    this._setStatus(e);
                });
            }
        },
        _setCount(r, root) {
            if (r.items) {
                r.items.forEach(e => {
                    if (e.status && !e._statusReady) {
                        root._statusReady.count += 1;
                        root._statusReady.ok += e.status.id === 'ok' ? 1 : 0;
                    }
                    this._setCount(e, root);
                });
            }
        }
    });
}

customElements.define('oda-site-iframe', class OdaSiteIframe extends HTMLElement {
    constructor() {
        super();
        this.shadow = this.attachShadow({ mode: 'closed' });
    }
    static get observedAttributes() {return ['src']; }
    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'src') {
            if (this.iframe) this.shadow.removeChild(this.iframe);
            this.iframe = document.createElement("iframe");
            this.iframe.src = newValue;
            this.iframe.style.border = 'none';
            this.iframe.style.width = '100%';
            this.iframe.style.height = '100%';
            this.shadow.appendChild(this.iframe);

            let existingOnMouseWheel = this.iframe.contentWindow.onwheel;
            this.iframe.contentWindow.onwheel = (e) => {
                if (existingOnMouseWheel) existingOnMouseWheel(e);
                this.iframe.dispatchEvent(new MouseEvent('wheel', {
                    'view': window,
                    'bubbles': true,
                    'cancelable': false,
                    'detail': e.wheelDelta
                }));
            };
        }
    }
})

content: {
    ODA({ is: 'oda-site-content-tree', extends: 'oda-tree', imports: '@oda/tree',
        props: {
            defaultTemplate: 'oda-site-content-cell',
            iconExpanded: 'icons:remove',
            iconCollapsed: 'icons:add',
            lazy: false,
            treeStep: 4,
            rowLines: false,
            autoRowHeight: true,
            part: {
                set(n) {
                    if (n) {
                        n = clone(n);
                        this.dataSet = (n && [n]) || [];
                    }
                    else
                        this.dataSet = [];
                    this.fire('scrollToUp');
                }
            },
        },
        _tap(i) { route(i); }
    });
    ODA({ is: 'oda-site-content-cell', extends: 'oda-table-cell-base', imports: '@oda/table, @tools/jupyter',
        template: /*html*/ `
            <style>
                :host * {
                    @apply --user-select;
                    white-space: initial;
                }
                :host {
                    display: unset !important;
                }
                .title{
                    cursor: pointer;
                    text-decoration: underline;
                }
                .title:hover{
                    @apply --selected;
                }
            </style>
            <div class="vertical flex" style="padding: 2px 2px;">
                <div :style="h" style="padding-bottom:4px" class="title no-flex" @down="_tap" ~html="value"></div>
                <oda-jupyter ~if="useJupyter" :notebook :read-only="!isEditMode"></oda-jupyter>
            </div>
        `,
        props: {
            h() {
                let l = this.item.$level || 0;
                let style = `
                    font-size: ${24 - l}px;
                    font-weight: ${550 - l * 50};
                    color: ${this.item && ((this.item.name && this.item.name.includes('.md')) || (this.item.content && this.item.content.link)) ? '#6699cc' : '#336699'};
                `;
                return style;
            },
            value: {
                get() {
                    return this.item?.label || this.item?.name;
                }
            },
            item: Object
        },
        get notebook() {
            return {
                cells: [
                    {
                        cell_type: 'markdown',
                        fount: this.item?.content?.abstract ? this.item.content.abstract
                            : (this.item?.name?.includes('.md') && this.item?.$level === 0) ?
                                this.item?.$id || this.item?.content?.link || this.item?.content?.src || '' : ''
                    }
                ]
            }
        },
        get useJupyter() {
            return this.notebook?.cells?.filter(i => i.fount).length;
        },
        _tap(e) {
            route(this.item)
        }
    });
    ODA({ is: 'oda-nav', template: /*html*/ `
            <style>
                :host {
                    max-height: 2px;
                }
                oda-nav-btn {
                    position: absolute;
                    bottom: 0;
                    opacity: 0.3;
                }
                oda-nav-btn:hover {
                    opacity: 1;
                }
            </style>
            <oda-nav-btn ~if="focusedItem?.prev?.label" :goal=focusedItem.prev @tap="_tap(focusedItem.prev)" :isnext=0></oda-nav-btn>
            <oda-nav-btn ~if="focusedItem?.next?.label" :goal=focusedItem.next @tap="_tap(focusedItem.next)" :isnext=1 style="right:0px;"></oda-nav-btn>
        `,
        props: {
            focusedItem: Object
        },
        _tap(i) { route(i); },
    });
    ODA({ is: 'oda-nav-btn', extends: 'oda-button', imports: '@oda/button',
        template: /*html*/ `
            <style>
                :host {
                    height: {{iconSize}}px;
                    z-index: 99;
                    transition: width 3s;
                    paddind: 0px;
                    background: lightgray;
                    border-radius: {{iconSize}}px;
                }
                .label {
                    display: none;
                    width: 0px;
                    transition: width 3s;
                }
                :host(:hover) {
                    outline: none;
                    border: 1px solid gray;
                }
                :host(:hover) .label {
                    display: block;
                    width: auto;
                }
            </style>
            <div class="label" :html="goal?.label"></div>
        `,
        props: {
            iconPos() {
                return ((this.isnext) ? "right" : "left");
            },
            icon() {
                return ((this.isnext) ? "hardware:keyboard-arrow-right" : "hardware:keyboard-arrow-left");
            },
            iconSize: 30,
            goal: Object,
            isnext: Number
        },
    });
}
navigator: {
    ODA({ is: 'oda-site-nav-tree', extends: 'oda-tree', imports: '@oda/tree',
        template: `
            <style>
                :host, :host *{
                    @apply --layout;
                }
            </style>
        `,
        props: {
            icon: 'icons:menu',
            iconExpanded: 'icons:remove',
            iconCollapsed: 'icons:add',
            lazy: true,
            allowFocus: true,
            defaultTemplate: 'oda-site-nav-cell',
            rowLines: false,
            hideRoot: true,
            showTreeLines: true,
            iconSize: 24,
            // treeStep: 8,
            columns: [],
            part: {
                set(n) {
                    this.dataSet = (n && [n]) || [];
                }
            },
            _editMode: {
                default: false,
                set(n) {
                    this.columns = n ? [{ name: 'item', width: 24, template: 'oda-status-cell' }, { name: 'item', treeMode: true }] : [];
                }
            }
        },

        observers: [
            function _byFocusedRow(focusedRow) {
                this.selectItem(focusedRow);
                this.scrollToItem(focusedRow);
            }
        ]
    });
    ODA({ is: 'oda-status-cell', extends: 'oda-table-cell', imports: '@oda/table',
        template: /*html*/ `
            <style>
                :host { min-width: 22px; max-width: 22px; }
                :hover { cursor: pointer; }
                div {  width: 14px; height: 14px; border: 2px solid lightgreen; border-radius: 50%; cursor: pointer;  }
            </style>
            <div ~if="item && item._statusReady" :title @tap="_tap(item)" ~style="_style"></div>
            <oda-icon ~if="item && !item._statusReady" :icon-size="20" :icon="item.status && item.status.icon" ~style="{fill:item.status?item.status.color:''}" :title="item && item.$id" @tap="_tap(item)"></oda-icon>
        `,
        props: {
            title: {
                get() {
                    let i = this.item;
                    return i ? `${i.$id} [${i._statusReady.ok}/${i._statusReady.count}-${Math.round(i._statusReady.percent)}%]` : '';
                }
            },
            _style: {
                get() {
                    return `background:conic-gradient(lightgreen 0% ${this.item && this.item._statusReady.percent}%, white 0% 100%);`;
                }
            }
        },
        async _tap(e) {
            await navigator.clipboard.writeText(e.label);
            let s = (e.$id.startsWith('components') && !e._statusReady) ? e.$id + '/$info/_info.js' : 'learn/_info.js';
            this.async(() => {
                window.open(ODA.rootPath + '/components/editors/md-editor/md-editor.html?src=' + (ODA.rootPathWhiteBook || ODA.rootPath) + '/' + (e.$id.includes('.') ? e.$id : s)
                    + (ODA.rootPathWhiteBook ? '&_path=' + '/' + (e.$id.includes('.') ? e.$id : s) : ''));
            });
        }
    });
    ODA({ is: 'oda-site-nav-cell', extends: 'this, oda-table-cell-base', imports: '@oda/table',
        template: /*html*/ `
            <style>
                :host{ @apply --header; cursor: pointer; }
                :host(:hover){ @apply --selected; }
            </style>
            <oda-icon ~if="icon" :icon="icon" :icon-size="iconSize * .7" style="margin-right: 8px;"></oda-icon>
            <span ~html="value" ~style="{color: item && ((item.name && item.name.includes('.md')) || (item.content && item.content.link)) ? '#6699cc' : '#336699'}" style="overflow: hidden;" :title="value"></span>
        `,
        props: {
            icon() {
                return this.item.icon;
            },
            value: {
                get() {
                    return this.item.label || this.item.name;
                }
            }
        },
        listeners: {
            tap: function(e) {
                this.fire('wheel', 'clearScroll')
                route(this.item);
            }
        }
    })
}
header: {
    ODA({ is: 'oda-site-header',
        template: /*html*/  `
            <style>
                :host{
                    justify-content: flex-end;
                    @apply --flex;
                    @apply --horizontal;
                }
                div{
                    align-items: center;
                }
                .vertical:{
                    @apply --vertical;
                }
                .mob:hover {
                    filter: invert(100%);
                }
                .outline {
                    outline: gray dashed 1px;
                    outline-offset: -2px;
                }
            </style>
            <oda-button class="no-flex" :icon-size ~show="mobile" icon="icons:menu" allow-toggle ::toggled="toggled"></oda-button>
            <div ~show="!mobile" :parent="this" class="flex horizontal" style="justify-content: flex-end;">
                <oda-site-header-item ~class="getHeaderItemClass(item)" :mobile="mobile" ~for="items" :focused="item?.name === part?.name" :item :index style="color: #336699;">{{item.label}}</oda-site-header-item>
            </div>
            <div ~show="mobile && toggled" style="font-size:18px;position:absolute;top:60px;right:0;width:auto;border:1px solid #ccc;z-index:999;background-color:#eeeeee;overflow:auto;max-height:80%">
                <div ~class="{outline: selectedSiteHeaderMenu === (item.label || item.name)}" ~for="items" :item="item" @tap="_tap(item, item)" style="color: #336699;justify-content:left; padding:3px;font-weight:700;cursor: pointer">
                    <div class="horizontal" style="align-items: center" ~class="{highlighted: selectedSiteHeaderMenu === (item.label || item.name)}">
                        <oda-icon :icon="leftControls[index]._icon" icon-size="20" style="margin-right: 4px; opacity: .7"></oda-icon>    
                        {{item.label}}
                    </div>
                    <div class="mob" ~for="i in item.items" :item="i" @tap.stop="_tap(i, item)" style="color:#336699;padding:2px;margin-left:20px;font-weight:400;">{{i.label}}</div>
                </div>
            </div>
        `,
        props: {
            toggled: false,
            mobile: false,
            items: Array,
            part: Object,
            iconSize: 24
        },
        getHeaderItemClass(item) {
            return { outline: this.left.focused?.title === item.label || this.left.lastFocused?.title === item.label }
        },
        attached() {
            this._resize();
        },
        listeners: {
            resize(e) {
                this._resize();
            }
        },
        _resize() {
            this.mobile = this.rootHost.offsetWidth < 920;
            this.showLogoImage = this.rootHost.offsetWidth > 320;
        },
        _tap(i, item) {
            this.selectedSiteHeaderMenu = item.label || item.name;
            this.setLeftDrawerFocus(item);
            this.toggled = false;
            route(i);
        }
    });
    ODA({ is: 'oda-site-header-item',
        template: `
            <style>
                :host{
                    cursor: pointer;
                    font-size: large;
                    @apply --vertical;
                    z-index: 1;
                }
            </style>
            <div class="horizontal" style="align-items: center; padding: 4px 8px;" @pointermove.stop="_showDropdown">
                <oda-icon ~if="mobile" icon="icons:chevron-left"></oda-icon>
                <oda-icon ~if="!mobile" :icon="leftControls[index]._icon" icon-size="20" style="margin-right: 4px; opacity: .7"></oda-icon>
                {{item.label || item.name}}
            </div>
        `,
        props: {
            mobile: false,
            item: {},
            index: 0
        },
        listeners: {
            tap: '_tap',
        },
        async _showDropdown() {
            const dd = document.body.getElementsByTagName('oda-dropdown')
            if (dd.length && this.ddMenuIndex === this.index) return;
            this.ddMenuIndex = this.index;
            if (dd.length)
                for (let i = 0; i < dd.length; i++) {
                    const elm = dd[i];
                    elm.fire('cancel');
                }
            this.async(() => {
                const dd = document.body.getElementsByTagName('oda-dropdown');
                if (dd.length)
                    for (let i = 0; i < dd.length; i++) {
                        const elm = dd[i];
                        elm.addEventListener('pointerleave', () => {
                            elm.fire('cancel');
                        })
                    }
            }, 300)
            let res = await ODA.showDropdown('oda-site-menu', { items: this.item.items || this.items, item: this.item, mobile: this.mobile }, { parent: this, cancelAfterLeave: true });
            if (res) {
                this.ddMenuIndex = -1;
                this.setLeftDrawerFocus(res.item);
            }
        },
        _tap() {
            this.ddMenuIndex = -1;
            route(this.item);
            this.setLeftDrawerFocus(this.item);
        }
    });
    ODA({ is: 'oda-site-search',
        template: `
            <style>
                input {
                    width: 140px;
                    height: 24px;
                    border: none;
                    outline: none;
                }
            </style>
            <div style="display:flex; alignitems: center">
                <input :show="!chaosMode" class="flex" placeholder=" введите запрос" type="search" @input="search">
                <input class="flex" :if="chaosMode"  placeholder=" бездна наблюдает" type="search" @change="chaossee">
                <oda-icon icon="icons:search" icon-size=28 class="noflex" :stroke="chaosMode?'#ff0000':'#0000'" @tap="chaosModeOff" ><oda-icon >
            </div>
        `,
        props: {
            _editMode: Boolean,
            chaosMode: false,
            es_url: "https://search.odajs.org",
            //es_url: "http://localhost:9200",
        },
        chaosModeOff() { this.chaosMode = false; },
        chaosModeChange() { this.chaosMode = !this.chaosMode; },
        keyBindings: { 'Alt+Ctrl+Shift': 'chaosModeChange' },
        async search(e) {
            window.dispatchEvent(new KeyboardEvent('keydown', { 'keyCode': 27 }));
            let query = {
                "_source": ["url", "label"],
                "size": 20,
                "query": {
                    "multi_match": {
                        "query": e.currentTarget.value,
                        "fields": ["label^3", "content"],
                        "fuzziness": "AUTO"
                    }
                }
            };

            let queryRow = await fetch(this.es_url + "/ind-learn/_search?pretty", {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(query)
            });
            const queryResult = (await queryRow.json()).hits.hits.map(o => (
                { "label": o._source.label, "$id": o._source.url, "score": o._score, "icon": (o._id[0] === 'c') ? "odant:module" : "editor:format-align-left" }));

            await ODA.showDropdown('oda-seach-result', { dataSet: queryResult }, { parent: this });

        },
        async chaossee(e) {
            this._editMode = e.currentTarget.value === '~~~' || e.currentTarget.value === '###';
            this.isEditMode = this._editMode;
            //this._iframe.contentDocument._editMode = this._editMode;
            if (e.currentTarget.value === '???') {
                //const path = window.location.pathname;
                //let basePath =  path.endsWith('.html') ? path.replace(/\/\w+.html/, '') : path + '';
                let _url = ODA.rootPath + '/learn/_info.js';

                _url = await import(_url);

                let indLearn = [];
                let indCompo = [];
                function fn(l, x, goal) {
                    goal.push({ url: (l + "/" + x.name), label: x.label, content: ((x.content && x.content.abstract) ? x.content.abstract : ""), isLeaf: !x.folder });
                    if (x.folder) (x.folder.forEach(e => { fn(l + "/" + x.name, e, goal) }));
                }
                fn(ODA.rootPath, _url.default.folder.find(e => e.name === "learn"), indLearn);
                fn(ODA.rootPath, _url.default.folder.find(e => e.name === "components"), indCompo);

                async function fullCompoInd(o) {
                    let rezList = [{ url: o.url, label: o.label, content: o.content, isLeaf: 0 }];
                    if (o.isLeaf) {
                        let _url = o.url + '/$info/props/_info.js';
                        _url = await import(_url);
                        let infoList = [{ label: "Описание", src: "./$info/description/description.md" }].concat(_url.default);
                        infoList.forEach(e => {
                            if (e) rezList.push({ url: o.url, label: o.label + ": " + e.label, content: o.content, isLeaf: 1, cont_url: e.src });
                        });
                    }
                    return rezList;
                }

                async function getContent(e) {
                    if (e.isLeaf) {
                        let uUrl = e.cont_url ? e.cont_url : e.url;
                        let rowText = await fetch(e.url).then(function(response) { return response.text(); });
                        //console.log(rowText);
                        e.content = rowText.replace(/['`.*+?^${}()|[\]]/g, " ").replace(/\r?\n/g, " ").replace(/ {1,}/g, " ");;
                        if (e.cont_url) e.url = e.url + '#' + e.url + e.cont_url.substr(1);
                        delete e.cont_url;
                    }
                    delete e.isLeaf;
                    // console.log(e.url);
                    e.url = e.url.substr(5);
                    return e;
                }

                let indLearn1 = await Promise.all(indLearn.map(getContent));
                let indLearn0 = indLearn1.map((o, i) => '{ "create" : { "_index" : "ind-learn", "_id" : "l' + (i + 1) + '" } }' + '\n' + JSON.stringify(o) + '\n').join('');
                console.log(indLearn0);



                let indCompo2 = await Promise.all(indCompo.map(fullCompoInd));
                let indCompo1 = await Promise.all(indCompo2.flat().map(getContent));
                let indCompo0 = indCompo1.map((o, i) => '{ "create" : { "_index" : "ind-learn", "_id" : "c' + (i + 1) + '" } }' + '\n' + JSON.stringify(o) + '\n').join('');;
                console.log(indCompo0);
            }

        },
    });


    ODA({ is: 'oda-seach-result', extends: 'oda-tree', props: { defaultTemplate: 'oda-site-search-cell' } });
    ODA({ is: 'oda-site-search-cell', extends: 'oda-site-nav-cell', template: `
            <div class="flex" style="padding: 0 10px; text-align: right; color: green;font-size: 0.7em;">{{this.item.score}}</div>
        `,
        // props: {
        //     icon: { get() {  rez = (this.item.ii[0]==='c') ? "odant:module" : "editor:format-align-left";
        //                 return rez;} }
        // }
    });
}
menu: {
    ODA({ is: 'oda-site-menu', template: `
            <style>
                :host{
                    @apply --vertical;
                    overflow-y: auto;
                }
            </style>
            <oda-site-menu-item ~for="i in items" :item="i" :parent :path="item.name" ~style="(i.items && i.items.length > 0)?'padding: 8px; font-weight: bold; font-size: large;':''" @up="close"></oda-site-menu-item>
        `,
        close() {
            this.parentElement.fire('ok');
        },
        // attached(){
        //     this.mm = (e)=>{
        //         if (e.target.contains(this)) return;
        //         this.parentElement.fire('cancel');
        //     }
        //     window.addEventListener('mousemove', this.mm, true)
        // },
        // detached(){
        //     window.removeEventListener('mousemove', this.mm, true)
        // },
        props: {
            mobile: Boolean,
            parent: HTMLElement,
            opened: false,
            items() {
                return (this.item && (this.item.items || []).filter(i => !(i.name && i.name.includes('.')))) || [];
            },
            item: {
                default: {},
                set(v) { if (v && !v.items) v.items = []; }
            },
            // _leave() {
            //     this.parentElement.fire('cancel');
            //     window.dispatchEvent(new KeyboardEvent('keydown', { 'keyCode': 27 }));
            // }
        }
    });
    ODA({ is: 'oda-site-menu-item', template: `
            <style>
                :host{

                    cursor: pointer;
                    @apply --vertical;
                    font-weight: normal;
                    color: #336699;
                }
                div:hover{
                    @apply --focused;
                }
                span{
                    padding: 8px;
                    white-space: nowrap;
                }
            </style>
            <div class="horizontal" style="align-items: center" @tap.stop="_tap">
                <oda-icon ~if="item.icon" style="padding-left: 8px;" :icon-size="16" :icon="item.icon"></oda-icon>
                <span ~html="item.label || item.name" ~style="(item.items && item.items.length === 0)?'margin-left:16px':''"></span>
            </div>
            <oda-site-menu-item ~show="!stop" stop ~for="i in items" :path="path+'/'+item.name" :item="i" :parent="parent" style="font-weight: normal; font-size: initial;"></oda-site-menu-item>
            <!-- hr ~if="!stop && items.length>0" style="width: 100%; max-height: 2px;"-->
        `,
        props: {
            path: String,
            stop: false,
            items() {
                if (this.item && this.item.items)
                    return this.item.items.filter(i => !i.name.includes('.'));
                return []
            },
            item: {},
            parent: Object
        },
        _tap(e) {
            route(this.item);
        }
    });
}
