export default ODA({ is: 'oda-color-picker', imports: '@oda/palette, @oda/button, @tools/containers', extends: 'oda-button',
    template: /*html*/`
        <style>
            :host {
                @apply --no-flex;
                flex-grow: 0;
                opacity: 1;
                margin: 4px;
                background-image: {{gradientMode?value:''}};
                background-color: {{gradientMode?'':value}};
                font-size: small;
                color: {{value}};
            }
            :host([read-only]){
                pointer-events: none;
            }
            :host(:hover) {
                @apply --raised;
            }
        </style>
    `,
    props: {
        value: '',
        gradientMode: false,
        readOnly: {
            type: Boolean,
            default: false,
            reflectToAttribute: true
        }
    },
    listeners:{
        async tap(e){
            try{
                let res = await ODA.showDropdown('oda-palette', { gradientMode: this.gradientMode }, { parent: this.$refs.btn, resolveEvent: 'value-changed' });
                this.value = res.value;
            }
            catch (e){}
        }
    },
})
