import '/web/oda/tools/containers/containers.js';
ODA({is: 'oda-combo-box', imports: '@oda/button',
    template: /*html*/`
        <style>
            :host {
                @apply --horizontal;
                min-height: {{iconSize + 2}}px;
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
        </style>
        <input class="flex" type="text" @input="input" :value="text" :placeholder>
        <oda-button ~if="!hideButton" :icon="value?'icons:close':icon" @tap="_dd?closeDown():dropDown()"></oda-button>
    `,
    placeholder: '',
    props: {
        icon: 'icons:chevron-right:90',
        value: Object,
        hideButton:{
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
    async input(e) {
        this.text = e.target.value;
        this._lastValue = e.target.value;
        e.target.value = undefined;
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
        this._panel.filter = this.text;
        this._dd = this._dd || ODA.showDropdown(this._panel, {}, { parent: this, useParentWidth: true}).then(res=>{
            this._lastValue = undefined;
            this.value = res.result;
        }).catch(()=>{
            if (this._lastValue)
                this.value = this._lastValue;
            this.text = undefined;
        }).finally(()=>{
            this._dd = null;
            this._lastValue = undefined;
        })
    },
    closeDown(){
        ODA.closeDropdown();
    },
    keyBindings: {
        ArrowDown(e) {
            this.dropDown();
            this.async(()=>{
                this._panel._down(e);
            })

        },
        ArrowUp(e) {
            this._panel._up(e)
        },
        enter(e) {
            this._panel.ok(e)
        },
        space(e){
            if (!e.ctrlKey) return;
            this.dropDown();
        }
    },
})
ODA({is: 'oda-combo-box-panel',
    template:`
        <style>
            :host{
                @apply --border;
                @apply --vertical;
            }
            label{
                padding: 4px;
            }
        </style>
        <label ~if="!dropDownControl?.hasData" class="header disabled" ~html="text"></label>
        <slot>
    `,
    get text(){
        return `no data to select <b>${this.filter || ''}</b>...`
    },
    set filter(n){
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
    result: undefined,
    _up(e){
        this.dropDownControl?.moveUp?.(e);
    },
    _down(e){
        this.dropDownControl?.moveDown?.(e);
    },
    pgUp(e){
        this.dropDownControl?.up(e);
    },
    pgDown(e){
        this.dropDownControl?.down(e);
    },
    home(e){
        this.dropDownControl?.home(e);
    },
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
                padding: 0px 8px;
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
            }
        </style>
        <label ~for="rows" :focused="item === focusedItem" @tap="focusedItem = item">{{item?.label || item}}</label>
    `,
    filter: '',
    get hasData(){
        return this.rows?.length;
    },
    attached() {
        if (!this.focusedItem)
            this.focusedItem = this.items?.[0];
    },
    keyBindings: {
        ArrowDown(e) {
            this.moveDown(e);
        },
        ArrowUp(e) {
            this.moveUp(e);
        },
        enter(e) {
            this.fire('ok');
        }
    },
    moveUp(e){
        const idx = this.items.indexOf(this.focusedItem);
        if (idx > 0)
            this.focusedItem = this.items[idx - 1];
    },
    moveDown(e){
        const idx = this.rows.indexOf(this.focusedItem);
        if (idx < this.rows.length - 1)
            this.focusedItem = this.rows[idx + 1];
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