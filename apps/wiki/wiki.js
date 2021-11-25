import '../../components/layouts/app-layout/app-layout.js';
import '../../components/buttons/button/button.js';
import '../../components/buttons/checkbox/checkbox.js';
import '../../components/viewers/md-viewer/md-viewer.js';
import '../../components/editors/ace-editor/ace-editor.js';
import './simplemde.js';
import './html-editor.js';
import './suneditor.js';

const getUUID = function b(a) { return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b) };

ODA({
    is: 'oda-wiki',
    template: `
        <style>
            .main {
                @apply --flex;
                @apply --horizontal;
                overflow: hidden;
                height: calc(100vh - 36px);
            }
            .main-panel {
                margin: 4px;
                border: 1px solid lightgray;
                overflow: auto;
                min-width: 0;
            }
            .main-left {
                display: flex;
                flex-direction: column;
                padding: 4px;
            }
            .res {
                padding: 4px;
            }
            [draggable] {
                user-select: none;
            }
            .splitter {
                max-width: 4px;
                min-width: 4px;
                cursor: col-resize;
                z-index: 9;
            }
            .splitter:hover, .splitter-move {
                background-color: lightgray;
            }
            .full-area {
                position: fixed;
                top: 0; left: 0; bottom: 0; right: 0;
                z-index: {{_indexFullArea}};
            }
            oda-button {
                border: 1px solid gray;
                margin: 4px;
            }
            .acts {
                display: flex;
                align-items: center;
            }
        </style>
        <div class="full-area" @mousemove="_mousemove" @mouseup="_clearAction" @mouseout="_clearAction"></div>
        <oda-app-layout>
            <div slot="title" class="header horizontal center">
                <div style="flex:1"></div>oda-wiki (prototype)<div style="flex:1"></div>
                <oda-button id="s06" icon="image:filter-1" @tap="_settings" style="margin-right:4px" icon-size="16"></oda-button>
                <oda-button id="s00" icon="icons:view-agenda" rotate="90" @tap="_settings" style="margin-right:4px" icon-size="16"></oda-button>
                <oda-button id="s01" icon="image:filter-2" @tap="_settings" style="margin-right:8px" icon-size="16"></oda-button>
            </div>
            <div slot="left-panel" icon="icons:tree-structure" title="articles">
                <div style="border-bottom:1px solid lightgray;width:100%;margin: 4px 0;"></div>
                <div class="horizontal">
                    <oda-button icon="av:library-add" title="new file"  icon-size="16"></oda-button>
                    <oda-button icon="icons:folder-open" title="new folder"  icon-size="16"></oda-button>
                    <oda-button icon="icons:refresh" title="refresh"  icon-size="16"></oda-button>
                    <oda-button icon="icons:unfold-less" title="collapse all"  icon-size="16"></oda-button>
                </div>
                <div style="border-bottom:1px solid lightgray;width:100%;margin: 4px 0;"></div>
                <oda-tree :item="treeList" icon-size="16"></oda-tree>
            </div>
            <div slot="left-panel" icon="av:playlist-add" title="editors">
                <div style="border-bottom:1px solid lightgray;width:100%;margin: 4px 0;"></div>
                add editor:
                <oda-button width="100%" @tap="_addBox">html-editor</oda-button>
                <oda-button width="100%" @tap="_addBox">suneditor</oda-button>
                <oda-button width="100%" @tap="_addBox">simplemde</oda-button>
                <oda-button width="100%" @tap="_addBox">showdown</oda-button>
                <oda-button width="100%" @tap="_addBox">iframe</oda-button>
            </div>
            <div slot="left-panel" icon="icons:check" title="actions" style="align-items:center">
                <div style="border-bottom:1px solid lightgray;width:100%;margin: 4px 0;"></div>
                editors:
                <div class="acts"><oda-button id="s01" @tap="_settings">01</oda-button> hide/show editors</div>
                <div class="acts"><oda-button id="s02" @tap="_settings">02</oda-button> hide all</div>
                <div class="acts"><oda-button id="s03" @tap="_settings">03</oda-button> show all</div>
                <div class="acts"><oda-button id="s04" @tap="_settings">04</oda-button> collapse all</div>
                <div class="acts"><oda-button id="s05" @tap="_settings">05</oda-button> expand all</div>
                result:
                <div class="acts"><oda-button id="s06" @tap="_settings">06</oda-button> hide/show result</div>
                <div class="acts"><oda-button id="s07" @tap="_settings">07</oda-button> invisible all</div>
                <div class="acts"><oda-button id="s08" @tap="_settings">08</oda-button> visible all</div>
                data:
                <div class="acts"><oda-button id="s09" @tap="_settings" fill="tomato" borderColor="tomato">09</oda-button> delete all hidden</div>
                <div class="acts"><oda-button id="s10" @tap="_settings" fill="tomato" borderColor="tomato">10</oda-button> delete all invisible</div>
                <div class="acts"><oda-button id="s11" @tap="_settings" fill="tomato" borderColor="tomato">11</oda-button> delete all</div>
            </div>             
            <div slot="left-panel" icon="icons:settings" title="settings">
                <div style="border-bottom:1px solid lightgray;width:100%;margin: 4px 0;"></div>
                <div>db name:</div>
                <div>db ip:</div>
                <div style="border-bottom:1px solid lightgray;width:100%;margin: 4px 0;"></div>
                <div>login:</div>
                <div>password:</div>
                <div style="border-bottom:1px solid lightgray;width:100%;margin: 4px 0;"></div>
            </div>
            <div slot="main" class="main" ref="main" @drop="_clearAction" @dragend="_clearAction">
                <div ~if="_widthL > 0 " class="main-panel main-left" ~style="{width:_widthL+'px'}" @dragover="$event.preventDefault()">
                    <oda-wiki-box ~if="_expandItem" :item="_expandItem" style="height: calc(100% - 40px);"
                            ::_expand-item="_expandItem" ::_item ::_action ::_index-full-area="_indexFullArea"></oda-wiki-box>
                    <div ~if="!_expandItem">
                        <div ~for="i,idx in data" ~is="_item === i && _action === 'box-move' ? 'oda-wiki-box-shadow' : 'oda-wiki-box'" :item="i" :idx="idx" 
                                ::_expand-item="_expandItem" ::_item ::_action ::_index-full-area="_indexFullArea"></div>
                    </div>
                </div>
                <div class="splitter" ~class="{'splitter-move': _action === 'splitter-move'}" @mousedown="_moveSplitter"></div>
                <div class="main-panel" style="flex: 1;" :hidden="_widthL >= this.$id?.main.offsetWidth && _action !== 'splitter-move'">
                    <div ~for="i,idx in data">
                        <oda-md-viewer ~if="i.show && i.type === 'showdown'" :src="(i.value || '') + '~~~~~_~~~~~'"></oda-md-viewer>
                        <iframe ~if="i.show && i.type === 'iframe'" :srcdoc="i.htmlValue || i.value || ''" style="width:100%;border: none"
                                ~style="{height: i.h ? i.h + 'px' : 'auto'}"></iframe>
                        <div class="res" ~if="i.show && i.type !== 'iframe' && i.type !== 'showdown'" :item="i" :html="i.htmlValue || i.value || ''"></div>
                    </div>
                </div>
            </div>
        </oda-layout-app>
      `,
    props: {
        data: { type: Array, shared: true },
        _item: { type: Object },
        _indexFullArea: { type: Number, default: -1 },
        _action: { type: String },
        _widthL: { type: Number, default: 800, save: true },
        _expandItem: { type: Object },
        _lPanel: { type: String, default: 'articles' },
        _rPanel: { type: String, default: '' },
        treeList: {
            type: Object, default: {
                items: [
                    {
                        id: '3dc0cb11-5496-4f76-8154-f8c9bda28289', label: 'wiki', expanded: true, items: [
                            { id: '302771fc-3978-4013-8836-d7c160ed3159', label: 'demo-article', }
                        ]
                    }
                ]
            }
        }
    },
    listeners: {
        'dragend': '_clearAction',
        'mouseup': '_clearAction',
        'clear-action': '_clearAction'
    },
    _settings(e) {
        const id = e.target.id,
            w = this.$refs.main.offsetWidth,
            d = this.data || [],
            s = {
                s00: () => this._widthL = w / 2 - 20,
                s01: () => this._widthL = this._widthL > 0 ? 0 : w / 2 - 20,
                s02: () => d.forEach(i => i.hidden = true),
                s03: () => d.forEach(i => i.hidden = false),
                s04: () => d.forEach(i => i.collapsed = true),
                s05: () => d.forEach(i => i.collapsed = false),
                s06: () => this._widthL = this._widthL >= w ? w / 2 - 20 : w,
                s07: () => d.forEach(i => i.show = false),
                s08: () => d.forEach(i => i.show = true),
                s09: () => {
                    let hidden = 0;
                    d.forEach(i => { if (i.hidden) ++hidden })
                    if (hidden && window.confirm(`Do you really want delete ${hidden} hidden box?`)) {
                        this.data = d.filter(i => !i.hidden);
                    }
                },
                s10: () => {
                    let invisible = 0;
                    d.forEach(i => { if (!i.show) ++invisible })
                    if (invisible && window.confirm(`Do you really want delete ${invisible} invisible box?`)) {
                        this.data = d.filter(i => i.show);
                    }
                },
                s11: () => { if (window.confirm(`Do you really want delete all?`)) this.data = [] }
            }
        if (s[id]) {
            this._expandItem = null;
            s[id]();
        }
    },
    _addBox(e) {
        const txt = e.target.innerText;
        this.data.push({ id: getUUID(), label: txt, show: true, h: 120, type: txt, value: '' });
    },
    attached() {
        setTimeout(() => {
            if (!this._widthL && this._widthL !== 0) this._widthL = 800;
            else this._widthL = this._widthL <= 0 ? 0 : this._widthL >= this.$id?.main.offsetWidth ? this.$id.main.offsetWidth : this._widthL;
        }, 100);
    },
    _moveSplitter() {
        this._action = 'splitter-move';
        this._indexFullArea = 999;
    },
    _mousemove(e) {
        if (this._action === 'splitter-move') {
            e.preventDefault();
            this._widthL = this._widthL + e.movementX;
            this._widthL = this._widthL <= 0 ? 0 : this._widthL >= this.$id?.main.offsetWidth ? this.$id.main.offsetWidth : this._widthL;
        } else if (this._action === 'set-box-height') {
            this._item.h = this._item.h + e.movementY;
            this._item.h = this._item.h > 0 ? this._item.h : 0;
        }
    },
    _clearAction(e) {
        if (this._indexFullArea > 0 || this._action === 'box-move' || this._action === 'splitter-move' || this._action === 'set-box-height') {
            this._indexFullArea = -1;
            this._action = '';
            this._item = this._expandItem = null;
        }
        this.render();
    }
})

