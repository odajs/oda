import {TNum} from './num.js';
import {EO} from './einops.js';
export const LEARNING_RATE = .4;
export const GRADIENT_DIVIDER = 1.618;
function genId(){
    return ++_id;
}
let _id = 0;
export class Tensor{
    #shape = [];
    #data = null;
    constructor(data, label, children) {
        if (children)
            this.children = children;
        if (label)
            this.label = label;
        if (Array.isArray(data)){
            let shape = [];
            let d = data;
            while(Array.isArray(d) && d.length){
                shape.push(d.length);
                d = d[0];
                data = data.flat()
            }
            this.#shape = shape;
            if (!(data instanceof Float32Array))
                data = new Float32Array(data);

        }
        else{
            if (data?.length)
                this.#shape = [data?.length]
        }
        this.#data = data;
        this.id = genId();
    }
    get grad(){
        if(this.data.length)
            return this['#grad'] ??= new Float32Array(this.size);
        return this['#grad'] ??= 0;
    }
    set grad(n){
        this['#grad'] = n;
    }
    get T(){
        let axis_this = this.shape.reduce((r,v,i)=>r = String.fromCharCode(i+97) + r, '');
        let axis_out = axis_this.split('');
        axis_out.reverse();
        axis_out = axis_out.join('')
        return EO.einsum(axis_this+'->'+axis_out, this);
    }
    get g(){
        return Tensor.from(this.grad).reshape(this.shape);
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
        this['#grad'] = undefined;
    }
    updateParams(){
        if (!this.isParam) return;
        let i = this.size;
        while(i--){
            this.data[i] += this.grad[i] * LEARNING_RATE;
        }
    }
    back(){
        this.topo = [];
        let visited = new Set();
        let build_topo = (t) => {
            if (!visited.has(t)) {
                visited.add(t)
                t.children?.forEach(ch => build_topo(ch))
                this.topo.push(t)
            }
        }
        build_topo(this);
        this.topo.forEach((node) => {
            node.clearGrad();
        })
        this.topo.reverse();
        this.topo.forEach((node) => {
            node._back?.();
        })
        this.topo.forEach((node) => {
            node.updateParams();
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
    static fill(shape, value, label, children){
        if (!Array.isArray(shape))
            shape = [shape];
        const size = shape.reduce((r, v)=>r * v, 1);
        const handler = typeof value === 'function'?value:i=>value;
        let data = new Float32Array(size).map(handler);
        return Tensor.from(data, label, children).reshape(shape);
    }
    static zeros(shape, label, children) {
        return this.fill(shape, 0, label, children);
    }
    static ones(shape, label, children) {
        return this.fill(shape, 1, label, children);
    }
    static random(shape, label, scale = .1) {
        return this.fill(shape, ()=>(Math.random()-.5) * scale, label);
    }
    static array(data, label="array"){
        return Tensor.from(data, label);
    }
    static arange(shape, step = 1, label, children){
        const size = shape.reduce((r,v)=>r*v, 1);
        const data = new Float32Array(size).map((_, i)=>(i+1) * step);
        return Tensor.from(data, label, children).reshape(shape);
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
    toString(max = 8){
        if (this.shape.length){
            let data = this.array.toTensorString(max, this.shape).split('\r\n');
            if (data.length > max){
                const padding = data[0].length/2 + 2
                data = [...data.slice(0, Math.floor(max/2)), ('...').padStart(padding, ' '), ...data.slice(-Math.floor(max/2))]
            }
            data = data.join('\r\n')
            return `(${data}, shape(${this.shape}), size: ${this.shape.reduce((r, v)=>r*v,1).toLocaleString()} )`;
        }
        return this.data;
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
    const data = (this.data.length)?(this.data.map(x => 1 / (1 + Math.exp(-x)))): (1 / (1 + Math.exp(-this.data)));
    const out = Tensor.from(data, 'sigmoid', [this]).reshape(this.shape);
    out._back = ()=>{
        if (data.length){
            for(let i = 0; i<data.length; i++){
                let v = data[i];
                this.grad[i] += (v * (1 - v) * out.grad[i] / GRADIENT_DIVIDER);
            }
        }
        else{
            this.grad += (data * (1 - data) * out.grad / GRADIENT_DIVIDER);
        }
    }
    return out;
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
    if (other instanceof Tensor)
        other = other.data;
    const data = (this.data.length)?this.data.map((d, i)=>{
        return (d - (other[i] ?? other ?? 0)) ** 2;
    }):(this.data - (other ?? 0)) ** 2;
    const error = (data.length)?(data.reduce((r, d) => r + d, 0) / data.length):data;
    const out = Tensor.from(error, 'MSE', [this]);
    out._back = ()=>{
        if (data.length){
            for (let i = 0; i<data.length; i++){
                this.grad[i] = 2 * data[i];
            }
        }
        else{
            this.grad = 2 * data;
        }
    }
    return out;
}

Array.prototype.toTensorString = function (max = 4, shape = []){
    function recurse(d, idx = 0, l = 0){
        let result = idx?`\r\n${(' ').repeat(l)}[`:'['
        if (d[0]?.map){
            let list = Array.from(d).map((v, i)=>{
                return recurse(v, i, l + 1);
            })
            result += list;
        }
        else{
            if (d.length > max){
                const showing = Math.floor(max/2);
                result += Array.from(d.slice(0, showing)).map(x=>{
                    return  num2text(x);
                }).join(' ') ;
                result +=  `  ...  `;
                result +=  Array.from(d.slice(-showing)).map(x=>{
                    return num2text(x);
                }).join(' ')
            }
            else{
                result += Array.from(d).map(x=>{
                    return num2text(x);
                }).join(' ') || num2text(d);
            }
        }

        result = result + ']'
        return result
    }
    let res = recurse(this);
    res = res.slice(1, -1);
    return res;
}
function num2text(x){
   // if (Number.isInteger(x))
   //      return x;
    return x.toExponential(3).padStart(9, ' ')
}