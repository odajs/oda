ODA({is: 'oda-numeric-input',
    template:`
        <style>
            :host{
       
            }
            input{
                outline: none;
                text-align: right;
                text-overflow: ellipsis;
            }
        </style>
        <input type="text" :value="text" @keydown="onKeyDown"  @input="onValueChanged" @scroll="onScroll">
    `,
    onScroll(e){
        this.input.scrollLeft = 10000;
    },
    onValueChanged(e){
        let ss = e.target.selectionStart;
        let se = e.target.selectionEnd;

        this.value = textToNumber(e.target.value);
        this.text = this.value.toLocaleString('ru-RU', {style: this.format, 'currency': this.currency, minimumFractionDigits: this.accuracy, maximumFractionDigits: this.accuracy})

        if (Math.abs(this.value) < 10){
            if (Math.floor(this.value) === this.value)
                ss = se = this.text.indexOf(',');
            else if (Math.abs(this.value) < 1)
                ss = se = this.text.indexOf(',') + 1;
        }

        this.render();
        this.async(()=>{
            this.input.selectionEnd = se;
            this.input.selectionStart = ss;
            this.input.scrollLeft = 10000;
        })
    },
    get input(){
        return this.$('input')
    },
    props:{
        currency:{
            default: 'RUB',
            list: ['RUB', 'USD', 'EUR', 'GBP', 'CNY']
        },
        accuracy: {
            default: 2,
            set(n){
                if (n<0)
                    this.accuracy = 0;
            }
        },
        value: {
            default: 0,
        },
        format:{
            default: 'decimal',
            list: ['decimal', 'currency', 'percent']
        }
    },
    get text(){
        return this.value.toLocaleString('ru-RU', {style: this.format, 'currency': this.currency, minimumFractionDigits: this.accuracy, maximumFractionDigits: this.accuracy})
    },
    isFocused: false,
    onKeyDown(e){
        switch (e.key){
            case '.':
            case ',':{
                e.preventDefault();
                this.$next(()=>{
                    this.input.selectionStart = this.input.selectionEnd = this.text.indexOf(',') + 1;
                },1)
            } break;
            case '-':{
                e.preventDefault();
                this.value = this.value * -1
                this.$next(()=>{
                    this.input.selectionStart = this.input.selectionEnd = this.value>0?0:1;
                },2)
            } break;
            case 'Delete':{
                let text = this.text;
                const end = e.target.selectionEnd - e.target.selectionStart === 0?e.target.selectionEnd+1:e.target.selectionEnd;
                let slice = text.slice(e.target.selectionStart, end);
                if (slice.includes(',')){
                    e.preventDefault();
                    text = text.substring(0, e.target.selectionStart) +',' + text.substring(end);
                    this.value = textToNumber(text);
                    if (this.value === Math.floor(this.value)) return;
                    this.$next(()=>{
                        this.input.selectionStart = this.input.selectionEnd = this.text.indexOf(',')+1;
                    },2)
                }
                else if (!isDigit(slice)){
                    this.$next(()=>{
                        this.input.selectionStart = this.input.selectionEnd = this.input.selectionStart + 1;
                    },2)
                }
                else if ((text.indexOf(',')-1) > e.target.selectionStart){
                    const se = text.length - e.target.selectionStart;
                    this.$next(()=>{
                        this.input.selectionStart = this.input.selectionEnd = this.text.length - Math.min(this.text.length, se - 1);
                    },2)
                }
                // else if (text.indexOf(',')>e.target.selectionStart){
                //     const se = text.length - e.target.selectionStart;
                //     this.$next(()=>{
                //         this.input.selectionStart = this.input.selectionEnd = this.text.length - (se+1);
                //     },2)

            } break;
            case 'Backspace':{
                let text = this.text;
                const start = e.target.selectionEnd - e.target.selectionStart === 0?e.target.selectionStart-1:e.target.selectionStart;
                let slice = text.slice(start, e.target.selectionEnd);
                if (slice.includes(',')){
                    e.preventDefault();
                    text = text.substring(0, start) +',' + text.substring(e.target.selectionEnd);
                    this.value = textToNumber(text);
                    this.$next(()=>{
                        this.input.selectionStart = this.input.selectionEnd = this.text.indexOf(',')
                    },2)
                }
                else if (!isDigit(slice)){
                    this.$next(()=>{
                        this.input.selectionStart = this.input.selectionEnd = this.input.selectionStart;
                    },2)
                }
                else if (text.indexOf(',')>start){
                    const se = text.length - e.target.selectionStart;
                    this.$next(()=>{
                        this.input.selectionStart = this.input.selectionEnd = this.text.length - Math.min(this.text.length, se);
                    },2)
                }

            } break;
        }
        switch (e.keyCode){
            case 189:
            case 190:{
                e.preventDefault();
                this.$next(()=>{
                    this.input.selectionStart = this.input.selectionEnd = this.text.indexOf(',') + 1;
                },1)
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
function isDigit(ch){
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
            return true;
    }
    return false;
}