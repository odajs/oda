function genId(){
    return ++_id;
}
let _id = 0;
export class Tensor{
    children = [];
    parents = [];
    #shape = [];
    #data = null;
    constructor(data, d_type = Float64Array) {
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
        data = data.map(i=>num(i))
        this.#data = new d_type(data);
    }
    get grads(){
        const grads = this['#grads'] ??= this.map(i=>[]);
        return grads;
    }
    get g(){
        return this.map(i=>i.g)
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
        this.map((d, i)=>{
            d._.g = undefined;
        })
    }
    updateParams(learn_speed=.1){
        if (!this.isParam) return;
        this.map(d=>{
            let correct = d.g * learn_speed + (d._.p || 0);
            const res =  d + correct;
            res._.p = correct * learn_speed;
            res._.g = d.g
            return res;
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
        })
        this.topo.forEach((node) => {
            node.map(x=>x._.grads = [])
        })
    }
    map(fn){
        return Array.prototype.map.call(this.data, fn);
    }
    reshape(shape){
        const size = shape.reduce((r, v)=>r * v, 1);
        if (size !== this.size)
            throw new Error(`Reshape from (${this.shape}) to (${shape}) not allow.`)
        return (this.#shape = shape);
    }
    static einsum(expr, ...sources){
        const label = 'einsum: \"'+expr+'\"';
        const tensors = sources.map(i=>tensor(i));
        let operator = '_mul';
        expr = expr.split('->');                            // Разделение выражения на вход и выход
        const axis = [];
        const terms = expr[0].trim().split(',');            // Разделение входа на термы
        const ins = terms.map((term, i)=>{                  // Анализ входных термов по размерностям
            term = term.trim();
            const tensor = tensors[i];
            return term.split(' ').map((a, j)=>{            // Разделение терма на индексы и их анализ
                a = '_'+a.trim()+'_';
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
        const outs = expr[0].trim().split(' ').map(a => {   // Разделение выходного терма на индексы и их анализ
            a = a.trim();
            if(!a) return;
            a = '_'+a+'_';
            let idx = axis.findIndex(v => v.a === a);
            if(idx < 0)
                throw new Error(`Unknown axis: '${a}'`);
            let ax = axis[idx];
            axis.splice(idx, 1);
            return ax;
        }).filter(i=>i)
        let vars = [...outs, ...axis].map((o, i) =>{
            return 'let $'+ o.a + ' = ' + o.d +';';
        }).join('\n');
        const out = Tensor.zeros(outs.map(o => o.d));
        expr = expr[1]?.trim();
        if(expr?.length)
            operator = expr;
        expr = '('+ins.map((t, i) => {
            t.reverse();
            let mm = ''
            const idx = t.map(o => {
                let res = o.a + mm;
                mm +='*$'+o.a;
                return res;
            }).join('+')
            return `t_${i}[${idx}]`
        }).join(`).${operator}(`)+')';

        outs.reverse();
        let mm = ''
        const idx = outs.map(o => {
            let res = o.a + mm;
            mm +='*$'+o.a;
            return res;
        }).join('+') || 0
        const ss = `out[${idx}]`
        expr = `\t${ss} = ${ss}._add(` + expr + ')';
        expr = vars + '\n'+[...outs, ...axis].map((o, i) => {
            if (o.d)
                return '\t'.repeat(i) + `for(let ${o.a} = 0; ${o.a} < \$${o.a}; ${o.a}++)`;
            return ''
        }).join('\n')+'\n' + expr;
        expr = expr + '\n return out';
        const fn = new Function(['out', ...tensors.map((_,i)=>'t_'+i)], expr);

        out.children = tensors;
        out.data = fn(out.data, ...tensors.map(t=>t.data));
        out.label = label + ' ('+out.shape+')';
        return out;
    }
    static fill(shape, value, label){
        if (!Array.isArray(shape))
            shape = [shape];
        const size = shape.reduce((r, v)=>r * v, 1);
        const handler = typeof value === 'function'?i=>value():i=>value;
        let data = Array(size).fill().map(handler);
        const tor =  new Tensor(data);
        tor.label = label;
        tor.reshape(shape);
        return tor
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
        let data = (show_data?this.toArray.toTensorString()+'\r\n':'').split('\r\n');
        if (data.length > 6){
            const padding = data[0].length/2 + 2
            data = [...data.slice(0, 2), (' ...').padStart(padding, ' '), ...data.slice(-3)]
        }
        data = data.join('\r\n')
        return this.label + '\r\n' + data
    }
    get toArray() {
        let data = Array.from(this.data);
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
}

export function tensor(data){
    if(data instanceof Tensor)
        return data;
    return new Tensor(data);
}

export function Parameter(t){
    t.isParam = true;
    return t
}

Tensor.prototype.log = function (){
    const out = new Tensor(this.map(x=>Math.log(x)));
    out.children = [this];
    out.reshape(this.shape);
    this.parents.push(()=>{
        for(let i = 0; i<this.grads.length; i++){
            this.grads[i] += (1 / this.data[i]) * out.grads[i];
        }
    });
    return out;
}
Tensor.prototype.add = function (other){
    other = tensor(other);
    const out = new Tensor(this.map((x, i)=>x._add(other.data[i] ?? other.data[0])));
    out.children = [this,  other];
    out.reshape(this.shape);
    return out;
}
Tensor.prototype.mul = function (other){
    other = tensor(other);
    const out = new Tensor(this.map((x, i)=>x._mul(other.data[i] ?? other.data[0])));
    out.children = [this,  other];
    out.reshape(this.shape);
    return out;
}
Tensor.prototype.pow = function (exp){
    const out = new Tensor(this.map((x, i)=>x ** exp));
    out.children = [this,  other];
    out.reshape(this.shape);
    this.grads
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
    let res = Array.from(this.data.map((d , i)=> d - other.data[i]));
    let out = new Tensor(res);
    out.children = [this];
    out.label = 'mse';
    this.data.map((d , i)=> d._.grads.unshift(()=>{
        return out.data[i].g;
    }));
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
            if (d.length > 6){
                result += d.slice(0, 2).map(x=>{
                    return x.toTNumString()
                }).join(' ') ;
                result +=  ':';
                result +=  d.slice(-2).map(x=>{
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
Number.prototype.toTensorString = function (n = 2){
    return this
}

Number.prototype.toTNumString = function () {
    const v = +this;
    return (v).toExponential(2).padStart(10, ' ') +' ';
}


Object.defineProperty(Number, '_', {
    writable: true,
    enumerable: true,
    value: {grads:[]}
})

Object.defineProperty(Number.prototype, 'g', {
    get(){
        const res = this['#g'] ??= this._.grads.reduce((r, grad)=>{
            const g = grad();
            return r + g;
        }, 0);
        return res;
    }
})

Number.prototype._log = function (){
    const out = Math.log(this)
    this._.grads.unshift(()=>{
        return ((1 / this) * out.g);
    })
    return out;
}
Number.prototype._mul = function (other){
    const out = this * other;
    this._.grads.unshift(()=>{
        return other * out.g;
    })
    other._.grads?.unshift(()=>{
        return this * out.g;
    })
    return out;
}
Number.prototype._add = function (other){
    const out = this + other;
    this._.grads.unshift(()=>{
        return out.g;
    })
    other._.grads?.unshift(()=>{
        return out.g;
    })
    return out;
}
Number.prototype._pow = function (other){
    const out = num(this ** other, '_pow')
    this.grads.unshift(()=>{
        return (other * this ** (other - 1) * out.g);
    })
    other.grads?.unshift(()=>{
        return (this ** other * Math.log(this) * out.g);
    })
    return out;
}

export class TNum extends Number{
    grads = []
    constructor(v, l) {
        super(v);
        if (l)
            this.l = l;
    }
    get g(){
        const res = this['#g'] ??= this.grads.reduce((r, grad)=>{
            const g = grad();
            return r + g;
        }, 0);
        return res;
    }
}
export function num(val, label){
    return ((val instanceof TNum) ? val : new TNum(val, label));
}