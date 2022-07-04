ODA({is: 'oda-tester', imports: '@oda/app-layout, @tools/property-grid, @tools/containers', extends: 'oda-app-layout',
    template: /*html*/`
    <app-layout-toolbar slot="header">
        <div class="horizontal" slot="left" style="align-items:center; width: 100%">
            <oda-button class="no-flex" ~for="views.filter(i=>i.slot === 'left')" :icon="item.icon" :title="item.label" allow-toggle :toggled="focused===item" @tap="focused=item"></oda-button>
        </div>
        <span class="flex" slot="center" style="font-weight: bold; font-size: large; text-align: center">{{label}}</span>
        <slot name="buttons" slot="header-right" style="display:flex;"></slot>
        <oda-button slot="right" ~if="!item.if || _info[item.if]" ~for="views.filter(i=>i.slot === 'right')" :icon="item.icon" :label="item.label" :title="item.label" allow-toggle :toggled="focused===item" @tap="focused=item"></oda-button>
    </app-layout-toolbar>
    <slot @slotchange="onSlot" class="flex"></slot>           
    `,
    props: {
        saveKey: 'tester',
        label: { get() { return this.component && (this.component.localName || this.component.label || this.component.title || 'component') || 'no component'; } },
        component: {
            type: Object,
            default: undefined,
            async set(n) {
                if (n) await this._componentAnalysis(n);
            }
        },
        views: [
            { icon: 'enterprise:computer-screen', view: 'tester', slot: 'left', slots: [{ slot: 'main', id: 'oda-tester-container' }, { slot: 'right-panel', id: 'oda-property-grid', component: 'inspectedObject' }] },
            { icon: 'device:devices', view: 'tester', slot: 'left', slots: [{ slot: 'main', id: 'oda-mobile', src: '../containers/mobile/mobile.js' }, { slot: 'right-panel', id: 'oda-property-grid', component: 'inspectedObject' }] },
            { icon: 'icons:settings-overscan', view: 'tester', slot: 'left', slots: [{ slot: 'main', id: 'oda-containers', src: '../containers/containers/containers.js' }, { slot: 'right-panel', id: 'oda-property-grid', component: 'inspectedObject' }] },

            { label: 'API', view: 'api', slot: "right", slots: [{ slot: 'main', id: 'oda-auto-doc', src: '../auto-doc/auto-doc.js' }] },// { slot: 'right-panel', id: 'oda-property-grid' }] },
            { icon: 'icons:code', view: 'source', slot: "right", slots: [{ slot: 'main', id: 'oda-code-viewer', src: '../../components/viewers/code-viewer/code-viewer.js' }, { slot: 'right-panel', id: 'oda-tester-info' }] },
            { icon: 'icons:check-circle', view: 'demo', slot: "right", slots: [{ slot: 'main', id: 'oda-html-md-viewer', src: './html-md-viewer.js' }, { slot: 'right-panel', id: 'oda-tester-info' }], if: 'demo' },
            { icon: 'icons:help', view: 'description', slot: "right", slots: [{ slot: 'main', id: 'oda-html-md-viewer', src: './html-md-viewer.js' }, { slot: 'right-panel', id: 'oda-tester-info' }], if: 'description' }
        ],
        focused: {
            default: {},
            async set(n) {
                for (let v of this.views) {
                    for (let slot of v.slots) {
                        if (slot.target) {
                            // slot.target[slot.component || 'component'] = null;
                            slot.target.setAttribute('slot', '?')
                        }
                    }
                }
                for (let v of this.views) {
                    if (Object.equal(v, n)) {
                        for (let slot of v.slots) {
                            if (!slot.target) {
                                slot.src && await import(slot.src);
                                if (slot.id !== 'oda-property-grid' || (slot.id === 'oda-property-grid' && !this._pg))
                                    slot.target = await ODA.createComponent(slot.id);
                            }
                            if (slot.id === 'oda-property-grid') {
                                if (!this._pg) this._pg = slot.target;
                                else slot.target = this._pg;
                            }
                            slot.target.setAttribute('slot', slot.slot)
                            this.appendChild(slot.target);
                            slot.target[slot.component || 'component'] ||= this.component;

                            if (slot.id === 'oda-tester-info') {
                                slot.target.focused = this.focused;
                                slot.target._arrSrc = this._arrSrc;
                                slot.target._focusedSrc = this._focusedSrc;
                                slot.target._target = this._target;
                            } else if (['source', 'demo', 'description'].includes(v.view)) {
                                slot.target.src = this._src;
                                this._target = slot.target;
                            }
                        }
                    }
                }
            }
        },
        _info: {
            default: { props: [] },
            freeze: true
        },
        _focusedSrc: 0,
        _arrSrc: { get() { return this.focused && this.focused.view !== 'tester' && this._info && this._info[this.focused.view] || undefined; } },
        _src: { get() { return this._arrSrc && this._arrSrc[this._focusedSrc] && this._arrSrc[this._focusedSrc].src || this._info.api || ''; } },
        hideToolbar() { return false }
    },
    async attached() {
        await this._componentAnalysis();
    },
    onSlot(e) {
        if (this.component) return;
        const els = e.target.assignedElements();
        this.component = els[0];
        //this.component.setAttribute('slot', 'main')
        // this.removeAttribute('hidden');
    },
    async _componentAnalysis(comp = this.component) {
        if (!comp) return;
        if (comp.$url) {
            const path = comp.$url.split('/').slice(0, -1).join('/') + '/$info/_info.js';
            try {
                let obj = await import(path);
                this._info = obj.info || obj.default;
            } catch (err) { };
        }
        this._info.api = this._info.api || comp.localName;
        if (!this._info.source || this._info.source.length === 0) {
            this._info.source = [{ label: comp.localName, src: comp.$url, title: 'source code ' + comp.localName }];
            if (comp.$$imports) {
                comp.$$imports.map(i => {
                    let label = i.substr(i.lastIndexOf('/') + 1);
                    this._info.source.push({
                        label, src: i, title: 'source code ' + label
                    });
                });
            }
        }
        this.focused = this.views[0];
    }
});

