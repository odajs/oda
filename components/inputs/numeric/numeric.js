ODA({is: 'oda-numeric-input',
    template:`
        <style>
            :host([overload])>input{
                @apply --error;
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
        // console.log(e.inputType, e.target.value, e.target.selectionStart, e.target.selectionEnd, e.data);

        let ss = e.target.value.length - e.target.selectionStart;
        let se = e.target.value.length - e.target.selectionEnd;
        let fraqPos = e.target.value.indexOf(',');
        let value = this.value;
        switch (e.inputType){
            case 'insertText':{
                if (isDigit(e.data))
                    value = textToNumber(e.target.value);
            } break;
            case 'deleteContentBackward':{
                value = textToNumber(e.target.value);
                if (value === this.value){
                    ss++;
                    se++;
                }
            } break;
            case 'deleteContentForward':{
                if (fraqPos>0 && fraqPos < e.target.selectionStart){
                    e.target.value = e.target.value.slice(0, e.target.selectionStart) + '0' + (e.target.value).slice(e.target.selectionStart);
                }
                value = textToNumber(e.target.value);
            } break;
            default:{
                this.render();
                return;
            }

        }
        this.overload = false;
        const text = Math.abs(value).toLocaleString('ru-RU', {useGrouping: false, style: 'decimal', minimumFractionDigits: this.accuracy, maximumFractionDigits: this.accuracy});
        if (text.length<17){
            this.value = value;
            this.text = this.value.toLocaleString('ru-RU', {style: this.format, 'currency': this.currency, minimumFractionDigits: this.accuracy, maximumFractionDigits: this.accuracy})
        }
        else{
            this.overload = true;
        }

        this.render();
        this.$next(()=>{
            fraqPos = this.text.indexOf(',');
            this.input.selectionStart = this.input.selectionEnd = this.text.length - Math.min(this.text.length, se);
            if (fraqPos>0 && this.input.selectionStart - fraqPos > this.accuracy)
                this.input.selectionStart = this.input.selectionEnd = fraqPos + this.accuracy + 1;
            this.input.scrollLeft = 10000;
        })
    },

    get input(){
        return this.$('input')
    },
    props:{
        overload: {
            default: false,
            private: true,
            reflectToAttribute: true,
            set(n) {
                if (n){
                    this.async(()=>{
                        this.overload = false;
                    }, 100)
                }
            }
        },
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
            // set(n){
            //     this.async(()=>{
            //         this.text = n?.toLocaleString('ru-RU', {style: this.format, 'currency': this.currency, minimumFractionDigits: this.accuracy, maximumFractionDigits: this.accuracy})
            //     })
            //
            // }
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
        const fraqPos = e.target.value.indexOf(',');
        console.log('fraqPos', fraqPos, 'selectionStart', e.target.selectionStart, 'selectionEnd', e.target.selectionEnd);
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
            case '9': {
                if (fraqPos<0) return;
                let text = this.text;
                let slice = text.slice(e.target.selectionStart, e.target.selectionEnd);
                if (slice.includes(',')){
                    e.preventDefault();
                    if (fraqPos <= e.target.selectionStart){
                        text = text.substring(0, e.target.selectionStart) +',' + e.key + text.substring(e.target.selectionEnd);
                        this.$next(()=>{
                            this.input.selectionStart = this.input.selectionEnd = this.text.indexOf(',') + 2;
                        },2)
                    }
                    else{
                        text = text.substring(0, e.target.selectionStart) + e.key + ',' + text.substring(e.target.selectionEnd);
                        this.$next(()=>{
                            this.input.selectionStart = this.input.selectionEnd = this.text.indexOf(',');
                        },2)
                    }
                    this.value = textToNumber(text);
                }
                else if (fraqPos>0 && fraqPos < e.target.selectionStart){
                    e.preventDefault();
                    if (e.target.selectionStart - fraqPos>this.accuracy) return;
                    text = text.substring(0, e.target.selectionStart) + e.key + text.substring((e.target.selectionEnd - e.target.selectionStart)?e.target.selectionEnd:(e.target.selectionEnd + 1));
                    this.value = textToNumber(text);
                    const start = e.target.selectionStart;
                    this.$next(()=>{
                        this.input.selectionStart = this.input.selectionEnd = this.text.indexOf(',') + start - fraqPos + 1;
                    },2)
                }
            } break;
            case '.':
            case ',':{
                e.preventDefault();
                if (fraqPos<0) return;
                this.$next(()=>{
                    this.input.selectionStart = this.input.selectionEnd = this.text.indexOf(',') + 1;
                },1)
            } break;
            case '-':{
                e.preventDefault();
                const se = e.target.value.length - e.target.selectionEnd;
                const ss = e.target.value.length - e.target.selectionEnd;
                this.value = this.value * -1
                this.$next(()=>{
                    this.input.selectionStart = this.text.length - ss;
                    this.input.selectionEnd = this.text.length - se;
                },1)
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
                        this.input.selectionStart = this.input.selectionEnd = this.text.indexOf(',') + 1;
                    },1)
                }
            } break;
            case 'Backspace':{
                let text = this.text;
                let start = e.target.selectionEnd - e.target.selectionStart === 0?e.target.selectionStart-1:e.target.selectionStart;
                let slice = text.slice(start, e.target.selectionEnd);
                if (slice.includes(',')){
                    e.preventDefault();
                    text = text.substring(0, start) +',' + text.substring(e.target.selectionEnd);
                    this.value = textToNumber(text);
                    this.$next(()=>{
                        this.input.selectionStart = this.input.selectionEnd = this.text.indexOf(',')
                    },1)
                }
                else if (fraqPos>0 && fraqPos < e.target.selectionEnd){
                    e.preventDefault();
                    text = text.substring(0, start) + text.substring(e.target.selectionEnd);
                    this.value = textToNumber(text);
                    start = e.target.value.length - start;
                    this.$next(()=>{
                        this.input.selectionStart = this.input.selectionEnd = this.text.length - start;
                    },1)
                }
            } break;
            case 'ArrowRight':{
                if (fraqPos>0 && this.input.selectionStart - fraqPos > this.accuracy){
                    e.preventDefault();
                    this.input.selectionStart = this.input.selectionEnd = fraqPos + this.accuracy + 1;
                }
            } break;
            case 'ArrowLeft':{
                if (fraqPos>0 && this.input.selectionStart - fraqPos - 1 > this.accuracy){
                    e.preventDefault();
                    this.input.selectionStart = this.input.selectionEnd = fraqPos + this.accuracy + 1;
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