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
            <div ~is="tabs[currentTab]?.template" :src="tabs[currentTab]?.src">
                <oda-ace-editor ~if="tabs[currentTab]?.aceMode" mode="tabs[currentTab]?.aceMode" ::value="tabs[currentTab].src.content" highlight-active-line="false" show-print-margin="false" max-lines="infinity"></oda-ace-editor>
            </div>

            <oda-xquery-panel :src="panels.history" bar-icon="enterprise:contract" hide-top slot="right-panel"></oda-xquery-panel>
            <oda-xquery-panel :src="panels.examples" bar-icon="icons:attachment" hide-top slot="right-panel"></oda-xquery-panel>
            <oda-xquery-panel :src="panels.settings" bar-icon="icons:settings" hide-top slot="right-panel">
                <oda-property-grid2 id="pg" :io="settings" label="oda-xquery settings" show-btns="false" group="false" style="overflow: auto; height: 100%; padding: 0;"></oda-property-grid2>
            </oda-xquery-panel>
        </div>
    `,
    uuid: '',
    currentTab: 'query',
    get tabs() {
        return {
            query: {
                template: 'oda-xquery-panel', aceMode: 'xquery',
                src: {
                    label: 'XPath/XQuery', open: true, icon: 'icons:content-paste',
                    btns: { open: 'enterprise:folder', save: 'icons:save', src: 'odant:base' }
                },
            },
            results: { template: 'oda-xquery-panel', src: { label: 'Query results', open: true, icon: 'icons:done-all' }, aceMode: 'xml' },
            table: { template: 'oda-xquery-panel', src: { label: 'Table', open: true, icon: 'odant:grid' } },
            src: { template: 'oda-xquery-panel', src: { label: 'src', open: true, icon: 'icons:create' }, aceMode: 'xml' },
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

ODA({ is: 'oda-xquery-panel', imports: '@oda/icon, @oda/button',
    template: /*html*/`
        <style>
            :host {
                @apply --vertical;
                position: relative;
                overflow: hidden;
                min-height: 32px;
                flex: {{src?.open || src?.opened ? 1 : 0}};
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
        <div class="header panel_header horizontal" @tap="onopened">
            <oda-icon ~if="!src?.open" :icon="src?.open || src?.opened ? 'icons:arrow-drop-down' : 'icons:arrow-drop-down:270'" icon-size="18"></oda-icon>    
            <oda-icon :icon="src?.icon || 'icons:check'" icon-size="16" style="padding-left: 4px;"></oda-icon>    
            <span style="padding-left: 8px">{{src.label}}</span>
            <div class="flex"></div>
            <oda-button class="btn" ~for="src.btns" :icon="src.btns[key]" icon-size="16" :title="key"></oda-button>
        </div>
        <div ~if="src?.open || src?.opened" class="panel_content">
            <slot>{{src.content}}</slot>
        </div>
    `,
    src: {},
    onopened() {
        if (this.src.oneShow) {
            document.dispatchEvent(new CustomEvent("xquery-accordion-panel-tap", {
                detail: { src: this.src, uuid: this.uuid }
            }))
        } else {
            this.src.opened = !this.src.opened;
        }
    },
    attached() {
        document.addEventListener("xquery-accordion-panel-tap", (e) => {
            const src = e?.detail?.src;
            if (e?.detail?.uuid === this.uuid && src?.oneShow && src.oneShow === this.src.oneShow) {
                this.src.opened = this.src === src;
            }
        });
    },
    detached() {
        document.removeEventListener("xquery-accordion-panel-tap");
    }
})

const getUUID = function b(a) { return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b) };
