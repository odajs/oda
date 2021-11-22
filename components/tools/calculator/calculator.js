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
            <div class="vertical flex" ~for="col in data?.cols" style="margin: 0px 8px">
                <div ~for="row in col?.rows" class="horizontal flex" style="margin-top: 8px;">
                    <oda-button class="raised flex" ~for="button in row" ~html="button.key" @tap="tap" :item="button" ~props="Object.assign({}, col.props, row.props, button.props)"></oda-button>
                </div>
            </div>
        </div>
    `,
    get predicate(){
        return this.predicates.map(i=>i.predicate).join('');
    },
    get expression(){
        return this.stack.map(i=>(i.key || i.name)).join('');
    },
    error: undefined,
    predicates: [],
    stack: [],
    result: '0',
    value: 0, 
    hostAttributes: {
        tabindex: 1
    },
    tap (e) {
        const model = e.target.item;
        if (model.command && this[model.command])
            return this[model.command]();
        if (this.predicates[0]?.predicate === (model.key || model.name)){ // checking closing brackets
            this.predicates.shift();
        }
        this.stack.push(model);
        if (model.predicate)
            this.predicates.unshift({key: model.predicate, predicate: model.predicate});
        this.expression = undefined;
        this.predicate = undefined;
    },
    calc () {
        this.stack.push(...this.predicates);
        this.expression = undefined;
        const expr = this.stack.map(i=>{
            return (i.expr || i.name || i.key);
        }).join('');
        this.predicates = [];
        try{
            this.value = (new Function([], `with (this) {return ${expr}}`)).call(this);
            this.result = this.expression + ' =';
        }
        catch (e){
            this.error = e;
            console.error(e)
        }
        this.stack = [{label: this.value, result: true}];
    },
    clear () {
        this.stack = [{label: 0}];
        this.predicates = [];
        this.value = 0;
        this.result = '0';
        this.error = undefined;
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
    invert (){

    }
})