import '../palette/palette.js';
import '../../buttons/button/button.js';

export default ODA({ is: 'oda-color-picker',
    import: '@oda/palette @oda/button',
    template: /*html*/`
        <style>
            :host {
                @apply --vertical;
                justify-content: center;
                align-items: center;
            }
            :host([read-only]){
                pointer-events: none;
            }
            oda-button {
                @apply --flex;
                @apply --raised;
                flex-grow: 0;
                opacity: 1;
                padding: 0px;
                min-width: 8px;
                min-height: 8px;
            }
            oda-button:hover {
                @apply --shadow;
            }
        </style>
        <oda-button ref="btn" @tap.stop="_openDropdown" :iconSize="size - 4" ~style="gradientMode?{backgroundImage:value}:{backgroundColor:value}"></oda-button>
    `,
    props: {
        size: 24,
        value: '',
        gradientMode: false,
        readOnly: {
            type: Boolean,
            default: false,
            reflectToAttribute: true
        }
    },
    async _openDropdown() {
        let res = await ODA.showDropdown('oda-palette', { gradientMode: this.gradientMode }, { parent: this.$refs.btn, resolveEvent: 'value-changed' });
        this.value = res.value;
    }
})
