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
            this.#data = data.map(i=>TNum(i, this.label));
        }
        else
            this.#data = TNum(data);

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

    static fill(shape, value, label){
        if (!Array.isArray(shape))
            shape = [shape];
        const size = shape.reduce((r, v)=>r * v, 1);
        const handler = typeof value === 'function'?i=>value():i=>value;
        let data = Array(size).fill().map(handler);
        return Tensor.from(data, label).reshape(shape);
    }
    static zeros(shape, label) {
        return this.fill(shape, 0, label);
    }
    static ones(shape, label) {
        return this.fill(shape, 1, label);
    }
    static random(shape, label, div = 1000) {
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
            result = Array(repeat).fill().map(a=>result.map(i=>i))
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
                const padding = data[0].length/2 + 2
                data = [...data.slice(0, Math.floor(max/2)), ('⇅').padStart(padding, ' '), ...data.slice(-Math.floor(max/2))]
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
    const data = this.data.map(x=>Math.log(x));
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


Tensor.prototype.add = function (other){
    other = Tensor.from(other);
    const data = this.data.map((x, i)=>x._add(other.data[i] ?? other.data))
    return Tensor.from(data, `add([${this.shape}] + [${other.shape}])`, [this,  other]).reshape(this.shape);
}
Tensor.prototype.minus = function (other){
    other = Tensor.from(other);
    const data = this.data.map((x, i)=>x._minus(other.data[i] ?? other.data))
    return Tensor.from(data, `minus([${this.shape}] - [${other.shape}])`, [this,  other]).reshape(this.shape);
}
Tensor.prototype.mul = function (other){
    other = Tensor.from(other);
    const data = this.data.map((x, i)=>x._mul(other.data[i] ?? other.data))
    return Tensor.from(data, `mul([${this.shape}] + [${other.shape}])`, [this,  other]).reshape(this.shape);
}
Tensor.prototype.div = function (other){
    other = Tensor.from(other);
    let data;
    if (this.shape.length)
        data = this.data.map((x, i)=>x._div(other.data[i] ?? other.data))
    else
        data = this.data._div(other.data.reduce?.((r, v)=>r + v, 0) ?? other.data)
    return Tensor.from(data, `divide([${this.shape}] / [${other.shape}])`, [this,  other]).reshape(this.shape);
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
Tensor.prototype.mse = function (other){  //todo Подумать насчет распространения градиента на вектор целевого токена для автокоррекции
    other = Tensor.from(other);
    const data = this.data.reduce((r, x, i)=>{
        const err = x - other.data[i];
        let out = TNum(err ** 2, 'mse');
        x.grads.push(()=>{
            return -2 * err;
        })
        return r + out;
    }, 0) / this.size;
    return Tensor.from(data, 'mse', [this]);
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
                result += d.slice(0, Math.floor(max/2)).map(x=>{
                    return x.toTNumString()
                }).join(' ') ;
                result +=  "  ⇠⇢";
                result +=  d.slice(-Math.floor(max/2)).map(x=>{
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
