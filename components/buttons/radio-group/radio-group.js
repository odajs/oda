ODA({ is: 'oda-radio-group', imports: '@oda/icon', template: /*html*/`
    <style>
        :host {
            @apply --vertical;
        }

        .radio {
            @apply --horizontal;
            @apply --flex;
            align-items: center;
            cursor: pointer;
            margin: 4px 8px;
        }
    </style>
    <div ~for="item in items" :item="item" class="radio" @tap.stop="_tap">
        <oda-icon :icon="item.checked ? checkedIcon : uncheckedIcon"></oda-icon>
        <span ~text="item.label"></span>
    </div>`,
    props: {
        list: {
            type: [Array, Object],
            set(list) {
                if (Array.isArray(list)) {
                    this.items = list.every(i => typeof i === 'string')
                        ? list.map(n => ({ label: n, checked: false }))
                        : list;
                } else {
                    const items = [];
                    for (n in list) {
                        items.push({ label: n, checked: list[n] });
                    }
                    this.items = items;
                }
            }
        },
        items: {
            type: Array,
            default: [],
            set(items) {
                if (items.length) {
                    if (!this.multiSelect && items.every(i => !i.checked)) {
                        items[0].checked = true;
                    }
                }
            }
        },
        multiSelect: false,
        value: {
            type: String,
            set(nv) {
                if (nv && this.items.length) {
                    const newArr = nv.split(';');
                    this.items.forEach(i => i.checked = newArr.includes(i.label));
                }
            }
        },
        checkedIcon: {
            type: String,
            get() {
                return (this.multiSelect)
                    ? 'icons:check-box'
                    : 'icons:radio-button-checked'
            }
        },
        uncheckedIcon: {
            type: String,
            get() {
                return (this.multiSelect)
                    ? 'icons:check-box-outline-blank'
                    : 'icons:radio-button-unchecked'
            }
        }
    },
    observers: [
        function itemsChanged(items) {
            if (items.length) {
                const res = items.filter(i => i.checked);
                if (res.length) {
                    const newVal = (this.multiSelect ? res.map(i => i.label) : [res[0].label]).join(';');
                    if (newVal !== this.value) {
                        this.value = newVal;
                    }
                }
            }
        }
    ],
    _tap(e) {
        const item = e.currentTarget.item;
        if (!this.multiSelect) {
            this.items.forEach(i => {
                i.checked = i === item;
            });
        } else {
            item.checked = !item.checked;
        }
    }
})