import '/web/oda/tools/containers/containers.js';
ODA({is: 'oda-combo-box', imports: '@oda/button',
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
            :host input{
                border: none;
                outline: none;
                background-color: transparent;
            }
            input{
                width: 0px;
            }
        </style>
        <input :readonly="value" class="flex" type="text" @input="onInput" :value="text" :placeholder>
        <oda-button class="no-flex" :icon-size ~if="!hideButton" :icon="(allowClear && value)?'icons:close':icon" @tap="_tap"></oda-button>
    `,
    get hasData(){
        return this.dropDownControl?.hasData;
    },
    get input(){
        return this.$('input');
    },
    _setFocus(){
        this.async(()=>{
            this.input.focus();
        })
    },
    _tap(e){
        if (this._dd)
            this.closeDown();
        else if (this.allowClear && this.value)
            this.value = undefined;
        else
            this.dropDown();
    },
    props: {
        placeholder: '',
        allowClear: false,
        iconSize: 24,
        icon: 'icons:chevron-right:90',
        value: undefined,
        hideButton:{
            label: 'Скрыть кнопку',
            default: false,
            reflectToAttribute: true
        }
    },
    set dropDownControl(n){
        n.tabindex = 0;
        this._panel.dropDownControl = n;
    },
    get text(){
        switch (typeof this.value){
            case 'string':
                return this.value;
            case 'object':{
                return this.value?.label || this.value?.name || this.value?.key;
            }
        }
        return this.value?.toString() || '';
    },
    iconSize: 24,
    _dd: null,
    async onInput(e) {
        this.text = e.target.value;
        if (this.text)
            this.dropDown();
        else
            this.closeDown();
    },
    get _panel(){
        const panel = document.createElement('oda-combo-box-panel');
        panel.dropDownControl = this.dropDownControl;
        return panel;
    },
    dropDown() {
        this._setFocus();
        this._panel.filter = this.text;
        this._dd = this._dd || ODA.showDropdown(this._panel, {}, { parent: this, useParentWidth: true}).then(res=>{
            this.value = res.result;
        }).catch(()=>{
            this.text = undefined;
        }).finally(()=>{
            this._dd = null;
            this._setFocus();
        })
    },
    closeDown(){
        ODA.closeDropdown();
    },
    keyBindings: {
        arrowDown(e) {
            this.dropDown();
            this.async(()=>{
                this.dropDownControl.$keys?.arrowDown?.(e);
            })
        },
        arrowUp(e) {
            this.dropDownControl.$keys?.arrowUp?.(e);
        },
        enter(e) {
            this._panel.$keys.enter(e);
        },
        space(e){
            if (!e.ctrlKey) return;
            this.dropDown();
            this.async(()=>{
                this.dropDownControl.$keys?.space?.(e);
            })
        }
    },
})
ODA({is: 'oda-combo-box-panel',
    template:`
        <style>
            :host{
                overflow: hidden;
                @apply --border;
                @apply --vertical;
                border-radius: 0px !important;
            }
            label{
                padding: 4px;
            }
        </style>
        <label ~if="!hasData" class="header disabled" ~html="text"></label>
        <slot ~show="hasData"></slot>
    `,
    get hasData(){
        return this.domHost.parent.hasData;
    },
    hostAttributes:{
        tabindex: 0
    },
    get text(){
        return `no data to select <b>${this.filter || ''}</b>...`
    },
    set filter(n){
        if (!this.dropDownControl)
            return;
        this.dropDownControl.filter = n;
    },
    set dropDownControl(n){
        if (!n) return;
        this.appendChild(n);
        this.async(()=>{
            n.addEventListener('result', e=>{
                this.fire(ok, n.result)
            });
        })
    },
    keyBindings:{
        enter(e) {
            this.fire('ok');
        }
    },
    result: undefined,
    ok(e){
        if (this.dropDownControl.result){
            this.result = this.dropDownControl.result;
            this.fire('ok');
        }
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
            [focused]{
                @apply --focused;
            }
            label:hover{
               @apply --selected;
            }
            label{
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
    get hasData(){
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
    get rows(){
        if (this.filter){
            const filter = this.filter.toLowerCase();
            return this.items?.filter(i=>{
                switch (typeof i){
                    case 'object':
                        return Object.values(i).filter(v=>{
                            return v?.toLowerCase?.().includes?.(filter);
                        }).length;
                    case 'string':
                        return i?.toLowerCase?.().includes?.(filter);
                }
            })
        }
        return this.items;
    },
    get result(){
        return this.focusedItem;
    }
})