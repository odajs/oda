import '/web/oda/tools/containers/containers.js';
ODA({is: 'oda-combo-box', imports: '@oda/button',
    template: /*html*/`
    <style>
        :host {
            @apply --horizontal;
            min-height: {{iconSize + 2}}px;
            background-color: var(--content-background);
            border: 1px solid gray;
            box-sizing: border-box;
        }
        :host input{
            border: none;
            background-color: transparent;
        }
    </style>
    <input class="flex" type="text" @input="input" :readonly="value" :value="filter || value?.label || value?.name || value || ''">
    <oda-button ~if="!hideButton" :icon="value?'icons:close':'icons:chevron-right:90'" @tap="dropdown"></oda-button>
    `,
    get _items() {
        return typeof this.items === 'function'
            ? this.items()
            : this.items;
    },
    props: {
        value: Object,
        hideButton:{
            default: false,
            reflectToAttribute: true
        }
    },
    filter: '',
    async dropdown(e) {
        
        if (this.value) {
            this.value = null;
        }
        else {
            if (!this._combo) {
                try {
                    this._combo = document.createElement('oda-combo-list');
                    this._combo.items = await this.getFiltered();
                    this._combo.focusedItem = this.value;
                    this.value = (await ODA.showDropdown(this._combo, {}, { parent: this, focused: !!e })).focusedItem;
                }
                finally {
                    this._combo = undefined;
                    this['#_items'] = undefined;
                    this.async(() => {
                        this.$('input').focus();
                    })
                }
            }
            else {
                this._combo.items = await this.getFiltered();
                this._combo.focusedItem = this.value;
                return;
            }
        }
        this.filter = '';
        
    },
    async input(e) {
        if (this.value) return;
        this.filter = e.target.value.toLowerCase();
        // if (!this.filter) return;
        this.dropdown();
    },
    getFiltered() {
        return Promise.resolve(this._items).then(items => {
            return this.filter
                ? items.filter(i => i.label.toLowerCase().includes(this.filter))
                : items
        });
    },
    keyBindings: {
        ArrowDown(e) {
            if (this.value) return;
            this.dropdown(true);
        },
        async space(e) {
            if (this.value) {
                await ODA.showConfirm('oda-dialog-message', { message: 'Clear value?', icon: 'icons:close', fill: 'red' });
                this.value = null;
            }

        },
        ArrowUp(e) {
            ODA.closeDropdown();
        },
        enter(e) {

        }
    },
})
ODA({is: 'oda-combo-list',
    template: /*html*/`
    <style>
        :host {
            @apply --vertical;
            overflow-y: auto;
            overflow-x: hidden;
        }
    </style>
    <label style="min-height: 24px; align-content: center;" ~for="items" :focused="item === focusedItem" @tap="focusedItem = item; fire('ok')">{{item?.label || item}}</label>
    `,
    attached() {
        if (!this.focusedItem)
            this.focusedItem = this.items?.[0];
    },
    keyBindings: {
        ArrowDown(e) {
            const idx = this.items.indexOf(this.focusedItem);
            if (idx < this.items.length - 1)
                this.focusedItem = this.items[idx + 1];
        },
        ArrowUp(e) {
            const idx = this.items.indexOf(this.focusedItem);
            if (idx > 0)
                this.focusedItem = this.items[idx - 1];
            else
                this.domHost.fire('cancel');
        },
        enter(e) {
            this.fire('ok');
        }
    },
    focusedItem: null,
    items: []
})