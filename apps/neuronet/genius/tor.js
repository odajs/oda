import {TNum} from './num.js';
function genId(){
    return ++_id;
}
let _id = 0;
export class Tensor{
    parents = [];
    #shape = [];
    #data = null;
    constructor(data, label, children = []) {
        this.children = children
        this.label = label;
        this.id = genId();
        if (Array.isArray(data)){
            let shape = [];
            let d = data;
            while(Array.isArray(d) && d.length){
                shape.push(d.length);
                d = d[0];
                data = data.flat()
            }
            this.#shape = shape;
        }
        else
            data = [data]
        this.#data = data.map(i=>TNum(i, this.label));
    }
    get g(){
        return new Tensor(this.data.map(i=>i._g)).reshape(this.shape);
    }
    get shape(){
        return this.#shape;
    }
    get size(){
        return this.shape.reduce((r, v)=>r * v, 1);
    }
    get data(){
        return this.#data;
    }
    set data(n){
        this.#data = n;
    }
    get label(){
        return this['#label'] ?? (()=>{
            switch (this.dim){
                case 0:
                    return 'scalar';
                case 1:
                    return `vector (${this.shape})`;
                case 2:
                    return `matrix (${this.shape})`;
                default:
                    return `tensor (${this.shape})`;
            }
        })();
    }
    set label(n){
        this['#label'] = n;
    }
    get paramCount(){
        if (this.isParam)
            return this.size;
        return 0;
    }
    clearGrad(){
        this.data.map((d, i)=>d.g = undefined)
    }
    updateParams(learn_speed=.1){
        if (!this.isParam) return;
        this.data = this.data.map((d, i)=>{
            const correct = d.g * learn_speed + (d.p || 0);
            const res = TNum(d + correct);
            res.g = d.g;
            res.p = correct * .1;
            return res
        })
    }
    back(learn_speed = .1){
        this.topo = [];
        let visited = new Set();
        let build_topo = (t) => {
            if (!visited.has(t)) {
                visited.add(t)
                t.children.forEach(ch => build_topo(ch))
                this.topo.push(t)
            }
        }
        build_topo(this);
        this.topo.forEach((node) => {
            node.clearGrad()
        })
        this.topo.forEach((node) => {
            node.updateParams(learn_speed);
            node.data.map(x=>x.grads?.clear())
        })
    }
    reshape(...shape){
        if(Array.isArray(shape[0]))
            shape = shape[0];
        const size = shape.reduce((r, v)=>r * v, 1);
        if (size !== this.size)
            throw new Error(`Reshape from (${this.shape}) to (${shape}) not allow.`);
        this.#shape = shape
        return this;
    }

    static fill(shape, value, label){
        if (!Array.isArray(shape))
            shape = [shape];
        const size = shape.reduce((r, v)=>r * v, 1);
        const handler = typeof value === 'function'?i=>value():i=>value;
        let data = Array(size).fill().map(handler);
        return new Tensor(data, label).reshape(shape);
    }
    static zeros(shape, label) {
        return this.fill(shape, 0, label);
    }
    static ones(shape, label) {
        return this.fill(shape, 1, label);
    }
    static random(shape, label) {
        return this.fill(shape, ()=>(Math.random()-.5), label);
    }
    static array(data, label="array"){
        return new Tensor(data, label);
    }
    static arange(from_or_size = 0, size, repeat = 1){
        if (size === undefined){
            size = from_or_size;
            from_or_size = 0;
        }
        let result = []
        for (let i = from_or_size; i<size; i++){
            result.push(i);
        }
        if (repeat > 1){
            result = Array(repeat).fill().map(a=>result.map(i=>i))
        }
        return new Tensor(result);
    }
    toString(show_data = false){
        // let res =  Math.min(...this.data).toExponential(3);
        // if(this.size>1)
        //     res += ' -> '+ Math.max(...this.data).toExponential(3);
        // return res;
        let data = this.array.toTensorString().split('\r\n');
        if (data.length > 5){
            const padding = data[0].length/2 + 3
            data = [...data.slice(0, 2), ('⇅').padStart(padding, ' '), ...data.slice(-2)]
        }
        data = data.join('\r\n')
        return data
    }
    get array() {
        let data = this.data;
        let res = [];
        const shape = Array.from(this.shape);
        let s
        while (s = shape.pop()){
            for (let i = 0; i<data.length; i+=s){
                res.push(data.slice(i, i+s))
            }
            data = res;
            res = [];
        }
        return data;
    }
    slice(parts = []){
        let start = 0;
        const result = []
        for (let size of parts){
            let end = start + size;
            let res = this.data.slice(start,  end);
            let out = tensor(res, `slice [${start}-${end}]`, [this]);
            result.push(out);
            start = end;
        }
        return result;
    }
}

