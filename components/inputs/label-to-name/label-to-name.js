ODA({is: 'oda-label-to-name', imports: '@oda/button, @oda/list',
    template: /*html*/`
    <style>
        :host {
            @apply --vertical;
            min-width: 100px;
            padding: 8px;
            display: grid;
            grid-template-columns: repeat(6, 1fr);
            align-items: center;
        }
        :host > label {
            grid-column-start: 1;
        }
        :host > div {
            grid-column-start: 2;
            grid-column-end: 7;
        }
        .input-container {
            align-items: center;
            border: 1px inset gray;
            margin: 2px;
            min-height: 34px;
        }
        .input-container input {
            font-family: inherit;
            font-size: inherit;
            outline: none;
            margin: 1px;
            padding: 2px 4px;
            min-height: 24px;
            max-height: 24px;
            border: none;
            width: 100%;
        }
        oda-button {
            padding: 0;
        }
    </style>
    <label for="label">Метка:</label>
    <div class="horizontal input-container">
        <input id="label" class="flex" ::value="label" :placeholder="placeholderLabel" >
        <oda-button ~if="defaultList?.length" icon="icons:chevron-right:90" @tap.stop="dropdown"></oda-button>
    </div>
    <label ~if="!hideName" for="name" class="horizontal">Имя:</label>
    <div ~if="!hideName" class="horizontal input-container">
        <input ~if="!hideName" id="name" class="flex" ::value="name" :placeholder="placeholderName">
    </div>
    `,
    placeholderLabel: 'метка',
    placeholderName: 'имя',
    defaultList: Array,
    props: {
        label: {
            type: String,
            set(label, o) {
                this.name = label ? label.trim() : null;
            }
        },
        hideName: false,
        name: {
            type: String,
            set(name, o) {
                name = name.toQName();
                let last = name[name.length - 1];
                if (last !== ' ' && last !== '-')
                    last = '';
                if (this.transliteration)
                    this.name = this.transliteration.slugify?.(name) + last;
                else
                    this.name = name;
            }
        }
    },
    get transliteration() {
        ODA.import("@ext/transliteration").then(i => this.transliteration = i)
    },
    set _list(n) {
        ODA.closeDropdown();
    },
    listeners: {
        dblclick(e) {
            e.stopPropagation();
        }
    },
    attached() {
        this.focus();
    },
    focus() {
        this.async(() => {
            const element = this.$('input');
            element.focus();
            element.selectionStart = 0;
            element.select();
        }, 300);
    },
    dropdown(e) {
        if (this._list) this._list = undefined;
        else this.showDropdown(e);
    },
    async showDropdown(e) {
        try {
            const list = this.defaultList;
            if (!list.length) {
                this._list = undefined;
                return;
            }
            if (!this._list) {
                this._list = document.createElement('oda-list');
                this._list.itemTemplate = 'odant-field-item';
                this._list.items = list;
                this._list.focusedItem = list?.[0];
                this.async(() => this.$('input')?.focus());
                const item = (await ODA.showDropdown(this._list, {}, { parent: e.target.parentElement, useParentWidth: true })).focusedItem;
                if (item) {
                    this.label = item.label;
                    this.name = item.name;
                }
                this._list = undefined;
                this.blur?.();
            }
            else {
                this._list.items = list;
                this._list.focusedItem = list?.[0];
                this._list?.domHost?.setSize();
                return;
            }
        }
        catch {
            this.interval('dd', () => {
                this._list = undefined;
            }, 100)
        }
    },
})

ODANT({is: 'odant-field-item',
    template: /*html*/`
        <style>
            :host {
                @apply --horizontal;
            }
        </style>
        <label class="flex">{{item?.label}}</label>
        <span>[{{item?.name}}]</span>
    `,
    item: {}
})
