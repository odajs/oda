ODA({ is: 'oda-xquery', imports: '@oda/splitter2, @oda/ace-editor, @tools/property-grid2',
    template: /*html*/`
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
                width: 100%;
                height: 100vh;
                /* box-sizing: border-box; */
            }
        </style>
        <div class="vertical flex">
            <div class="horizontal" style="overflow: hidden; height: 50%;">
                <div class="vertical no-flex" style="width: 100%; overflow: hidden;">
                    <oda-xquery-accordion-panel :item="panels.input">
                        <oda-ace-editor mode="xml" ::value="panels.input.content" highlight-active-line="false" show-print-margin="false" max-lines="infinity"></oda-ace-editor>
                    </oda-xquery-accordion-panel>
                    <oda-xquery-accordion-panel :item="panels.query">
                        <oda-ace-editor mode="xquery" ::value="panels.query.content" highlight-active-line="false" show-print-margin="false" max-lines="infinity"></oda-ace-editor>
                    </oda-xquery-accordion-panel>
                </div>
                <!-- <oda-splitter2 size="3px" color="darkgray" style="opacity: .3"></oda-splitter2>
                <div class="vertical flex" style="overflow: hidden; flex: 1"> -->
                    <oda-xquery-accordion-panel :item="panels.history" bar-icon="enterprise:contract" hide-top slot="right-panel"></oda-xquery-accordion-panel>
                    <oda-xquery-accordion-panel :item="panels.examples" bar-icon="icons:attachment" hide-top slot="right-panel"></oda-xquery-accordion-panel>
                    <oda-xquery-accordion-panel :item="panels.settings" bar-icon="icons:settings" hide-top slot="right-panel">
                        <oda-property-grid2 id="pg" :io="settings" label="oda-xquery settings" show-buttons="false" group="false" style="overflow: auto; height: 100%; padding: 0;"></oda-property-grid2>
                    </oda-xquery-accordion-panel>
                <!-- </div> -->
            </div>
            <oda-splitter2 direction="horizontal" size="3px" color="darkgray" style="opacity: .3"></oda-splitter2>
            <div class="horizontal flex">
                <oda-xquery-accordion-panel class="no-flex" :item="panels.results" style="width: 50%; overflow: hidden; max-width: calc(100% - 3px);">
                    <oda-ace-editor mode="xml" ::value="panels.results.content" highlight-active-line="false" show-print-margin="false" max-lines="infinity"></oda-ace-editor>
                </oda-xquery-accordion-panel>
                <oda-splitter2 size="3px" color="darkgray" style="opacity: .3"></oda-splitter2>
                <oda-xquery-accordion-panel class="flex" :item="panels.table" style="overflow: hidden;"></oda-xquery-accordion-panel>
            </div>
        </div>
    `,
    uuid: '',
    get panels() {
        return {
            input: { label: 'XML Input', opened: false, icon: 'icons:create' },
            query: { label: 'XPath/XQuery', opened: true, icon: 'icons:content-paste' },
            history: { label: 'History', open: true, icon: 'enterprise:contract', oneShow: 'top-right' },
            examples: { label: 'Examples', open: true, icon: 'icons:attachment', oneShow: 'top-right' },
            settings: { label: 'Settings', open: true, icon: 'icons:settings', oneShow: 'top-right' },
            results: { label: 'Query results', open: true, icon: 'icons:done-all' },
            table: { label: 'Table', open: true, icon: 'odant:grid' }
        }
    },
    get settings() {
        return {
            'server address': 'https://current.odant.org/'
        }
    },
    ready() {
        this.uuid = getUUID();
    }
})

ODA({ is: 'oda-xquery-accordion-panel', imports: '@oda/icon',
    template: /*html*/`
        <style>
            :host {
                @apply --vertical;
                position: relative;
                overflow: hidden;
                min-height: 32px;
                flex: {{item?.open || item?.opened ? 1 : 0}};
            }
            .panel_header {
                display: flex; 
                align-items: center;
                overflow: hidden;
                height: 28px; 
                margin: 1px;
                border: 1px solid darkgrey;
                cursor: pointer; 
            }
            .panel_content {
                flex: 1; 
                overflow: hidden;
                margin: 1px;
                border: 1px solid darkgrey; 
            }
        </style>
        <div class="header panel_header" @tap="onopened">
            <oda-icon ~if="!item?.open" :icon="item?.open || item?.opened ? 'icons:arrow-drop-down' : 'icons:arrow-drop-down:270'" icon-size="18"></oda-icon>    
            <oda-icon :icon="item?.icon || 'icons:check'" icon-size="16" style="padding-left: 4px;"></oda-icon>    
            <span style="padding-left: 8px">{{item.label}}</span>
        </div>
        <div ~if="item?.open || item?.opened" class="panel_content">
            <slot>{{item.content}}</slot>
        </div>
    `,
    item: {},
    onopened() {
        if (this.item.oneShow) {
            document.dispatchEvent(new CustomEvent("xquery-accordion-panel-tap", {
                detail: { item: this.item, uuid: this.uuid }
            }))
        } else {
            this.item.opened = !this.item.opened;
        }
    },
    attached() {
        document.addEventListener("xquery-accordion-panel-tap", (e) => {
            const item = e?.detail?.item;
            if (e?.detail?.uuid === this.uuid && item?.oneShow && item.oneShow === this.item.oneShow) {
                this.item.opened = this.item === item;
            }
        });
    },
    detached() {
        document.removeEventListener("xquery-accordion-panel-tap");
    }
})

const getUUID = function b(a) { return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b) };
