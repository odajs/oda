ODA({ is: 'oda-color-input',
    template: `
        <style>
            :host {
                display: flex;
                justify-content: center;
                align-items: center;
            }
            input {
                border: none;
                outline: none;
                background-color: var(--content-background);
                color: var(--content-color);
            }
            #txt {
                min-width: 0px;
            }
            #clr {
                width: 24px;
                min-width: 24px;
            }
        </style>
        <input id="txt" class="flex" :value="value" @change="setColor"/>
        <input id="clr" type="color" :value="value" @input="setColor"/>
    `,
    $public: {
        value: '#000000'
    },
    async attached() {
        const { MaskInput } = await import('./lib/maska.js');
        new MaskInput(this.$('#txt'), { mask: '!#HHHHHH', tokens: { 'H': { pattern: /[0-9a-fA-F]/, transform: (i) => i.toUpperCase() } } });
    },
    setColor(e) {
        this.value = (e?.target?.value || e).toUpperCase();
    }
})
