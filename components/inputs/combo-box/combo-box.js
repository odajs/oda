import '/web/oda/tools/containers/containers.js';
ODA({is: 'oda-combo-box', imports: '@oda/button',
    template:`
        <style>
            :host{
                @apply --horizontal;
            }
        </style>
        <input class="flex" type="text" @input="input" :readonly="value" :value="filter || value?.label || value?.name || ''"></input>
        <oda-button :icon="value?'icons:close':'icons:chevron-right:90'" @tap="dropdown"></oda-button>
    `,
    items: [],
    props:{
        value: null,
    },
    filter: '',
    async dropdown(e){
        try{
            if (this.value) {
                this.value = null;
            }
            else {
                ODA.closeDropdown();
                this.value = (await ODA.showDropdown('oda-combo-list', {items: this.filtered, focusedItem: this.value}, {parent: this, focused: !!e})).focusedItem;
            }
            this.filter = '';
        }
        finally {
            this.async(()=>{
                this.$('input').focus();
            })
        }

    },
    async input(e){
        if (this.value) return;
        this.filter = e.target.value.toLowerCase();
        // if (!this.filter) return;
        this.dropdown();
    },
    get filtered(){
        return this.filter?this.items.filter(i=>i.label.toLowerCase().includes(this.filter)):this.items;
    },
    keyBindings:{
        ArrowDown(e){
            if (this.value) return;
            this.dropdown(true);
        },
        async space(e){
            if (this.value){
                await ODA.showConfirm('oda-dialog-message', {message: 'Clear value?', icon: 'icons:close', fill: 'red'});
                this.value = null;
            }

        },
        ArrowUp(e){
            ODA.closeDropdown();
        },
        enter(e) {

        }
    },
})
ODA({is:'oda-combo-list',
    template:`
        <style>
            :host{
                @apply --vertical;
                overflow-y: auto;
                overflow-x: hidden;
            }

        </style>
        <label style="min-height: 24px; align-content: center;" ~for="items" :focused="item === focusedItem" @tap="focusedItem = item; fire('ok')">{{item?.label}}</label>
    `,
    attached(){
        if (!this.focusedItem)
            this.focusedItem = this.items?.[0];
    },
    keyBindings:{
        ArrowDown(e){
            const idx = this.items.indexOf(this.focusedItem);
            if (idx<this.items.length-1)
                this.focusedItem = this.items[idx+1];
        },
        ArrowUp(e){
            const idx = this.items.indexOf(this.focusedItem);
            if (idx>0)
                this.focusedItem = this.items[idx-1];
            else
                this.domHost.fire('cancel');
        },
        enter(e){
            this.fire('ok');
        }
    },
    focusedItem: null,
    items: []
})