ODA({is: 'oda-calculator', imports: '@oda/button',
    template: /*html*/ `
        <style>
            :host {
                flex-grow: 0;
                @apply --vertical;
                /*max-width: 300px;*/
                padding: 16px;
                @apply --shadow;
            }
            .header {
                @apply --header
            }
        </style>
        <div class="border vertical" style="margin-bottom: 16px; text-align: right">
            <span style="font-size: small" class="dimmed">{{result}}</span>
            <span style="font-size: large">{{error || expression || value}}
                <sup disabled>{{degree}}</sup>
                <span disabled>{{predicate}}</span>
            </span>
        </div>
        <div ~for="data?.rows" class="horizontal between" style="margin-top: 8px;" >
            <oda-button class="raised flex" style="min-width: 30px;" ~for="md in item" :label="md.label" @tap="tap" @mousedown="mousedown" @mouseup="mouseup" :model="md" ~props="md.props"></oda-button>
        </div>
    `,
    get predicate(){
        return this.predicates.map(i=>{
            return i.predicate;
        }).join('');
    },
    get expression(){
        return this.stack.map(i=>{
            return (i.name || i.label);
        }).join('');
    },
    predicates: [],
    stack: [{label: 0}],
    signs: ['+', '-', '*', '/'],
    result: '0',
    value: 0, 
    error: '',
    hostAttributes: {
        tabindex: 1
    },
    degree: '',
    timerClear: '',
    keyBindings: {
        Enter () {
            this.calc();
        },
        Backspace () {
            this.back();
        },
        Escape () {
            this.clear();
        }
    },
    attached() {
        document.addEventListener('keydown', this._onKeyDown.bind(this));
    },
    detached() {
        document.removeEventListener('keydown', this._onKeyDown.bind(this));
    },
    _onKeyDown (e) {
        this.tap(e.key);
    },
    mousedown (e) {
        if (e.target.model.command === 'back') {
            this.timerClear = setTimeout(() => {
                this.clear()
            }, 1000)
        }  
    },
    mouseup () {
        clearTimeout(this.timerClear);
    },
    tap (e) {
        let model = '';
        if (e.target?.model) {
            model = e.target.model
        } else if (e.match(/[0-9.)]/)) {
            model = {label: e}
        } else if (e.match(/\(/)) {
            model = {label: e, predicate: ')'}
        } else if (e.match(/[-+/*]/)) {
            model = {label: e, name: ` ${e} `}
        } 
        switch (model.command){
            case 'calc':
            case 'clear':
            case 'back':
                return this[model.command]();
        }
        if (this.expression === '0' && model.label === 0) { 
            return 
        } 
        if (model.label === '(' && this.expression !== '0' && !this.stack[this.stack.length-1]?.result) {
            this.stack.push(model);
            if (this.getExpression().match(/\d+\.?\d*\%?(?=\()/) || this.getExpression().match(/\)/)) { // if exist the number after which comes the bracket, add '*' in front of the bracket
                this.stack[this.stack.length-1] = {label: model.label, predicate: ')', expr: '*' + model.label};
                this.getReactivity();
            }
        } else if (model.label === ')') {
            if (this.canWriteBracket()) {
                this.stack.push(model);
                this.predicates.shift();
            }
        } else if (model.label === this.stack[this.stack.length-1].predicate) {
            return
        } else if (model.label === '.') {
            const enteredNubers = this.getExpression().match(/\d+\.?(\d*)?/g); // get an array of all entered numbers for further checks
            enteredNubers[(enteredNubers.length - 1)].match(/\./) || this.getExpression().match(/\D$/) ? false : this.stack.push(model);
        } else if (this.canBeDeleted(model)) { 
            this.error = '';
            this.stack.splice(0, 1, model);
        } else if (this.canBeReplaced(model)) {
            this.stack.splice(-1, 1, model);
            this.getReactivity();  
        } else if (model.label.toString().match(/[0-9%)]/) && this.getExpression().match(/\)$/)) {
            this.stack.push(model);
            this.stack[this.stack.length-1] = {label: model.label, expr: '*' + model.label}
            this.getReactivity();
        } else {
            this.stack.push(model);
        } 
        if (model.predicate) 
            this.predicates.unshift({label: model.predicate, predicate: model.predicate});
            this.getReactivity();
    },
    calc () {
        this.stack.push(...this.predicates);
        this.getReactivity();
        const expr = this.getExpression();
        this.predicates = [];
        try {
            if (expr.match(/\D$/) && this.signs.some(e => e === expr.match(/\D$/)[0])) { // if the expression ends with a mathematical sign, do not count
                    return
                }
            this.value = (new Function([], `with (this) {return ${expr}}`)).call(this);
            this.result = this.expression + ' =';
        }
        catch (e) {
            this.error = 'Error';
            this.stack = [];
            console.log(e);
        }
        this.stack = [{label: this.value, result: true}]; // push the result to the stack
    },
    clear () {
        this.stack = [{label: 0}];
        this.predicates = [];
        this.value = 0;
        this.result = '0';
        this.error = '';
    },
    back () {

        if (this.getExpression().match(/\)$/)) {
            this.predicates.unshift({label: ')', predicate: ')'})
        }
        if (this.stack[this.stack.length-1]?.predicate === this.predicates[this.predicates.length - 1]?.predicate){ 
            this.predicates.shift();
            this.getReactivity();
        }
        if (this.stack.length === 1) {
            this.stack.splice(-1, 1, {label: 0});
            this.getReactivity();
        } else {
            this.stack.pop();
            this.getReactivity();
        }
    },
    // checking if the value in the output line can be deleted
    canBeDeleted (model) {
        return (this.expression === '0' || this.stack[this.stack.length-1]?.result) 
                && (model.label.toString().match(/[0-9]/) ||
                model.label === 'sin' ||
                model.label === 'tan' ||
                model.label === '-' ||
                model.label === '(')
    },
    // checking the possibility of replacing the mathematical sign
    canBeReplaced (model) {
        return this.signs.some(e => e === this.stack[this.stack.length-1]?.label) && (this.signs.some((e) => e === model.label) || model.label === '%')
    },
    // checking the possibility of writing the closing bracket
    canWriteBracket () {
        return this.stack[this.stack.length-1].label.toString().match(/[0-9%)]/) && this.predicates.length !== 0
    },
    // activation of reactivity
    getReactivity () {
        this.expression = undefined;
        this.predicate = undefined;
    },
    // get the expression as a string
    getExpression () {
        const expr = this.stack.map(i=>{
            return (i.expr || i.label);
        }).join('');
        return expr
    }
})