ODA({ is: 'oda-xquery', imports: '@oda/splitter2',
    template: /*html*/`
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                width: 100%;
                height: 100vh;
                box-sizing: border-box;
            }
        </style>
        <main class="vertical flex">
            <div class="horizontal" style="overflow: hidden; height: 50%;">
                <div class="vertical" style="width: 70%;">
                    <oda-xquery-accordion-panel :item="panels.input"></oda-xquery-accordion-panel>
                    <oda-xquery-accordion-panel :item="panels.query"></oda-xquery-accordion-panel>
                </div>
                <oda-splitter2 size="3px" color="darkgray" style="opacity: .3"></oda-splitter2>
                <div class="vertical flex" style="overflow: hidden; flex: 1">
                    <oda-xquery-accordion-panel :item="panels.examples"></oda-xquery-accordion-panel>
                    <oda-xquery-accordion-panel :item="panels.settings"></oda-xquery-accordion-panel>
                </div>
            </div>
            <oda-splitter2 direction="horizontal" size="3px" color="darkgray" style="opacity: .3"></oda-splitter2>
            <div class="horizontal flex">
                <oda-xquery-accordion-panel class="no-flex" :item="panels.results" style="width: 50%;"></oda-xquery-accordion-panel>
                <oda-splitter2 size="3px" color="darkgray" style="opacity: .3"></oda-splitter2>
                <oda-xquery-accordion-panel class="flex" :item="panels.table"></oda-xquery-accordion-panel>
            </div>
        </main>
    `,
    get panels() {
        return {
            input: { label: 'XML Input', opened: false, content: 'XML Input ...' },
            query: { label: 'XPath/XQuery', opened: true, content: 'XPath/XQuery ...' },
            examples: { label: 'Examples', opened: true, content: 'Examples ...' },
            settings: { label: 'Settings', opened: false, content: 'Settings ...', icon: 'icons:settings' },
            results: { label: 'Query results', open: true, content: 'Query results ...' },
            table: { label: 'Table', open: true, content: 'Table ...' }
        }
    }
})

ODA({ is: 'oda-xquery-accordion-panel', imports: '@oda/icon',
    template: /*html*/`
        <style>
            :host {
                @apply --vertical;
                flex: {{item?.open || item?.opened ? 1 : 0}};
            }
        </style>
        <div class="header" style="height: 28px; border: 1px solid gray; cursor: pointer; margin: 1px; display: flex; align-items: center;" @tap="item.opened=!item.opened">
            <oda-icon ~if="!item?.open" :icon="item?.open || item?.opened ? 'icons:arrow-drop-down' : 'icons:arrow-drop-down:270'" icon-size="18"></oda-icon>    
            <oda-icon :icon="item?.icon || 'icons:check'" icon-size="16"></oda-icon>    
            <span style="padding-left: 8px">{{item.label}}</span>
        </div>
        <div ~if="item?.open || item?.opened" class="content panel" style="flex: 1; border: 1px solid darkgrey; margin: 1px;">{{item.content}}</div>
    `,
    item: {}
})
