export class Tensor {
    _back = () => {};
    constructor(data, label, children= [], error) {
        this.data = data;
        this.label = label;
        this.children = children;
        this.error = error;
    }
    back(){
        let topo = [];
        let visited = new Set();
        let build_topo = (v) => {
            if (!visited.has(v)) {
                visited.add(v)
                v.children.forEach(ch => build_topo(ch))
                topo.push(v)
            }
        }
        build_topo(this);
        this.grad = element_wise((x)=>1, this.data)
        topo.reverse().forEach(node => {
            node._back()
        })
    }
    get label(){
        return this['#label'] || '';
    }
    set label(n){
        this['#label'] = n;
    }
    get size(){
        return this.shape.reduce((r, v)=>r * v, 1);
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
        let s = `tensor ${this.label} (${this.shape}):\r\n`;
        function recurse(d, idx, l){
            let result = idx?`\r\n${(' ').repeat(l)}[`:'['
            if (Array.isArray(d[0])){
                const list = d.map((v, i)=>{
                    return recurse(v, i, l + 1);
                })
                result += list;
            }
            else{
                if (d.length>6){
                    result += d.slice(0, 2).map(x=>{
                        return ((x < 0?' ':'  ') + x.toExponential(4) + ' ');
                    }).join(' ')  + ' ... ' + d.slice(-2).map(x=>{
                        return ((x < 0?' ':'  ') + x.toExponential(4) + ' ');
                    }).join(' ')
                }
                else{
                    result += d.map(x=>{
                        return x.toExponential(3);
                    }).join(' ')
                }
            }
            return result + ']'
        }
        s += recurse(this.data, 0, 0);
        return s
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
    get grad(){
        return this['#grad'] ??= element_wise((x)=>0, this.data)
    }
    set grad(v){
        this['#grad'] = v;
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
        out._back = () => {
            let mode = '' + this.dim + other.dim;
            switch (mode){
                case '11':{
                    other.grad = MultiplyMatrix(this._t().data, [out.grad])
                    this.grad = multiplyMT([out.grad], other.data);
                } break;
            }
        }
        return out;
    }
    _mul(other){
        other = tensor(other);
        const res = element_wise((x, y)=>{
            return element_wise((a, b)=>(a * b), y, x);
        }, this.data, other.data);
        let out = tensor(res, '_mul', [this, other]);
        out._back = () => {
            this.grad = element_wise((x, y, z)=>{
                return element_wise((v, a, b)=>(v + a * b), y, x, z);
            }, this.grad, other.data, out.grad);
            other.grad = element_wise((x, y, z)=>{
                return element_wise((v, a, b)=>(v + a * b), y, x, z);
            }, other.grad, this.data, out.grad);
        }
        return out;
    }
    _add(other){
        other = tensor(other);
        const res = element_wise((x, y)=>(x + y), this.data, other.data);
        let out = tensor(res, '_add', [this, other]);
        out._back = () => {
            this.grad = element_wise((x, y)=>{
                return element_wise((a, b)=>(a + b), y, x);
            }, this.grad, out.grad);
            other.grad = element_wise((x, y)=>{
                return element_wise((a, b)=>(a + b), y, x);
            }, other.grad, out.grad);
        }
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
    _rsqrt(){
        const res = element_wise((x)=>1/Math.sqrt(x), this.data);
        let out = tensor(res, `_rsqrt`, [this]);
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
        out._back = () => {
            this.grad = element_wise((g, d, o)=>{
                return element_wise((v, x, e)=>(v + x * (1 - x) * e), g, d, o);
            }, this.grad, this.data, out.grad);
        }
        return out;
    }
    _silu(){
        const res = element_wise((x) => x * 1/(1+ Math.exp(-x)), this.data)
        let out = tensor(res, '_silu', [this]);
        out._back = () => {
            // this.grad = element_wise((x, y, z)=>{
            //     return element_wise((v, a, b)=>(v + a * (1 - a) * b), y, x, z);
            // }, this.grad, this.data, out.grad);
        }
        return out;
    }
    _relu(){
        const res = element_wise((x) => Math.max(0, x) , this.data)
        let out = tensor(res, '_relu', [this]);
        out._back = () => {
            this.grad = element_wise((x, y, z)=>{
                return element_wise((v, a, b)=>(v + a<0?0:1 * b), x, y, z);
            }, this.grad, this.data, out.grad);
        }
        return out;
    }
    _lrelu(){
        const res = element_wise((x) => Math.max(.1 * x, x) , this.data)
        let out = tensor(res, '_relu', [this]);
        out._back = () => {
            // this.grad = element_wise((x, y, z)=>{
            //     return element_wise((v, a, b)=>(v + a<0?0:1 * b), y, x, z);
            // }, this.grad, this.data, out.grad);
        }
        return out;
    }
    _elu(alpha = 1){
        const res = element_wise((x) => (x>0?x:(alpha * (Math.exp(x) - 1))), this.data)
        let out = tensor(res, '_relu', [this]);
        out._back = () => {
            // this.grad = element_wise((x, y, z)=>{
            //     return element_wise((v, a, b)=>(v + a<0?0:1 * b), y, x, z);
            // }, this.grad, this.data, out.grad);
        }
        return out;
    }
    _exp(){
        const res = element_wise((x) => Math.exp(x), this.data)
        let out = tensor(res, '_exp', [this]);
        return out;
    }
    _random(){
        const res = element_wise((x) => Math.random()-.5, this.data)
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
    static hippo(size= 8, koef = 1){
        const hippo = Array(size).fill('').map((_, k)=>{
            return Array(size).fill('').map((_, n)=>{
                if (n>k)
                    return (2 * k + 1) ** .5 * (2 * n + 1) ** .5 * koef;
                if (n === k)
                    return (n + 1) * koef;
                return 0;
            })
        })
        return tensor(hippo);
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

function element_wise(fn, data1, data2, data3){
    return data1?.map?.((d1, i)=>{
        const d2 = data2?.[i] ?? data2;
        const d3 = data3?.[i] ?? data3;
        return element_wise(fn, d1, d2, d3);
    }) || fn(data1, data2, data3);
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
        const fwd = (...args)=>{
            console.time('forward: ' + this.label)
            const res = this.forward(...args)
            console.timeEnd('forward: ' + this.label)
            return res;
        }
        fwd.module = this;
        fwd.toString = this.toString.bind(this);
        return fwd
    }
    forward(x){
        return x;
    }
    back(g){
        return g;
    }
    get label(){
        return this.constructor.name;
    }
    get __children__(){
        let ch = Object.getOwnPropertyDescriptors(this);
        const result = []
        for (let n in ch){
            const prop = ch[n]
            if (prop.value?.module){
                result.push({[n]:prop.value.module})
            }
            else if (Array.isArray(prop.value) && prop.value[0]?.module){
                result.push({[n]:prop.value.map(i=>i.module)})
            }
        }
        return result;
    }
    toString(step = 0){
        const add = 1;
        let s = (' ').repeat(step) + `${this.label} ()(\r\n`;
        s += this.__children__.map(obj => {
            const key = Object.keys(obj)[0];
            const prop = obj[key];
            if(Array.isArray(prop)){
                return (' ').repeat(step + add) + key+':'+prop.map?.(j =>j.toString(step + add)).join('')
            }
            return (' ').repeat(step + add) + key+':'+prop.toString(step + add);
        }).join('');
        // s+=(' ').repeat(step) + '\r\n)'
        return s;
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
        v = v._rsqrt();
        v = v._mul(this.weight);
        x = x._mul(v);
        return x;
    }
}
export function rsmNorm(...args){
    return new RMSNorm(...args)
}

function tensor(...args){
    if(args[0] instanceof Tensor)
        return args[0];
    return new Tensor(...args);
}
export function Parameter(t){
    t.isParameter = true;
    return t
}
function multiplyMT(M, T) {
    return M.map(x=>T.map(y=>dotProduct(x, y)));
}
function dotProduct(v1, v2) {
    return v1.map((a, i) => (a * v2[i])).reduce((r, n) => (r + n));
}