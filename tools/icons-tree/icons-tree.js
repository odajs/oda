import '../../components/grids/tree/tree.js';
const ODA_ICON_PATH = '/oda/buttons/icon/icon.js';
let iconsPath = import.meta.url;
iconsPath = iconsPath.slice(0, iconsPath.lastIndexOf('/')) + '/../../icons/svg/';
const pars = new DOMParser();
function getIconItem(el, group) {
    const obj = {};
    obj.name = el.getAttribute('id');
    obj.label = obj.name;
    obj.icon = group ? `${group}:${obj.name}` : '';
    return obj;
}
function getIconFolder(template) {
    const obj = {};
    obj.name = template.getAttribute('name');
    obj.label = obj.name
    // obj.icon = `${obj.name}:${template.getAttribute('icon')}`;
    obj.icon = 'enterprise:folder';
    obj.subIcon = `${obj.name}:${template.getAttribute('icon')}`
    const content = template.content;
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
ODA({
    is: 'oda-icons-tree', extends: 'oda-tree',
    props: {
        // allowFocus: true,
        lazy: true,
        allowDrag: true,
        allowSort: true,
        iconsList: {
            type: Array,
            async set(v) {
                this.dataSet = await loadIcons(v);
                this.suggestions = this.dataSet.flatMap(i => i.items).reduce((res, i) => {
                    res.push(i.name);
                    return res;
                }, []);
            }
        },
        columns: [{ name: 'label', treeMode: true, $sort: 1 }],
        filterVal: {
            default: '',
            set(filter) {
                this.columns[0].$filter = filter === '*' ? '' : filter;
                this.hideRoot = Boolean(filter);
            }
        },
        defaultTemplate: 'oda-icons-icon',
        rootPath: '/',
        suggestions: []
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
    // async _beforeExpand(item) {
    //     return item.items;
    // },
    async ready() {
        this.iconsList = await (await fetch(iconsPath + 'info.json')).json();
        this.sorts = [this.columns[0]]; //todo: костыль, убрать
    }
});

ODA({
    is: 'oda-icons-icon',
    extends: 'oda-icon, oda-table-cell-base',
    template: /*html*/`
    <style>
        :host{
            cursor: default;
        }
        :host(:not(:hover)) > oda-button{
            display: none;
        }
        oda-button{
            opacity: 0.25;
        }
        oda-button:hover{
            opacity: 1;
        }
    </style>
    <oda-icon ~if="item?.subIcon" style="position: absolute; transform: translate(0px, 2px) scale(0.5);" :icon="item.subIcon || ''"></oda-icon>
    <label class="label flex">{{item.label}}</label>
    <oda-button ~if="!item?.subIcon" icon="icons:content-copy" @tap="_copyToClipboard"></oda-button>`,
    props: {
        item: {
            set(item) {
                this.icon = item.icon;
                this.fill = item?.subIcon ? 'orange' : '';
            }
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