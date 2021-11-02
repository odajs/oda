import ODA from '../../../oda.js';
import '../../buttons/icon/icon.js';

const VIEW_MODES = [
    {
        icon: 'icons:view-week',
        name: 'tile',
        style: `.sticky { display: flex; flex-direction: horizontal; padding: 15px; flex-wrap: wrap;} .cell{width: 250px; margin:1px;}`
    },
    {
        icon: 'icons:view-headline',
        name: 'list',
        style: '.sticky{display: flex; flex-direction: column; padding: 15px;} .cell{margin:1px;}'
    },
    {
        icon: 'image:view-compact',
        name: 'table',
        style: '.cell{margin:1px;}',
        columns: [{name: 'label', label: 'Name'},{name: 'size', label: 'Size'},{name:'type', label: 'Type'},{name:'time', label: 'Edited'}],
        template: 'oda-tile-table-item',
    },
    {
        icon: 'image:view-comfy',
        name: 'icons',
        style: `.sticky{ display: flex; flex-direction: horizontal; padding: 15px; flex-wrap: wrap;} .cell{width: 150px; margin:1px;  display: flex; flex-direction: column; margin-top: 5px; align-items: center; overflow: hidden;}`,
    },
];

ODA({ // It is addon for components: oda-table, oda-tree
    is: 'oda-tile', template: /*html*/`
        <style>
            .row {
                margin: 1px;
            }
            .row:hover {
                outline: 1px dotted silver;
            }
            {{_style}}
        </style>
    `,

    props: {
        defaultTemplate: 'oda-tile-item',
        _defaultTemplate: '',
        currentNode: {
            type: Object,
            set(n, o) {
                if (n && (n !== o) && (n !== this._currentNode)) this.updateCurrentNode(n);
            }
        },
        _currentNode: Object, // for comparing of current and previous state
        cols:{
            type: Array,
            get(){
                return this.columns.length?this.columns:[{name: this.keyName}]
            }
        },
        preventExpanding: true,
        viewMode: {
            type: String,
            list: VIEW_MODES,
            default: VIEW_MODES[0]
        },
        _style: '',
        viewModes: VIEW_MODES,
        tableModeColumns: [],
        viewModeIndex: 0
    },

    created() {
        if (this.defaultTemplate) this._defaultTemplate = this.defaultTemplate;
    },

    observers: [
        function _byViewModeIndex(viewModeIndex) {
            this.viewMode = this.viewModes[viewModeIndex];
        },
        function _byViewMode(viewMode, tableModeColumns) {
            this._style = '';
            this.columns = [];
            this.colLines = false;
            this.showHeader = false;

            this._style = viewMode.style;
            if ( viewMode.name === 'table') {
                this.defaultTemplate = viewMode.template || 'oda-tile-table-item';
                this.columns = (tableModeColumns && tableModeColumns.length) ? tableModeColumns : viewMode.columns;
                this.showHeader = true;
                this.colLines = true;
            } else {
                this.defaultTemplate = viewMode.template || this._defaultTemplate;
            }
        }
    ],
    listeners: {
        'row-dblclick'(e) {
            e.stopPropagation();
            this.updateCurrentNode(e.detail.value);
        }
    },
    async updateCurrentNode(item) {
        if (!item) return;
        const items = await this._beforeExpand(item);
        if (items) {
            this.dataSet = items;
            this.setCurrentNode(item);
        } else {
            // to do
        }
    },
    setCurrentNode(node) {
        if (this.currentNode !== node) {
            this._currentNode = node;
            this.currentNode = node;
        }
    }
});

import '../table/table.js';
import '../../buttons/icon/icon.js';
ODA({
    is: 'oda-tile-item', extends: 'oda-table-cell-base',
    template: /*html*/`
        <oda-icon :icon="icon"></oda-icon>
        <div class="label" ~if="label">{{label}}</div>
    `,
    props: {
        icon: {
            type: Object
        },
        focused: false,
        defaultIcon: 'files:document',
        folderIcon: 'icons:folder',
        label: {
            type: String,
            get() {
                const item = this.item;
                return item ? (item.label || item.name) : '';
            }
        }
    },

    observers: [
        function _setIcon(item) {
            if (item) {
                this.icon = item.icon || (item.items ? this.folderIcon : this.defaultIcon);
            }
        }
    ]
});

ODA({
    is: 'oda-tile-table-item', extends: 'oda-table-cell-base',
    template: /*html*/`
        <style>
            :host {
                @apply --horizontal;
            }
        </style>
        <div ~is="_template" ~if="_labelCol" :item="item" style="padding-left: 15px"></div>
        <div ~if="!_labelCol" style="padding-left: 15px">{{_value}}</div>
    `,
    props: {
        _value: '',
        _item: {
            get() {
                return this.item; // for redefining in inherit
            }
        },
        _labelCol: false,
        _template: 'oda-tile-item'
    },
    observers: [
        async function _setValue(_item, column) {
            if (_item && column) {
                this._value = (column.name in _item) ? _item[column.name] : '';
                if ((column.name === 'label') || (column.name === 'name')) {
                    this._labelCol = true;
                }
            }
        }
    ]
});