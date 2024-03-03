function getId(){
    return ++id;
}
let id = 0;
export class Tensor {
    _back = () => {};
    allowBack = true;
    id = getId();
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
            if (v.allowBack && !visited.has(v)) {
                visited.add(v)
                v.children.forEach(ch => build_topo(ch))
                topo.push(v)
            }
        }
        build_topo(this);
        // this.grad = element_wise((x)=>0, this.data);
        topo.reverse().forEach((node) => {
            node._back()
        })
    }
    get label(){
        return this['#label'] ?? (()=>{
            switch (this.dim){
                case 0:
                    return 'scalar='+this.data;
                case 1:
                    return `vector[${this.shape}]`;
                case 2:
                    return `matrix[${this.shape}]`;
                default:
                    return `tensor[${this.shape}]`;
            }
        })();
    }
    get description(){
        if(!this.children?.length)
            return this.label;
        let res = this.children[0].label+'.'+this.label+'(';
        let others = []
        for(let i = 1; i<this.children.length; i++){
            others.push(this.children[i].label)
        }
        res+=others.join(', ');
        res +=')'
        return res;
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
                    result += d?.map?.(x=>{
                        return x.toExponential(3);
                    }).join(' ') || d?.toExponential?.(3);
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
        // Реализован самый простой случай
        // когда тензор состоит из массива одномерных тензоров,
        // которые надо соединить.
        let result = this.data.flat();
        let out = tensor(result, '_concat', [this]);
        out._back = () => {
            const len = this.data[0].length;
            this.grad = this.grad.map((v, i)=>{
                return out.grad.slice(i * len, i * len + len);
            });
        }
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
                    if(other.allowBack)
                        other.grad = MultiplyMatrix(this._t().data, [out.grad])
                    if(this.allowBack)
                        this.grad = multiplyMT([out.grad], other.data);
                } break;
                case '12':{
                    if(other.allowBack)
                        other.grad = MultiplyMatrix(this._t().data, [out.grad])
                    if(this.allowBack)
                        this.grad = multiplyMT([out.grad], other.data)[0];
                } break;
            }
        }
        return out;
    }
    _mul(other){
        other = tensor(other);
        const res = element_wise((x, y) => (x * y), this.data, other.data);
        let out = tensor(res, '_mul', [this, other]);
        out._back = () => {
            this.grad = element_wise((v, x, g) => (v + x * g), this.grad, other.data, out.grad);
            other.grad = element_wise((v, x, g) => (v + x * g), other.grad, this.data, out.grad);
        }
        return out;
    }
    _add(other){
        other = tensor(other);
        const res = element_wise((x, y) => (x + y), this.data, other.data);
        let out = tensor(res, '_add', [this, other]);
        out._back = () => {
            this.grad = element_wise((v, g) => (v + g), this.grad, out.grad);
            other.grad = element_wise((v, g) => (v + g), other.grad, out.grad);
        }
        return out;
    }
    _pow(other){
        other = tensor(other);
        const res = element_wise((x, rate)=> x ** rate, this.data, other.data);
        let out = tensor(res, '_pow', [this, other]);
        out._back = () => {
            this.grad = element_wise((v, x, y, g) => v + (y * x ** (y - 1)) * g, this.grad, this.data, other.data, out.grad);
        }
        return out;
    }
    _sum(){
        let res = this.data.reduce((r, v) => r + v);
        let out = tensor(res, `_sum`, [this]);
        out._back = () => {
            this.grad = this.grad.map(v=>v + out.grad);
        }
        return out;
    }
    _mean(){
        return this._sum()._div(this.size);
    }
    _div(other){
        other = tensor(other);
        const res = element_wise((a, b)=>(a / b), this.data, other.data);
        let out = tensor(res, `_div`, [this]);
        out._back = () => {
            this.grad = element_wise((v, x, y, g) => v + (x * y / y**2) * g, this.grad, this.data, other.data, out.grad);
        }
        return out;
    }
    _sqrt(){
        const res = element_wise((x)=> Math.sqrt(x) , this.data);
        let out = tensor(res, `_sqrt`, [this]);
        out._back = () => {
            this.grad = element_wise((v, x, g)=> v + (1 / (2 * Math.sqrt(x) ** 2)) * g, this.grad, this.data, out.grad);
        }
        return out;
    }
    _rsqrt(){
        return tensor(1, '_rsqrt')._div(this._sqrt());
    }
    _log(){
        const res = element_wise((x)=>Math.log(x), this.data);
        let out = tensor(res, `_log`, [this]);
        out._back = () => {
            this.grad = element_wise((v, x, g) => (v + 1/x * g), this.grad, this.data, out.grad);
        }
        return out;
    }
    _t(){
        const res = transpose(this.data);
        let out = tensor(res, '_t', [this]);
        out._back = () => {
            this.grad = transpose(out.grad);
        }
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
            let out = tensor(this.data.slice(start,  end), `slice: ${start}-${end}`, [this]);
            out._back = () => {
                this.grad = this.grad.map((x,i)=>{
                    if(i<start || i>end)
                        return x;
                    return out.grad[i];
                })
            }
            result.push(out)
            start = end;
        }
        return result;
    }
    _softplus(){
        const res = element_wise((x) => Math.log(1 + Math.exp(x)), this.data);
        let out = tensor(res, '_softplus', [this]);
        out._back = () => {
            this.grad = element_wise((v, x, g) => v + (1 / (1 + Math.exp (-x))) * g, this.grad, this.data, out.grad);
        }
        return out;
    }
    _sigmoid(){
        const res = element_wise((x) => 1/(1+ Math.exp(-x)), this.data);
        let out = tensor(res, '_sigmoid', [this]);
        out._back = () => {
            this.grad = element_wise((v, x, g) => (v + x * (1 - x) * g), this.grad, this.data, out.grad);
        }
        return out;
    }
    _silu(){
        const res = element_wise((x) => x * 1/(1+ Math.exp(-x)), this.data);
        let out = tensor(res, '_silu', [this]);
        out._back = () => {
            this.grad = element_wise((v, x, g) => v + x * (1 - x) * g, this.grad, this.data, out.grad);
        }
        return out;
    }
    _relu(){
        const res = element_wise((x) => Math.max(0, x) , this.data)
        let out = tensor(res, '_relu', [this]);
        out._back = () => {
            this.grad = element_wise((v, x, g) => v + x<0?0:1 * g , this.grad, this.data, out.grad);
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
    _mse(other){
        other = tensor(other);
        let res = 0;
        this.grad = element_wise((x, t) =>{
            let r = (t - x) ** 2;
            res+=r;
            return r
        }, this.data, other.data);
        return tensor(res, '_mse', [this]);
    }
    _exp(){
        const res = element_wise((x) => Math.exp(x), this.data)
        let out = tensor(res, '_exp', [this]);
        out._back = () => {
            this.grad = element_wise((v, x, g) => (v + x * g), this.grad, res, out.grad);
        }
        return out;
    }
    _random(){
        const res = element_wise((x) => Math.random()-.5, this.data)
        let out = tensor(res, '_random');
        out.allowBack = false;
        return out;
    }
    static stack(other_tensors){
        let res = other_tensors.map(t=>Array.from(t.data));
        let out = tensor(res, 'stack', other_tensors);
        out._back = () => {
            other_tensors.map((t, i)=>{
                t.grad = out.grad[i];
            })
        }
        return out;
    }
    static ones(size){
        return this.fill(size, 1,'ones');
    }
    static zeros(size){
        return this.fill(size, 0, 'zeros');
    }
    static random(size){
        return this.fill(size, 0,'random')._random();
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
        return tensor(hippo, `hippo [${size}]`);
    }
    static fill(size= 1, value= 0, label){
        label = label+`[${size}]`
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
        const out = tensor(result, label);
        out.allowBack = false;
        return out;
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
        const out = tensor(result, `arange (${from_or_size}-${size})`);
        out.allowBack = false;
        return out;
    }
}

function element_wise(fn, ...args){
    let main = args.sort((a,b)=>{
        return ((a?.length || 1)<(b?.length || 1))?1:-1;
    })[0];
    return main?.map?.((_, i)=>{
        const next_args = args.map(a=>{
            return a?.[i] ?? a;
        });
        return element_wise(fn, ...next_args);
    }) ?? fn(...args);
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
        this.__args__ = ''
        if (args.length){
            let s = this.constructor.toString();
            s = s.substr(s.indexOf('(')+1);
            s = s.substr(0, s.indexOf(')'));
            s = s.split(',');
            this.__args__= s.map((n, i)=>{
                n = n.split('=').shift().trim();
                return n +'='+ args[i];
            }).join(', ')
        }
        this.__init__(...args);
        const fwd = (...args)=>{
            // console.time('forward: ' + this.label)
            const res = this.forward(...args)
            // console.timeEnd('forward: ' + this.label)
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
        const add = 3;
        const tab = (' ').repeat(step + add);
        let s = `${this.label} (${this.__args__})\r\n`;
        s += this.__children__.map(obj => {
            const key = Object.keys(obj)[0];
            const prop = obj[key];
            if(Array.isArray(prop)){
                return tab + key + `[${prop.length}]:\r\n` +prop.map((m, i)=>(' ').repeat(step + add * 2)+i+': '+m.toString(step + add * 2)).join('')
            }
            return tab + key+': '+prop.toString(step + add);
        }).join('');
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