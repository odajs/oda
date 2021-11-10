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
            <span style="font-size: large">{{expression || 0}}
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
    predicates: [],
    hostAttributes: {
        tabindex: 1
    },
    keyBindings: {
        p () {
            alert('HI')
        }
    },
    result: '0',
    value: 0, // переменная для представления выражения, которое было записано ранее
    get expression(){
        return this.stack.map(i=>{
            return (i.name || i.label);
        }).join('');
    },
    data: {
        rows:[]
    },
    stack: [],
    tap(e){
        const model = e.target.model;
        switch (model.command){
            case 'calc':
            case 'clear':
            case 'back':
                return this[model.command]();
        }
        if (this.predicates[0]?.predicate === (model.name || model.label)){
            this.predicates.shift();
        }
        this.stack.push(model)
        if (model.predicate) 
            this.predicates.unshift(model);
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
        this.stack = [];

    },
    clear(){
        this.stack = [];
        this.predicate = [];
        this.value = 0;
        this.result = '0';
    },
    back(){

    }
})