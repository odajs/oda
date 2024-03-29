import {num, TNum} from './num.js';
function genId(){
    return ++_id;
}
let _id = 0;
export class Tensor {
    constructor(data, label, children= [], error) {
        this.id = genId();
        this.data = data;
        this.data =  element_wise((x)=>{
            const n = num(x);
            return n;
        }, [data])[0]
        this.label = label;
        this.children = children;
        this.error = error;
    }
    get g(){
        return element_wise(d => {
            return num(d.g);
        }, [this.data])[0];
    }
    get paramCount(){
        if (this.isParam)
            return this.shape.reduce((r, v)=> r * v, 1);
        return 0;
    }
    _back(){
        if (!this.children.length)
            return;
        element_wise(x => x.back(), [this.data]);
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
        this.topo.reverse();

        this.topo.forEach((node) => {
            node.updateParams(learn_speed);
        })
        this.topo.forEach((node) => {
            element_wise(d=>{d.grads = []}, [node.data]);
        })


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
        if (!this.isParam) return;
        this.data = element_wise(d=>{
            let correct = d.g * learn_speed + (d.p || 0);
            const res =  num(d + correct);
            res.p = correct * learn_speed;
            res['#g'] = d.g
            return res;
        }, [this.data])[0];
    }
    clearGrad(){
        element_wise(d=>{
            d['#g'] = undefined;
        }, [this.data]);
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
    toString(show_data = false){
        let data = (show_data?this.data.toTensorString()+'\r\n':'').split('\r\n');
        if (data.length > 6){
            const padding = data[0].length/2 + 2
            data = [...data.slice(0, 2), (' ...').padStart(padding, ' '), ...data.slice(-2)]
        }
        data = data.join('\r\n')
        return this.label + '\r\n' + data
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
        return element_wise((x)=>x?.g, [this.data])[0];
    }
    get dim(){
        return this.shape.length;
    }
    sum(axis){
        let expr = this.shape.map((_,i)=>{
            return 'd'+i;
        }).join(' ')+' -> ';
        if (axis !== undefined)
            expr += 'd'+axis
        const out = Tensor.einsum(expr, this);
        out.label = 'sum';
        if (axis !== undefined)
            out.label +=' by ' + axis;
        return out;
    }
    mul(other){
        return this.func('_mul', other);
    }
    add(other){
        return this.func('_add', other);
    }
    div(other){
        return this.func('_div', other);
    }
    exp(){
        return this.func('_exp');
    }
    pow(other){
        return this.func('_pow', other);
    }
    log(other){
        return this.func('_log', other);
    }
    mean(){
        let out = this.sum();
        out = out.div(this.size);
        return out;
    }
    repeat(cnt= 1){
        const res = Array(cnt).fill(0).map(i=>{
            return structuredClone(this.data);
        })
        let out = ten(res, `_repeat(${cnt})`, [this]);
        return out;
    }
    slice(parts = []){
        let start = 0;
        const result = []
        for (let size of parts){
            let end = start + size;
            let res = this.data.slice(start,  end);
            let out = ten(res, `slice [${start}-${end}]`, [this]);
            result.push(out);
            start = end;
        }
        return result;
    }
    mse(other){
        other = ten(other);
        let res = element_wise((x, t) => num(t-x), this.data, other.data);
        let out = ten(res, `mse (${this.shape})`, [this]);
        element_wise((x, g) => (x.grads.unshift(()=>{
            return g;
        })), [this.data], [out.data]);
        return out
    }
    active(name){
        return this.func(name);
    }
    func(fn, ...args){
        let res = element_wise((d, o) => {
            return d[fn](o)
        }, this.data, ...(args.map(i=>(i?.data ?? i))));
        return ten(res, fn, [this, ...args.filter(i=>i instanceof Tensor)]);
    }
    static concat(...tensors){
        const res = tensors.reduce((r, t)=>{
            return r.concat(t.data);
            return r;
        }, [])

        const out = ten(res, '', tensors);
        let label = 'concat: (';
        label += tensors.map(t=>t.shape).join(') + (') + `) -> (${out.shape})`;
        out.label = label
        return out;
    }
    static stack(other_tensors){
        let res = other_tensors.map(t=>Array.from(t.data));
        let out = ten(res, 'stack', other_tensors);
        return out;
    }
    static ones(size){
        return this.fill(size, 1.0);
    }
    static zeros(size){
        return this.fill(size, 0.0);
    }
    static random(size, k = 1){
        return this.fill(size, ()=>(Math.random()-.5) * k);
    }
    static fill(shape, value){
        if (!Array.isArray(shape))
            shape = [shape];
        function expr_gen(sh){
            const s = sh.shift();
            return s && `Array(${s}).fill(v)${sh.length?'.map(a=>'+expr_gen(sh)+')':((typeof value === 'function')?'.map(a=>a())':'')}`;
        }
        const expr = expr_gen(shape);
        const fn = new Function('v', 'return ' + expr);
        let result = fn(value) || (typeof value === 'function'?value():value);
        return ten(result);
    }
    static hippo(size= 8, koef = 1){
        if (!Array.isArray(size))
            size = [size];
        if (size.length<2)
            size.push(size[0])
        const hippo = Array(size[0]).fill('').map((_, k)=>{
            return Array(size[1]).fill('').map((_, n)=>{
                if (n>k)
                    return -((2 * k + 1) ** .5 * (2 * n + 1) ** .5 * koef);
                if (n === k)
                    return -((n + 1) * koef);
                return 1;
            })
        })
        return ten(hippo, `hippo (${size})`);
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
        return ten(result, `arange (${from_or_size}-${size-1} X ${repeat})`);
    }
    static pos(d, pos = 0, k = 1000){
        return ten(Array(d).fill().map((_, i)=>{
            const v = 1/Math.pow(k, 2 * i/d) * pos;
            return (i%2)?Math.cos(v):Math.sin(v);
        }), 'pos: '+pos)
    }
    static einsum(expr, ...sources){
        const label = 'einsum: \"'+expr+'\"';
        const tensors = sources.map(i=>ten(i));
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
        expr = expr[1]?.trim();
        if(expr?.length)
            operator = expr;
        expr = '('+ins.map((t, i) => {
            return `t_${i}${t.map(idx=>{
                if (idx.d)
                    return '['+idx.a+']';
                return ''
            }).join('')}`
        }).join(`).${operator}(`)+')';
        const ss = `out${outs.map(o => {
            return '['+o.a+']'}).join('')
        }`
        expr = `\t${ss} = ${ss}._add(` + expr + ')';
        expr = [...outs, ...axis].map((o, i) => {
            if (o.d)
                return '\t'.repeat(i) + `for(let ${o.a} = 0; ${o.a} < ${o.d}; ${o.a}++)`;
            return ''
        }).join('\n')+'\n' + expr;
        expr = expr + '\n return out';
        const fn = new Function(['out', ...tensors.map((_,i)=>'t_'+i)], expr);
        const out = Tensor.zeros(outs.map(o => o.d));
        out.children = tensors;
        out.data = fn(out.data, ...tensors.map(t=>t.data));
        // out.data = element_wise((x)=>{
        //     let res = num(+x);
        //     res.backs = x.backs;
        //     res.back = x.back;
        //     return res;
        // }, out.data)
        out.label = label + ' ('+out.shape+')';
        return out;
    }
}
export function ten(...args){
    if(args[0] instanceof Tensor)
        return args[0];
    return new Tensor(...args);
}
export function Parameter(t){
    t.isParam = true;
    return t
}
function element_wise(fn, data, other){
    if(Array.isArray(data)){
        return data.map?.((d, i)=>{
            return element_wise(fn, d, other?.[i] ?? other);
        })
    }
    return fn(data, other);
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
Math.seed = function(s) {
    return function() {
        s = Math.sin(s) * 10000;
        return s - Math.floor(s);
    }
};
function Rec_Mult(C, A, B, n, rowsize) {
    if (n === 2)
    {
        const d11 = 0;
        const d12 = 1;
        const d21 = rowsize;
        const d22 = rowsize + 1;

        C[d11] += A[d11] * B[d11] + A[d12] * B[d21];
        C[d12] += A[d11] * B[d12] + A[d12] * B[d22];
        C[d21] += A[d21] * B[d11] + A[d22] * B[d21];
        C[d22] += A[d21] * B[d12] + A[d22] * B[d22];
    }
    else
    {
        const d11 = 0;
        const d12 = n / 2;
        const d21 = (n / 2) * rowsize;
        const d22 = (n / 2) * (rowsize + 1);

        // C11 += A11 * B11
        Rec_Mult(C + d11, A + d11, B + d11, n / 2, rowsize);
        // C11 += A12 * B21
        Rec_Mult(C + d11, A + d12, B + d21, n / 2, rowsize);

        // C12 += A11 * B12
        Rec_Mult(C + d12, A + d11, B + d12, n / 2, rowsize);
        // C12 += A12 * B22
        Rec_Mult(C + d12, A + d12, B + d22, n / 2, rowsize);

        // C21 += A21 * B11
        Rec_Mult(C + d21, A + d21, B + d11, n / 2, rowsize);
        // C21 += A22 * B21
        Rec_Mult(C + d21, A + d22, B + d21, n / 2, rowsize);

        // C22 += A21 * B12
        Rec_Mult(C + d22, A + d21, B + d12, n / 2, rowsize);
        // C22 += A22 * B22
        Rec_Mult(C + d22, A + d22, B + d22, n / 2, rowsize);
    }
}