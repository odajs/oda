import '../../buttons/button/button.js';
ODA({is: 'oda-tabs',
    template:`
        <style>
            :host{
                @apply --horizontal;
                white-space: nowrap;
                overflow: hidden;
            }
            .tab{
                @apply --horizontal;
                align-items: center;
                padding: 2px 4px;
            }
        </style>
        <div class="no-flex horizontal">
            <div ~for="items" :focused="item === focusedItem" @tap="focusedItem = item" class="tab">
                <div :is="item.is || 'span'">{{item.label}}</div>
            </div>
        </div>
    `,
    items:[],
    focusedItem: null,
    props:{
        align: {
            default: 'horizontal',
            list:['vertical', 'horizontal']
        },
        allowClose: true
    }
})