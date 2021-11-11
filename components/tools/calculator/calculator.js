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
            <span style="font-size: large">{{expression || value}}
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
    stack: [],
    signs: ['+', '-', '*', '/'],
    result: '0',
    value: 0, 
    hostAttributes: {
        tabindex: 1
    },
    keyBindings: {
        p () {
            alert('HI')
        }
    },
    tap (e) {
        const model = e.target.model;
        switch (model.command){
            case 'calc':
            case 'clear':
            case 'back':
                return this[model.command]();
        }
        if (this.predicates[0]?.predicate === (model.name || model.label)){ // checking closing brackets
            this.predicates.shift();
        }
        if (this.expression === '0' && model.label === 0) { 
            return
        } else if (this.canBeDeleted(model)) { 
            this.stack.splice(0, 1, model);
        } else if (this.canBeReplaced(model)) {
            this.stack.splice(-1, 1, model);
            this.expression = undefined; // activation of reactivity 
        } else {
            this.stack.push(model);
        } 
        if (model.predicate) 
            this.predicates.unshift({label: model.predicate, predicate: model.predicate});
            this.expression = undefined; 
            this.predicate = undefined; 
    },
    calc () {
        this.stack.push(...this.predicates);
        this.expression = undefined;
        const expr = this.stack.map(i=>{
            return (i.expr || i.name || i.label);
        }).join('');
        this.predicates = [];
        try{
            this.value = (new Function([], `with (this) {return ${expr}}`)).call(this);
            this.result = this.expression + ' =';
        }
        catch (e){
            console.error(e)
        }
        this.stack = [{label: this.value, result: true}];
    },
    clear () {
        this.stack = [{label: 0}];
        this.predicate = [];
        this.value = 0;
        this.result = '0';
    },
    back () {
        if (this.stack[this.stack.length-1]?.predicate === this.predicates[this.predicates.length - 1]?.predicate){ 
            this.predicates.shift();
            this.predicate = undefined;
        }
        if (this.stack.length === 1) {
            this.stack.splice(-1, 1, {label: 0})
            this.expression = undefined;
        } else {
            this.stack.pop();
            this.expression = undefined;
            this.predicate = undefined;
        }
    },
    // checking if the value in the output line can be deleted
    canBeDeleted (model) {
        return (this.expression === '0' || this.stack[this.stack.length-1]?.result) && typeof model.label === 'number'
    },
    // checking the possibility of replacing the mathematical sign
    canBeReplaced (model) {
        return this.signs.some((e) => e === this.stack[this.stack.length-1]?.label) && this.signs.some((e) => e === model.label)
    }
})