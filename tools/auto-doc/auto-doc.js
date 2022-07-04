ODA({is: 'oda-auto-doc', imports: '@oda/button, @oda/md-viewer',
    template: /*html*/`
    <style>
        :host {
            @apply --vertical;
            overflow-y: auto;
            overflow-x: hidden;
        }
    </style>
    <div>
        <h2>{{component && component.localName}}</h2>
        <div ~if="!about">
            <div horizontal>
                <b><span>{{description.component}}</span></b>
                <span>{{description.mission}}</span>
            </div>
            <div>supported by -  <a :href="'mailto:' + description.emailSupport">{{description.support}}</a>, author -  <a :href="'mailto:' + description.emailAuthor">{{description.author}}</a></div>
            <div>{{description.licence}}</div>
            <div>{{description.copyright}}</div>
            <div><a target="_blank" :href="description.site">{{description.site}}</a></div>
        </div>
        <div ~if="about" :html="about"></div>
        <hr style="width:100%" />
        <div class="no-flex horizontal between">
            <span style="font-size: 150%"><b>API Reference</b></span>
            <oda-button @tap="showPrivate=!showPrivate" :label="showPrivate? 'Hide private API': 'Show private API'"></oda-button>
        </div>
        <oda-api-table :component :show-private="showPrivate" ::about></oda-api-table>
        <br>
        <hr style="width:100%" />
    </div>
    `,
    props: {
        description: {
            component: 'This component',
            mission: ' - is ODA component.',
            author: 'ODA',
            emailAuthor: 'support@odajs.org',
            support: 'ODA',
            emailSupport: 'support@odajs.org',
            licence: 'Distributed under the BIS LLC.',
            copyright: 'Copyright (c) 2007-2020. All rights reserved.',
            site: 'https://www.odajs.org'
        },
        about: '',
        component: {
            type: HTMLElement,
            set(n) { this.description = n && n.description ? { ...this.description, ...n.description } : this.description; },
            freeze: true
        },
        showPrivate: false,
        src: {
            default: '',
            set(n) { if (n) { this.component = document.createElement(this.src); } }
        }
    }
})

