const CONSOLE = ODA.regTool('console');
ODA.regHotKey('alt+t', e => {
    const elem = window.top.document.body.querySelector('oda-console');
    if (elem)
        window.top.document.body.removeChild(elem);
    else
        window.top.document.body.appendChild(document.createElement('oda-console'));
});
ODA({ is: 'oda-console', imports: '@oda/button, @oda/splitter', template: /*html*/`
    <style>
        :host {
            /*position: fixed;*/
            bottom: 0;
            background-color: var(--content-background);
            font-size: small;
        }
        :host > div, .row {
            padding: 2px;
        }
        :host > div, .row:not(:last-child) {
            border-bottom: 1px solid var(--dark-background);
        }
        .row {
            @apply --horizontal;
            justify-content: space-between;
        }
        .row > div {
            /*overflow: hidden;*/
            text-overflow: ellipsis;
        }
        .log {
            overflow-y: auto;
        }
        .statusBar {
            @apply --flex;
            padding: 0 4px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: flex;
            align-items: center;
        }
        .sidebar {
            padding: 2px;
            border-right: 1px solid var(--dark-background);
            @apply --header;
        }
    </style>
    <oda-splitter sign="1" align="horizontal" ::height></oda-splitter>
    <div class="horizontal header">
        <oda-button icon="icons:view-list" 
                @tap="sidebarToggled = !sidebarToggled" :icon-size allow-toggle :toggled="sidebarToggled"></oda-button>
        <oda-button icon="icons:remove-circle-outline" :disabled="!items?.length" @tap.stop="items = null;console.clear();" :icon-size title="clear"></oda-button>
        <div class="statusBar" ~text="status" :title="status"></div>
        <oda-button :icon="expanded ? 'icons:arrow-drop-down' : 'icons:arrow-drop-up'"
                    :disabled="!items?.length" @tap="expanded = !expanded" :icon-size> ({{items?.length || 0}})</oda-button>
        <oda-button icon="icons:close" @tap.stop="this.remove()" :icon-size title="close"></oda-button>
    </div>
    <div class="horizontal" ~if="expanded">
        <aside class="sidebar" ~if="sidebarToggled">
            <oda-button ~for="buttons" :icon="item?.icon"
                        @tap="filter = item?.type" :icon-size allow-toggle :toggled="filter === item?.type">{{' ' + item?.type}}</oda-button>
        </aside>
        <section class="flex">
            <div class="flex log" :style="{height: height + 'px'}">
                <div class="row" ~for="outputItems">
                    <div :style="item?.style">{{ item?.count && item.count > 1 ? '(' + item.count + ') ' + (item?.text ?? item) : ' ' + (item?.text ?? item)}}</div>
                    <div title="timestamp">{{_getDT(item)}}</div>
                </div>
            </div>
            <div class="horizontal">
                <oda-icon icon="icons:chevron-right"></oda-icon><input @keyup="_exec" class="flex" ::value="expression">
            </div>
        </section>
    </div>
    `,
    attached() {
        window.addEventListener('error', this._windowOnError);
        this['#console'] = {};
        const c = window.console;
        c.status = c.status || (() => { });
        for (const k in c) {
            const f = c[k];
            const _checkCondition = (strOfStack) => {
                return (strOfStack.includes('/web/') && !strOfStack.includes('oda.js')) || strOfStack.includes('console.js') || strOfStack.includes('HTMLElement.eval ')
            };
            if (this.colors[k]) {
                this['#console'][k] = c[k];
                c[k] = (...args) => {
                    f(...args);
                    const erStack = (new Error()).stack?.split('    at ');
                    if (/*args[0] !== 'render'*/_checkCondition(erStack[2])) {
                        this._logFunction(k, ...args);
                    }
                }
            }
        }
    },
    detached() {
        window.removeEventListener('error', this._windowOnError);
        for (const k in this['#console']) {
            window.console[k] = this['#console'][k];
            delete this['#console'][k];
        }
    },
    props: {
        expression: String,
        height: 300,
        iconSize: 18,
        items: Array,
        history: [],
        outputItems: {
            type: Array,
            get() {
                return this.items?.filter(i => this.filter === 'all' ? true : i.type === this.filter)
                .reduce((prev, cur) => {
                    const idx = prev.findIndex(i => i.text === cur.text);
                    if(idx > -1){
                        const item = prev.splice(idx, 1)[0];
                        item.count = item.count ? item.count + 1 : 1;
                        // prev.unshift(item);
                        prev.splice(0, 0, item);
                    } else {
                        cur.count = 1;
                        prev.unshift(cur);
                    }
                    return prev;
                }, []);
            }
        },
        buttons: [
            { icon: 'icons:select-all', type: 'all', style: ' ' },
            { icon: 'files:log', type: 'log', style: ' ' },
            { icon: 'icons:error', type: 'error', style: 'color: red' },
            { icon: 'icons:warning', type: 'warn', style: 'color: orange' },
            { icon: 'icons:view-day', type: 'status', style: ' ' },
            { icon: 'icons:done', type: 'success', style: 'color: green' }
        ],
        colors: {
            log: ' ',
            error: 'color: red',
            warn: 'color: orange',
            status: ' ',
            success: 'color: green'
        },
        filter: 'all',
        status: {
            type: String,
            get() {
                const statusMessages = this.items?.filter(i => i.type === 'status');
                if (statusMessages && statusMessages.length > 0)
                    return statusMessages[0]?.text;
            }
        },
        expanded: {
            type: Boolean,
            default: true,
            save: true
        },
        sidebarToggled: false
    },
    _exec(e) {
        if (e.key === 'Enter') {
            let expr = this.expression.trim();
            this.history.push(expr);
            if (!expr.startsWith('console.')) {
                this._logFunction('log', this.expression);
                expr = `console.log(${expr})`;
            }
            (new Function(expr))();
            e.currentTarget.blur();
            this.expression = '';
            e.currentTarget.focus();
        }
    },
    _logFunction(type, ...args) {
        const item = {
            type,
            style: this.colors[type] || null,
            text: [...args].join(' ')
        };
        this.items = this.items ? [item, ...this.items] : [item];
    },
    _windowOnError(e) {
        const { message, filename, lineno, colno } = e;
        this._logFunction('error', message, filename, lineno, colno);
    },
    _getDT(item) {
        if (!item._dt) item._dt = (new Date()).getTime();
        return item._dt;
    }
});
export default CONSOLE;