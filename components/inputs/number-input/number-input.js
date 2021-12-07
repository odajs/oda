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
            input:focus {
                outline: none;
            }
            input:invalid {
              border-color: red
            }
        </style>
        <span>format: {{format}}</span>
        <span>display: {{displayFormat}}</span>
        <span>mask: {{mask}}</span>
        <input disabled :value>
        <input @input="_input" @select="selectionchange" :value="inputValue">
        
        
        <input disabled :value="displayValue">
        <input @oninvalid="onInvalid" type="text" pattern="[A-Za-z]{3}" title="Three letter country code" required>
        <input type="tel" pattern="2-[0-9]{3}-[0-9]{3}" placeholder="+_(__)___ __ __" title="Three letter country code" required>
    `,
    onInvalid(e){
        console.dir(e)
    },
    selectionchange (e) {
        this.start = e.target.selectionStart;
        this.end = e.target.selectionEnd;
        const toDelete = this.end-this.start;
        this.count = toDelete;
    },
    async _input (e) {
        const char = e.data,
              size = e.target.value.length;
              this.start = e.target.selectionStart,
              this.end = e.target.selectionEnd;

        switch (e.inputType) {
            case 'insertText': {
                this.stack.splice(this.start-1, 0, char);
                this.value = undefined;
                try {
                    (new Function([], `with (this) {return ${this.value}}`));
                }
                catch (e) {
                    this.stack.splice(this.start-1, 1);
                    this.value = undefined;
                }
            } break;
            case 'insertFromPaste': {
                const clip = await navigator.clipboard.readText().then(text => text.split('')); // get an array of inserted elements
                    this.stack.splice(this.start-clip.length, this.count, ...clip); // subtract the length of the inserted line from the starting point to get the correct insertion point
                    this.value = undefined;
            } break;
            case 'deleteContentBackward': {
                this.stack.splice(this.end, 1);
                this.value = undefined;
            } break;
        }
    },
    stack: [],
    start: '',
    end: '',
    count: 0,
    props: {
        thousandsSeparator: ' ',
        decimalSeparator: '.',
        locale: 'RU',
        format: {
            default: 'currency',
            list: ['percent', 'currency', 'text', 'decimal', '0.00' , '0.00%', '# 0,0000'],
        },
        mask: {
            get () {
                return formats[this.format]?.mask || this.format;
            }
        },
        displayFormat: {
            get () {
                return formats[this.format]?.format || this.format;
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
            case '# #00.000':
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
        format: 'SSSS', mask: 'SSSS', formatter: './formatters/text.js'
    },
    'decimal': {
        format: '0,0', mask: '#,#'
    },
}