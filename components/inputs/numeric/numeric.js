ODA({is: 'oda-numeric-input',
    template:`
        <style>
            :host{
                @apply --vertical;
            }
            :host([overload])>input{
                @apply --error;
            }
            :host([calculate]){
                @apply --invert;
            }
            :host([calculate])>input{
                font-size: x-small !important;
                min-width: {{minW}}px;
                min-height: {{minH}}px;
            }
            :host([calculate])::before{
                content: attr(calculate);
                position: absolute;
                font-size: xx-small;
                @apply --info;
                padding: 2px 4px;
            }
            input{
                outline: none;
                text-align: right;
                text-overflow: ellipsis;
            }
        </style>
        <input class="flex" type="text" :value="valueText" @keydown="onKeyDown"  @input="onValueChanged" @scroll="onScroll">
    `,
    onScroll(e){
        this.input.scrollLeft = 10000;
    },
    minW: 0,
    minH:0,
    get beginInt(){
        for (let i = 0; i<this.valueText.length; i++){
            if (isDigit(this.valueText[i]))
                return i;
        }
        return undefined;
    },
    get endInt(){
        return this.beginFrac - (this.accuracy>0?1:0);
    },
    get beginFrac(){
        return this.endFrac - this.accuracy;
    },
    get endFrac(){
        for (let i = this.valueText.length-1; i>=0; i--){
            if (isDigit(this.valueText[i]))
                return i+1;
        }
        return undefined;
    },
    get separator(){
        return (1.1).toLocaleString(this.locale)[1]
    },
    onValueChanged(e) {
        console.log('onValueChanged', e.target.value);
        let ss = this.valueText.length - e.target.selectionStart;
        switch (e.inputType){
            case 'insertText':{
                if (!isDigit(e.data)){
                    e.preventDefault();
                    this.$next(()=>{
                        this.input.selectionStart = this.input.selectionEnd = this.valueText.length - ss - 1;
                    })
                    return;
                }
            } break;
        }
        this.value = textToNumber(e.target.value, this.separator);
        this.setPos();
    },
    setPos(){
        this.render();
        this.$next(()=>{
            console.log('setPos', this.input.selectionStart,  this.input.selectionEnd);
            if (!this.value){
                if (this.input.selectionStart < this.endInt)
                    this.input.selectionStart = this.input.selectionEnd = this.endInt;
                if (this.accuracy && this.input.selectionEnd > this.endFrac-1)
                    this.input.selectionEnd = this.endFrac - 1;
            }
            if (this.input.selectionStart < this.beginInt)
                this.input.selectionStart = this.beginInt;
            if (this.input.selectionEnd > this.endFrac)
                this.input.selectionEnd = this.endFrac;
            this.input.scrollLeft = 10000;
        })
    },
    get input(){
        return this.$('input')
    },
    set memory(n){
        if (n){
            const r = this.input.getBoundingClientRect();
            this.minW = r.width;
            this.minH = r.height;
            if (this.log.last !== this.value)
                this.log.push(this.value);
            this.value = 0;
        }
    },
    log: [],
    action: '',
    props:{
        hideZero: false,
        locale: {
            default: 'ru-RU',
            get list(){
                return ODA.loadJSON("@tools/localization/locales.json").then(list =>{
                    const result = [];
                    for (let key in list){
                        result.push({label: key+': '+list[key], value: key})
                    }
                    return result.sort((a,b)=>{
                        return a.value>b.value?1:-1
                    });
                })
            }
        },
        calculate:{
            default: '',
            get (){
                if (this.memory){
                    return this.memory.toLocaleString(this.locale, {minimumFractionDigits: (this.action === '!'?0:this.accuracy), maximumFractionDigits: (this.action === '!'?0:this.accuracy)}) + ' ' + this.action + ' ';
                }
            },
            reflectToAttribute: true
        },
        overload: {
            default: false,
            private: true,
            reflectToAttribute: true,
            get(){
                return  (Math.abs(this.value * Math.pow(this.accuracy, 10))> Number.MAX_SAFE_INTEGER)
            }
            // set(n) {
            //     if (n){
            //         this.async(()=>{
            //             this.overload = false;
            //         }, 100)
            //     }
            // }
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
            default: 0,
            set(n, o){
                if (n === 0){
                    this.render();
                    this.$next(()=>{
                        this.input.selectionStart = this.input.selectionEnd = this.endInt;
                    })
                }
            }
        },
        format:{
            default: 'decimal',
            list: ['decimal', 'currency', 'percent']
        }
    },
    get valueText(){
        if (this.hideZero && !this.value)
            return ''
        return this.calcText(this.value);
    },
    calcText(value){
        if (this.hideZero && !value)
            return ''
        return value.toLocaleString(this.locale, {style: (this.memory?'decimal':this.format), 'currency': this.currency, minimumFractionDigits: this.accuracy, maximumFractionDigits: this.accuracy})+(this.memory?' = ':"");
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
            case "X":{
                this.value = this.memory * this.value;
            } break;
            case "/":{
                this.value = this.memory / this.value;
            } break;
            case "^":{
                this.value = Math.pow(this.memory, this.value);
            } break;
            case "%":{
                this.value = this.memory * (this.value / 100);
            } break;
        }
        this.action = '';
        this.memory = 0;
        this.valueText = this.calcText(this.value)
        this.$next(()=>{
            this.input.selectionStart = 0;
            this.input.selectionEnd = 100000;
            this.setPos();
        },1)

    },
    isFocused: false,
    onKeyDown(e){
        let ss = e.target.selectionStart;
        let se = e.target.selectionEnd;

        switch (e.key){
            case 'Space':{
                this.value = 0;
            } return;
            case 'Escape':{
                if (this.help){
                    e.preventDefault();
                    this.help = false;
                }
                else if (this.memory){

                    this.value = this.memory;
                    this.memory = 0;
                    this.$next(()=>{
                        this.input.selectionStart = 0;
                        this.input.selectionEnd = this.valueText.length;
                    },1);
                }
                else if (e.target.selectionStart !== this.input.selectionEnd){
                    e.preventDefault();
                    this.input.selectionStart = this.input.selectionEnd = this.valueText.indexOf(this.separator);
                }
            } break;
            case '=':
            case 'Enter':{
                e.preventDefault();
                if (!this.memory) {
                    if (e.target.selectionStart !== this.input.selectionEnd){
                        this.input.selectionStart = this.input.selectionEnd = this.valueText.indexOf(this.separator);
                    }
                }
                else
                    this.calc();
            } break;
            case '/':
            case '%':
            case '^':
            case '+':{
                e.preventDefault();
                if (this.memory)
                    this.calc();
                this.memory = this.value;
                this.action = e.key;
            } break;
            case '!':{
                e.preventDefault();
                const n = Math.floor(this.value);
                this.value = n * (n-1);
            } break;
            case '*':{
                e.preventDefault();
                if (this.memory)
                    this.calc();
                this.memory = this.value;
                this.action = 'X';
            } break;
            case '_':{
                e.preventDefault();
                if (this.memory)
                    this.calc();
                this.memory = this.value;
                this.action = '-';
            } break;
            case '-':{
                e.preventDefault();
                ss = e.target.value.length - ss;
                se = e.target.value.length - se;
                this.value = -this.value;
                this.$next(()=>{
                    this.input.selectionStart = this.valueText.length - ss;
                    this.input.selectionEnd = this.valueText.length - se;
                    this.setPos();
                })
            } break;
            case '.':
            case ',':{
                e.preventDefault();
                e.target.selectionStart = e.target.selectionEnd = this.beginFrac;
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
                e.preventDefault();
                let text = this.valueText;
                if (this.value && ss >= this.endFrac && this.endInt != this.endFrac) return;
                let backSS = e.target.value.length - se;
                if (ss >= this.beginFrac && this.endInt != this.endFrac)
                    backSS = text.length - ss - 1;
                else if (se > this.endInt)
                    backSS = text.length - this.endInt;
                let slice = text.slice(ss, se);
                slice = slice.includes(this.separator)?this.separator:'';
                if (!this.value)
                    this.value = textToNumber(e.key);
                else
                    this.value = textToNumber(text.substring(0, ss) + e.key + slice + text.substring(se));
                this.valueText = this.calcText(this.value);
                this.$next(()=>{
                    if(this.value < 10 && this.value === Math.floor(this.value))
                        this.input.selectionEnd = this.input.selectionStart = this.endInt;
                    else
                        this.input.selectionEnd = this.input.selectionStart = this.valueText.length - backSS;
                }, 1)
            } return;
            case 'Delete':{
                e.preventDefault();
                if (ss >= this.endFrac) return;
                if (ss === se){
                    if (ss === this.endInt && this.endInt !== this.beginFrac)
                        ss++;
                    while (!isDigit(e.target.value[se]) && se<this.endFrac)
                        se++;
                    se++;
                }
                let backSS = e.target.value.length - se;
                if (ss >= this.beginFrac)
                    backSS = e.target.value.length - ss;
                else if (se > this.endInt)
                    backSS = e.target.value.length - this.endInt;
                let slice = e.target.value.slice(ss, se);
                slice = slice.includes(this.separator)?this.separator:'';
                this.value = textToNumber(e.target.value.substring(0, ss) + slice + e.target.value.substring(se));
                this.$next(()=>{
                    this.input.selectionEnd = this.input.selectionStart = this.input.value.length - Math.min(this.input.value.length, backSS);
                },1)
            } return;
            case 'Backspace':{
                e.preventDefault();
                if (ss < this.beginInt) return;
                if (ss>this.endFrac)
                    ss = this.endFrac;
                if (se>this.endFrac)
                    se = this.endFrac;
                if (ss === se){
                    if (se === this.beginFrac && this.endInt !== this.beginFrac)
                        se--;
                    ss--;
                    while (!isDigit(e.target.value[ss]) && ss>this.beginInt)
                        ss--;
                }
                let backSS = e.target.value.length - se;
                if (ss >= this.beginFrac)
                    backSS = e.target.value.length - ss;
                else if (se > this.endInt)
                    backSS = e.target.value.length - this.endInt;
                let slice = e.target.value.slice(ss, se);
                slice = slice.includes(this.separator)?this.separator:'';
                this.value = textToNumber(e.target.value.substring(0, ss) + slice + e.target.value.substring(se));
                this.valueText = this.calcText(this.value);
                this.input.selectionEnd = this.input.selectionStart = this.valueText.length - Math.min(this.valueText.length, backSS);
                this.$next(()=>{
                    this.input.selectionEnd = this.input.selectionStart = this.valueText.length - Math.min(this.valueText.length, backSS);
                },1)
            } return;
        }
        switch (e.keyCode){
            case 188:
            case 190:{
                e.preventDefault();
                e.target.selectionStart = e.target.selectionEnd = this.beginFrac;
            } break;
        }
        this.setPos();
    }
})
function textToNumber(text, separator = ','){
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
            case '9': break;
            case separator:{
                ch = '.';
            } break;
            case '%':{
                divider = 100;
                continue;
            }
            default:
                continue;
        }
        value += ch;

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