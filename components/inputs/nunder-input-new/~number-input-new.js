ODA({is:'oda-number',
    template:`
        <style>
            :host{
                @apply --vertical;
            }
            input{
                text-align: right;
                width: 200px;
                margin: 16px;
            }
            div{
                align-items: center;
            }
        </style>
        <span>value: {{value}}</span>
        <span>mask:<input ::value="mask"></span>
        <div class="horizontal">
            <input @input="onInput" @select="selectionchange" @mousedown="onmousedown" @dblclick="onDblClick" :value="maskedValue">
        </div>
    `,
    mask: '# 0.000',
    value: 0,
    get thousandSeparator () {
        return /\s/.test(this.mask) ? ' ' : ''
    },
    get minInt () {
        return /0/.test(this.mask) ? this.mask.match(/\d+(?=\.)/) ? this.mask.match(/\d+(?=\.)/g)[0].length : 0 : 0 // a number of simbols before comma
    },
    get minFract () {
        return /0/.test(this.mask) ? this.mask.match(/(?<=\.)\d+/) ? this.mask.match(/(?<=\.)\d+/)[0].length : 0 : 0 // a number of simbols after comma
    },
    get maskedValue () {
        let formattedValue = '0';
        if (/\./.test(this.value)) {
            this.value = /\d(?=\.)/.test(this.value) ? this.value : '0' + this.value;
        }
        if (/(?<=\.)\d+/.test(this.mask)) {
            formattedValue = (+this.value).toFixed(this.minFract). // rounding
                replace(/\B(?=(\d{3})+(?!\d)(?=\.))/g, this.thousandSeparator). // added digit capacity
                padStart(this.minInt, 0); // the integer part of the number is matched to the mask
        } else {
            formattedValue = (+this.value).toFixed(this.minFract).
                replace(/\B(?=(\d{3})+(?!\d))/g, this.thousandSeparator).
                padStart(this.minInt, 0);
        }

        formattedValue = (formattedValue.split('.').length > 1) ?
            `${formattedValue.split('.')[0].padStart(this.minInt, 0)}.${formattedValue.split('.')[1] || ''}` :
            formattedValue.padStart(this.minInt, 0);

        if (this.input) {
            const start = this.input.selectionStart,
                    end = this.input.selectionEnd;
            this.numberOfThousandSeparators = formattedValue.slice(0, start).match(/\s/g)?.length || 0;
            if (this.numberOfThousandSeparators === (this.input?.value.slice(0, start).match(/\s/g)?.length || 0)) {
                this.async(() => {
                    this.input.selectionStart = start;
                    this.input.selectionEnd = end;
                }, 1);
            }

            if (this.numberOfThousandSeparators > (this.input?.value.slice(0, start).match(/\s/g)?.length || 0)) {
                this.async(() => {
                    this.input.selectionStart = start+1;
                    this.input.selectionEnd = end+1;
                }, 1);
            }

            if (this.numberOfThousandSeparators < (this.input?.value.slice(0, start).match(/\s/g)?.length || 0)) {
                this.async(() => {
                    this.input.selectionStart = start-1 < 0 ? 0 : start -1;
                    this.input.selectionEnd = end-1 < 0 ? 0 : end - 1;
                }, 1);
            }
        }
        return formattedValue
    },
    selectionchange (e) {
        this.getSelectionRange(e);
        this.thousandSeparatorsFromEnd = this.maskedValue.slice(0, this.selectionEnd).match(/\s/g)?.length || 0, // number of thousands separators to selectionEnd
        this.thousandSeparatorsFromStart = this.maskedValue.slice(0, this.selectionStart).match(/\s/g)?.length || 0; // number of thousands separators to selectionStart
    },
    onDblClick (e) {
        if (this.maskedValue.split('.')[0].length < this.selectionStart) { // if the cursor is on the fractional part of the number, select the fractional part
            e.target.setSelectionRange(this.maskedValue.split('.')[0].length + 1, this.maskedValue.length)
        } else {
            e.target.setSelectionRange(0, this.maskedValue.split('.')[0].length)
        }
    },
    onmousedown (e) {
        this.getSelectionRange(e);
    },
    async onInput (e) {
        const char = e.data === ',' ? '.' : e.data,
              start = e.target.selectionStart,
              end = e.target.selectionEnd;
        this.input = e.target;
        this.numberOfThousandSeparators = this.input.value.slice(0, start).match(/\s/g)?.length || 0;
        switch (e.inputType) {
            case 'insertText': {
                if (this.value === '0' && /\./.test(char)) {
                    return this.value += char
                }
                this.value = this.value.replace(/^0+/, '');  // removing zeros in front of a number
                if (this.selectionStart !== this.selectionEnd) {
                    return this.value = this.value.slice(0, this.selectionStart - this.thousandSeparatorsFromStart) + char + this.value.slice(this.selectionEnd-this.thousandSeparatorsFromEnd, this.value.split('.')[0].length + this.minFract + 1)
                }
                if (this.value.match(/(?<=\.)\d+/) && this.value.match(/(?<=\.)\d+/)[0].length >= this.minFract && start === this.input.value.length) {
                    /\d/.test(char) ? this.value += char :
                    /\./.test(char) ? /\./.test(this.value) ? false :
                    this.value += char :
                    false; // input only numbers and dots (if there are no dots in the number already)
                } else {
                    /\d/.test(char) ? this.value = this.value.slice(0, start-this.numberOfThousandSeparators-1) + char + this.value.slice(end-this.numberOfThousandSeparators-1) :
                    /\./.test(char) ? /\./.test(this.value) ? false :
                    this .value = this.value.slice(0, start-this.numberOfThousandSeparators-1) + char + this.value.slice(end-this.numberOfThousandSeparators-1) :
                    false;
                }
                try {
                    (new Function([], `with (this) {return ${this.value}}`));
                }
                catch (e) {
                    this.value = this.value.slice(0, end-this.numberOfThousandSeparators-1) + this.value.slice(end-this.numberOfThousandSeparators);
                }
            } break;
            case 'insertFromPaste': {
                const clip = await navigator.clipboard.readText().then(text => text.split('').join('')); // get an array of inserted elements
                this.value = this.value.slice(0, start - this.numberOfThousandSeparators - clip.length) + clip + this.value.slice(end-this.numberOfThousandSeparators-clip.length); // subtract the length of the inserted line from the starting point to get the correct insertion point
            } break;
            case 'deleteContentBackward': {
                this.thousandSeparatorsFromStart = this.value.split('.')[0].length > 0 ? this.thousandSeparatorsFromStart : this.thousandSeparatorsFromStart + 1;
                this.numberOfThousandSeparators = this.value.split('.')[0].length > 0 ? this.numberOfThousandSeparators : this.numberOfThousandSeparators + 1;
                if (this.selectionStart !== this.selectionEnd) { // deleting the selected part
                    if (this.maskedValue.split('.')[0].length < this.selectionStart) {
                        return this.value = this.value.slice(0, this.selectionStart - this.thousandSeparatorsFromStart)
                    }
                    return this.value = this.value.slice(0, this.selectionStart - this.thousandSeparatorsFromStart) + this.value.slice(this.selectionEnd-this.thousandSeparatorsFromEnd);
                }
                if (this.maskedValue.split('.')[0].length < start) {
                    return this.value = this.value.slice(0, start-this.numberOfThousandSeparators) + this.value.slice(end-this.numberOfThousandSeparators+1, this.value.split('.')[0].length + this.minFract + 1);
                }
                this.value = this.value.slice(0, start-this.numberOfThousandSeparators) + this.value.slice(end-this.numberOfThousandSeparators+1);
            } break;
            case 'deleteContentForward': {
                if (this.maskedValue.split('.')[0].length < start) {
                    return this.value = this.value.slice(0, start-this.numberOfThousandSeparators) + this.value.slice(start-this.numberOfThousandSeparators+1, this.value.split('.')[0].length + this.minFract + 1)
                }
                this.value = this.value.slice(0, start-this.numberOfThousandSeparators) + this.value.slice(start-this.numberOfThousandSeparators+1);
            } break;
        }
    },
    getSelectionRange (e) {
        this.selectionStart = e.target.selectionStart;
        this.selectionEnd = e.target.selectionEnd;
    }
})