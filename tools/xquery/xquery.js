ODA({ is: 'oda-xquery', imports: '@oda/splitter2, @oda/ace-editor, @tools/property-grid2',
    template: /*html*/`
        <style>
            :host {
                @apply --vertical;
                @apply --flex;
            }
            .tab {
                padding: 2px 4px;
                cursor: pointer;
                font-size: 12px;
                color: darkgrey;
            }
            .tab:hover {
                color: black;
            }
        </style>
        <div class="vertical flex">
            <div class="horizontal">
                <label class="tab" ~for="tabs" @tap="currentTab = key" ~style="{color: currentTab === key ? 'blue' : ''}">{{key}}</label>
            </div>
            <div ~is="tabs[currentTab]?.template" :item="tabs[currentTab]?.item">
                <oda-ace-editor ~if="tabs[currentTab]?.aceMode" mode="tabs[currentTab]?.aceMode" ::value="tabs[currentTab].item.content" highlight-active-line="false" show-print-margin="false" max-lines="infinity"></oda-ace-editor>
            </div>

            <oda-xquery-panel :item="panels.history" bar-icon="enterprise:contract" hide-top slot="right-panel"></oda-xquery-panel>
            <oda-xquery-panel :item="panels.examples" bar-icon="icons:attachment" hide-top slot="right-panel"></oda-xquery-panel>
            <oda-xquery-panel :item="panels.settings" bar-icon="icons:settings" hide-top slot="right-panel">
                <oda-property-grid2 id="pg" :io="settings" label="oda-xquery settings" show-buttons="false" group="false" style="overflow: auto; height: 100%; padding: 0;"></oda-property-grid2>
            </oda-xquery-panel>
        </div>
    `,
    uuid: '',
    currentTab: 'query',
    get tabs() {
        return {
            query: { template: 'oda-xquery-panel', item: { label: 'XPath/XQuery', open: true, icon: 'icons:content-paste' }, aceMode: 'xquery' },
            results: { template: 'oda-xquery-panel', item: { label: 'Query results', open: true, icon: 'icons:done-all' }, aceMode: 'xml' },
            table: { template: 'oda-xquery-panel', item: { label: 'Table', open: true, icon: 'odant:grid' } },
            source: { template: 'oda-xquery-panel', item: { label: 'Source', open: true, icon: 'icons:create' }, aceMode: 'xml' },
        }
    },
    get panels() {
        return {
            history: { label: 'History', open: true, icon: 'enterprise:contract', oneShow: 'top-right' },
            examples: { label: 'Examples', open: true, icon: 'icons:attachment', oneShow: 'top-right' },
            settings: { label: 'Settings', open: true, icon: 'icons:settings', oneShow: 'top-right' },
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

ODA({ is: 'oda-xquery-panel', imports: '@oda/icon',
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
