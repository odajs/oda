import ODA from '../../../oda.js';
ODA({
    is: 'oda-tree-list',
    template: /*html*/`
        <style>
            :host {
                overflow: auto;
            }
            .list-node {
                box-sizing: border-box;
                margin: 1px;
                border-bottom: 1px solid transparent
            }
            .horizontal {
                @apply --horizontal;
            }
            .vertical {
                @apply --vertical;
            }
        </style>
        <div ~if="headerTemplate" ~is="headerTemplate"></div>
        <div :class="direction" style="margin: 1px">
            <div class="list-node" ~for="item in items" ~is="item.template || bodyTemplate" :item="item" :focused="item === focusedItem" @down.stop="_select($event, item)"></div>
        </div>
        <div ~if="footerTemplate" ~is="footerTemplate"></div>
    `,
    props: {
        dataSet: [],
        items: [],
        focusedItem: Object,
        selection: [],

        hideRoot: false,
        direction: {
            type: 'string',
            default: 'vertical',
            enum: [
                'vertical',
                'horizontal'
            ]
        },
        preventExpanding: false,

        bodyTemplate: 'oda-tree-list-element',
        headerTemplate: '',
        footerTemplate: '',

    },

    // listeners: {
    //     expand: "_onExpand",
    //     dragend: '_onDragEnd',
    //     resize: '_scroll'
    // },

    observers: [
        function setItems(dataSet) {
            if (!dataSet) return [];
            let array = dataSet.map(el => {
                if (typeof el === 'object') {
                    if (!('value' in el)) {
                        el = Object.assign({value: el.label || el.name || ''},el);
                    }
                    return el;
                } else return {value: el};
            });
            // if (this.hideRoot){
            //     array = this._hideRoot(array);
            // }

            // if (!this.preventExpanding) {
            //     if (array.length > 0) {
            //         this._expanding(array, 0);
            //         if (array.length === 1) {
            //             const i = array[0];
            //             if (!i.$group && !i.hideExpander && !i.$expanded) {
            //                 i.$expanded = true;
            //                 this.async(() => {
            //                     this.fire('expand', i);
            //                 });
            //             }
            //         }
            //     }
            // }

            // array = this.filter(array);
            // if (this.groups.length) {
            //     array = this.group(array);
            // } else array = this.sort(array);
            this.items = array;
        }
    ],

    // _expanding(data, level, parent) {
    //     let expands = data.filter(i => {
    //         i.$level = level;
    //         i.$parent = parent;
    //         if (i.$expanded && !i.hideExpander){
    //             if(i.items){
    //                 if (i.items.length === 1){
    //                     const item = i.items[0];
    //                     // if (!Object.keys(item).length)
    //                     // item.template = this.loadingTemplate;
    //                     if (!Object.keys(item).length || item.template === this.loadingTemplate)
    //                         this.fire('expand', i);
    //                 }
    //             }
    //             else{
    //                 this.fire('expand', i);
    //             }
    //         }
    //         return i.$expanded && i.items && (i.items.length || i.items.then);
    //     });
    //     level++;
    //     expands.forEach(async e => {
    //         if (e.items.then){
    //             e.items = await e.items;
    //         }
    //         e.items.forEach(i => {
    //             if (this.allowCheck !== 'none' && this.allowCheck !== 'single')
    //                 if (e.checked === true){
    //                     i.checked = true;
    //             }
    //             i.$level = level;
    //             i.$parent = e;
    //         });
    //         let idx = array.indexOf(e);
    //         array.splice(idx + 1, 0, ...e.items);
    //         expanding(e.items, level, e);
    //     });
    // },

    // filter(array) {
    //     this.filters.forEach(col => {
    //         let name = col.name;
    //         let filter = String(col.$filter).toLowerCase().replace('&&', '&').replace('||', '|');
    //         filter = filter.replaceAll(' and ', '&').replaceAll('&&', '&').replaceAll(' or ', '|').replaceAll('||', '|');
    //         filter = filter.split('&').reduce((res, and) => {
    //             let or = and.split('|').reduce((res, or) => {
    //                 let space = or.split(' ').reduce((res, space) => {
    //                     if (space.trim())
    //                         res.push(`String(val).toLowerCase().includes('${space.trim()}')`);
    //                     return res;
    //                 }, []).join(' || ');
    //                 if (space)
    //                     res.push(`(${space})`);
    //                 return res;
    //             }, []).join(' || ');
    //             if (or)
    //                 res.push(`(${or})`);
    //             return res;

    //         }, []).join(' && ');
    //         let func = new Function('val', `return (${filter})`);

    //         array = array.filter(item => {
    //             return func(item[name]);
    //         });
    //     });
    //     return array;
    // },

    // group(array) {
    //     const addChildItemsToGroup = (item, group) => {
    //         if (group.value)
    //             item.$groupParent = group;
    //         if (item.$expanded && item.items && item.items.length > 0) {
    //             const idx = group.items.indexOf(item);
    //             group.items.splice(idx + 1, 0, ...item.items);
    //             item.items.forEach(i => addChildItemsToGroup(i, group));
    //         }
    //     };
    //     let grouping = (data, level, parent = '-') => {
    //         let group = this.groups[level];
    //         let rows = [];
    //         if (!group) {
    //             Object.assign(rows, data);
    //             if (this.showGroupFooter)
    //                 rows.push({$role: 'footer'});
    //             return rows;
    //         }
    //         let col = group;
    //         let name = col.name;
    //         if (!group.map) {
    //             group.map = new Map();
    //         }
    //         let groups = group.map.get(parent);
    //         groups = data.reduce((res, item) => {
    //             if (res.every(g => g.items.every(r => r !== item))) {
    //                 let value = item[name];
    //                 let obj = res.find(r => {
    //                     return r.value === value;
    //                 });
    //                 if (!obj) {
    //                     obj = groups && groups.find(r => {
    //                         return r.$expanded && r.value === value;
    //                     });
    //                     const newGroup = {
    //                         value: value,
    //                         name: name,
    //                         $col: col,
    //                         template: this.defaultGroupTemplate,
    //                         $level: level,
    //                         $expanded: obj !== undefined,
    //                         items: [item],
    //                         $group: true,
    //                         parent: parent
    //                     };
    //                     addChildItemsToGroup(item, newGroup);
    //                     res.push(newGroup);
    //                 }
    //                 else {
    //                     obj.items.push(item);
    //                     addChildItemsToGroup(item, obj);
    //                 }
    //             }
    //             return res;
    //         }, []);
    //         if (this.categories.allowSort){
    //             groups.sort((a, b) => {
    //                 return a.value > b.value ? 1 : -1
    //             });
    //         }
    //         group.map.set(parent, groups);
    //         groups.forEach(g => {
    //             if (g.value)
    //                 rows.push(g);
    //             if (!g.value || g.$expanded) {
    //                 rows.push(...grouping(g.items, level + 1, parent + '|' + g.name + ':' + g.value));
    //             }
    //         });
    //         return rows;
    //     };
    //     return grouping(array, 0);
    // },

    // sort(array) {
    //     let result = array;
    //     if (this.sorts.length) {
    //         let name, A, B, s;
    //         result = array.sort((a, b) => {
    //             return this.sorts.reduce((result, col) => {
    //                 name = col.name;
    //                 A = a[name] || '';
    //                 B = b[name] || '';
    //                 return result || (((B < A) - (A < B)) * col.$sort);
    //             }, 0);
    //         });
    //     }
    //     return result;
    // },

    // async _onExpand(e, d){
    //     e.stopPropagation();
    //     const items = (await this._beforeExpand(d.value)) || [];
    //     if (d.value.items === items) {
    //         this._refresh();
    //         return;
    //     }
    //     d.value.items = items;
    //     d.value.items.forEach(async i=>{
    //         if (i.items && i.items.then) {
    //             const p = await i.items;
    //             if (p && p.length>0) {
    //                 i.items = [{template: this.loadingTemplate}]
    //             }
    //             else
    //                 i.items = [];
    //         }
    //         return i.items;
    //     });
    //     this._refresh();
    // },
    // _beforeExpand(item){
    //     return item.items;
    // },

    _select(e, item){
        this.focusedItem = item
    },

    // _scroll(e){
    //     // if (this.$refs.header)
    //     //         this.headerHeight = this.$refs.header.offsetHeight;
    //     //     if (this.$refs.body) {
    //     //         this._scrollTop = this.$refs.body.scrollTop;
    //     //         this._scrollWidth = this.$refs.body.scrollWidth;
    //     //         this._height = this.$refs.body.offsetHeight;
    //     //     }
    //     //     this.fire('scroll');
    // },

});

ODA({
    is: 'oda-tree-list-element',
    template: '<div>{{this._value}}<div>',
    props: {
        item: null,
        _value: ''
    },
    observers: [
        function _setValue(item) {
            let result = '';
            if (item && (typeof item === 'object')) {
                result = ('value' in item) ? item.value : '';
            } else result = item;
            this._value = result;
        }
    ]
})