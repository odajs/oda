const ODA_ICON_PATH = '/oda/buttons/icon/icon.js';
let iconsPath = import.meta.url;
iconsPath = iconsPath.slice(0, iconsPath.lastIndexOf('/')) + '/../../icons/svg/';
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
    obj.label = obj.name
    obj.icon = 'odant:folder';
    obj.subIcon = `${obj.name}:${template.getAttribute('icon')}`;
    obj.search = [obj.name, obj.label, ...[...content.children].map(c => ` ${c.name || ''} ${c.label || ''}`)].join(' ');
    obj.items = Array.prototype.map.call(content.children, g => getIconItem(g, obj.name));
    return obj;
}
async function loadIcons(items) {
    return (await Promise.all(items.map(async i => {
        const res = await fetch(iconsPath + i.name);
        const text = await res.text();
        const html = pars.parseFromString(text, 'text/html');
        const template = html.querySelector('template');
        return getIconFolder(template);
    })));
}
ODA({is: 'oda-icons-tree', extends: 'this, oda-tree', imports: '@oda/tree',
    template: /*html*/`
    <style>
        :host input {
            outline: none;
            min-width: 0;
            background-color: inherit;
            overflow: hidden;
            text-overflow: ellipsis;
            width: 100%;
            padding: 0px;
            font-family: inherit;
            font-size: inherit;
            text-align: inherit;
            font-weight: inherit;
            padding-left: 4px;
        }
    </style>
    <div class="horizontal">
        <input class="flex" type="search" ::value="filterVal">
        <oda-button :icon-size icon="icons:search"></oda-button>
    </div>
    `,
    props: {
        allowFocus: true,
        lazy: true,
        allowDrag: true,
        allowSort: true,
        iconsList: {
            type: Array,
            async set(v) {
                this.dataSet = await loadIcons(v);
            }
        },
        filterVal: {
            default: '',
            set(filter) {
                this.debounce('filterVal', () => {
                    this.columns[1].$filter = filter === '*' ? '' : filter.split(':').join('&&');
                    this.hideRoot = Boolean(filter);
                }, 150);
            }
        },
        defaultTemplate: 'oda-icons-icon',
        rootPath: '/',
    },
    columns: [{ name: 'label', treeMode: true, $sort: 1 }, { name: 'search', hidden: true, }],
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
    detached() {
        this.columns[1].$filter = '';
    },
    async ready() {
        this.iconsList = await (await fetch(iconsPath + 'info.json')).json();
    },
    focus() {
        this.$('input').focus();
    }
});

ODA({is: 'oda-icons-icon', extends: 'oda-icon', imports: '@oda/icon',
    template: /*html*/`
    <style>
        :host {
            cursor: default;
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
        label{
            align-self: center;
            padding-left: 4px;
        }
    </style>
    <oda-icon ~if="item?.subIcon" :icon="item.subIcon" :icon-size="iconSize*.4" style="position: absolute; transform: skew(340deg, 360deg); filter: invert(1)" ~style="{left: iconSize/3+'px'}"></oda-icon>
    <label class="label flex">{{item.label}}</label>
    <oda-button ~if="!item?.subIcon" icon="icons:content-copy" @tap.stop="_copyToClipboard"></oda-button>`,
    set item(item) {
        this.icon = item?.icon;
        this.fill = item?.subIcon && 'orange';
    },
    listeners: {
        tap(e) {
            if (this.item.$hasChildren) e.stopPropagation();
        }
    },
    _copyToClipboard() {
        const s = this.icon;
        const input = document.createElement('input');
        input.style.opacity = '0';
        input.style.display = 'fixed';
        document.body.appendChild(input);
        input.value = s;
        input.focus();
        input.select();
        document.execCommand("Copy");
        input.remove();
    }
});