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
            font-family: monospace;
            /*todo сделать хорошо*/
            font-size: larger;
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
    selectionFromEnd: NaN,
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
        value = value.replace(/\s/g, '');//value.replaceAll(this.thousandSeparator, '');
        this.value = +value;
    },
    onRender(e) {
        // установку курсора каретки после удаления
        this.debounce('onRender', () => {
            if (!Number.isNaN(this.selectionFromEnd) && this.$refs.input?.value) {
                const selection = this.$refs.input.value.length - this.selectionFromEnd;
                this.$refs.input.selectionStart = this.$refs.input.selectionEnd = selection;
                this.selectionFromEnd = NaN;
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
        if (e.detail > 1) {
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
            // проверка, что вводим число
            let data = e.data.replace(/\s/g, '');//e.data.replaceAll(this.thousandSeparator, '');
            if (!data.match(/^\d*\.?,?\d*$/g))
                return;

            const start = e.target.selectionStart
            const end = e.target.selectionEnd;
            let value = this.inputValue;
            const length = value.length;
            
            // если вставляем число с разделителем, не заменяя всё (только в дробную или только в целую часть)
            if (~data.indexOf('.') && (start !== 0) && (end !== length))
                return;
            
            // возвращает кол-во 0, на конце аргумента
            let getZeroCount = (value) => {
                if (!value) return 0;
                let count = 0;
                for (let i = (value.length - 1); i >= 0; i--) {
                    if (value[i] === '0') count++;
                    else break;
                }
                return count;
            };

            let decimalPos = value.indexOf(this.decimalSeparator);
            // необходимое смещение каретки
            let offset = 0;//length - end;
            if (~decimalPos) {
                // если итоговое число с разделителем дробной части
                if (end < decimalPos) {
                    // если меняется целая часть
                    offset = 0;
                } else {
                    // если меняется дробная часть
                    let before = value.substring(decimalPos + this.decimalSeparator.length, start);
                    if (before.length >= this.precision) {
                        offset = 0;
                    } else {                        
                        let middle = data.substr(0, Math.min(this.precision - before.length, data.length));
                        const zeroData = getZeroCount(middle);
                        const after = value.substr(end, this.precision - before.length - middle.length);
                        const zeroAfter = getZeroCount(after);
                        if (after.length &&  (zeroAfter < after.length)) {
                            offset = ((start === end) ? -1 : 0) - middle.length + 1;
                        } else {
                            // todo
                            offset = end - start - 1 + zeroData - data.length + 1;
                            if (zeroData >= middle.length) {
                                offset -= getZeroCount(before);
                            }
                        }
                    }
                }
            } else {
                // если итоговое число без разделителя дробной части
                decimalPos = data.indexOf(this.decimalSeparator);
                if (!~decimalPos) {
                    decimalPos = data.indexOf('.');
                    if (!~decimalPos) {
                        decimalPos = data.indexOf(',');
                    }
                }
                if (!~decimalPos || (decimalPos === data.length)) {
                    // вставляем данные без разделителя дробной части 
                    offset = (this.precision || 0) + (this.decimalSeparator?.length || 0);
                } else {
                    // вставляем данные с разделителем дробной части

                    // приведение вводимых данных к "маске"
                    if ((data.length - decimalPos) > (this.precision + 1)) {
                        // ограничение по точности
                        data = data.slice(0, decimalPos + this.precision + 1);
                    } else {
                        // добавление необходимых 0 на конце согласно маске
                        data += '0'.repeat(this.precision + 1 - (data.length - decimalPos));
                    }

                    offset = getZeroCount(data);
                }
            }
            
            this.selectionFromEnd = length - end + offset;

            // изменение значения
            value = value.slice(0, start) + data + value.slice(end);
            if ((value.length - decimalPos) > (this.precision + 1)) {
                // ограничение по точности
                value = value.slice(0, decimalPos + this.precision + 1);
            }
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