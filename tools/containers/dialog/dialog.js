ODA({is: 'oda-dialog', extends: 'oda-modal', imports: '@tools/modal',
    template: /*html*/`
        <oda-dialog-footer ~if="control && (buttons?.length || !hideOkButton || !hideCancelButton)" class="no-flex" slot="*" ></oda-dialog-footer>
    `,
    title: 'Dialog',
    $pdp:{
        buttons: [],
        hideOkButton: false,
        hideCancelButton: false,
        okDisabled: false,
        okLabel: 'OK',
        footerText: '',
        focusedButton: null //??? больше не нужно
    },
    $keyBindings:{
        enter(e){
            this.ok(this.focusedButton)
        }
    },
    ok(item) {
        this.container.fire('ok', item)
    }
})
ODA({is: 'oda-dialog-footer',
    template: /*html*/`
        <style>
            :host {
                @apply --horizontal;
                @apply --header;
                @apply --shadow;
                padding: 4px;
            }
            oda-button {
                margin: 4px;
                padding: 4px;
                min-width: 50px;
                opacity: .7;
                @apply --content;
                @apply --raised;
                transition: opacity .2s;
                border-radius: 4px;
                outline: none;
            }
            oda-button:focus{
                @apply --focused;
            }
            oda-button:hover {
                opacity: 1;
            }
            :host > div {
                flex-wrap: wrap;
            }
        </style>
        <div class="flex horizontal">
            <slot class="flex"></slot>
            <slot class="flex" name="footer"></slot>
            <oda-button
                ~for="buttons"
                ~is="$for.item?.is || 'oda-button'"
                ~props="$for.item"
                :tabindex="0"
                :item="($for.item.preFocused && $this.focus()), $for.item"
                :icon="$for.item.icon"
                :sub-icon="$for.item.subIcon"
                :label="$for.item?.label?.call?.(this, control) || $for.item?.label"
                :disabled="$for.item?.disabled?.call?.(this, control) ?? $for.item?.disabled"
                @tap="ok($for.item)"
                @focus="focusedButton = $for.item"
                @blur="focusedButton = null"
                class="no-flex"
            ></oda-button>
        </div>
        <div class="flex horizontal" style="align-items: center;">
            <label class="flex">{{footerText}}</label>
        </div>
        <div class="no-flex horizontal">
            <oda-button hide-icon ~if="!hideOkButton" @tap.stop="ok" :disabled="okDisabled" style="font-weight: bold;" tabindex="0" @focus="focusedButton = null">{{okLabel}}</oda-button>
            <oda-button hide-icon ~if="!hideCancelButton" @tap="cancel" style="width: 70px" tabindex="-1" @focus="focusedButton = null">Cancel</oda-button>
        </div>
    `,
})
