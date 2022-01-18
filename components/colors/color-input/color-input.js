import '../../../oda.js';
import 'https://cdn.jsdelivr.net/npm/maska@latest/dist/maska.js';

ODA({
    is: 'oda-color-input', template: `
        <style>
            :host {
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 1px;

            }
            input {
                border: none;
                outline: none;
                background-color: var(--content-background);
                color: var(--content-color);
            }
            #txt {
                width: 100%;
            }
            #clr {
                width: 24px;
                min-width: 24px;
            }
        </style>
        <input id="txt" ref="txt" :value="value" @change="_setTxt"/>
        <input id="clr" ref="clr" type="color" :value="value" @input="_setClr"/>
    `,
    props: {
        value: { 
            type: String, 
            default: '#F00000' },
    },
    attached() {
        setTimeout(() => {
            Maska.create(this.$refs.txt, { mask: '!#HHHHHH', tokens: { 'H': { pattern: /[0-9a-fA-F]/, uppercase: true } } });
        }, 100);

    },
    _setTxt(e) {
        this.value = this.$refs?.txt.value;
    },
    _setClr(e) {
        this.value = this.$refs?.clr.value.toUpperCase();
    }
})
