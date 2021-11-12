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
                <span disabled>{{predicate}}</span>
            </span>
        </div>
        <div ~for="data?.rows" class="horizontal between" style="margin-top: 8px;" >
            <oda-button class="raised flex" ~for="md in item" :label="md.label" @tap="tap" :model="md" ~props="md.props"></oda-button>
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
    data: {
        rows:[]
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
    keyBindings: {
        Enter () {
            this.calc();
        },
        Backspace () {
            this.back();
        },
        Escape () {
            this.clear();
        },
        // 1 () {
        //     this.stack.push({label: 1});
        //     this.tap (this.stack)
        // }
    },
    tap (e) {
        const model = e.target.model;
        switch (model.command){
            case 'calc':
            case 'clear':
            case 'back':
                return this[model.command]();
        }
        this.predicates[0]?.predicate === (model.name || model.label) ? this.predicates.shift() : false;
        if (this.expression === '0' && model.label === 0) { 
            return
        } 
        if (model.label === '(') {
            this.stack.push(model);
            if (this.getExpression().match(/\d+\.?\d*(?=\()/)) { // if exist the number after which comes the bracket, add '*' in front of the bracket
                this.stack[this.stack.length-1] = {label: model.label, expr: '*' + model.label};
                this.getReactivity();
            }
        } else if (model.label === this.stack[this.stack.length-1].predicate) {
            return
        } else if ((model.name || model.label) === '.') {
            const arr = this.getExpression().match(/\d+\.?(\d*)?/g); // get an array of all entered numbers for further checks
            arr[(arr.length - 1)].match(/\./) || this.getExpression().match(/\D$/) ? false : this.stack.push(model);
        } else if (this.canBeDeleted(model)) { 
            this.error = '';
            this.stack.splice(0, 1, model);
        } else if (this.canBeReplaced(model)) {
            this.stack.splice(-1, 1, model);
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
            if (expr.match(/\D$/)) { // if the expression ends with a mathematical sign, do not count
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
                && (typeof model.label === 'number' || model.label === ('sin' || 'atan'))
    },
    // checking the possibility of replacing the mathematical sign
    canBeReplaced (model) {
        return this.signs.some((e) => e === this.stack[this.stack.length-1]?.label) && this.signs.some((e) => e === model.label)
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