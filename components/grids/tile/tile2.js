import ODA from '/web/oda/oda.js';
import '/web/oda/components/grids/table/table.js';
ODA({
    is: 'oda-tile', extends: 'oda-table', template: /*html*/`
        <style>{{this.tileStyles}}</style>
    `,
    props: {
        allowFocus: true,
        allowSelection: 'all',
        autoWidth: false,
        directoryIcon: 'odant:folder',
        fullDirectoryIcon: 'odant:folder-full',
        itemIcon: 'files:file',
        modeIndex: 0,
        tileWidth: 300,
    },

    get headerColumns() {
        const mode = this.modes[this.modeIndex];
        if (!(mode.name === 'table')) return this.columns;
        this.columns.forEach((col, i) => {
            if (col[this.columnId]) {
                col.order = this.__read(this.settingsId + '/column/' + col[this.columnId] + '/order', col.order || i + 1);
                col.hidden = this.__read(this.settingsId + '/column/' + col[this.columnId] + '/hidden', col.hidden || false);
            } else {
                // this.set(col, 'width', col.width);
                col.order = i + 1;
                col.hidden = false;
            }
            switch (col.fix) {
                case 'left':
                    col.index = col.order - 1000;
                    break;
                case 'right':
                    col.index = col.order + 1000;
                    break;
                default:
                    col.index = col.order;
                    break;
            }
            col.$hasChildren = Boolean(col.items?.length);
        });
        const cols = this.columns.filter(i => !i.hidden);
        if (!this.autoWidth)
            cols.push({ index: 999, template: 'div' });
        if (this.allowCheck !== 'none' && !this.columns.some(i => i.treeMode)) {
            cols.push({ width: 32, index: -999, template: 'oda-table-check', header: 'div', fix: 'left' });
        }
        cols.sort((a, b) => (a.index - b.index));
        cols.filter(i => i.fix === 'left').reduce((res, i) => {
            i.left = res;
            res += i.width || 0;
            return res;
        }, 0);

        cols.filter(i => i.fix === 'right').reverse().reduce((res, i) => {
            i.right = res;
            res += i.width || 0;
            return res;
        }, 0);
        cols.forEach((c, i) => {
            c.id = i;
        });
        return cols;
    },
    get modes() {
        return [
            {
                icon: 'image:view-comfy',
                name: 'tile',
                columns: [{name: 'name', $sort: 1, template: 'oda-tile-cell'}],
                rowStyle: { width: this.tileWidth, height: this._rowHeight },
                containerStyle: {position: 'relative', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', height: 'auto'},
                scrollContainerStyle: {flex: 'auto', minHeight: 'auto', height: '100%', overflow: 'auto'}
            },
            {
                icon: 'icons:view-headline',
                name: 'list',
                columns: [{name: 'name', $sort: 1, template: 'oda-tile-cell'}],
                rowStyle: { width: this.tileWidth, height: this._rowHeight },
                containerStyle: {position: 'relative', display: 'flex', flexDirection: 'column', flexWrap: 'wrap', height: 'auto'},
                scrollContainerStyle: {flex: 'auto', minHeight: 'auto', height: '100%', overflow: 'auto'}
            },
            {
                icon: 'image:view-compact',
                name: 'table',
                columns: [{name: 'label', label: 'Name', $sort: 1, template: 'oda-tile-cell'},{name: 'size', label: 'Size'},{name:'type', label: 'Type'},{name:'time', label: 'Edited'}],
                rowStyle: { width: this.autoWidth ? 'auto' : (this._scrollWidth + 'px') },
                containerStyle: {position: 'relative', display: 'flex', flexDirection: 'row', flexWrap: 'wrap', height: 'auto'},
                scrollContainerStyle: {flex: 'none', minHeight: 'auto', height: 'auto', overflow: 'visible'},
            }
        ]
    } ,
    tileStyles: '',
    _rowStyle: {},

    observers: [
        function useMode(modeIndex, modes, tileWidth) {
            const mode = modes[modeIndex];
            if (!mode) return;

            const scrollContainerStyle = this.$refs['rows-scroll-container'].style;
            Object.assign(scrollContainerStyle, mode.scrollContainerStyle);

            const containerStyle = this.$refs['rows-container'].style;
            Object.assign(containerStyle, mode.containerStyle);

            this.columns = modes[modeIndex].columns;
            this._rowStyle = mode.rowStyle;

            if (mode.name === 'table') {
                this.showHeader = true;
                this.colLines = true;
                this.showFooter = true
            } else {
                this.showHeader = false;
                this.colLines = false;
                this.showFooter = false;
            }
        }
    ],

    _getRowStyle() {
        return this._rowStyle;
    },
});

ODA({
    is: 'oda-tile-cell', template: /*html*/`
        <style>
            :host {
                width: 100%;
            }
            .text {
                width: 100%;
                overflow: hidden;
                text-overflow: ellipsis;
            }
            .text:hover {
                overflow: visible;
            }
        </style>
        <oda-icon :icon="getIcon(item)" :icon-size></oda-icon>
        <div class="text">{{item?.label || item?.name || ''}}</div>
    `,
    item: null,

    getIcon(item) {
        if (item?.icon) return item.icon;
        if (item.$hasChildren) return this. fullDirectoryIcon;
        if (item?.items) {
            if (item.items.length) return this.fullDirectoryIcon;
            else return this.directoryIcon;
        } else return this.itemIcon;
    },
});