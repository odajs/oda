import '../../buttons/button/button.js';
ODA({ is: 'oda-tabs',
    template: `
        <style>
            :host {
                @apply --horizontal;
                white-space: nowrap;
                overflow: hidden;
            }
            .tab {
                padding: 4px;
                margin: 2px 0 0 2px;
                cursor: pointer;
                background-color: lightgray;
                opacity: .4;
            }
            .tab:hover {
                opacity: .6;
            }
            .tab[focused] {
                color: var(--selected-color);
                opacity: 1;
            }
        </style>
        <div class="flex horizontal" style="border-bottom: 1px solid var(--border-color);">
            <div ~for="items" :focused="item === (focusedItem || items[0])" @tap="focusedItem = item" class="tab border" style="border-bottom: none; border-top-left-radius: 4px; border-top-right-radius: 4px;" ~style="{order: item.pinned ? -1 : 0}">
                <div :is="item.is || 'span'">{{item.label}}</div>
            </div>
        </div>
        <slot :name="(focusedItem || items[0]).label"></slot>
    `,
    items: [],
    focusedItem: null,
    props: {
        align: {
            default: 'horizontal',
            list: ['vertical', 'horizontal']
        },
        allowClose: true
    }
})