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
        try {
            (new Function([], `with (this) {return ${this.value}}`));
        }
        catch (e) {

        }
        switch (e.inputType){
            case 'insertText': {
                this.stack.splice(start-1, 0, char);
            } break;
            case 'insertFromPaste': {
                const clip = await navigator.clipboard.readText().then(text => text.split('')); // get an array of inserted elements
                clip.forEach((el, i) => { // insert the copied elements into the array
                    this.stack.splice(start-1+i, 0, el);
                })
            } break;
            case 'deleteContentBackward': {
                this.stack.splice(end, 1);
            } break;
        }
        this.value = undefined;
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
        if (/0/.test(this.mask)) { // check for restrictions in the mask
            const minInt = this.mask.match(/\d+(?=\.)/)[0].length, // looking for the number of numbers to the point
                  minFract = this.mask.match(/(?<=\.)\d+/)[0].length; // looking for the number of numbers after the dot
            if (minInt && minFract)
                return this.value.toLocaleString('ru-RU', {minimumIntegerDigits: minInt, minimumFractionDigits: minFract});
        }
        switch (this.displayFormat) {
            case '0,0':
                return this.value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " "); // add the digit capacity for the entered number
            case '0.00%':
                return this.value.toLocaleString('ru-RU', { style: 'percent' });
            case '# #00.00$':
                return this.value.toLocaleString('ru-RU', { style: 'currency', currency: 'RUB' }).toFixed(4);
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
        format: 'SSSS'
    },
    'decimal': {
        format: '0,0', mask: '#,#'
    },
}