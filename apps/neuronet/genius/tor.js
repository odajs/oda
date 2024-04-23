import {TNum} from './num.js';
import {EO} from './einops.js';
export const LEARNING_RATE = 1
function genId(){
    return ++_id;
}
let _id = 0;
export class Tensor{
    parents = [];
    #shape = [];
    #data = null;
    constructor(data, label, children = []) {
        this.children = children;
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
            this.#data = data.map(TNum);
        }
        else
            this.#data = TNum(data);

    }
    get T(){
        let axis_this = this.shape.reduce((r,v,i)=>r = String.fromCharCode(i+97) + r, '');
        let axis_out = axis_this.split('');
        axis_out.reverse();
        axis_out = axis_out.join('')
        return EO.einsum(axis_this+'->'+axis_out, this);
    }
    get g(){
        return Tensor.from(this.data.map?.(i=>i._g) ?? this.data._g).reshape(this.shape);
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
    get dim(){
        return this.shape.length;
    }
    get label(){
        return this['#label'] ?? (()=>{
            switch (this.dim){
                case 0:
                    return `scalar = ${this.data}`;
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
        this.data.map?.((d, i)=>d._g = undefined) || (this.data._g = undefined);
    }
    updateParams(){
        if (!this.isParam) return;
        this.data.forEach((d, i)=>{
            d.val = d + d.g * LEARNING_RATE;
        })
    }
    back(){
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
            node.updateParams();
            node.data.map?.(x=>x.grads?.clear()) || node.data?.grads?.clear();
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
    static stack(array){
        const data = array.map(a=>a.data).flat();
        return Tensor.from(data, 'stack', array);
    }
    static fill(shape, value, label){
        if (!Array.isArray(shape))
            shape = [shape];
        const size = shape.reduce((r, v)=>r * v, 1);
        const handler = typeof value === 'function'?value:i=>value;
        let data = Array(size).fill().map(handler);
        return Tensor.from(data, label).reshape(shape);
    }
    static zeros(shape, label) {
        return this.fill(shape, 0, label);
    }
    static ones(shape, label) {
        return this.fill(shape, 1, label);
    }
    static random(shape, label, div = 10) {
        return this.fill(shape, ()=>(Math.random()-.5)/div, label);
    }
    static array(data, label="array"){
        return Tensor.from(data, label);
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
            result = Array(repeat).fill().map(a => result.map(i=>i))
        }
        return Tensor.from(result);
    }
    static hippo(size){
        const data = Array(size).fill().map((_,n)=>{
            return Array(size).fill().map((_,k)=>{
                if (n>k)
                    return -Math.sqrt(2 * n + 1) * Math.sqrt(2 * k + 1);
                if(n === k)
                    return -(n + 1);
                return 0
            })
        })
        return Tensor.from(data, 'hippo');
    }
    static from(data, label, children){
        if (data instanceof Tensor)
            return data;
        return new Tensor(data, label, children)
    }
    static param(tensor){
        if (!(tensor instanceof Tensor)){
            tensor = Tensor.from(tensor);
        }
        tensor.isParam = true;
        return tensor;
    }
    toString(max = 4){
        // let res =  Math.min(...this.data).toExponential(3);
        // if(this.size>1)
        //     res += ' -> '+ Math.max(...this.data).toExponential(3);
        // return res;
        if (this.shape.length){
            let data = this.array.toTensorString(max).split('\r\n');
            if (data.length > max){
                const padding = data[0].length/2 + 4
                data = [...data.slice(0, Math.floor(max/2)), ('⭥ '+data.length+' ⭥').padStart(padding, ' '), ...data.slice(-Math.floor(max/2))]
            }
            data = data.join('\r\n')
            return data
        }
        return +this.data;
    }
    get array() {
        if(!this.shape.length)
            return [this.data];
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
        return data.flat();
    }
    slice(parts = []){
        let start = 0;
        const result = []
        for (let size of parts){
            let end = start + size;
            let res = this.data.slice(start,  end);
            let out = Tensor.from(res, `slice [${start}-${end}]`, [this]);
            result.push(out);
            start = end;
        }
        return result;
    }
}

Tensor.prototype.sum = function (){
    const out = EO.einsum('x->', this);
    out.label = `sum([${this.shape}])`;
    return out;
}

Tensor.prototype.log = function (){
    const data = this.data.map(Math.log);
    const out = Tensor.from(data, 'log', [this]).reshape(this.shape);
    for(let i = 0; i<this.data.length; i++){
        this.data[i].grads.push(()=>{
            return (1 / this.data[i]) * out.data[i].g;
        })
    }
    return out;
}

Tensor.prototype.exp = function (){
    const data = this.data.map(x => x.exp())
    return Tensor.from(data, `exp([${this.shape}])`, [this]).reshape(this.shape);
}

Tensor.prototype.oper = function (operation , other){
    other = Tensor.from(other);
    let axis_this = this.shape.reduce((r,v,i)=>r = String.fromCharCode(i+97) + r, '');
    let axis_other = other.shape.reduce((r,v,i)=>r = String.fromCharCode(i+97) + r, '');
    const expr = `${axis_this}, ${axis_other} -> ${axis_this}:`+operation;
    const out = EO.einsum(expr, this,  other);
    out.label = operation+`: ${this.label}, ${other.label}`;
    return out;
}

Tensor.prototype.add = function (other){
    return this.oper('add', other);
}
Tensor.prototype.minus = function (other){
    return this.oper('minus', other);
}
Tensor.prototype.mul = function (other){
    return this.oper('mul', other);
}
Tensor.prototype.div = function (other){
    return this.oper('div', other);
}
Tensor.prototype.tahn = function (){
    const data = this.data.map(x=>x.tahn());
    return Tensor.from(data, 'tahn', [this]).reshape(this.shape);
}
Tensor.prototype.pow = function (other){
    other = Tensor.from(other);
    let data;
    if (this.shape.length)
        data = this.data.map((x, i)=>x._pow(other.data[i] ?? other.data))
    else
        data = this.data._pow(other.data.reduce?.((r, v)=>r + v, 0) ?? other.data)
    return Tensor.from(data, `pow([${this.shape}] ^ ${other.data})`, [this, other]).reshape(this.shape);
}

Tensor.prototype.sigmoid = function (){
    const data = this.data.map(x=>x.sigmoid());
    return Tensor.from(data, 'sigmoid', [this]).reshape(this.shape);
}
Tensor.prototype.softplus = function (){
    const data = this.data.map(x=>x.softplus());
    return Tensor.from(data, 'softplus', [this]).reshape(this.shape);
}
Tensor.prototype.softmax = function (){
    const exp = this.data.map(Math.exp).reduce((r, v) => r + v);
    const data = this.data.map((x, i)=> {
        const out = TNum(Math.exp(x) / exp);
        x.grads.push(()=>{
            let sum = data.reduce((r, sj, j)=>{
                if (i === j)
                    return out * (1-out)
                return -out * sj
            });
            sum *= out.g;
            return sum;
        })
        return out;
    })
    return Tensor.from(data, 'softmax', [this]).reshape(this.shape);
}
Tensor.prototype.MSE = function (other){
    other = Tensor.from(other);
    let step_this = this.shape[this.shape.length - 1];
    let step_other = other.shape[other.shape.length - 1];
    let idx_this = 0;
    let idx_other = 0;
    let r = 0;
    for(let i = 0; i<this.size; i++){
        let x = this.data[i];
        let y = other.data[idx_other + i] || 0;
        const err = x - y;
        let out = TNum(err ** 2);
        x.grads.push(()=>{
            return -2 * err;
        })
        r += out;
        idx_this++;
        if(idx_this === step_this){
            idx_this = 0;
            idx_other+=step_other;
            if(idx_other>other.size)
                idx_other = 0;
        }
    }
    const data = r / this.size;
    return Tensor.from(data, 'MSE', [this]);
}

Array.prototype.toTensorString = function (max = 4){
    function recurse(d, idx = 0, l = 0){
        let result = idx?`\r\n${(' ').repeat(l)}[`:'['
        if (Array.isArray(d[0])){
            let list = d.map((v, i)=>{
                return recurse(v, i, l + 1);
            })
            result += list;
        }
        else{
            if (d.length > max){
                const showing = Math.floor(max/2);
                result += d.slice(0, showing).map(x=>{
                    return x.toTNumString()
                }).join(' ') ;
                result +=  `  ⭠ ${d.length} ⭢`;
                result +=  d.slice(-showing).map(x=>{
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
    let res = recurse(this);
    res = res.slice(1, -1);
    return '(' + res + ')';
}
