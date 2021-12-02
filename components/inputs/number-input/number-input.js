ODA({is:'oda-number-input',
    template:`
        <style>
            :host{
                @apply --vertical;
            }
            input{
                margin: 20px;
                text-align: right;
            }
        </style>
        <input disabled :value>
        <input @input="_input" :value="inputValue">
        <input disabled :value="displayValue">
    `,
    async _input (e) {
        const char = e.data;
        const size = e.target.value.length;
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        switch (e.inputType){
            case 'insertText': {
                this.stack.splice(start-1, 0, char);
                this.value = undefined;
                try {
                    (new Function([], `with (this) {return ${this.value}}`));
                }
                catch (e) {
                    this.stack.splice(start-1, 1);
                    this.value = undefined;
                }
            } break;
            case 'insertFromPaste': {
                const clip = await navigator.clipboard.readText().then(text => text.split('')); // get an array of inserted elements
                clip.forEach((el, i) => { // insert the copied elements into the array
                    this.stack.splice(start-1+i, 0, el);
                })
            } break;
            case 'deleteContentBackward': {
                this.stack.splice(end, 1);
                this.value = undefined;
            } break;
        }
    },
    stack: [],
    props: {
        thousandsSeparator: ' ',
        decimalSeparator: '.',
        locale: 'RU',
        format: {
            default: 'decimal',
            list: ['percent', 'currency', 'text', 'decimal', '0.00' , '0.00%', '# 0,0000'],
        },
        mask: {
            get () {
                return formats[this.format]?.mask || '0.00';
            }
        },
        displayFormat: {
            get () {
                return formats[this.format]?.format || '0.00';
            }
        },
    },
    get value () {
        return this.stack.join('') || 0
    },
    get inputValue () {
        return this.value;
    },
    get displayValue () {
        return this.getFormattedValue();
    },
    getFormattedValue () {
        const minInt = /0/.test(this.mask) ? this.mask.match(/\d+(?=\.)/)[0].length : 0, // looking for the number of numbers to the point
              minFract = /0/.test(this.mask) ? this.mask.match(/(?<=\.)\d+/)[0].length : 0; // looking for the number of numbers after the dot
        switch (this.displayFormat) {
            case '0,0':
                return new Intl.NumberFormat('ru-RU').format(this.value);
            case '0.00%':
                return new Intl.NumberFormat('ru-RU', { style: 'percent', minimumIntegerDigits: minInt, minimumFractionDigits: minFract }).format(this.value)
            case '# #00.00$':
                return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB', minimumIntegerDigits: minInt, minimumFractionDigits: minFract }).format(this.value)
        };
    }
});
const formats = {
    'percent': {
        format: '0.00%', mask: '0.00%'
    },
    'scientific': {
        format: '0E0', mask: '0E0'
    },
    'currency': {
        format: '# #00.00$', mask: '0.0000'
    },
    'text': {
        format: 'SSSS', mask: 'SSSS'
    },
    'decimal': {
        format: '0,0', mask: '#,#'
    },
}