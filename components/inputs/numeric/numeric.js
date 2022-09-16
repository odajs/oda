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
        <input type="text" :value="text" @keydown="onKeypress" @value-changed="_ccc">
    `,
    _ccc(e){
        if (this.selectionStart !== undefined){
            this.input.selectionStart = this.selectionStart;
            this.selectionStart = undefined
        }
        if (this.selectionEnd !== undefined){
            this.input.selectionEnd = this.selectionEnd;
            this.selectionEnd = undefined
        }
    },
    get input(){
        return this.$('input')
    },
    props:{
        currency:{
            default: 'RUB',
            list: ['RUB', 'USD']
        },
        accuracy: {
            default: 2,
            set(n){
                if (n<0)
                    this.accuracy = 0;
            }
        },
        value: 0,
        style:{
            default: 'decimal',
            list: ['decimal', 'currency', 'percent']
        }
    },
    get text(){
        return this.value.toLocaleString('ru-RU', {style: this.style, 'currency': this.currency, minimumFractionDigits: this.accuracy, maximumFractionDigits: this.accuracy})
    },
    isFocused: false,
    onKeypress(e){
        let text = this.text;
        const pos = e.target.selectionStart - text.indexOf(',');
        console.log('pos', pos)
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
                e.preventDefault();
                if (pos>0 && Number.parseInt(text[e.target.selectionStart]) !== Number.NaN){
                    text= text.substring(0, e.target.selectionStart) + e.key + text.substring(e.target.selectionStart + 1);
                    this.selectionEnd = this.selectionStart = e.target.selectionStart+1;
                    // e.target.selectionStart++;
                    // e.target.selectionEnd = e.target.selectionStart;
                }
                this.value = textToNumber(text);
            } break;
            case 'Backspace':{
                e.preventDefault();
                if (e.target.selectionStart>0){
                    e.target.selectionStart--;
                    e.target.selectionEnd = e.target.selectionStart;
                }
                this.value = textToNumber(text);
            } break;
            case 'ArrowLeft':{
                // if (e.target.selectionStart>0){
                //     e.target.selectionStart--;
                //     if (!e.shiftKey)
                //         e.target.selectionEnd = e.target.selectionStart;
                // }

            } break;
            case 'ArrowRight':{
                // if (e.target.selectionStart<e.target.value.length){
                //     e.target.selectionStart++;
                //     if (!e.shiftKey)
                //         e.target.selectionEnd = e.target.selectionStart;
                // }

            } break;
        }
    }
})
function textToNumber(text){
    let value = '';
    let divider = 1;
    for (let ch of text){
        switch (ch){
            case '0':
            case '1':
            case '2':
            case '3':
            case '4':
            case '5':
            case '6':
            case '7':
            case '8':
            case '9':
            case '.':
            case '-':
            case 'e':
            case 'E': break;
            case ',':{
                ch = '.'
            } break;
            case '%':{
                divider = 100;
                continue;
            }
            default:
                continue;
        }
        value +=ch;

    }
    if (value.endsWith('.'))
        value.substring(0, value.length-1);
    return Number.parseFloat(value)/divider;
}