export function tensor(data, label, children){
    if(data instanceof Tensor)
        return data;
    return new Tensor(data, label, children);
}

export function Parameter(t){
    t.isParam = true;
    return t
}

Tensor.prototype.log = function (){
    const data = this.data.map(x=>Math.log(x));
    const out = new Tensor(data, 'log', [this]).reshape(this.shape);
    for(let i = 0; i<this.data.length; i++){
        this.data[i].grads.push(()=>{
            return (1 / this.data[i]) * out.data[i].g;
        })
    }
    return out;
}
Tensor.prototype.exp = function (){
    const data = this.data.map(x=>Math.exp(x));
    const out = new Tensor(data, 'exp', [this]).reshape(this.shape);
    this.data.forEach((d)=>{
        d.grads.push((d, i)=>{
            return (Math.E ** d * out.data[i].g);
        })
    })

    for(let i = 0; i<this.data.length; i++){
        this.data[i].grads.push(()=>{
            return (Math.E ** this * out.g);
        })
    }
    return out;
}
Tensor.prototype.add = function (other){
    other = tensor(other);
    const data = this.data.map((x, i)=>x._add(other.data[i] ?? other.data[0]))
    const out = new Tensor(data, 'add', [this,  other]).reshape(this.shape);
    return out;
}
Tensor.prototype.mul = function (other){
    other = tensor(other);
    const data = this.data.map((x, i)=>x._mul(other.data[i] ?? other.data[0]))
    const out = new Tensor(data, 'mul', [this,  other]).reshape(this.shape);
    return out;
}
Tensor.prototype.pow = function (exp){
    const data = this.data.map((x, i)=>x ** exp);
    const out = new Tensor(data, 'pow', [this]).reshape(this.shape);
    out._back = ()=>{
        for(let i = 0; i<this.grads.length; i++){
            let o = (other.data[i] ?? other.data[0]);
            this.grads[i] += (o * this.data[i] ** (o - 1) * out.grads[i]);
        }
    }
    return out;
}

Tensor.prototype.mse = function (other){
    other = tensor(other);
    let data = this.data.map((d , i)=> (other.data[i] - d));
    let out = new Tensor(data, 'MSE', [this]).reshape(this.shape);
    this.data.forEach((d,i)=>{
        d.grads.push(()=>{
            return data[i];
        })
    })
    return out
}