ODA({is: 'oda-tester-info', template: /*html*/`
    <div style="display:flex">
        <div style="font-weight: 500; margin-top:10px;flex:1">{{focused && focused.view}} content:</div>
        <oda-button ~if="_editMode" icon="office-set:contact" @tap="_editInfo()" title="Edit _info.js"></oda-button>
    </div>
    <hr style="opacity: 0.3">
    <div ~for="_arrSrc" @tap="_focusedSrc=index" style="cursor: pointer">   
        <div style="display:flex">
            <div>
                <div style="margin-left:6px"  ~style="_focusedSrc===index?'font-weight:700':''">{{item.label || item}}</div>
                <div style="font-size: 80%; font-style: italic;word-wrap: break-word;color:#6699cc;margin-left:18px">{{item.title || item}}</div>
            </div>
            <div style="flex:1"></div>
            <oda-button ~if="_editMode && focused && !item.src.endsWith('.js')" icon="office-set:contact" @tap="_editSource(item)" title="Edit Source"></oda-button>
        </div>
        <hr style="opacity: 0.3">
    </div>
    `,
    props: {
        component: {},
        focused: {},
        _arrSrc: Array,
        _focusedSrc: {
            default: 0,
            set(n) {
                this._target.src = this._arrSrc[n].src;
            }
        },
        _editMode: { get() { return document._editMode; } }
    },
    _editSource(e) {
        let src = e && e.src;
        if (src.startsWith('/')) src = ODA.rootPath + '/' + src;
        else if (src.startsWith('./')) src = this.component.baseURI.split('/').slice(0, -1).join('/') + src.replace('./', '/')
        window.open(ODA.rootPath + '/components/editors/md-editor/md-editor.html?src=' + src);
    },
    _editInfo() {
        let s = this.focused.view === 'source' ? '_info.js' : this.focused.view + '/_info.js';
        window.open(ODA.rootPath + '/components/editors/md-editor/md-editor.html?src=' +
            this.component.baseURI.split('/').slice(0, -1).join('/') + '/$info/' + s);
    }
})

ODA({is: 'oda-tester-container',
    template: /*html*/`
    <style>
        :host {
            overflow: hidden;
            @apply --vertical;
        }
        /*::slotted(*) {*/
        /*    @apply --flex;*/
        /*}*/
    </style>
    <slot class="vertical flex" style="overflow: hidden;"></slot>
    `,
    props: {
        component: {
            set(n) {
                if (n instanceof HTMLElement)
                    this.appendChild(n);
            }
        }
    }
})