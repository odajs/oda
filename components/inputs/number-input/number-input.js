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
    _input(e){
        const char = e.data;
        const size = e.target.value.length;
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        switch (e.inputType){
            case 'insertText':{
                if (suffixes.has(char)){
                    if(size === start && start === end && e.target.value.indexOf(char) === end-1)
                        this.suffix = char;
                }
                else{
                    this.suffix = '';
                }
            } break;
            case 'insertFromPaste':{

            } break;
            case 'deleteContentBackward':{

            } break;
        }

        const value = Number.parseFloat(e.target.value || 0);
        if (Number.isNaN(value))
            return;
        this.value = value;
    },
    suffix: '',
    props:{
        thousandsSeparator: ' ',
        decimalSeparator: '.',
        locale: 'RU',
        value: {
            default: 5.5465634687695,
            label: 'Значение'
        },

        format:{
            default: 'percent',
            list: ['percent', 'currency', 'text', '0.00' , '0.00%', '# 0,0000']
        },
        mask:{
            get (){
                return formats[this.format]?.mask || '0.00';
            }
        },
        displayFormat:{
            get (){
                return formats[this.format]?.format || '0.00';
            }
        },
    },
    get inputValue(){
        return this.value.toString()+this.suffix;
    },
    get displayValue () {
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
const formats = {
    'percent': {
        format: '0.00%', mask: '0.00%'
    },
    'text': {
        format: 'SSSS'
    }
}
const suffixes = ['.', '%', '-', 'E', 'e']