ODA({is: "oda-api-table", imports: '@oda/button',
    template: /*html*/`
    <style>
        span {
            overflow: hidden;
            padding-left: 4px;
        }
        .colA {
            width: 50%;
            font-weight: 550;
        }
        .colT,
        .colV {
            width: 25%;
        }
    </style>
    <div style="background: #ccc;">
        <hr>
        <div class="horizontal">
            <span class="colA">Name</span>
            <span class="colT">Type</span>
            <span class="colV" style="margin-right:36px">Default value</span>
        </div>
        <hr>
    </div>
    <div ~for="k in Object.keys(apiSort)">
        <h2>{{k}}</h2>
        <div ~for="i in Object.keys(apiSort[k])" :style="apiSort[k][i].isPrivate? 'background: #ccc;': 'background: #eee;'">
            <hr>
            <div class="horizontal">
                <span class="colA">{{apiSort[k][i].f || i}}</span>
                <span class="colT" style="font-size: 90%;;">{{apiSort[k][i]['typeName']}}</span>
                <span class="colV" style="font-size: 90%;">{{apiSort[k][i]['defVal']}}</span>
                <oda-icon ~if="apiSort[k][i]['_docs']" icon="icons:info-outline" fill="darkgray" style="cursor:pointer;margin-right:10px;"
                        @tap="_tap(apiSort[k][i])" :title="apiSort[k][i]._docs.title" :fill="apiSort[k][i]['_docs'].color"></oda-icon>
                <div ~if="!apiSort[k][i]['_docs']" style="width:36px"></div>
            </div>
            <div ~if="apiSort[k][i]._docs && apiSort[k][i]._docs.title && apiSort[k][i]._docs.title">
                <hr style="opacity: 0.3">
                <span style="font-size: 80%; font-style: italic;word-wrap: break-word;color:#6699cc;cursor:pointer" @tap="_tap(apiSort[k][i])">{{ apiSort[k][i]._docs.title }}</span>
            </div>
            <div ~if="apiSort[k][i]['description']">
                <hr style="opacity: 0.3">
                <span style="font-size: 80%; font-style: italic;word-wrap: break-word;">description: {{ apiSort[k][i]['description'] }}</span>
            </div>
            <div ~if="apiSort[k][i]['category'] || apiSort[k][i]['label'] || apiSort[k][i]['reflectToAttribute'] || apiSort[k][i]['notify'] ||
                    apiSort[k][i]['freeze']">
                <hr style="opacity: 0.3">
                <span style="font-size: 80%; font-style: italic;word-wrap: break-word;" align="left">
                    {{ apiSort[k][i]['category'] ? 'category : ' + apiSort[k][i]['category'] + '; ': '' }}
                    {{ apiSort[k][i]['label'] ? 'label : ' + apiSort[k][i]['label'] + '; ': '' }}
                    {{ apiSort[k][i]['reflectToAttribute'] ? 'reflectToAttribute; ': '' }}
                    {{ apiSort[k][i]['notify'] ? 'notify; ': '' }}
                    {{ apiSort[k][i]['freeze'] ? 'freeze; ': '' }}
                </span>
            </div>
            <div ~if="apiSort[k][i]['list']">
                <hr style="opacity: 0.3">
                <span style="font-size: 80%; font-style: italic;word-wrap: break-word;">list: {{ apiSort[k][i]['list'] }}</span>
            </div>
            <div ~if="selected && apiSort[k][i]._docs && apiSort[k][i]._docs.src && selected === apiSort[k][i]._docs.src"
                    style="margin:6px;border:1px solid #6699cc;background:white;padding:6px">
                <oda-button icon="icons:close"  @tap="selected=''" size=32
                        style="border: 1px solid red;background-color:lightyellow;position:sticky;top:10px;float:right;z-index:99;width:32; margin:2px;border-radius:2px"></oda-button>
                <oda-md-viewer :src="selected"></oda-md-viewer>
            </div>
            <hr>
        </div>
    </div>
    `,
    props: {
        showPrivate: {
            type: Boolean,
            set(n) {
                this._getAPI();
            }
        },
        about: '',
        component: {
            type: Object,
            async set(n) {
                if (n) {
                    if (n.$url) {
                        const path = n.$url.split('/').slice(0, -1).join('/');
                        let info = path + '/$info/_info.js',
                            props = path + '/$info/props/_info.js';
                        try {
                            info = await import(info);
                            info = info.info || info.default;
                            this.about = info.about || this.about;
                            props = await import(props);
                            props = props.info || props.default;
                            props && props.map(o => {
                                o.src = o.src.replace('./', path + '/')
                                if (n.props[o.label]) n.props[o.label]._docs = o;
                            });
                        } catch (err) { }
                    }
                    this._getAPI();
                    // this.render();
                }
            },
            freeze: true
        },
        apiSort: {
            default: [],
            freeze: true
        },
        selected: {}
    },
    _getAPI(o = this.component) {
        this.async(() => {
            if (!o) return;
            this._getType(o.props, 'props');
            if (o.$core) this._getType(o.$core.prototype, 'methods');
        }, 100)
    },
    _getType(obj, type) {
        if (obj) {
            let publicKeys = [];
            let privateKeys = [];
            Object.keys(obj).forEach(k => {
                if (k.startsWith('_')) privateKeys.push(k);
                else publicKeys.push(k);
            });
            let keys = [...[], ...publicKeys.sort()];
            if (this.showPrivate) keys = [...keys, ...privateKeys.sort()];
            let tmp = {};
            keys.forEach(key => {
                if (type === 'props') {
                    tmp[key] = obj[key];
                    tmp[key].isPrivate = key.startsWith('_');
                    if (tmp[key]['type'] || tmp[key]['default']) {
                        tmp[key].typeName = tmp[key]['type']['name'];
                        tmp[key].defVal = String(tmp[key]['default']) || String(tmp[key]['value']);
                    }
                }
                if (type === 'methods' && typeof obj[key] === 'function') {
                    tmp[key] = obj[key];
                    tmp[key].isPrivate = key.startsWith('_');
                    tmp[key].f = tmp[key].toString().substr(0, tmp[key].toString().indexOf(')') + 1).replace('(', '( ').replace(')', ' )');
                }
            });
            this.apiSort[type] = tmp;
        }
    },
    _tap(e) {
        let selected = e._docs && e._docs.src ? e._docs.src : '';
        this.selected = this.selected && this.selected === selected ? '' : selected;
    }
});