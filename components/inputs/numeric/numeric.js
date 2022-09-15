ODA({is: 'oda-numeric-input',
    template:`
        <style>
            :host{
       
            }
            input{
                outline: none;
                text-align: right;
            }
        </style>
        <input type="text" :value="text" @keydown="onKeypress">
    `,
    props:{
        currency:{
            default: 'RUB',
            list: ['RUB', 'USD']
        },
        accuracy: 2,
        value: 46346.435665,
        mask: '',
        format:{
            default: 'decimal',
            list: ['decimal', 'integer', 'currency', 'percent']
        }
    },
    get text(){
        let text;
        switch (this.format){
            case 'integer':{
                text = Math.floor(this.value).toLocaleString(this.accuracy);
            } break;
            case 'percent':{
                text = (this.value * 100).toLocaleString(this.accuracy)+'%';
            } break;
            case 'currency':{
                text = this.value.toLocaleString(this.accuracy) + ' '+ currencyList[this.currency];
            } break;
            default:{
                text = this.value.toLocaleString(this.accuracy);
            } break;
        }

        return text;
    },
    isFocused: false,
    onKeypress(e){
        // e.preventDefault();
        switch (e.key){
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':{

            } break;
            case 'Backspace':{
                e.preventDefault();
            }

        }
        console.log(e)
    }
})
const currencyList = {
    RUB: '₽',
    USD: '$'
}