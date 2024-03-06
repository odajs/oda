function getId(){
    return ++id;
}
let id = 0;
export class Tensor {
    _back = () => {};
    id = getId();
    constructor(data, label, children= [], error) {
        this.data = data;
        this.label = label;
        this.children = children;
        this.error = error;
    }
    get paramCount(){
        if (this.isParam)
            return this.shape.reduce((r, v)=> r * v, 1);
        return 0;
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
        // this.grad = element_wise((x)=>0, this.data);
        for (let t of this.topo)
        t.grad = undefined;
        this.topo.reverse().forEach((node) => {
            node._back()
        })
        const params = this.topo.filter(t=>t.isParam);
        params.map(p=>p.updateParams(learn_speed));
    }
    get label(){
        return this['#label'] ?? (()=>{
            switch (this.dim){
                case 0:
                    return 'scalar';
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
        let res = this.label+'(';
        let others = []
        for(let i = 1; i<this.children.length; i++){
            others.push(this.children[i].label)
        }
        res += others.join(', ');
        res +='): ['+ this.shape+']';
        return res;
    }
    updateParams(learn_speed=.1){
        this.data = element_wise((d, g)=>(d + g * learn_speed), this.data, this.grad);
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
        return this.label + (this.shape?.length?' ('+this.shape+')':'') +':\r\n' + this.data.toTensorString();
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
    // _dot(other){ //todo доделать
    //     other = tensor(other);
    //      other.data.map(w=>{
    //         return this.data.reduce((l, r, i) => l + r * w[i]);
    //     })
    //     let out = tensor(res, '_dot', [this, other]);
    //     out._back = () => {
    //         this.grad = this.grad.map((v, i)=>{
    //             return v + other.data[i].reduce((r, d, j)=> r + d * out.grad[j]);
    //         })
    //         other.grad = other.grad.map((row, i) =>{
    //             let d = this.data[i];
    //             return row.map((v, j)=>{
    //                 return v + d * out.grad[j];
    //             })
    //         })
    //     }
    //     return out;
    // }
    _mm(other){
        other = tensor(other);
        let m = ''+this.dim+other.dim;
        let res;
        switch(m){
            case '11':{
                res = MultiplyMatrix([this.data], other.data.map(i=>[i]))[0];
            } break;
            case '12':{
                res = MultiplyMatrix([this.data], other.data)[0];
            } break;
            case '22':{
                res = MultiplyMatrix(this.data, other.data);
            } break;
            default:
                throw new Error('Не поддерживается');
        }
        let out = tensor(res, '_mm', [this, other]);
        out._back = () => {
            switch (m){
                case '11':{
                    this.grad = multiplyMT([out.grad], other.data);
                    other.grad = MultiplyMatrix(transpose(this.data), [out.grad]);
                } break;
                case '12':{
                    this.grad = multiplyMT([out.grad], other.data);
                    other.grad = MultiplyMatrix(transpose(this.data), [out.grad]);
                } break;
                default:
                    throw new Error('Не поддерживается');
            }
        }
        return out;
    }
    _mul(other){
        other = tensor(other);
        const m = '' + this.dim + other.dim;
        let res;
        switch (m){
            case '00':
                res = other.data * this.data;
                break;
            default: {
                let queue = this.dim<other.dim?[other.data, this.data]:[this.data, other.data];
                res = element_wise((x, y) => (x * y), ...queue);
            }
        }
        let out = tensor(res, '_mul', [this, other]);
        out._back = () => {
            switch (m){
                case '00':{
                    this.grad = other.data * out.grad;
                    other.grad = this.data * out.grad;
                } break;
                case '01':{
                    this.grad = other.data.reduce((r, x, i)=>r + x * out.grad[i]);
                    other.grad = out.grad.map(x=>x * this.data);
                } break;
                case '10':{
                    other.grad = thisother.data.reduce((r, x, i)=>r + x * out.grad[i]);
                    this.grad = out.grad.map(x=>x * other.data);
                } break;
            }

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
        let out = this._sum();
        out = out._div(this.size);
        return out;
    }
    _div(other){
        other = tensor(other);
        const res = element_wise((a, b)=>(a / b), this.data, other.data);
        let out = tensor(res, `_div`, [this, other]);
        out._back = () => {
            this.grad = element_wise((x, y, g) => (x * y / y**2 * g), this.data, other.data, out.grad);
            other.grad = element_wise((x, y, g) => (x * y / y**2 * g), other.data, this.data, out.grad);
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
        let sqrt = this._sqrt();
        let out = tensor(1, '_rsqrt');
        out = out._div(sqrt);
        return out;
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
            let res = this.data.slice(start,  end);
            let out = tensor(res, `_slice [${start}-${end}]`, [this]);
            out._back = () => {
                this.grad = this.grad.map((x,i)=>{
                    if(i<start || i>end)
                        return x;
                    return x + out.grad[i];
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
        const res = element_wise((x) => (x>0?x:0)  , this.data)
        let out = tensor(res, '_relu', [this]);
        out._back = () => {
            this.grad = element_wise((v, x, g) => (v + (x>0?1:0) * g), this.grad, this.data, out.grad);
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
        let res = element_wise((x, t) => (t - x) ** 2, this.data, other.data);
        let out =  tensor(res.reduce((r, v) => (r + v)), '_mse', [this]);
        out._back = () => {
            this.grad = element_wise((x, t) => (t - x), this.data, other.data);
        }
        return out
    }
    _exp(){
        const res = element_wise((x) => Math.exp(x), this.data)
        let out = tensor(res, '_exp', [this]);
        out._back = () => {
            this.grad = element_wise((v, x, g) => (v + x * g), this.grad, res, out.grad);
        }
        return out;
    }
    _random(label = '_random'){
        const res = element_wise((x) => Math.random()-.5, this.data)
        let out = tensor(res, label);
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
    static ones(size, label = 'ones'){
        return this.fill(size, 1, label);
    }
    static zeros(size, label='zeros'){
        return this.fill(size, 0, label);
    }
    static random(size, label='random'){
        return this.fill(size, 0, label)._random(label);
    }
    static hippo(size= 8, koef = 1){
        if (!Array.isArray(size))
            size = [size];
        if (size.length<2)
            size.push(size[0])

        const hippo = Array(size[0]).fill('').map((_, k)=>{
            return Array(size[1]).fill('').map((_, n)=>{
                if (n>k)
                    return (2 * k + 1) ** .5 * (2 * n + 1) ** .5 * koef;
                if (n === k)
                    return (n + 1) * koef;
                return 0;
            })
        })
        const out = tensor(hippo, 'hippo');
        return out;
    }
    static fill(size= 1, value= 0, label){
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
        return out;
    }
}

function element_wise(fn, ...args){
    // let main = args.sort((a,b)=>{
    //     return ((a?.length || 1)<(b?.length || 1))?1:-1;
    // })[0];
    return args[0]?.map?.((_, i)=>{
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
        this.W = Parameter(Tensor.random([in_size, out_size], 'linear-w'));
    }
    forward(x){
        x = x._mm(this.W);
        return x;
    }
}
export function linear(...args){
    return new Linear(...args)
}
export class RMSNorm extends Module {
    __init__(dim) {
        this.weight = Parameter(Tensor.ones(dim, 'rsm-norm-w'));
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

export function tensor(...args){
    if(args[0] instanceof Tensor)
        return args[0];
    return new Tensor(...args);
}
export function Parameter(t){
    t.isParam = true;
    return t
}
function multiplyMT(M, T){
    return M.map(x=>T.map(y=>dotProduct(x, y)));
}
function dotProduct(v1, v2){
    return v1.map((a, i) => (a * v2[i])).reduce((r, n) => (r + n));
}
Array.prototype.toTensorString = function (n = 2){
    function recurse(d, idx = 0, l = 0){
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
                    return ((x < 0?' ':'  ') + x.toExponential(n) + ' ');
                }).join(' ') ;
                result +=  ' ... ';
                result +=  d.slice(-2).map(x=>{
                    return ((x < 0?' ':'  ') + x.toExponential(n) + ' ');
                }).join(' ')
            }
            else{
                result += d?.map?.(x=>{
                    return x.toExponential(n);
                }).join(' ') || d?.toExponential?.(n);
            }
        }
        return result + ']'
    }
    return recurse(this);
}
Number.prototype.toTensorString = function (n = 2){
    // if (!Number.isNaN(this))
    //     return this.toExponential?.(n);
    return this
}