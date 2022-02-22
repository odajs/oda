import '../palette/palette.js';
import '../../buttons/button/button.js';

export default ODA({ is: 'oda-color-picker',
    import: '@oda/palette @oda/button', extends: 'oda-button',
    template: /*html*/`
        <style>
            :host {
                @apply --no-flex;
                flex-grow: 0;
                opacity: 1;
                padding: 0px;
                background-image: {{gradientMode?value:''}};
                background-color: {{gradientMode?'':value}};
                font-size: small;
                @apply --raised;
                @apply --text-shadow;
                color: white;
            }
            :host([read-only]){
                pointer-events: none;
            }
            :host(:hover) {
                @apply --shadow;
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
            let res = await ODA.showDropdown('oda-palette', { gradientMode: this.gradientMode }, { parent: this.$refs.btn, resolveEvent: 'value-changed' });
            this.value = res.value;
        }
    },
})
