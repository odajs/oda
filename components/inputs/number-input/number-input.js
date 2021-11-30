ODA({is:'oda-number-input',
    template:`
        <style>
            :host{
                @apply --vertical;
            }
            input{
                margin: 20px;
            }
        </style>
        <input ::value>
        <input ::value="input">
        <input ::value="display">
    `,
    props:{
        value: {
            default: 52352345.5465634687695,
            label: 'Значение'
        },
        input: '456',
        format:{
            default: 'text',
            list: ['percent', 'currency', 'text', '0.00' , '0.00%', '# 0,0000']
        }
    },
    get display () {
        return this.getFormattedValue();
    },
    getFormattedValue(){
        // const minimumIntegerDigits = this.format.match(/\d+(?<=\.)/)[0];
        // minimumIntegerDigits !== null ? minimumIntegerDigits.length : ;
        switch (this.format) {
            case 'text':
                return this.value.toString();
            case 'percent':
                return this.value.toLocaleString('ru-RU', { style: 'percent' });
            case 'currency':
                return this.value.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' });
        }
    }
})
