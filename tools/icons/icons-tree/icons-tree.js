const ODA_ICON_PATH = '/oda/buttons/icon/icon.js';
let iconsPath = import.meta.url;
iconsPath = iconsPath.replace('icons-tree/icons-tree.js', 'lib/svg/');
const pars = new DOMParser();
function getIconItem(el, group) {
    const obj = {};
    obj.name = el.getAttribute('id');
    obj.label = obj.name;
    obj.icon = group ? `${group}:${obj.name}` : '';
    obj.search = [group, obj.name, obj.label].join(' ');
    return obj;
}
function getIconFolder(template) {
    const content = template.content;
    const obj = {};
    obj.name = template.getAttribute('name');
    obj.label = obj.name;
    obj.icon = 'odant:folder';
    obj.subIcon = `${obj.name}:${template.getAttribute('icon')}`;
    obj.search = [obj.name, obj.label, ...[...content.children].map(c => ` ${c.name || ''} ${c.label || ''}`)].join(' ');
    obj.items = Array.prototype.map.call(content.children, g => getIconItem(g, obj.name));
    // obj.disabled = true;
    return obj;
}
async function loadIcons(items) {
    items = items?.map?.(i => {
        return fetch(iconsPath + i.name).then(res=>{
            return res.text().then(text=>{
                const html = pars.parseFromString(text, 'text/html');
                const template = html.querySelector('template');
                return getIconFolder(template);
            })
        }).catch(error=>{
            return getIconFolder(document.createElement('template'));
        })
    }) || []
    return Promise.all(items);
}

ODA({ is: 'oda-icons-tree', imports: '@oda/tree', extends: 'this, oda-tree',
    template: /*html*/`
        <style>
            :host{
                overflow: hidden;
                padding-left: 8px;
            }
            input{
                width: 0px;
                padding: 8px;
            }
        </style>
        <div class="horizontal" style="padding: 4px; align-items: center;">
            <input class="flex" ::value="filterVal" type="search"  style="outline: none" placeholder="Search...">
<!--            <oda-button :icon-size icon="icons:search" @tap="_keypress($event, true)"></oda-button>-->
        </div>
    `,
    async attached() {
        const list = await this.iconsList;
        this.dataSet = await loadIcons(list);
    },
    $public: {
        allowFocus: true,
        autoFixRows: true,
        lazy: true,
        allowDrag: true,
        allowSort: true,
        iconsList: {
            $type: Array,
            get() {
                return fetch(iconsPath + 'info.json').then(res => {
                    return res.json();
                })
            }
        },
        filterVal: {
            $def: '',
            set(filter) {
                this.debounce('filterVal', () => {
                    this.columns[1].$filter = (!filter || filter === '*') ? '' : filter.split(':').join('&&');
                    this.hideRoot = Boolean(filter);
                }, 300);
            }
        },
        cellTemplate: 'oda-icons-icon',
        rootPath: '/'
    },
    get columns() {
        return [{ name: 'label', treeMode: true, $sort: 1 }, { name: 'search', $hidden: true, $filter: '' }]
    },
    async _onDragStart(e) {
        const el = e.path.find(p => p.row);
        if (el.row.subIcon) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        if (el && (this.allowDrag || el.row.drag)) {
            try {
                const node = e.target.querySelector('oda-table-cell-tree').__shadowRoot.querySelector('oda-icons-icon');
                e.dataTransfer.setDragImage(node, 0, 0);
            } catch (err) {
                e.dataTransfer.setDragImage(new Image(), 0, 0);
            }
            e.dataTransfer.setData('text/plain', `\r\n<oda-icon icon="${el.row.icon}"></oda-icon>`);
            e.dataTransfer.setData('odant/html-links', JSON.stringify([`<script type="module" href="${this.rootPath}${ODA_ICON_PATH}">`]));
            e.dataTransfer.setData('odant/icon', el.row.icon);
        }
    },
    focus() {
        this.$('input').focus();
    }
})

ODA({ is: 'oda-icons-icon', extends: 'oda-icon', imports: '@oda/icon',
    template: /*html*/`
    <style>
        :host {
            cursor: default;
            overflow: hidden;
        }
        :host(:not(:hover)) > oda-button {
            display: none;
        }
        oda-button {
            opacity: 0.25;
        }
        oda-button:hover {
            opacity: 1;
        }
        oda-icon {
            filter: invert(1);
        }
        label {
            align-self: center;
            padding-left: 4px;
            text-overflow: ellipsis;
            overflow: hidden;
        }
        :host .ellipsis {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
        .badge {
            margin: 4px;
            font-size: x-small;
            text-align: center;
            padding: 2px 6px;
            border-radius: 8px;
        }
    </style>
    <label class="label flex">{{item.label}}</label>
    <div ~if="subIcon" class="badge no-flex ellipsis">{{badge}}</div>
    <oda-button ~if="!subIcon" icon="icons:content-copy" @tap.stop="_copyToClipboard(icon)"></oda-button>`,
    set item(item) {
        this.icon = item?.icon;
        this.fill = item?.subIcon && 'orange';
    },
    get subIcon() {
        return this.item?.subIcon;
    },
    get badge() {
        return this.item?.items?.length || 0;
    },
    $listeners: {
        tap(e) {
            if (!this.item.$hasChildren) {
                this.selectedIcon = this.icon;
            }
        },
        dblclick(e) {
            e.stopPropagation();
            this.selectedIcon = this.icon;
            copyToClipboard(this.icon);
            this.dispatchEvent(new CustomEvent("ok", { detail: this.selectedIcon, bubbles: true, composed: true }));
        }
    },
    _copyToClipboard() {
        copyToClipboard(this.icon);
    }
})

export function copyToClipboard(s) {
    const el = document.createElement('textarea');
    el.value = s;
    el.setAttribute('readonly', '');
    el.style.position = 'absolute';
    el.style.left = '-9999px';
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
}
