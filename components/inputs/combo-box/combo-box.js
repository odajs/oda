ODA({is: 'oda-combo-box', imports: '@oda/button, @tools/containers',
    template: /*html*/`
    <style>
        :host {
            @apply --horizontal;
            @apply --no-flex;
            min-height: {{iconSize + 12}}px;
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
    </style>
    <input class="flex" type="text" @input="onInput" :value="text" :placeholder>
    <oda-button class="no-flex" :icon-size ~if="!hideButton" :icon="(value && allowClear)?'icons:close':icon" @tap="_tap"></oda-button>
    `,
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
            }
        }
    },
    get input() {
        return this.$('input');
    },
    _setFocus(select) {
        this.async(() => {
            this.input.focus();
            if (select)
                this.input.select(0, 1000);
        })
    },
    _tap(e) {
        if (this.allowClear && this.value){
            this.text = '';
            // this.async(()=>{
                this.value = '';
            // }, 100)
        }
        else if (this._dd)
            this.closeDown();
        else
            this.dropDown();
    },
    set value(n){
        this.text = undefined;
        this.async(()=>{
            this.input.select(0, 1000);
        })
    },
    props: {
        allowClear: false,
        fadein: false,
        template: 'oda-combo-list',
        placeholder: '',
        iconSize: 24,
        icon: 'icons:chevron-right:90',
        hideButton: {
            label: 'Скрыть кнопку',
            default: false,
            reflectToAttribute: true
        },
        // items: Array
    },
    useParentWidth: true,
    createDropDownControl() {
        return this.createElement(this.template, this.props);
    },
    set dropDownControl(n) {
        n?.setAttribute('tabIndex', 1);
        // n?.addEventListener('resize', e=>{
        //     if (e.target.offsetHeight) return
        //     this.closeDown();
        // })
    },
    result: null,
    get text() {
        switch (typeof this.value) {
            case 'string':
                return this.value;
            case 'object':
                return (this.value?.label || this.value?.name || this.value?.key || this.value?.toString());
        }
        return this.value?.toString() || '';
    },
    iconSize: 24,
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
        this.dropDownControl.filter = filter;
        if (!this._dd) {
            // if (this.items?.length)
            //     this.params.items = this.items;
            this._dd = ODA.showDropdown(this.dropDownControl, this.params, { parent: this, useParentWidth: true, fadein: this.fadein });
            this._dd.then(res => {
                this.value = this.result;
            }).catch(e => {

            }).finally(() => {
                this.result = null;
                this._dd = null;
                this._setFocus();
            })
        }
        // if (!this.dropDownControl.offsetHeight)
        //     this.closeDown();
    },
    closeDown() {
        this.async(()=>{
            this.dropDownControl?.fire?.('cancel')
        })
    },
    keyBindings: {
        escape(e){
            if (!this._dd){
                this.text = undefined;
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
        },
        arrowUp(e) {
            e.stopPropagation();
            e.preventDefault();
            this.dropDownControl?.$keys?.arrowUp?.(e);
            this._setFocus();
        },
        enter(e) {
            e.stopPropagation();
            e.preventDefault();
            if (this._dd){
                this.dropDownControl?.$keys?.enter?.(e);
                if (this.result)
                    this.dropDownControl?.fire?.('ok');
            }
            else{
                this.value = this.text?.trim();
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
    onEnter(){

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
        label:hover {
            @apply --selected;
        }
        label {
            @apply --content;
            min-height: 24px;
            align-content: center;
            cursor: pointer;
            padding: 2px 4px;
        }
    </style>
    <label ~for="rows" :focused="item === focusedItem" @tap="focusedItem = item">{{item?.label || item}}</label>
    `,
    filter: '',
    get hasData() {
        return this.rows?.length;
    },
    keyBindings: {
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
    focusedItem: null,
    items: [],
    get rows() {
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
    }
})