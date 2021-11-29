ODA({is: "oda-grid-cell-header", extends: 'oda-grid-cell-base', template: /*html*/`
        <style>
            :host{
                font-weight: bold;
                @apply --header;
                @apply --flex;
                @apply --horizontal;
                cursor: pointer;
                justify-content: space-around;
                overflow: hidden;
                align-items: initial !important;
                box-sizing: border-box;
            }
            .split{
                cursor: col-resize;
                border: 2px solid transparent;
                transition: border-color .5s;
            }
            .split:hover{
                border-color: silver;
            }
            oda-icon, oda-grid-cell-and {
                opacity: .5;
            }
            :host(:hover)>oda-icon{
                opacity: 1;
            }
            input{
                width: 0px;
                font-size: x-small;
                opacity: .8;
            }
            oda-button{
                padding: 0px;
                min-width: {{Math.round(iconSize * .5)+4}}px;
                min-height: {{Math.round(iconSize * .5)+4}}px;
            }
            span{
                margin: 4px 0px;
                text-overflow: ellipsis;
            }
            div{
                overflow: hidden;
            }
            oda-grid-cell-header{
                box-sizing: border-box;
                /*border: 1px solid red;*/
            }
            .sub-cols{
                border-top: 1px solid var(--dark-background);
                box-sizing: border-box;
            }
            .sub-cols>oda-grid-cell-header:not(:nth-child(1)){
                border-left: 1px solid var(--dark-background);
                box-sizing: border-box;
            }
            oda-icon:after{
                content: attr(sort);
                font-size: small;
                top: 0px;
                position: absolute;
                right: 0px;
            }
            :host .filter-container{
                @apply --content;
                @apply --border;
                padding: 2px;
            }
            :host .filter-input{
                border: none;
            }
        </style>
        <div class="flex horizontal" ~if="col.name" ~style="{flexDirection: col.fix === 'right'?'row-reverse':'row'}">
            <div class="flex horizontal" style="align-items: center;">
                <oda-grid-cell-expand :row="col"></oda-grid-cell-expand>
                <span class="label flex" :text="col.label || col.name" draggable="true" @dragover="_dragover" @dragstart="_dragstart" @dragend="_dragend" @drop="_drop"></span>
                <oda-icon :show="showSort && sortIcon" title="sort" :icon="sortIcon" :sort="sortIndex"></oda-icon>
            </div>
            <div class="split" @tap.stop @track="_track"></div>
        </div>
        <div class="flex horizontal filter-container" ~if="!col.$expanded && col.name && showFilter" style="align-items: center" @tap.stop>
            <input class="flex filter-input" ::value="filter" @tap.stop>
            <oda-button :icon-size="Math.round(iconSize * .5)+2" @tap.stop="showDD" icon="icons:filter" style="align-self: baseline;" title="filter"></oda-button>
            <oda-button :icon-size="Math.round(iconSize * .5)+2" icon="icons:close" @tap.stop="filter = ''" title="clear"></oda-button>
        </div>
        <div class="flex sub-cols horizontal" ~if="col.$expanded">
            <oda-grid-cell-header ~for="col in col.items" :col :show-filter="showFilter" ~style="{width: col.width?col.width+'px':'auto' }" :save-key="col.name ? (col.name || col.id) + col.name : ''" ref="subColumn"></oda-grid-cell-header>
        </div>
        <div class="flex" ~if="!col.name"></div>
`,
    props: {
        showSort() {
            return this.allowSort && !this.col$expanded && (!this.col.$parent || this.col.$parent.$expanded);
        },
        showFilter: false,
        filter: {
            type: String,
            set(val) {
                this.col.$filter = val || null;
            }
        },
        sortIcon() {
            const sort = this.col.$sort;
            return sort === 1 ? 'icons:arrow-drop-down' : sort === -1 ? 'icons:arrow-drop-up' : '';
        },
        sortIndex() {
            return (this.sorts?.filter(s => !s.hidden).indexOf(this.col) + 1) || '';
        },
        minWidth(){
            let width = 15;
            if (this.col.$expanded && this.$refs.subColumn?.length){
                width = this.$refs.subColumn.reduce((res, c) => {
                    res += Math.max(c.minWidth || 15, 15);
                    return res;
                }, 0);
            }else if(this.col.items?.length){
                width = getWidth(this.col);
            }
            return width;
        },
    },
    // updated() {
    //     if (this.table && this.table.set && this.col.$parent) {
    //         this.table.set(this.col, 'width', Math.round(this.offsetWidth));
    //     }
    // },
    listeners: {
        contextmenu: '_menu',
        resize(e){
            if (this.col)
                this.col.width = this.col.width || this.offsetWidth;
        }
    },
    _dragstart(e) {
        this.table._draggableColumn = this.col;
    },
    _dragend(e) {
        this.table._draggableColumn = null;
    },
    _dragover(e) {
        if (this.table._draggableColumn && this.table._draggableColumn !== this.col) {
            e.preventDefault();
        }
    },
    _drop(e) {
        this.table._swapColumns(this.table._draggableColumn, this.col);
        this.table._draggableColumn = null;
    },
    _track(e, d) {
        switch (e.detail.state) {
            case 'start': {
                this.col.width = Math.round(this.offsetWidth);
            } break;
            case 'track': {
                const delta = e.detail.ddx * (this.col.fix === 'right' ? -1 : 1);
                const clientRect = this.getClientRects()[0];
                if (delta > 0 && e.detail.x < (clientRect.x + clientRect.width) && this.col.fix !== 'right') return;
                let p = this.col;

                while (p) {
                    const w = Math.round(p.width + delta);
                    p.width = Math.max(w, this.minWidth);
                    p = p.$parent;
                }
                const setChildrenWidth = (col, delta) => {
                    if (col.items?.length) {
                        const d = Math.round((delta || 0) / col.items.length);
                        col.items.forEach(i => {
                            const w = i.width + d;
                            i.width = Math.max(getMinWidth(i), w);
                            setChildrenWidth(i, d);
                        });
                    }
                };
                setChildrenWidth(this.col, delta);
            } break;
            case 'end': {
                let col = this.col;
                const writeChildren = col => {
                    col.items?.forEach(c => {
                        // this.table.__write(this.table.settingsId + '/col/' + c.id + '/width', c.width);
                        writeChildren(c);
                    });
                };
                writeChildren(col);
                while (col) {
                    // this.table.__write(this.table.settingsId + '/col/' + col.id + '/width', col.width);
                    col = col.$parent;
                }
            } break;
        }
    },
    async _menu(e) {
        e.preventDefault();
        e.stopPropagation();
        const menu = [
            {
                label: this.table.groups.includes(this.col) ? 'Ungrouping' : 'Grouping' + ' by this column',
                icon: 'icons:open-in-browser',
                execute: () => {
                    if (this.table.groups.includes(this.col))
                        this.table.removeGroup(this.col);
                    else
                        this.table.addGroup(this.col);
                }
            },
            {
                label: 'Hide this column',
                icon: 'icons:visibility-off',
                execute: () => {
                    this.col.hidden = !this.col.hidden;
                    // this.table.__write(this.table.settingsId + '/column/' + this.column.name + '/hidden', this.column.hidden);
                }
            },
            {
                label: (this.table.showGroupingPanel ? 'Hide' : 'Show') + ' grouping panel',
                icon: 'icons:credit-card',
                group: 'more', execute: () => {
                    this.table.showGroupingPanel = !this.table.showGroupingPanel;
                }
            },
            {
                label: (this.table.showFilter ? 'Hide' : 'Show') + ' filter row',
                icon: 'icons:filter',
                execute: () => {
                    this.table.showFilter = !this.table.showFilter;
                }
            }
        ];
        const res = await ODA.showDropdown('oda-menu', { parent: this, iconSize: this.iconSize, items: menu, title: 'Column menu', allowClose: true });
        res?.focusedItem.execute();
    },
    _sort(e) {
        e.stopPropagation();
        if (this.allowSort) {
            const sort = this.col.$sort;
            this.col.$sort = sort === 1 ? -1 : sort === -1 ? 0 : 1;
        }
    },
    async showDD(e) {
        const dataSet = this.items.reduce((res, i) => {
            const value = i[this.row.name];
            if (value) {
                res.add(i);
            }
            return res;
        }, []);
        const list = await ODA.createComponent('oda-grid', { columns: [this.row], dataSet });
        this.async(() => {
            list.focus();
        }, 300);
        const res = await ODA.showDropdown(list, {}, { parent: this });
        console.log(res);
    }
});
function getMinWidth(col) {
    if (col.items?.length) {
        return col.items.reduce((res, c) => res + Math.max(getMinWidth(c) || 0, 15), 0);
    } else {
        return 15;
    }
}
function getWidth(col){
    if (col.items?.length) {
        return col.items.reduce((res, c) => res + Math.max(getWidth(c) || 0, 15), 0);
    } else {
        return Math.max(col.width, 15);
    }
}







