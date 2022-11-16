ODA({is: 'oda-label-to-name', imports: '@oda/button, @oda/list',
    template: /*html*/`
        <style>
            :host {
                @apply --vertical;
            }
            oda-button {
                padding: 0;
            }
            .name{
                font-size: x-small;
                color: var(--header-background);
            }
            :host input{
                border: none;
                padding: 4px;
                min-width: 0;
                background-color: transparent;
                overflow: hidden;
                text-overflow: ellipsis;
                font-family: inherit;
                font-size: inherit;
            }
        </style>
        <label for="label">Input label:</label>
        <div class="horizontal content">
            <input class="flex" ::value="label">
            <oda-button ~if="defaultList?.length" icon="icons:chevron-right:90" @tap.stop="dropdown"></oda-button>
        </div>
        <div ~if="showName" class="horizontal name">
            <label>name:</label>
            <input tabindex="-1" class="flex" :value="name" style="border: none; font-size: x-small; font-weight: bold;" @input="nameInput">
        </div>
    `,
    nameInput(e){

    },
    defaultList: Array,
    props: {
        label: {
            type: String,
            set(label, o) {
                this.name = label ? label.trim() : null;
            }
        },
        showName: false,
        name: {
            type: String,
            set(name, o) {
                name = name.toQName();
                let last = name[name.length - 1];
                if (last !== ' ' && last !== '-')
                    last = '';
                    this.name = this.transliteration ? this.transliteration.slugify?.(name) + last : name;
            }
        }
    },
    // get transliteration() {
    //     ODA.import("@ext/transliteration").then(i => this.transliteration = i)
    // },
    transliteration: null,
    set _list(n) {
        ODA.closeDropdown();
    },
    listeners: {
        dblclick(e) {
            e.stopPropagation();
        }
    },
    async attached() {
        this.transliteration = await ODA.import("@ext/transliteration")
        this._focus();
    },
    _focus() {
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
                this._list.itemTemplate = 'oda-label-to-name-item';
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
            }
        }
        catch {
            this.interval('dd', () => {
                this._list = undefined;
            }, 100)
        }
    },
})

ODA({is: 'oda-label-to-name-item',
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
