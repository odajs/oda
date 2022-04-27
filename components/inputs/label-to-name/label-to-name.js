ODA({is: 'oda-label-to-name', imports: '@oda/button, @oda/list',
    template: /*html*/`
    <style>
        :host {
            @apply --vertical;
            min-width: 100px;
            padding: 8px;
        }
        input {
            outline: none;
            margin: 1px;
            padding: 2px 4px;
            min-height: 24px;
            max-height: 24px;
            border: none;
        }
        div {
            align-items: center;
            border: 1px inset gray;
        }
        oda-button {
            padding: 0;
        }
    </style>
    <div class="horizontal">
        <input autofocus class="flex" ::value="label" :placeholder>
        <oda-button ~if="defaultList?.length" icon="icons:chevron-right:90" @tap.stop="dropdown"></oda-button>
    </div>
    <input ~if="!hideName" ::value="name">
    `,
    placeholder: 'Input label',
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
                name = name.split(' ').map((s, i) => {
                    if (i === 0)
                        return (s === 'the') ? null : s;

                    if (s.length < 7)
                        return s;
                    return s.substring(0, 4);
                });
                name = name.join('-');
                name = name.replace(/-{2,}/g, '-');
                name = name.replace(/(^\d)/, '_$1');
                name = name.replace(/\./g, '');
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
                const item = (await ODA.showDropdown(this._list, {}, { parent: this.$('div'), useParentWidth: true })).focusedItem;
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
            // Для показа всего списка при нажатии на dropDown
            this.text = undefined;
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