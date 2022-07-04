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
        <input class="flex" type="text" @input="input" :value="text">
        <oda-button ~if="!hideButton" :icon="value?'icons:close':icon" @tap="_dd?closeDown():dropDown()"></oda-button>
    `,
    get _items() {
        return typeof this.items === 'function'
            ? this.items()
            : this.items;
    },
    props: {
        icon: 'icons:chevron-right:90',
        value: Object,
        hideButton:{
            default: false,
            reflectToAttribute: true
        }
    },
    set dropDownControl(n){
        this._panel.dropDownControl = n;
    },
    get text(){
        return this.value?.toString() || '';
    },
    iconSize: 24,
    _dd: null,
    async input(e) {
        this.text = e.target.value;
        if (e.target.value)
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
            this.value = res;
        }).catch(()=>{
            this.text = undefined;
        }).finally(()=>{
            this._dd = null;
        })
    },
    closeDown(){
        ODA.closeDropdown();
    },
    keyBindings: {
        ArrowDown(e) {
            this.dropDown();
            this._panel.down(e)
        },
        ArrowUp(e) {
            this._panel.up(e)
        },
        enter(e) {

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
    up(e){
        this.dropDownControl?.up(e);
    },
    down(e){
        this.dropDownControl?.down(e);
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
            this.fire(ok, this.dropDownControl.result);
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
        </style>
        <label style="min-height: 24px; align-content: center;" ~for="rows" :focused="item === focusedItem" @tap="focusedItem = item; fire('ok')">{{item?.label || item}}</label>
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
    }
})