ODA({
    is: 'oda-wiki-box',
    template: `
        <style>
            :host {
                width: 100%;
            }
            .header {
                display: flex;
                align-items: center;
                border: 1px solid gray;
                background-color: lightgray;
                padding: 0 2px;
                margin: 2px;
                height: 26px;
                overflow: hidden;
                white-space: nowrap;
                color: gray;
                font-size: 16;
            }
            .box {
                border: 1px solid #666;
                background-color: #ddd;
                margin: 2px;
                overflow: auto;
            }
            [draggable=true] {
                cursor: move;
                user-select: none;
            }
            .bottomSplitter {
                width: 100%;
                max-height: 4px;
                min-height: 4px;
                cursor: row-resize;
                z-index: 9;
            }
            .bottomSplitter:hover, .bottomSplitter-move {
                background-color: lightgray
            }
            .btn {
                opacity: .4;
            }
        </style>
        <div ~if="!item.hidden">
            <div draggable="true" class="header"
                    @dragstart="_dragStart" 
                    @dragend="_dragend"
                    @drop="_dragend" 
                    @dragover="_dragover">
                {{(idx || 0) + 1 + '. ' + item?.label}}
                <div style="flex:1"></div>
                <oda-button class="btn" icon="icons:expand-more" title="down" @tap="_stepBox(1)" icon-size="20"></oda-button>
                <oda-button class="btn" icon="icons:expand-less" title="up" @tap="_stepBox(-1)" icon-size="20"></oda-button>
                <oda-button class="btn" icon="icons:fullscreen-exit" title="collapse" @tap="_collapseBox" icon-size="20"></oda-button>
                <oda-button class="btn" icon="icons:aspect-ratio" title="expand/collapse" @tap="_expandItem = _expandItem ? null : item" icon-size="20"></oda-button>
                <oda-button class="btn" icon="icons:check" title="visible" :toggled="item.show" allowToggle @tap="item.show=!item.show"></oda-button>
                <oda-button class="btn" icon="icons:close" title="hide box" @tap="_hideBox" icon-size="20"></oda-button>
            </div>
            <div class="box" :hidden="!_expandItem && (item?.h <= 0 || item.collapsed)"
                    ~style="{height:_expandItem ? '100%' : item?.h + 'px'}">
                    <div ~is="'oda-' + item.type" ref="ed" :item="item"></div>
                    </div>
            <div class="bottomSplitter" ~class="{'bottomSplitter-move': _item === item}" :hidden="_expandItem" 
                    @mousedown="_setBoxHeight" @dragover="_dragover" @drop="_dragend" ></div>
        </div>
        `,
    props: {
        item: { type: Object },
        shadow: { type: Number, default: 0 },
        _item: { type: Object },
        _indexFullArea: { type: Number, default: -1 },
        _action: { type: String },
        _expandItem: { type: Object },
        data: { type: Array },
        idx: { type: Number, default: 0 }
    },
    _stepBox(v) {
        const idx = this.data.indexOf(this.item);
        if (v === -1 && idx === 0 || v === 1 && idx === this.data.length - 1) return;
        let itm = this.data.splice(this.data.indexOf(this.item), 1);
        this.data.splice(idx + v, 0, itm[0]);
        this.fire('clear-action');
    },
    _collapseBox() {
        this.item.collapsed = !this.item.collapsed;
        this._expandItem = null;
        this.render();
    },
    _hideBox() {
        this.item.hidden = true;
        this._expandItem = null;
        return;
    },
    _setBoxHeight(e) {
        if (this.item.collapsed) {
            this.item.h = 0;
            this.item.collapsed = false;
        }
        this._item = this.item;
        this._action = 'set-box-height';
        this._indexFullArea = 999;
    },
    _dragStart(e) {
        this._item = this.item;
        this._action = 'box-move';
    },
    _dragover(e) {
        if (this._action !== 'box-move' || this._item === this.item) return;
        e.preventDefault();
        const shadowOffset = e.target.className === 'header' ? 0 : 1;
        let itm = this.data.splice(this.data.indexOf(this._item), 1);
        let indx = this.data.indexOf(this.item) + shadowOffset;
        this.data.splice(indx, 0, itm[0]);
    },
    _dragend(e) {
        this.fire('clear-action');
    }
})

ODA({
    is: 'oda-wiki-box-shadow',
    template: `
        <style>
            :host {
                width: 100%;
            }
            .box {
                border: 1px solid red;
                background-color: tomato;
                cursor: move;
                margin: 2px;
                height: 28px;
                opacity: .5;
            }
        </style>
        <div class="box" @dragover="_dragover" @dragend="_dragend" @drop="_dragend"></div>
    `,
    _dragover(e) {
        e.preventDefault();
    },
    _dragend(e) {
        this.fire('clear-action');
    }
})

ODA({
    is: 'oda-iframe', extends: 'oda-ace-editor',
    props: {
        theme: 'chrome', mode: 'html', fontSize: 16,
        item: {
            set(v) {
                if (v)
                    this.value = v.value
            }
        }
    },
    listeners: {
        change() {
            this.item.value = this.value;
        }
    }
})

ODA({
    is: 'oda-showdown', extends: 'oda-ace-editor',
    props: {
        theme: 'solarized_light', mode: 'markdown', fontSize: 16,
        item: {
            set(v) {
                if (v)
                    this.value = v.value
            }
        }
    },
    listeners: {
        change() {
            this.item.value = this.value;
        }
    }
})
