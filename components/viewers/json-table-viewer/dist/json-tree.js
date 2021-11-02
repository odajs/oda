import '../../../grids/tree/tree.js';
import ODA from '../../../../oda.js';
ODA({
    is: 'oda-json-tree',
    extends: 'oda-tree',
    props: {
        columns: [
            { name: 'item', treeMode: true }
        ],
        showTreeLines: true,
        lazy: true,
        item: {
            type: Object,
            set(n) {
                if (n && n.item) {
                    // n = {
                    //     a: 1,
                    //     b: 2,
                    //     c: 3,
                    //     d: {
                    //         da: 1,
                    //         db: 2
                    //     },
                    //     e: [
                    //         {
                    //             ea: 1,
                    //             eb: 2,
                    //             ec: {
                    //                 eca: 1
                    //             }
                    //         }
                    //     ]
                    // };

                    // n = {
                    //     a: 1,
                    //     b: 2
                    // }

                    this.dataSet = [this.makeDataSetItem(n.item)];
                    //this.dataSet = [{ item: { key: 'one'}, items: this.makeDataSetItem(n), template: 'oda-json-item-object-start', end: '!!!' }];
                }
            }
        },
        style: `
            .key {
                font-weight: 600;
                color: #5f5f5f;
                }
            .value {
                font-weight: 300;
                color: #cc5252;
            }
        `
    },

    makeDataSetItem(item, params = {}) {
        if (Array.isArray(item)) return this.codeArray(item, { level: params.level || 0});
        else if (typeof item === 'object') return this.codeObject(item, { level: params.level || 0 });
    },
    codeSimple(key, value, params) {
        return {
            item: { key: key, value: value },
            end: params.end || '',
            template: 'oda-json-item-simple',
            $level: params.level || 0,
            style: this.style
        }
    },
    codeArray(array, params = {}) {
        const arr = array.map(elem => {
           return this.makeDataSetItem(elem, {level: (params.level || 0) + 1});
        });
        arr.push({ template: 'oda-json-item-array-end', end: params.end || ''});
        return {
            item: { key: params.key || '' },
            template: 'oda-json-item-array-start',
            items: arr,
            $expanded: true,
            $level: params.level,
            end: params.end || '',
            style: this.style
        };
    },
    codeObject(object, params = {}) {
        const arr = Object.keys(object).map((prop, i, props) => {
            const value = object[prop];
            if (Array.isArray(value)) {
                return this.codeArray(value, {
                    key: prop,
                    end: i < props.length - 1 ? ',' : '',
                    level: (params.level || 0) + 1
                });
            } else if (typeof value === 'object') {
                return this.codeObject(value, {
                    key: prop,
                    end: i < props.length - 1 ? ',' : '',
                    level: (params.level || 0) + 1
                });
            } else return this.codeSimple(prop, value, {
                end: i < props.length - 1 ? ',' : '',
                level: (params.level || 0) + 1
            });
        });
        arr.push({ template: 'oda-json-item-object-end', end: params.end || ''});
        return {
            item: {key: params.key || ''},
            template: 'oda-json-item-object-start',
            items: arr,
            $expanded: true,
            $level: params.level || 0,
            end: params.end || '',
            style: this.style
        };
    }
});
ODA({
    is: 'oda-json-item-simple', template: /*html*/`
        <style>{{item.style || ''}}</style>
        <span ~if="item && item.item">"<span class="key">{{item.item.key}}</span>": "<span class="value">{{item.item.value}}</span>"{{item.end || ''}}</span>
    `,
    props: {
        item: ''
    }
});
// ODA({ is: 'oda-json-item-value', template: `<span>"{{item}}"</span>`, props: {item: ''} });
ODA({
    is: 'oda-json-item-array-start', template: /*html*/`
        <style>{{item.style || ''}}</style>
        <span ~if="item.item && item.item.key">"<span class="key">{{item.item.key}}</span>": [</span>
        <span ~if="!item.item || !item.item.key">[</span>
        <span ~if="item && !item.$expanded">...]{{item.end || ''}}</span>
    `,
    props: {
        item: ''
    }
});
ODA({ is: 'oda-json-item-array-end', template: /*html*/`<span>]{{item.end || ''}}</span>`, props: { item: '' } });
ODA({
    is: 'oda-json-item-object-start', template: /*html*/`
        <style>{{item.style || ''}}</style>
        <span ~if="item.item && item.item.key">"<span class="key">{{item.item.key}}</span>": {</span>
        <span ~if="!item.item || !item.item.key">{</span>
        <span ~if="item && !item.$expanded">...}{{item.end || ''}}</span>
    `,
    props: {
        item: ''
    }
});
ODA({ is: 'oda-json-item-object-end', template: /*html*/` <span >}{{item.end || ''}}</span>`, props: { item: '' }});
