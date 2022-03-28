ODA({is: 'oda-calculator', imports: '@oda/button',
    template: /*html*/ `
    <style>
        :host {
            @apply --vertical;
            padding: 16px;
            @apply --shadow;
            height: fit-content;
        }
        .header {
            @apply --header
        }
        .layout {
            @apply --layout
        }
        oda-button {
            margin: 0px 2px;
        }
    </style>
    <div class="border vertical" style="margin-bottom: 16px; text-align: right">
        <span style="font-size: small" class="dimmed">{{operation}}</span>
        <span style="font-size: large">{{error || expression || value || 0}}
            <span disabled>{{hint}}</span>
        </span>
    </div>
    <div class="horizontal" style="margin: 0px 8px 0px auto" ~style="{height: buttonHeight + 'px'}">
        <oda-button class="raised flex" @tap="chooseAccuracy">Acc <span disabled>{{Acc}}</span></oda-button>
    </div>
    <div class="horizontal" ::data="calc.data">
        <div class="vertical flex" ~for="col in data?.cols" style="margin: 0px 8px" >
            <div ~for="row in col?.rows" class="horizontal flex" style="margin-top: 8px;" ~props="row.props" ~style="{height: buttonHeight + 'px'}">
                <oda-button class="raised flex" ~for="btnProps, a1, a2, btnName in row.buttons" ~html="btnProps?.key || btnName" @tap="tap" :item="btnProps" ~props="button.props" ~style="{width: 100/Object.keys(row.buttons).length + '%'}"></oda-button>
            </div>
        </div>
    </div>
    `,
    keyBindings: {
        Enter() {
            this.calc();
        },
        Backspace() {
            this.back();
        },
        Escape() {
            this.clear();
        },
    },
    attached() {
        this.listen('keydown', '_onKeyDown', { target: document });
    },
    detached() {
        this.unlisten('keydown', '_onKeyDown', { target: document });
    },
    _onKeyDown(e) {
        e.key.match(/[0-9().*/+-]/) ? this.tap(e.key) : false;
    },
    get hint() {
        return this.hints.map(i => i?.hint).join('');
    },
    get expression() {
        return this.stack.map(i => (i?.name || i?.key)).join('').replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    },
    get calcExpression() {
        return ([...this.stack]).map(i => {
            return (i.expr || i.name || i.key);
        }).join('');
    },
    get Acc() { // bit width of the result
        return ` = ${this.accuracy}`
    },
    get value() {
        return this.result.toFixed(this.Acc.match(/\d$/))
    },
    data: {},
    error: undefined,
    hints: [], // unclosed brackets
    stack: [],
    timerClear: '', // a variable containing a timer to clear the monitor
    operation: '0', // the value of the previous expression
    result: 0,
    answer: '0',
    props: {
        accuracy: {
            default: 2,
            label: 'Точность',
            save: true,
            list: [0, 1, 2, 3, 4, 5],
        },
        buttonHeight: {
            default: 32,
            label: 'Высота кнопки',
            save: true,
        }
    },
    hostAttributes: {
        tabindex: 1
    },
    tap(e) {
        this.error = undefined; // on any input, the error is cleared
        this.operation = `Ans = ${this.value}`; // for any input, the result is formed according to a given template
        const model = e.currentTarget?.item ? e.currentTarget.item : { key: e }; // determine if a calculator button or keyboard key was pressed
        if (model?.command && this[model.command]) // if the button has a function, then it is executed
            return this[model.command]()
        if (this.hints[0]?.hint === (model?.key || model?.name)) // checking closing brackets
            this.hints.shift();
        this.expression == 0 && this.stack.length === 1 ? this.stack.splice(0, 1, model) : this.stack.push(model); // if there is only zero in the expression, replace it with the entered character
        if (model?.hint)
            this.hints.unshift({ key: model?.hint, hint: model?.hint });
        if (/^[a-zA-Z(]/.test(model?.expr || model?.name || model?.key) && /[0-9)]$/.test(this.stack[this.stack.length - 2]?.key)) { // if immediately after the number certain symbols follow, you must substitute multiplication
            this.stack.splice(this.stack.length - 1, 1, { key: model.key, name: model?.name, expr: `*${model?.expr}`, hint: model?.hint });
        }
        if (/^\d/.test(model?.key || model?.expr) && /[a-zA-Z)]$/.test(this.stack[this.stack.length - 2]?.expr || this.stack[this.stack.length - 2]?.key || 0)) { // if the number is written immediately after certain characters, it is necessary to insert multiplication
            this.stack.splice(this.stack.length - 1, 1, { key: model.key, expr: `*${model.key}` })
        }
        this.expression = undefined;
        this.hint = undefined;
        try {
            (new Function([], `with (this) {return ${this.calcExpression.replace(/[a-zA-Z]\.|[a-zA-Z()]/g, '') + 0}}`)).call(this); // remove all letters, brackets and dots in operations and test
            this.expression = undefined;
            this.hint = undefined;
        }
        catch (e) {
            this.error = e;
            this.stack[this.stack.length - 1]?.hint ? this.hints.pop() : false;
            this.stack.pop(model);
        }
    },
    calc() {
        this.stack.push(...this.hints); // close all brackets
        this.expression = undefined;
        this.answer = this.calcExpression;
        try {
            this.result = (new Function([], `with (this) {return ${this.calcExpression}}`)).call(this);
            this.value = this.result.toFixed(this.Acc.match(/\d$/)); // rounding to the specified value
            this.operation = this.expression + ' =';
        }
        catch (e) {
            this.error = 'Error';
        }
        this.stack = [{ key: this.value, result: true }];
        this.hints = [];
    },
    clear() {
        this.stack = [{ key: 0 }];
        this.hints = [];
        this.operation = '0';
    },
    back() {
        if (this.stack[this.stack.length - 1]?.hint === this.hints[this.hints.length - 1]?.hint) {
            this.hints.shift();
            this.hint = undefined;
        }
        if (this.stack.length === 1) {
            this.stack.splice(-1, 1, { key: 0 });
            this.expression = undefined;
        } else {
            this.stack.pop();
            this.expression = undefined;
            this.hint = undefined;
        }
    },
    getAnswer() {
        if (this.expression == 0 && this.stack.length === 1) {
            this.stack.splice(0, 1, { name: 'Ans', expr: `(${this.answer})` });
        } else {
            try {
                this.stack.push({ name: 'Ans', expr: `(${this.answer})` });
                (new Function([], `with (this) {return ${this.calcExpression}}`)).call(this)
            }
            catch (e) {
                this.stack.pop();
                this.answer = '0';
            }
        }
        this.expression = undefined;
        this.calcExpression = undefined;
    },
    calcFactorial() {
        const factorial = (num = this.stack[this.stack.length - 1].key - 1) => {
            return (num !== 1) ? num * factorial(num - 1) : 1
        }
        this.stack.push({ name: '!', expr: `*${factorial()}` });
        this.expression = undefined;
    },
    // choose what bit depth the number will be
    chooseAccuracy() {
        switch (this.accuracy) {
            case 0:
                this.accuracy = 1;
                break;
            case 1:
                this.accuracy = 2;
                break;
            case 2:
                this.accuracy = 3;
                break;
            case 3:
                this.accuracy = 4;
                break;
            case 4:
                this.accuracy = 5;
                break;
            case 5:
                this.accuracy = 0;
                break;
        }
        this.stack[this.stack.length - 1]?.result ? this.stack.splice(-1, 1, { key: (+this.value).toFixed(this.accuracy), result: true }) : 0;
        this.expression = undefined;
    },
})
