ODA({is: 'oda-auto-doc', imports: '@oda/button',
    template: /*html*/`
    <style>
        :host {
            @apply --vertical;
            overflow-y: auto;
            overflow-x: hidden;
            padding: 16px;
        }
    </style>
    <div>
        <h2>{{component && component.localName}}</h2>
        <div ~if="!about">
            <div horizontal>
                <b><span>{{description.component}}</span></b>
                <span>{{description.mission}}</span>
            </div>
            <div>supported by-  <a :href="'mailto:' + description.emailSupport">{{description.support}}</a>, author-  <a :href="'mailto:' + description.emailAuthor">{{description.author}}</a></div>
            <div>{{description.licence}}</div>
            <div>{{description.copyright}}</div>
            <div><a target="_blank" :href="description.site">{{description.site}}</a></div>
        </div>
        <div ~if="about" ~html="about"></div>
        <hr style="width:100%" />
        <div class="no-flex horizontal between">
            <span style="font-size: 150%"><b>API Reference</b></span>
            <oda-button @tap="showPrivate=!showPrivate" :label="showPrivate? 'Hide private API': 'Show private API'"></oda-button>
        </div>
        <oda-api-table :component :show-private="showPrivate" ::about></oda-api-table>
        <br>
        <hr style="width:100%" />
    </div>
    <slot @slotchange="_slotchange"></slot>
    `,
    _slotchange(e){
        this.component = e.target.assignedElements()?.[0]
    },
    $public: {
        $pdp: true,
        description: {
            component: 'This component-',
            mission: 'is ODA component.',
            author: 'ODA',
            emailAuthor: 'support@odajs.org',
            support: 'ODA',
            emailSupport: 'support@odajs.org',
            licence: 'Distributed under the BIS LLC.',
            copyright: 'Copyright (c) 2007-2023. All rights reserved.',
            site: 'https://www.odajs.org'
        },
        about: '',
        component: {
            $type: HTMLElement,
            set(n) { this.description = n && n.description ? { ...this.description, ...n.description } : this.description; },
        },
        showPrivate: false,
        src: {
            $def: '',
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
    <div ~for="Object.keys(apiSort)">
        <h2>{{$for.item}}</h2>
        <div ~for="Object.keys(apiSort[$for.item]).sort()" ~style="apiSort[$for.item][$$for.item].isPrivate? 'background: #ccc;': 'background: #eee;'">
            <oda-api-table-row :name="$$for.item" :row="apiSort[$for.item][$$for.item]" :def="apiSort[$for.item][$$for.item]"></oda-api-table-row>
        </div>
    </div>
    `,
    $public: {
        $pdp: true,
        showPrivate: {
            $type: Boolean,
            set(n) {
                this._getAPI();
            }
        },
        about: '',
        component: {
            $type: Object,
            async set(n) {
                if (n) {
                    this._getAPI();
                }
            }
        },
        apiSort: {}
    },
    _getAPI(o = this.component) {
        this.async(() => {
            if (!o) return;
            const proto = ODA.telemetry.components[o.localName].prototype;
            this._getType(proto);
        }, 100)
    },
    _getType(obj) {
        if (obj) {
            let publicProps = {};
            let privateProps = {};
            Object.keys(obj.$public || { }).forEach(k => {
                if (k.startsWith('_')) privateProps[k] = obj.$public[k];
                else publicProps[k] = obj.$public[k];
            })
            let props = {...{}, ...publicProps};
            if (this.showPrivate) props = {...props, ...privateProps};
            let tmp = {};
            this.apiSort = { $public: props };
        }
    }
})

ODA({ is: 'oda-api-table-row',
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
        <hr>
        <div class="horizontal">
            <span class="colA">{{name}}</span>
            <span class="colT" style="font-size: 90%;;">{{_type}}</span>
            <span class="colV" style="font-size: 90%;">{{_def}}</span>
            <oda-icon ~if="row['_docs']" icon="icons:info-outline" fill="darkgray" style="cursor:pointer;margin-right:10px;" :title="row._docs.title" :fill="row['_docs'].color"></oda-icon>
            <div ~if="!row['_docs']" style="width:36px"></div>
        </div>
        <div ~if="row._docs && row._docs.title && row._docs.title">
            <hr style="opacity: 0.3">
            <span style="font-size: 80%; font-style: italic;word-wrap: break-word;color:#6699cc;cursor:pointer">{{ row._docs.title }}</span>
        </div>
        <div ~if="row['description']">
            <hr style="opacity: 0.3">
            <span style="font-size: 80%; font-style: italic;word-wrap: break-word;">description: {{ row['description'] }}</span>
        </div>
        <div ~if="row['category'] || row['label'] || row['reflectToAttribute'] || row['notify'] ||
                row['freeze']">
            <hr style="opacity: 0.3">
            <span style="font-size: 80%; font-style: italic;word-wrap: break-word;" align="left">
                {{ row['category'] ? 'category : ' + row['category'] + '; ': '' }}
                {{ row['label'] ? 'label : ' + row['label'] + '; ': '' }}
                {{ row['reflectToAttribute'] ? 'reflectToAttribute; ': '' }}
                {{ row['notify'] ? 'notify; ': '' }}
                {{ row['freeze'] ? 'freeze; ': '' }}
            </span>
        </div>
        <div ~if="row['$list']">
            <hr style="opacity: 0.3">
            <span style="font-size: 80%; font-style: italic;word-wrap: break-word;">list: {{ row['$list'] }}</span>
        </div>
        <hr>
    `,
    name: '',
    def: undefined,
    row: undefined,
    get _def() {
        const _def = this.row?.$def?.toString() || this.def?.toString() || '';
        if (_def.startsWith('fun') || _def.startsWith('[')) return '';
        return _def;
    },
    get _type() {
        const _type =  this.row?.$type?.name || (this.row?.hasOwnProperty('$def') && typeof(this.row?.$def)) || this.def?.name || typeof(this.def);
        return _type.toLowerCase();
    }
})
