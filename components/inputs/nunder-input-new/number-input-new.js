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
                cursor: text;
            }
            div{
                align-items: center;
            }
        </style>
        <span>value: {{value}}</span>
        <div class="horizontal">
            <input @keydown="onKeyDown" :value="inputValue">
        </div>
    `,
    precision: 3,
    thousandSeparator: ' ',
    decimalSeparator: '.',
    value: 5476.547576,
    get inputValue () {
        return this.value.toLocaleString().replace(',', this.decimalSeparator);
    },
    onKeyDown(e){
        const char = e.key;
        const start = e.target.selectionStart
        const end = e.target.selectionEnd;
        const length = this.inputValue.length;
        const decimalPos = this.inputValue.indexOf(this.decimalSeparator);
        const value = this.inputValue.replace(/\s/g, '');
        this.input = e.target;
        e.preventDefault();
        switch (char){
            case 'Backspace':{
                this.value = +value.slice(0,-1)
            } break;
        }
    },
    async onInput (e) {
        const char = e.data === ',' ? '.' : e.data,
            start = e.target.selectionStart,
            end = e.target.selectionEnd;
        this.input = e.target;
        switch (e.inputType) {
            case 'insertText': {

            } break;
            case 'insertFromPaste': {

            } break;
            case 'deleteContentBackward': {

            } break;
            case 'deleteContentForward': {

            } break;
        }
    }
})