Array.prototype.toTensorString = function (n = 2){
    function recurse(d, idx = 0, l = 0){
        let result = idx?`\r\n${(' ').repeat(l)}[`:'['
        if (Array.isArray(d[0])){
            let list = d.map((v, i)=>{
                return recurse(v, i, l + 1);
            })
            result += list;
        }
        else{
            if (d.length > 5){
                result += d.slice(0, 1).map(x=>{
                    return x.toTNumString()
                }).join(' ') ;
                result +=  "  ⇠⇢";
                result +=  d.slice(-1).map(x=>{
                    return x.toTNumString()
                }).join(' ')
            }
            else{
                result += d?.map?.(x=>{
                    return x.toTNumString()
                }).join(' ') || d.toTNumString()
            }
        }

        result = result + ']'
        return result
    }

    return recurse(this);
}
export class EO{
    static einsums = {};
    static parse_shape(expr, tensor){
        const shape = tensor.shape;
        const vars = expr.split('');
        if(vars.length !== shape.length)
            throw new Error(`Shape size [${shape.length}] does not match variable count [${vars.length}]`);
        vars.reduce((r, d, i)=>{
            d = d.trim();
            switch (d){
                case '_':{

                } break;
                default:{
                    r[d] = shape[i];
                }
            }
            return r
        },{})
    }
    static einsum(expr, ...sources){
        const tensors = sources.map(i=>tensor(i));
        const ein = EO.einsums[expr] ??= (()=>{
            const label = 'einsum: \"'+expr+'\"';
            expr = expr.split('->');                            // Разделение выражения на вход и выход
            const axis = [];
            const terms = expr[0].trim().split(',');            // Разделение входа на термы
            const ins = terms.map((term, i)=>{                  // Анализ входных термов по размерностям
                term = term.trim();
                const tensor = tensors[i];
                return term.split('').map((a, j)=>{            // Разделение терма на индексы и их анализ
                    let d =  tensor.shape[j];
                    let ax = axis.find(v => v.a === a);
                    if(ax === undefined){
                        ax = {a, d};
                        axis.push(ax);
                    }
                    else if(ax.d !== d)
                        throw new Error(`Axis '${a}' == ${ax.d} but on tensor №${i+1} this axis == ${d}`);
                    return ax;
                })
            });
            expr = expr[1].split(':');
            const outs = expr[0].trim().split('').map(a => {   // Разделение выходного терма на индексы и их анализ
                if(!a) return;
                let idx = axis.findIndex(v => v.a === a);
                if(idx < 0)
                    throw new Error(`Unknown axis: '${a}'`);
                let ax = axis[idx];
                axis.splice(idx, 1);
                return ax;
            }).filter(i=>i)
            let vars = [...outs, ...axis].map((o, i) =>{
                return 'let '+ o.a + o.a + ' = ' + o.d +';';
            }).join('\n');

            expr = expr[1]?.trim();
            if(expr?.length)
                operator = expr;
            expr = '('+ins.map((t, i) => {
                t.reverse();
                let mm = ''
                const idx = t.map(o => {
                    let res = o.a + mm;
                    mm +=' * ' + o.a+o.a;
                    return res;
                }).join(' + ')
                return `t_${i}[${idx}]`
            }).join(`)._mul(`)+')';

            outs.reverse();
            let mm = ''
            const idx = outs.map(o => {
                let res = o.a + mm;
                mm +='* ' + o.a + o.a;
                return res;
            }).join(' + ') || 0
            const ss = `out[${idx}]`
            expr = `\t${ss}._sum(` + expr + ')';
            expr = vars + '\n'+[...outs, ...axis].map((o, i) => {
                if (o.d)
                    return '\t'.repeat(i) + `for(let ${o.a} = 0; ${o.a} < ${o.a+o.a}; ${o.a}++)`;
                return ''
            }).join('\n')+'\n' + expr;
            expr = expr + '\n return out';
            return {
                fn:new Function(['out', ...tensors.map((_,i)=>'t_'+i)], expr),
                outs,
                label
            }
        })()
        const out = Tensor.zeros(ein.outs.map(o => o.d));
        out.children = tensors;
        out.data = ein.fn(out.data, ...tensors.map(t=>t.data));
        out.label = ein.label + ' ('+out.shape+')';
        return out;
    }
    static rearrange(expr, tensor){

    }
    static reduce(expr, tensor, agg_func = 'max'){

    }
    static repeat(expr, tensor, vars = {}){

    }
    static pack(expr, inputs){

    }
    static unpack(expr, inputs){

    }
}

