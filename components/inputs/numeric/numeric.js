ODA({is: 'oda-numeric-input',
    template:`
        <style>
            :host([overload])>input{
                @apply --error;
            }
            :host([calculate])::before{
                content: attr(calculate);
                position: absolute;
                font-size: xx-small;
                @apply --raised;
                @apply --dark;
                opacity: .5;
                padding: 2px 4px;
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
        let ss = e.target.value.length - e.target.selectionStart;
        let fraqPos = e.target.value.indexOf(',');
        let value = this.value;
        switch (e.inputType){
            case 'insertText':{
                if (isDigit(e.data)){
                    if (Math.abs(this.value)<1 && e.target.value.startsWith(e.data)){
                        e.target.value = e.target.value.replace('0,', ',');
                        ss--;
                    }
                    if (e.target.value.indexOf('-')>0){
                        // отмена вставки числа перед минусом
                    }
                    else
                        value = textToNumber(e.target.value);
                }

            } break;
            case 'deleteContentBackward':{
                value = textToNumber(e.target.value);
                if (value === this.value){
                    ss++;
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
        const text = Math.abs(value).toLocaleString(this.locale, {useGrouping: false, style: 'decimal', minimumFractionDigits: this.accuracy, maximumFractionDigits: this.accuracy});
        if (text.length<17){
            this.value = value;
            this.text = this.value.toLocaleString(this.locale, {style: this.format, 'currency': this.currency, minimumFractionDigits: this.accuracy, maximumFractionDigits: this.accuracy})
        }
        else{
            this.overload = true;
        }

        this.render();
        this.$next(()=>{
            fraqPos = this.text.indexOf(',');
            this.input.selectionStart = this.input.selectionEnd = this.text.length - Math.min(this.text.length, ss);
            if (fraqPos>0 && this.input.selectionStart - fraqPos > this.accuracy)
                this.input.selectionStart = this.input.selectionEnd = fraqPos + this.accuracy + 1;
            this.input.scrollLeft = 10000;
        })
    },

    get input(){
        return this.$('input')
    },
    memory: 0,
    set memory(n){
        if (n){
            this.value = 0;
        }
    },
    action: '',
    props:{
        locale: 'ru-RU',
        calculate:{
            default: '',
            get (){
                if (this.memory){
                    return this.memory.toLocaleString(this.locale, {minimumFractionDigits: this.accuracy, maximumFractionDigits: this.accuracy}) + ' ' + this.action + ' ';
                }
            },
            reflectToAttribute: true
        },
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
            type: Number,
            set(n){
                if (!n){
                    this.$next(()=>{
                        this.input.selectionStart = this.input.selectionEnd = 1;
                    }, 3)

                }
            }
        },
        format:{
            default: 'decimal',
            list: ['decimal', 'currency', 'percent']
        }
    },
    get text(){
        return this.value.toLocaleString(this.locale, {style: this.format, 'currency': this.currency, minimumFractionDigits: this.accuracy, maximumFractionDigits: this.accuracy})
    },
    calc(){
        if (!this.memory) return
        switch (this.action){
            case "+":{
                this.value = this.memory + this.value;
            } break;
            case "-":{
                this.value = this.memory - this.value;
            } break;
            case "*":{
                this.value = this.memory * this.value;
            } break;
            case "/":{
                this.value = this.memory / this.value;
            } break;
            case "^":{
                this.value = Math.pow(this.memory, this.value);
            } break;
            case "%":{
                this.value = this.value / this.memory;
            } break;
        }
        this.action = '';
        this.memory = 0;
    },
    isFocused: false,
    onKeyDown(e){
        const fraqPos = e.target.value.indexOf(',');
        console.log('fraqPos', fraqPos, 'selectionStart', e.target.selectionStart, 'selectionEnd', e.target.selectionEnd);
        switch (e.key){
            case 'Escape':{
                if (this.memory){
                    e.preventDefault();
                    this.value = this.memory;
                    this.memory = 0;
                    this.$next(()=>{
                        this.input.selectionStart = 0;
                        this.input.selectionEnd = this.text.length;
                    },1);
                }
                else if (e.target.selectionStart !== this.input.selectionEnd){
                    e.preventDefault();
                    this.input.selectionStart = this.input.selectionEnd = this.text.indexOf(',');
                }
            } break;
            case '=':
            case 'Enter':{
                if (!this.memory) return;
                e.preventDefault();
                this.calc();
            } break;
            case '/':
            case '*':
            case '%':
            case '^':
            case '+':{
                if (this.memory)
                    this.calc();
                this.memory = this.value;
                this.action = e.key;
            } break;
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
                let text = this.text;
                let slice = text.slice(e.target.selectionStart, e.target.selectionEnd);
                if (slice.length){
                    if (slice.includes(',')){
                        slice = ',';
                    }
                    else{
                        slice = ''
                    }

                    text = text.substring(0, e.target.selectionStart) + slice + text.substring(e.target.selectionEnd);
                    this.value = textToNumber(text);
                }
                this.$next(()=>{
                    this.input.selectionStart = this.input.selectionEnd = this.text.indexOf(',') + 1;
                },1)
            } break;
            case '-':{
                e.preventDefault();
                const se = e.target.value.length - e.target.selectionEnd;
                const ss = e.target.value.length - e.target.selectionStart;
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
            case 188:
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