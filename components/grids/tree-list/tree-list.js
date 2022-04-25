ODA({is: 'oda-tree-list',
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
            this.items = array;
        }
    ],
    _select(e, item){
        this.focusedItem = item
    },
});

ODA({is: 'oda-tree-list-element',
    template: '<div>{{this._value}}<div>',
    props: {
        item: null,
        _value: ''
    },
    observers: [
        function _setValue(item) {
            let result = '';
            if (item && (typeof item === 'object')) result = ('value' in item) ? item.value : '';
            else result = item;
            this._value = result;
        }
    ]
})