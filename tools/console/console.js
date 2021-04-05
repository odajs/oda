import '../../components/buttons/button/button.js';
ODA({
    is: 'oda-console', template: /*template*/`
    <style>
        :host {
            bottom: 0;
            background-color: var(--content-background);
            font-size: small;
            border: 1px solid var(--dark-background);
        }
        :host > div, :host div.row {
            padding: 2px;
        }
        :host > div, :host div.row:not(:last-child) {
            border-bottom: 1px solid var(--dark-background);
        }
        :host div.row {
            @apply --horizontal;
            justify-content: space-between;
        }
        :host div.row > div {
            overflow: hidden;
            text-overflow: ellipsis;
        }
        :host .log {
            @apply --flex;
            max-height: 300px;
            overflow-y: auto;
        }
        :host .statusBar {
            @apply --flex;
            padding: 0 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: flex;
            align-items: center;
        }
        :host .sidebar {
            padding: 2px;
            border-right: 1px solid var(--dark-background);
        }
    </style>
    <div class="horizontal header">
        <oda-button icon="icons:view-list" 
                @tap="sidebarToggled = !sidebarToggled" icon-size="18" allow-toggle :toggled="sidebarToggled"></oda-button>
        <div class="statusBar" ~text="status" :title="status"></div>
        <oda-button :icon="expanded ? 'icons:arrow-drop-down' : 'icons:arrow-drop-up'"
                    :disabled="!items?.length" @tap="expanded = !expanded" icon-size="18"> ({{items?.length || 0}})</oda-button>
        <oda-button icon="icons:remove-circle-outline" :disabled="!items?.length" @tap.stop="items = null;expanded = false;" icon-size="18" title="clear"></oda-button>
        <oda-button icon="icons:close" @tap.stop="ODA.console.close()" icon-size="18" title="close"></oda-button>
    </div>
    <div class="horizontal layout" ~if="expanded && items?.length">
        <div class="sidebar" ~if="sidebarToggled">
            <oda-button ~for="buttons" :icon="item?.icon"
                        @tap="filter = item?.type" icon-size="18" allow-toggle :toggled="filter === item?.type">{{' ' + item?.type}}</oda-button>
        </div>
        <div class="log">
            <div class="row" ~for="outputItems">
                <div :style="item?.style">{{' ' + (item?.text ?? item)}}</div>
                <div title="timestamp">{{_getDT(item)}}</div>
            </div>
        </div>
    </div>
    `,
    props: {
        items: Array,
        buttons: [
            {icon: 'icons:select-all', type: 'all'},
            {icon: 'files:log', type: 'log'},
            {icon: 'icons:error', type: 'error'},
            {icon: 'icons:warning', type: 'warn'},
            {icon: 'icons:view-day', type: 'status'},
            {icon: 'icons:done', type: 'success'},
        ],
        outputItems: {
            type: Array,
            get() {
                return this.items?.filter(i => this.filter === 'all' ? true : i.type === this.filter);
            }
        },
        filter: 'all',
        status: {
            type: String,
            get() {
                const statusMessages = this.items?.filter(i => i.type === 'status');
                if(statusMessages && statusMessages.length > 0)
                    return statusMessages[statusMessages.length - 1]?.text;
            }
        },
        expanded: {
            type: Boolean,
            default: true,
            save: true
        },
        sidebarToggled: false,
        __readyToSave: true
    },
    _getDT(item) {
        if(!item._dt) item._dt = (new Date()).getTime();
        return item._dt;
    }
});