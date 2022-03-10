ODA({ is: 'oda-xquery', imports: '@oda/splitter2, @oda/ace-editor, @tools/property-grid2',
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
                <div class="vertical no-flex" style="width: 70%;">
                    <oda-xquery-accordion-panel :item="panels.input">
                        <oda-ace-editor mode="xml" ::value="panels.input.content" highlight-active-line="false" show-print-margin="false" min-lines=1></oda-ace-editor>
                    </oda-xquery-accordion-panel>
                    <oda-xquery-accordion-panel :item="panels.query">
                        <oda-ace-editor mode="xquery" ::value="panels.query.content" highlight-active-line="false" show-print-margin="false" min-lines=1></oda-ace-editor>
                    </oda-xquery-accordion-panel>
                </div>
                <oda-splitter2 size="3px" color="darkgray" style="opacity: .3"></oda-splitter2>
                <div class="vertical flex" style="overflow: hidden; flex: 1">
                    <oda-xquery-accordion-panel :item="panels.history"></oda-xquery-accordion-panel>
                    <oda-xquery-accordion-panel :item="panels.examples"></oda-xquery-accordion-panel>
                    <oda-xquery-accordion-panel :item="panels.settings">
                        <oda-property-grid2 id="pg" :io="settings" label="oda-xquery settings" show-buttons="false" group="false" style="overflow: auto; height: 100%; padding: 0;"></oda-property-grid2>
                    </oda-xquery-accordion-panel>
                </div>
            </div>
            <oda-splitter2 direction="horizontal" size="3px" color="darkgray" style="opacity: .3"></oda-splitter2>
            <div class="horizontal flex">
                <oda-xquery-accordion-panel class="no-flex" :item="panels.results" style="width: 50%;">
                    <oda-ace-editor mode="xml" ::value="panels.results.content" highlight-active-line="false" show-print-margin="false" min-lines=1></oda-ace-editor>
                </oda-xquery-accordion-panel>
                <oda-splitter2 size="3px" color="darkgray" style="opacity: .3"></oda-splitter2>
                <oda-xquery-accordion-panel class="flex" :item="panels.table"></oda-xquery-accordion-panel>
            </div>
        </main>
    `,
    get panels() {
        return {
            input: { label: 'XML Input', opened: false, content: 'XML Input ...', icon: 'icons:create' },
            query: { label: 'XPath/XQuery', opened: true, content: 'XPath/XQuery ...', icon: 'icons:content-paste' },
            history: { label: 'History', opened: true, content: 'History ...', icon: 'enterprise:contract' },
            examples: { label: 'Examples', opened: false, content: 'Examples ...', icon: 'icons:attachment' },
            settings: { label: 'Settings', opened: true, content: 'Settings ...', icon: 'icons:settings' },
            results: { label: 'Query results', open: true, content: 'Query results ...', icon: 'icons:done-all' },
            table: { label: 'Table', open: true, content: 'Table ...', icon: 'odant:grid' }
        }
    },
    get settings() {
        return {
            'server address': 'https://current.odant.org/'
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
        <div ~if="item?.open || item?.opened" class="content panel" style="flex: 1; border: 1px solid darkgrey; margin: 1px;">
            <slot>{{item.content}}</slot>
        </div>
    `,
    item: {}
})
