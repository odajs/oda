ODA({is: 'oda-number',
    template: /*html*/`
    <style>
        :host {
            @apply --vertical;
        }
        input {
            text-align: right;
            width: 200px;
            margin: 16px;
            cursor: text;
        }
        div {
            align-items: center;
        }
    </style>
    <span>value: {{value}}</span>
    <div class="horizontal">
        <input ref="input" @keydown="onKeyDown" @select="onSelect" @beforeinput="onBeforeInput" @cut="onCut"
        @mouseup="onMouseUp" @render="onRender" @mousedown="onMouseDown"
        :value="inputValue">
    </div>
    `,
    precision: 3,
    thousandSeparator: ' ',
    decimalSeparator: '.',
    selectionFromEnd: -1,
    value: 5476.547576,
    get inputValue() {
        let int = this.value.toLocaleString();
        if (int.includes(','))
            int = int.slice(0, int.indexOf(','));

        int = int.replace(/\s/g, this.thousandSeparator);//.replaceAll(' ', this.thousandSeparator);

        let fract = this.value.toString();
        fract = fract.includes('.') ? fract.slice(fract.indexOf('.') + 1) : '';
        // ограничение по точности
        if (fract.length > this.precision) fract = fract.slice(0, this.precision);

        while (fract.length < this.precision) {
            fract += '0';
        }

        return int + this.decimalSeparator + fract;
    },
    onKeyDown(e) {
        const char = e.key;
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        let value = this.inputValue;
        const length = value.length;
        const decimalPos = value.indexOf(this.decimalSeparator);
        //this.input = e.target;
        switch (char) {
            case 'Backspace': {
                e.preventDefault();
                if (start === end) {
                    if (end === 0) return;

                    // если удаляется разделитель дробной части
                    if (end === (decimalPos + 1)) return;

                    value = value.slice(0, end - 1) + value.slice(end);
                }
                else {
                    value = value.slice(0, start) + value.slice(end);
                }
                const curPrec = value.length - value.indexOf(this.decimalSeparator) - 1;
                const offset = (curPrec < this.precision) ? (this.precision - curPrec) : 0;
                this.selectionFromEnd = length - end + offset;
                value = value.replace(/\s/g, '');//value.replaceAll(this.thousandSeparator, '');
                this.value = +value;
            } break;
            case 'Delete': {
                e.preventDefault();
                let offset = 0;
                if (start === end) {
                    if (end === length) return;

                    if ((end > decimalPos) && (this.inputValue[end] === '0')) return;
                    // если удаляется разделитель дробной части
                    if (start === decimalPos) return;

                    offset = (this.inputValue[end] === this.thousandSeparator) ? 2 : 1;
                    value = value.slice(0, end) + value.slice(end + offset);
                }
                else {
                    value = value.slice(0, start) + value.slice(end);
                }
                const curPrec = value.length - value.indexOf(this.decimalSeparator) - 1;
                if (curPrec < this.precision) offset -= (this.precision - curPrec);
                this.selectionFromEnd = length - end - offset;
                value = value.replace(/\s/g, '');//value.replaceAll(this.thousandSeparator, '');
                this.value = +value;
            } break;
            case 'ArrowRight':
                // "перескакивать" разделитель тысячных
                if (!e.shiftKey && this.thousandSeparator && this.inputValue[end] === this.thousandSeparator) {
                    e.preventDefault();
                    e.target.selectionStart = (e.target.selectionEnd += 2);
                }
                break;
            case 'ArrowLeft':
                // "перескакивать" разделитель тысячных
                if (!e.shiftKey && this.thousandSeparator && start > 2 && this.inputValue[start - 2] === this.thousandSeparator) {
                    e.preventDefault();
                    e.target.selectionEnd = (e.target.selectionStart -= 2);
                }
                break;
            default:
                return true;
        }
    },
    onSelect(e) {
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        const length = this.inputValue.length;
        const decimalPos = this.inputValue.indexOf(this.decimalSeparator);
        if ((start <= decimalPos) && (decimalPos < end) && (start !== 0) && (end !== length)) {
            // выделять весь текст, если в выделении присутствует разделитель дробной части
            e.target.selectionStart = 0;
            e.target.selectionEnd = length;
        }
        else if ((start === end) && (start > 0)
            && (this.inputValue[start - 1] === this.thousandSeparator)) {
            // смещать выделение слева от разделителя тысячных
            e.target.selectionStart = (++e.target.selectionEnd);
        }
    },
    onCut(e) {
        e.preventDefault();
        const start = e.target.selectionStart;
        const end = e.target.selectionEnd;
        const length = this.inputValue.length;
        let value = this.inputValue;
        this.selectionFromEnd = length - end;
        value = value.slice(0, start) + value.slice(end);
        value = value.replace(/\s/g, '')
        this.value = +value;
    },
    onRender(e) {
        // установку курсора каретки после удаления
        this.debounce('onRender', () => {
            if (~this.selectionFromEnd && this.$refs.input?.value) {
                const selection = this.$refs.input.value.length - this.selectionFromEnd;
                this.$refs.input.selectionStart = this.$refs.input.selectionEnd = selection;
                this.selectionFromEnd = -1;
            }
        });
    },
    onMouseUp(e) {
        if ((e.target.selectionStart === e.target.selectionEnd)
            && (e.target.selectionStart > 0)
            && (this.inputValue[e.target.selectionStart - 1] === this.thousandSeparator)) {
            // смещать выделение слева от разделителя тысячных
            e.target.selectionStart = (++e.target.selectionEnd);
        }
        if(e.detail > 1){
            e.preventDefault();
        }
    },
    onMouseDown(e) {
        const length = this.inputValue.length
        if (e.detail === 3) {
            // выделять всё
            e.preventDefault();
            e.target.selectionStart = 0;
            e.target.selectionEnd = length;
        }
        else if (e.detail === 2) {
            e.preventDefault();

            const start = e.target.selectionStart;
            const end = e.target.selectionEnd;
            if ((start === end) || ((start === 0) && (end === length))) {
                // выделять только дробную/целую часть
                const decimalPos = this.inputValue.indexOf(this.decimalSeparator);
                if (decimalPos > start) {
                    // целая
                    e.target.selectionStart = 0;
                    e.target.selectionEnd = decimalPos;
                } else {
                    // дробная
                    e.target.selectionStart = decimalPos + 1;
                    e.target.selectionEnd = length;
                }
            }
        }
    },
    async onBeforeInput(e) {
        e.preventDefault();
        if ((e.inputType === 'insertText') || (e.inputType === 'insertFromPaste')) {
            if (!e.data.match(/^\d*\.?,?\d*$/g))
                return;

            const start = e.target.selectionStart
            const end = e.target.selectionEnd;
            const length = this.inputValue.length;
            let value = this.inputValue;
            let getZeroCount = (value) => {
                if (!value) return 0;
                let count = 0;
                for (let i = (value.length - 1); i >= 0; i--) {
                    if (value[i] === '0')
                        count++;
                }
                return count;
            };
            const zeroBefore = getZeroCount(value);
            value = value.slice(0, start) + e.data + value.slice(end);
            const decimalPos = value.indexOf(this.decimalSeparator);
            if (~decimalPos) {
                if ((value.length - decimalPos) > this.precision + 1) {
                    // ограничение по точности
                    value = value.slice(0, decimalPos + this.precision + 1)
                } else {
                    value += '0'.repeat(this.precision + 1 - (value.length - decimalPos));
                }
            }
            const zeroAfter = getZeroCount(value);
            // const curPrec = value.length - value.indexOf(this.decimalSeparator) - 1;
            // const offset = (curPrec < this.precision) ? (this.precision - curPrec) : 0;
            const offset = zeroAfter - zeroBefore;
            this.selectionFromEnd = length - end + offset;
            value = value.replace(/\s/g, '');//value.replaceAll(this.thousandSeparator, '');
            this.value = +value;
        }
        // switch (e.inputType) {
        //     case 'insertText': {
        //     } break;
        //     case 'insertFromPaste': {
        //     } break;
        // case 'deleteContentBackward': {
        //     console.log('deleteContentBackward');
        // } break;
        // case 'deleteContentForward': {
        //     console.log('deleteContentForward');
        // } break;
        // }
    }
})