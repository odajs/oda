ODA({is: 'oda-dialog', extends: 'oda-modal', imports: '@tools/modal',
    template: /*html*/`
    <oda-dialog-footer ~if="control" ref="footer" :control class="no-flex" slot="*" :buttons :hide-ok-button :hide-cancel-button>
    </oda-dialog-footer>
    `,
    buttons: [],
    get focusedButton() {
        return this.buttons.find(b => b.focused)
    },
    props: {
        title: 'Dialog'
    },
    hideOkButton: false,
    hideCancelButton: false,
    okDisabled: false,
    listeners: {
        dblclick(e) {
            e.stopPropagation();
            this.ok();
        }
    },
    _onKeyDown(e) {
        switch (e.keyCode) {
            case 13 /* enter */: this.ok(); break;
            case 27 /* esc */: this.cancel(); break;
        }
    },
    attached() { this.listen('keydown', '_onKeyDown', { target: window}) },
    detached() { this.unlisten('keydown', '_onKeyDown', { target: window}) },
    async ok(item = this.focusedButton) {
        if (typeof item?.execute === 'function') await item?.execute();
        (this.domHost || this).fire('ok', item)
    },
    cancel() { (this.domHost || this).fire('cancel') }
})
ODA({is: 'oda-dialog-footer',
    template: /*html*/`
    <style>
        :host{
            @apply --horizontal;
            @apply --header;
            @apply --shadow;
            padding: 4px;
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
    </style>
    <div class="flex horizontal" style="justify-content: space-around">
        <slot class="flex"></slot>
        <slot class="flex" name="footer"></slot>
        <oda-button class="flex" ~props="item" ~for="buttons" @tap="clickBtn($event)" :item :tabindex="index+1" @focusin="onFocusIn" @blur="onBlur" :label="item?.label?.call?.(this, control) || item?.label" :disabled="item?.disabled?.call(this, control)"></oda-button>
    </div>
    <div class="no-flex horizontal" style="margin-left: 16px">
        <oda-button hide-icon ~if="!hideOkButton" @tap="ok" :disabled="okDisabled" style="font-weight: bold;" tabindex="0" @focusin="onFocusIn"  @blur="onBlur">OK</oda-button>
        <oda-button hide-icon ~if="!hideCancelButton" @tap="cancel" style="width: 70px" tabindex="0" @focusin="onFocusIn"  @blur="onBlur">Cancel</oda-button>
    </div>
    `,
    clickBtn(e) {
        if (e.target.hasAttribute('disabled')) return;
        this.ok(e.target?.item)
    },
    control: {},
    props: {
        buttons: [],
        hideOkButton: false,
        hideCancelButton: false,
    },
    onFocusIn(e) { this.focusedButton = e.target },
    onBlur(e) { this.focusedButton = null },
    listeners:{
        pointerdown(e){
            e.stopPropagation();
        }
    }
})