cells: {
    ODA({is: "oda-grid-cell-base",
        template:/*html*/`
            <style>
                :host{
                    @apply --horizontal;
                    align-items: center;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    min-height: 1px;
                    min-width: 1px;
                }
                :host *{
                    text-overflow: ellipsis;
                    position: relative;
                }
                .expander{
                    cursor: pointer;
                }
            </style>
        `,
        col: null

    });
    ODA({is: 'oda-grid-cell-expand', extends: "oda-grid-cell-base",
        template:/*html*/`
            <oda-icon ~if="row?.$level !== -1" :icon :disabled="hideIcon" :icon-size @dblclick.stop.prevent @tap.stop.prevent="_toggleExpand" @down.stop.prevent  class="expander" ~style="{opacity: (hideIcon || !icon)?0:1}"></oda-icon>
        `,
        get hideIcon() {
            return this.row?.hideExpander || (!this.row?.items?.length && !this.row?.$hasChildren);
        },
        get icon() {
            if (!this.row || this.hideIcon)
                return '';
            if (this.row.$loading)
                return this.iconExpanding;
            if (this.row.$expanded)
                return this.iconExpanded;
            return this.iconCollapsed;
        },
        _toggleExpand(e, d) {
            if (!this.row.hideExpander) {
                this.row.$expanded = !this.row.$expanded;
                // this.fire('expanded-changed', this.row.$expanded);
            }
        }
    });

    tree: {
        ODA({is: 'oda-grid-cell-tree', extends: 'oda-grid-cell-base', template:/*html*/`
            <style>
                :host *{
                  --line-border: 1px solid silver;
                    /*align-items: center;*/
                    background-color: unset;
                }
                :host:last-child .step {
                    height: 50%;
                }
                .icon{
                    height: auto;
                    align-items: center;
                    align-content: center;
                }
                .step {
                    position: relative;
                    height: 100%;
                }
                .step > .end-step{
                    position: absolute;
                    right: 0;
                    height: 100%;
                }
            </style>
            <div class="step no-flex" ~style="{width: (row.$level || 0) * stepWidth + 'px', ...stepStyle}">
                <div class="end-step" ~style="endStepStyle"></div>
            </div>
            <oda-grid-cell-expand class="no-flex" :row></oda-grid-cell-expand>
            <oda-grid-check class="no-flex" ~if="(row?.allowCheck !== 'none') || (allowCheck && allowCheck !== 'none' && !row.hideCheckbox)" :col :row></oda-grid-check>
            <div ~is="row?.[col[columnId]+'.template'] || row?.template || col?.template || defaultTemplate || 'span'" :col :row class="flex">{{row[col[columnId]]}}</div>`,
            get endStepStyle() {
                if (!this.showTreeLines || !this.stepWidth) return {};
                const thickness = this.treeLineStyle.width || 1;
                const pre = `${Math.round((this.iconSize + thickness) / 2)}px`;
                const post = `${pre} + ${thickness}px`;
                const color = this.treeLineStyle.color || 'rgba(0, 0, 0, 0.25)';
                return {
                    width: this.stepWidth - Math.round((this.iconSize + thickness) / 2) + 'px',
                    background: `linear-gradient(0deg, transparent 0, transparent calc(${pre}), ${color} calc(${pre}), ${color} calc(${post}), transparent calc(${post}))`
                }
            },
            get stepStyle() {
                if (!this.showTreeLines || !this.iconSize) return {}
                const step = this.stepWidth;
                const thickness = this.treeLineStyle?.width || '1px';
                const color = this.treeLineStyle?.color || 'rgba(0, 0, 0, 0.25)';
                let str = '';
                const lineStart = Math.round((this.iconSize - thickness) / 2);
                const lineEnd = lineStart + thickness;
                str = `, transparent, transparent ${lineStart}px, ${color} ${lineStart}px, ${color} ${lineEnd}px, transparent ${lineEnd}px, transparent ${step}px`;
                return { background: `repeating-linear-gradient(90deg ${str})` };
            },
            get stepWidth() {
                return this.treeStep ?? this.iconSize ?? 0;
            }
        });

        ODA({is: "oda-empty-tree-cell", extends: "oda-icon, oda-grid-cell-base", template: `
        <label class="label flex">nothing</label>`,
            props: {
                icon: 'notification:do-not-disturb'
            }
        });

        ODA({is: "oda-grid-check", extends: 'oda-grid-cell-base', template: `
            <oda-icon class="no-flex" @down.stop.prevent="_toggleChecked" @tap.stop.prevent :icon :icon-size ~style="{padding: Math.round(iconSize*.2)+'px'}"></oda-icon>`,
            props: {
                icon() {
                    if (!this.row.checked || this.row.checked === 'unchecked')
                        return this.iconUnchecked;
                    if (this.row.checked === true || this.row.checked === 'checked')
                        return this.iconChecked;
                    return this.iconIntermediate;
                }
            },
            _toggleChecked(e) {
                if (this.allowCheck === 'none') return;

                const checkChildren = (row) => {
                    (row.items || []).forEach(i => {
                        if (row.checked !== 'intermediate') {
                            i.checked = row.checked;
                            updateCheckedRows(i);
                            checkChildren(i);
                        }
                    })
                };
                const updateChecked = (row) => {
                    row.checked = (row.items || []).reduce((res, i) => {
                        if (res === 'intermediate')
                            return res;
                        else if (res === undefined)
                            res = i.checked ? i.checked : false;
                        else if (res !== ((i.checked === undefined) ? false : i.checked))
                            res = 'intermediate';
                        return res;
                    }, undefined);
                    updateCheckedRows(row);
                };
                const updateCheckedRows = (row) => {
                    const i = this.checkedRows.indexOf(row);
                    if (row.checked && i === -1)
                        this.checkedRows.push(row);
                    else if (!row.checked && i !== -1)
                        this.checkedRows.splice(i, 1);
                };

                this.row.checked = !(!!this.row.checked);
                updateCheckedRows(this.row);
                if (this.allowCheck !== 'single') {
                    if (this.allowCheck === 'double' || this.allowCheck === 'down') {
                        checkChildren(this.row);
                    }
                    if (this.allowCheck === 'double' || this.allowCheck === 'up') {
                        let parent = this.row.$parent;
                        while (parent) {
                            updateChecked(parent);
                            parent = parent.$parent;
                        }
                    }
                }

                this.table.fire('checked-changed');
            }
        });
    }

    ODA({is: "oda-grid-error", extends: "oda-grid-cell-base", template: /*html*/`
            <oda-icon icon="icons:error"></oda-icon>
            <span class="label flex" :text="row.error"></span>`
    });

    const MHW = 24; //min header width


    ODA({is: "oda-grid-cell-group", extends: 'oda-grid-cell-base',
        template: /*html*/`
            <style>
                :host{
                    justify-content: left;
                    @apply --header;
                    position: sticky;
                    position: -webkit-sticky;
                    left: 0px;
                    top: 0px;
                    position: sticky;
                }
                span{
                    @apply --flex;
                }
            </style>
            <oda-grid-cell-expand :item ~style="{marginLeft: row.$level * iconSize + 'px'}" @expanded-changed="expandedChanged"></oda-grid-cell-expand>
            <span :text="\`\${row.name}:\`" style="font-size: small; margin-right: 4px;" class="no-flex"></span>
            <span :text="row.value" style="font-weight: bold; margin-right: 4px;" class="no-flex"></span>
            <span ~if="row.items" :text="\`[\${row.items?.length}]\`" class="no-flex"></span>`,
        expandedChanged() {
            this.table.setScreenExpanded?.(this.item);
        }
    });

    ODA({is: "oda-grid-cell-footer", extends: 'oda-grid-cell-header', template:/*html*/`
        <style>
            :host{
                justify-content: flex-end;
                padding: 4px;
                @apply --dark;
                text-align: right;
                font-size: smaller;
            }
        </style>`
    });
}