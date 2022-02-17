ODA({is: 'oda-dialog', extends: 'oda-modal', imports: '@tools/modal',
    template: /*html*/`
    <oda-dialog-footer ~if="control" :control class="no-flex" slot="*"  :buttons :hide-ok-button :hide-cancel-button>
    </oda-dialog-footer> 
    `,
    buttons: [],
    focusedButton: null,
    props: {
        title: 'Dialog'
    },
    hideOkButton: false,
    hideCancelButton: false,
    // keyBindings: {
    //     enter() {
    //         if (this.focusedButton?.item?.execute)
    //             this.focusedButton.item.execute();
    //         this.fire('ok');
    //     }
    // },
    listeners: {
        dblclick(e) {
            e.stopPropagation();
            this.fire('ok');
        }
    }
})
ODA({is: 'oda-dialog-footer',
    template: /*html*/`
    <style>
        :host{
            @apply --horizontal;
            @apply --header;
            /*order: 10;*/
            /*border-radius: 4px;*/
        }
        oda-button{
            margin: 4px;
            padding: 4px;
            min-width: 50px;
            opacity: .7;
            @apply --content;
            @apply --raised;
            transition: opacity .2s;
            border-radius: 4px;
        }
        oda-button:hover{
            opacity: 1;
        }
        :host>div{
            flex-wrap: wrap;
        }
        [accent]{
            font-weight: bolder;
            border: 1px solid black;
            @apply --header; 
        }
    </style>
    <div class="flex horizontal">
        <slot></slot>
        <slot name="footer"></slot>
        <oda-button ~props="item" ~for="buttons" @tap="clickBtn($event)" :item :tabindex="index+1" @focusin="focusedButton = $event.target"
        :label="item?.label?.call?.(this, control) || item?.label"
        :disabled="item?.disabled?.call(this, control)"></oda-button>
    </div>
    <div class="no-flex horizontal">
        <oda-button hide-icon ~if="!hideOkButton" @tap="domHost.fire('ok')" style="font-weight: bold;" tabindex="0">OK</oda-button>
        <oda-button hide-icon ~if="!hideCancelButton" @tap="domHost.fire('cancel')" style="width: 70px">Cancel</oda-button>
    </div>
    `,
    clickBtn(e) {
        this.focusedButton = e.target;
        const item = e.target.item;
        if (item.execute)
            item.execute.call(this, e, this.control);
        this.domHost.fire('ok', item);
    },
    control: {},
    props: {
        buttons: [],
        hideOkButton: false,
        hideCancelButton: false,
    },
})
