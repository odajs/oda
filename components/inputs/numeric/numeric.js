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
        if (this.value === 0){
            this.input.selectionStart = this.input.selectionEnd = this.text.indexOf(',')
            this.ss = undefined;
            this.se = undefined;
        }
        if (this.ss !== undefined){
            this.input.selectionStart = this.text.length - Math.min(this.text.length, this.ss);
            this.ss = undefined;
        }
        if (this.se !== undefined){
            this.input.selectionEnd = this.text.length - Math.min(this.text.length, this.se);
            this.se = undefined;
        }
        e.target.scrollLeft = 10000;
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
        value: {
            default: 0,
        },
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
        let fracPos = text.indexOf(',');
        let pos = e.target.selectionStart - fracPos;
        this.se = text.length - e.target.selectionEnd;
        this.ss = text.length - e.target.selectionStart;
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
                if (pos > this.accuracy) return;

                console.log(text, e.key, e.target.selectionStart, e.target.selectionEnd);
                const end = e.target.selectionEnd>e.target.selectionStart?e.target.selectionEnd:(pos>0?e.target.selectionStart+1:e.target.selectionStart)
                let slice = text.slice(e.target.selectionStart, end);
                if (slice.includes(',')){
                    this.ss = text.length - fracPos;
                    slice = ',';
                }
                else{
                    slice = '';
                    this.ss = this.se;
                }

                text = text.substring(0, e.target.selectionStart) + e.key + slice + text.substring(end);
                if (pos>0){
                    e.target.selectionStart++;
                    e.target.selectionEnd = e.target.selectionStart;
                    this.se--;
                    this.ss--;
                }
                else{
                    this.se = this.ss;
                }

                this.value = textToNumber(text);
            } break;
            case '.':
            case ',':{
                e.preventDefault();
                e.target.selectionStart = e.target.selectionEnd = text.indexOf(',') + 1;
            } break;
            case '-':{
                e.preventDefault();
                this.value = this.value * -1
            } break;
            case 'Delete':{
                e.preventDefault();
                if (pos > this.accuracy) return;
                if (e.target.selectionEnd>e.target.selectionStart){
                    const end = e.target.selectionEnd;
                    let slice = text.slice(e.target.selectionStart, end);
                    if (slice.includes(',')){
                        this.ss = text.length - fracPos;
                        slice = ',';
                    }
                    else{
                        slice = '';
                        this.ss = this.se;
                    }
                    text = text.substring(0, e.target.selectionStart) + slice + text.substring(end);
                    this.se = this.ss;
                }
                else{
                    let end;
                    let start = end = e.target.selectionStart;
                    let ch = '';
                    while (!isDigit(ch)){
                        ch = text[end];
                        if (ch === ',' || ch === '.'){
                            this.ss++;
                            start++;
                        }
                        this.ss--;
                        end++;
                    }
                    if (pos>0){
                        this.ss++;
                    }
                    this.se = this.ss;
                    text = text.substring(0, start) + text.substring(end);
                }

                this.value = textToNumber(text);
            } break;
            case 'Backspace':{
                e.preventDefault();
                if (e.target.selectionEnd>e.target.selectionStart){
                    const end = e.target.selectionEnd;
                    let slice = text.slice(e.target.selectionStart, end);
                    if (slice.includes(',')){
                        this.ss = text.length - fracPos;
                        slice = ',';
                    }
                    else{
                        slice = '';
                        if (pos>0)
                            this.se = this.ss;
                        else
                            this.ss = this.se;
                    }
                    text = text.substring(0, e.target.selectionStart) + slice + text.substring(end);
                    this.se = this.ss;
                }
                else {

                    if (e.target.selectionStart > 0) {
                        e.target.selectionStart--;
                        e.target.selectionEnd = e.target.selectionStart;
                    }
                    if (isDigit(text[e.target.selectionStart])){
                        text = text.substring(0, e.target.selectionStart) + text.substring(e.target.selectionStart+1);
                        if (pos>0)
                            this.se = this.ss = text.length - e.target.selectionStart + 1;
                        else
                            this.se = this.ss = text.length - e.target.selectionStart ;
                    }
                }
                this.value = textToNumber(text);
            } break;
            case 'Home':
            case 'End':
            case 'ArrowRight':
            case 'ArrowLeft': break;
            default:{
                e.preventDefault();
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