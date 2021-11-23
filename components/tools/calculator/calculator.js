ODA({is: 'oda-calculator', imports: '@oda/button',
    template: /*html*/ `
        <style>
            :host {
                @apply --vertical;
                padding: 16px;
                @apply --no-flex;
                @apply --shadow;
            }
            .header {
                @apply --header
            }
            .layout {
                @apply --layout
            }
            oda-button{
                margin: 0px 2px;
            }
        </style>
        <div class="border vertical" style="margin-bottom: 16px; text-align: right">
            <span style="font-size: small" class="dimmed">{{result}}</span>
            <span style="font-size: large">{{expression || value || error || 0}}
                <span disabled>{{predicate}}</span>
            </span>
        </div>
        <div class="horizontal flex">
            <div class="vertical flex" ~for="col in data?.cols" style="margin: 0px 8px" ~props="col.props">
                <div ~for="row in col?.rows" class="horizontal flex" style="margin-top: 8px;" ~props="row.props">
                    <oda-button class="raised flex" ~for="button in row.buttons" ~html="button.key" @tap="tap" :item="button" ~props="col?.rows.props"></oda-button>
                </div>
            </div>
        </div>
    `,
    get predicate () {
        return this.predicates.map(i=>i?.predicate).join('');
    },
    get expression () {
        return this.stack.map(i=>(i?.name || i?.key)).join('');
    },
    get calcExpression () {
        return ([...this.stack]).map(i=>{
            return (i.expr || i.name || i.key);
        }).join('');
    },
    error: undefined,
    predicates: [], // unclosed brackets
    stack: [],
    result: '0', // the value of the previous expression
    value: 0, // the resulting expression value
    hostAttributes: {
        tabindex: 1
    },
    tap (e) {
        this.error = undefined;
        this.result = `Ans = ${this.value}`;
        const model = e.target.item;
        if (model?.command && this[model.command])
            return this[model.command]();
        if (this.predicates[0]?.predicate === (model?.key || model?.name)){ // checking closing brackets
            this.predicates.shift();
        }
        this.expression == 0 && this.stack.length === 1 ? this.stack.splice(0, 1, model) : this.stack.push(model); 
        if (model?.predicate)
            this.predicates.unshift({key: model?.predicate, predicate: model?.predicate});
            this.expression = undefined;
            this.predicate = undefined;
        try {
            (new Function([], `with (this) {return ${this.calcExpression.replace(/[a-zA-Z]\./g).replace(/[a-zA-Z()]/g, '')+0}}`)).call(this); // remove all letters, brackets and dots in operations and test
            this.expression = undefined;
            this.predicate = undefined;
        }
        catch (e) {
            this.error = e;
            this.stack[this.stack.length-1]?.predicate ? this.predicates.pop() : false;
            this.stack.pop(model);
        }
    },
    calc () {
        this.stack.push(...this.predicates); // close all brackets
        this.expression = undefined;
        try{
            this.value = (new Function([], `with (this) {return ${this.calcExpression}}`)).call(this);
            this.result = this.expression + ' =';
        }
        catch (e){
            this.error = e;
            console.error(e);
        }
        this.stack = [{key: this.value}];
        this.predicates = [];
    },
    clear () {
        this.stack = [{key: 0}];
        this.predicates = [];
        this.result = '0';
    },
    back () {
        if (this.stack[this.stack.length-1]?.predicate === this.predicates[this.predicates.length - 1]?.predicate){ 
            this.predicates.shift();
            this.predicate = undefined;
        }
        if (this.stack.length === 1) {
            this.stack.splice(-1, 1, {key: 0});
            this.expression = undefined;
        } else {
            this.stack.pop();
            this.expression = undefined;
            this.predicate = undefined;
        }
    },
    answer () {
        this.expression == 0 && this.stack.length === 1 ? this.stack.splice(0, 1, model) : this.stack.push({name: 'Ans', expr: this.value}); 
        this.expression = undefined;
    },
    invert () {
        
    },
    calcFactorial () {
        const fact = [];
        const factorial = (num = this.stack[this.stack.length-1].key-1) => {
            return (num !== 1) ? num * factorial(num-1) : 1
        }
        fact.push(factorial());
        this.stack.push({name: '!', expr: `*${fact.join('')}`}); 
        this.expression = undefined;
    },
})