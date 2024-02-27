export class Tensor {
    _back = () => {};
    constructor(data, label, children= [], error) {
        this.data = data;
        this.label = label;
        this.children = children;
        this.error = error;
    }
    valueOf(){
        return this.data;
    }
    toJSON(){
        return {
            "tensor": this.data,
            "label": this.label,
            "shape": this.shape
        }
    }
    toString(){
        return JSON.stringify(this, undefined, 1)
    }
    get shape(){
        return this['#shape'] ??= (()=>{
            let d = this.data;
            let v = [];
            while(Array.isArray(d) && d.length){
                v.push(d.length);
                d = d[0];
            }
            return v;
        })()
    }
    get dim(){
        return this.shape.length;
    }
    _concat(){
        let result = this.data.map(i=>{
            return i.data || i;
        }).flat();
        let out = tensor(result, 'concat', [this]);
        return out;
    }
    _mat_mul(other){
        other = tensor(other);
        let data = this.data;
        let o_data = other.data;
        if(this.dim === other.dim){
            switch (this.dim){
                case 1:{
                    o_data = [o_data];
                    data = this._t().data;

                }
            }
        }
        else {
            if(this.dim === 1){
                data = [data];
            }
            if(other.dim === 1){
                o_data = [o_data];
            }
        }

        let result = MultiplyMatrix(data, o_data);
        if(this.dim === 1 && other.dim !== 1)
            result = result[0];
        let out = tensor(result, '_mat_mul', [this, other]);

        return out;
    }
    _mul(other){
        other = tensor(other);
        const res = element_wise((x, y)=>{
            return element_wise((a, b)=>(a * b), y, x);
        }, this.data, other.data);

        let out = tensor(res, '_mul', [this, other]);
        return out;
    }
    _add(other){
        other = tensor(other);
        const res = element_wise((x, y)=>(x + y), this.data, other.data);

        let out = tensor(res, '_add', [this, other]);
        return out;
    }
    _pow(rate=1){
        const res = element_wise((x)=>Math.pow(x, rate), this.data);

        let out = tensor(res, `_pow(${rate})`, [this]);
        return out;
    }
    _mean(){
        let res = 0;
        let cnt = 0;
        element_wise((x)=> {
            cnt++;
            res += x;
        }, this.data);
        res /= cnt
        let out = tensor(res, `_mean`, [this]);
        return out;
    }
    _sqrt(){
        const res = element_wise((x)=>Math.sqrt(x), this.data);
        let out = tensor(res, `_sqrt`, [this]);
        return out;
    }
    _log(){
        const res = element_wise((x)=>Math.log(x), this.data);
        let out = tensor(res, `_log`, [this]);
        return out;
    }
    _t(){
        const res = transpose(this.data);
        let out = tensor(res, '_t', [this]);
        return out;
    }
    _repeat(cnt= 1){
        const res = Array(cnt).fill(0).map(i=>{
            return structuredClone(this.data);
        })
        let out = tensor(res, `_repeat(${cnt})`, [this]);
        return out;
    }
    _slice(parts = []){
        let start = 0;
        const result = []
        for (let size of parts){
            let end = start + size;
            result.push(tensor(this.data.slice(start,  end), `slice: ${start}-${end}`, [this]))
            start = end;
        }
        return result;
    }
    _softplus(){
        const res = element_wise((x) => Math.log(1 + Math.exp(x)), this.data)
        let out = tensor(res, '_softplus', [this]);
        return out;
    }
    _sigmoid(){
        const res = element_wise((x) => 1/(1+ Math.exp(-x)), this.data)
        let out = tensor(res, '_sigmoid', [this]);
        return out;
    }
    _exp(){
        const res = element_wise((x) => Math.exp(x), this.data)
        let out = tensor(res, '_exp', [this]);
        return out;
    }
    _random(){
        const res = element_wise((x) => Math.random()-1, this.data)
        let out = tensor(res, '_random', [this]);
        return out;
    }
    static ones(size){
        return this.fill(size, 1);
    }
    static zeros(size){
        return this.fill(size, 0);
    }
    static random(size){
        return this.fill(size)._random();
    }
    static fill(size= 1, value= 0){
        if (!Array.isArray(size))
            size = [size];
        let result;
        let s;
        while(s = size.pop()){
            if (!result)
                result = Array(s).fill(value);
            else{
                result = Array(s).fill(0).map(i=>{
                    return structuredClone(result);
                })
            }
        }
        return tensor(result);
    }
    static arange(from_or_size = 0, size){
        if (size === undefined){
            size = from_or_size;
            from_or_size = 0;
        }
        const result = []
        for (let i = from_or_size; i<size; i++){
            result.push(i);
        }
        return tensor(result)
    }
}

function element_wise(fn, data, other){
    return data?.map?.((d, i)=>{
        const o = other?.[i] ?? other;
        return element_wise(fn, d, o)
    }) || fn(data, other);
}


function MultiplyMatrix(A,B) {
    const rowsA = A.length;
    const colsA = A[0].length;
    const rowsB = B.length;
    const colsB = B[0].length;
    const C = [];
    if (colsA !== rowsB) throw new Error('Size mismatch');
    for (let i = 0; i < rowsA; i++)
        C[i] = [];
    for (var k = 0; k < colsB; k++) {
        for (let i = 0; i < rowsA; i++) {
            let t = 0;
            for (let j = 0; j < rowsB; j++)
                t += A[i][j]*B[j][k];
            C[i][k] = t;
        }
    }
    return C;
}
function transpose(m, axis = 0) {
    return m[0]?.map?.((x,i) =>(m.map(y => y[i]))) || m.map(y => [y]);
}

export class Module{
    constructor(...args) {
        this.__init__(...args);

        return (...args)=>{
            console.time('forward: ' + this.label)
            const res = this.forward(...args)
            console.timeEnd('forward: ' + this.label)
            // console.log(res.toString())
            return res;
        }
    }
    forward(x){
        return x;
    }
    back(g){
        return g;
    }
    get label(){
        return this.constructor.name + (this.index !== undefined?` [${this.index}]`:'')
    }
}

export class Linear extends Module{
    __init__(in_size, out_size, bias = false) {
        this.bias = bias;
        this.W = Parameter(Tensor.random([in_size, out_size]));
    }
    forward(x){
        x = x._mat_mul(this.W);
        return x;
    }
}
export function linear(...args){
    return new Linear(...args)
}
export class RMSNorm extends Module {
    __init__(dim) {
        this.weight = Parameter(Tensor.ones(dim));
        this.eps = 1e-5;
    }
    forward(x) {
        let v = x._pow(2);
        v = v._mean();
        v = v._add(this.eps);
        v = v._sqrt();
        v = v._mul(.1);
        v = v._mul(this.weight);
        x = x._mul(v);
        return x;
    }
}
export function rsmNorm(...args){
    return new RMSNorm(...args)
}

function tensor(data){
    if(data instanceof Tensor)
        return data;
    return new Tensor(data);
}
export function Parameter(t){
    t.isParameter = true;
    return t
}