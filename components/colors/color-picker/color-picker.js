ODA({ is: 'oda-color-picker', imports: '@oda/palette, @oda/button, @tools/containers', extends: 'oda-button',
    template: /*html*/`
        <style>
            :host {
                @apply --no-flex;
                flex-grow: 0;
                opacity: 1;
                background-image: {{gradientMode?value:''}};
                background-color: {{gradientMode?'':value}};
                font-size: small;
                color: {{value}};
                margin: 4px;
            }
            :host([read-only]) {
                pointer-events: none;
            }
            :host(:hover) {
                @apply --raised;
            }
        </style>
    `,
    $public: {
        value: '',
        gradientMode: false,
        readOnly: {
            $type: Boolean,
            $def: false,
            $attr: true
        }
    },
    $listeners: {
        async click(e) {
            try {
                const { control } = await ODA.showDropdown('oda-palette', { gradientMode: this.gradientMode,
                    'value-changed'(e){
                        this.fire('ok');
                    }}, { parent: this });
                this.value = control?.value;
            }
            catch (e) {
                console.log(e);
            }
        }
    },
})
