ODA({is: 'oda-combo-box', imports: '@oda/button, @tools/containers',
    template: /*html*/`
    <style>
        :host {
            @apply --horizontal;
            @apply --no-flex;
            min-height: {{iconSize}}px;
            background-color: var(--content-background);
            border-radius: 0px !important;
            border: 1px solid var(--header-background);
            box-sizing: border-box;
        }
        :host input {
            border: none;
            outline: none;
            background-color: transparent;
        }
        input {
            width: 0px;
            padding: 4px;
        }
        #combo-btn {
            margin-left: auto;
        }
    </style>
    <input class="flex" type="text" @input="onInput" :value="text" :readonly="readOnly || (allowClear && !!value)" :placeholder>
    <oda-button id="combo-btn" class="no-flex" :icon-size ~if="!hideButton" :icon="(value && allowClear)?'icons:close':icon" @tap.stop="_tap"></oda-button>
    `,
    placeholder: '',
    text: '',
    result: null,
    iconSize: 24,
    arrowMoveDone: false,
    $public: {
        dropDownTitle: '',
        readOnly: false,
        allowClear: false,
        fadein: false,
        template: 'oda-combo-list',
        //iconSize: 24, // todo: duplicate
        icon: 'icons:chevron-right:90',
        hideButton: {
            $label: 'Скрыть кнопку',
            $def: false,
            $attr: true
        },
        useParentWidth: {
            $def: false,
            $type: Boolean
        }
    },
    get params() {
        return {
            "focused-item-changed": (e) => {
                const item = e.target.focusedItem;
                this.result = item?.label || item;
                this._setFocus();
            },
            tap: (e) => {
                this.async(() => {
                    if (!this.result) return;
                    this.dropDownControl?.fire('ok');
                })
            },
        }
    },
    get input() {
        return this.$('input');
    },
    set value(n) {
        this.async(() => {
            this.input?.select(0, 1000);
        })
    },
    set dropDownControl(n) {
        n?.setAttribute('tabIndex', 1);
        // n?.addEventListener('resize', e=>{
        //     if (e.target.offsetHeight) return
        //     this.closeDown();
        // })
    },
    $observers: {
        load: 'value'
    },
    load(value) {
        if (!this.text)
            this.text = value;
    },
    // get text() {
    //     switch (typeof this.value) {
    //         case 'string':
    //             return this.value;
    //         case 'object':
    //             return (this.value?.label || this.value?.name || this.value?.key || this.value?.toString());
    //     }
    //     return this.value?.toString() || '';
    // },
    createDropDownControl() {
        return ODA.createElement(this.template);
    },
    _setFocus(select) {
        this.async(() => {
            this.input?.focus();
            if (select)
                this.input?.select(0, 1000);
        })
    },
    _tap(e) {
        if (this.allowClear && this.value) {
            this.text = '';
            this.value = '';
        }
        else if (this._dd) {
            this.closeDown();
        } else {
            this.dropDown();
        }
    },
    async onInput(e) {
        this.text = e.target.value;
        if (this.text)
            this.dropDown(this.text);
        else
            this.closeDown();
    },
    dropDown(filter) {
        this._setFocus();
        this.dropDownControl ??= this.createDropDownControl();
        if (!this.dropDownControl) return;
        this.dropDownControl.filter = filter;
        if (!this._dd) {
            // if (this.items?.length)
            //     this.params.items = this.items;
            this._dd = ODA.showDropdown(this.dropDownControl, this.params, { parent: this, useParentWidth: this.useParentWidth, fadein: this.fadein, title: this.dropDownTitle });
            this._dd.then(res => {
                this.value = this.result;
                switch (typeof this.value) {
                    case 'string': {
                        this.text = this.value;
                    } break;
                    case 'object': {
                        this.text = (this.value?.label || this.value?.name || this.value?.key || this.value?.toString());
                    } break;
                    default: {
                        this.text = this.value?.toString() || '';
                    } break;
                }
            }).catch(e => {
                this.arrowMoveDone = false;
            }).finally(() => {
                this.arrowMoveDone = false;
                this.result = null;
                this._dd = null;
                this._setFocus();
            })
        }
        // if (!this.dropDownControl.offsetHeight)
        //     this.closeDown();
    },
    closeDown() {
        this.arrowMoveDone = false;
        this.async(() => {
            this.dropDownControl?.fire?.('cancel')
        })
    },
    $keyBindings: {
        escape(e) {
            if (!this._dd) {
                this.text = '';
            }
        },
        arrowDown(e) {
            e.stopPropagation();
            e.preventDefault();
            this.dropDown(this.text);
            this.async(() => {
                this.dropDownControl?.$keys?.arrowDown?.(e);
                this._setFocus();
            })
            this.arrowMoveDone = true;
        },
        arrowUp(e) {
            e.stopPropagation();
            e.preventDefault();
            this.dropDownControl?.$keys?.arrowUp?.(e);
            this._setFocus();
            this.arrowMoveDone = true;
        },
        enter(e) {
            e.stopPropagation();
            e.preventDefault();
            if (this._dd && this.arrowMoveDone) {
                this.dropDownControl?.$keys?.enter?.(e);
                if (this.result)
                    this.dropDownControl?.fire?.('ok');
            }
            else {
                this.value = this.text?.trim();
                this.closeDown();
                this.onEnter();
            }

        },
        space(e) {
            e.stopPropagation();
            if (!e.ctrlKey) return;
            this.dropDown(this.text);
            this.async(() => {
                this.dropDownControl?.$keys?.space?.(e);
            })
        },
    },
    onEnter() {

    }
})

ODA({is: 'oda-combo-list',
    template: /*html*/`
    <style>
        :host {
            @apply --vertical;
            overflow-y: auto;
            overflow-x: hidden;
        }
        span:hover {
            @apply --selected;
        }
        span {
            @apply --content;
            min-height: 24px;
            align-content: center;
            cursor: pointer;
            padding: 2px 4px;
        }
    </style>
    <span ~for="rows" :focused="$for.item === focusedItem" @tap="focusedItem = $for.item">{{$for.item?.label || $for.item}}</span>
    `,
    filter: '',
    items: [],
    get hasData() {
        return this.rows?.length;
    },
    set focusedItem(v) {
        this.fire('focused-item-changed', v); // ToDo - temporary solution, doesn't always work
    },
    get rows() {
        if (this.items.then) this.items.then(res => this.items = res)
        if (this.filter) {
            const filter = this.filter.toLowerCase();
            return this.items?.filter(i => {
                switch (typeof i) {
                    case 'object':
                        return Object.values(i).filter(v => {
                            return v?.toLowerCase?.().includes?.(filter);
                        }).length;
                    case 'string':
                        return i?.toLowerCase?.().includes?.(filter);
                }
            })
        }
        return this.items;
    },
    get result() {
        return this.focusedItem;
    },
    $keyBindings: {
        arrowDown(e) {
            const idx = this.rows.indexOf(this.focusedItem);
            if (idx < this.rows.length - 1)
                this.focusedItem = this.rows[idx + 1];
        },
        arrowUp(e) {
            const idx = this.rows.indexOf(this.focusedItem);
            if (idx > 0)
                this.focusedItem = this.rows[idx - 1];
        }
    },
})