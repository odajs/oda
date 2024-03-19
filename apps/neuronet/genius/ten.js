import {num} from './num.js';
export class Tensor {
    _back = () => {

    };
    constructor(data, label, children= [], error) {
        this.data =  element_wise((x)=>{
            return num(x);
        }, [data])[0]
        // this.data = data;
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
        this.topo.reverse().forEach((node) => {
            node._back()
        })
        this.topo.forEach((node) => {
            node.updateParams(learn_speed);
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
        this.data = element_wise((d)=>(num(d + d.g * learn_speed)), [this.data])[0];
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
    toString(step = 0, show_data = false){
        let data = (show_data?this.data.toTensorString()+'\r\n':'').split('\r\n');
        if (data.length > 6){
            const padding = data[0].length/2 + 2
            data = [...data.slice(0, 2), ('...').padStart(padding, ' '), ...data.slice(-3)]
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
    _concat(){
        // Реализован самый простой случай
        // когда тензор состоит из массива одномерных тензоров,
        // которые надо соединить.
        let result = this.data.flat();
        let out = ten(result, '_concat', [this]);
        out._back = () => {
            const len = this.data[0].length;
            this.grad = this.grad.map((v, i)=>{
                return out.grad.slice(i * len, i * len + len);
            });
        }
        return out;
    }
    _sum(){
        let res = this.data.reduce((r, v) => r + v);
        let out = ten(res, `_sum`, [this]);
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
    _repeat(cnt= 1){
        const res = Array(cnt).fill(0).map(i=>{
            return structuredClone(this.data);
        })
        let out = ten(res, `_repeat(${cnt})`, [this]);
        return out;
    }
    _slice(parts = []){
        let start = 0;
        const result = []
        for (let size of parts){
            let end = start + size;
            let res = this.data.slice(start,  end);
            let out = ten(res, `_slice [${start}-${end}]`, [this]);
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
    _mse(other){
        other = ten(other);
        let res = element_wise((x, t) => (t - x) ** 2, this.data, other.data);
        res = res.reduce((r, v) => (r + v))
        let out =  ten(res, '_mse', [this]);
        out._back = () => {
            element_wise((x, t) => x.back(t - x), this.data, other.data);
        }
        return out
    }
    static stack(other_tensors){
        let res = other_tensors.map(t=>Array.from(t.data));
        let out = ten(res, 'stack', other_tensors);
        out._back = () => {
            other_tensors.map((t, i)=>{
                t.grad = out.grad[i];
            })
        }
        return out;
    }
    static ones(size){
        return this.fill(size, 1);
    }
    static zeros(size){
        return this.fill(size, 0);
    }
    static random(size){
        return this.fill(size, ()=>Math.random()-.5);
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
                return 0;
            })
        })
        return ten(hippo, 'hippo');
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
        return ten(result, `arange (${from_or_size}-${size})`);
    }
    static pos(d, pos = 0, k = 1000){
        return ten(Array(d).fill().map((_, i)=>{
            const v = 1/Math.pow(k, 2 * i/d) * pos;
            return (i%2)?Math.cos(v):Math.sin(v);
        }), 'pos: '+pos)
    }
    static einsum(expr, ...sources){
        const label = 'einsum: \''+expr+'\'';
        const tensors = sources.map(i=>ten(i));
        expr = expr.split('->');                            // Разделение выражения на вход и выход
        const axis = [];
        const terms = expr[0].trim().split(',');            // Разделение входа на термы
        const ins = terms.map((term, i)=>{                  // Анализ входных термов по размерностям
            term = term.trim();
            const tensor = tensors[i];
            return term.split(' ').map((a, j)=>{            // Разделение терма на индексы и их анализ
                a = a.trim();
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
        const outs = expr[1].trim().split(' ').map(a => {   // Разделение выходного терма на индексы и их анализ
            a = a.trim();
            if(!a) return;
            let idx = axis.findIndex(v => v.a === a);
            if(idx < 0)
                throw new Error(`Unknown axis: '${a}'`);
            let ax = axis[idx];
            axis.splice(idx, 1);
            return ax;
        }).filter(i=>i)
        expr = '('+ins.map((t, i) => `t_${i}${t.map(idx=>'['+idx.a+']').join('')}`).join(')._mul(')+')';
        expr = `out${outs.map(o => '['+o.a+']').join('')} = (out${outs.map(o => '['+o.a+']').join('')})._add(` + expr + ')';
        expr = [...outs, ...axis].map(o => `for(let ${o.a} = 0; ${o.a} < ${o.d}; ${o.a}++)`).join('\n')+'\n' + expr;
        expr = expr + '\n return out';
        const fn = new Function(['out', ...tensors.map((_,i)=>'t_'+i)], expr);
        const out = Tensor.zeros(outs.map(o => o.d));
        out.children = tensors;
        out.data = fn(out.data, ...tensors.map(t=>t.data));
        out.label = label + ' ('+out.shape+')';
        out._back = ()=>{
            element_wise((x) => x.back(x.g), out.data);
        }
        return out;
    }
    any(fn){
        return element_wise(v => v[fn](), [this.data])[0];
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
function element_wise(fn, ...args){
    return args[0]?.map?.((_, i)=>{
        const next_args = args.map(a=>{
            return a?.[i] ?? a;
        });
        return element_wise(fn, ...next_args);
    }) ?? fn(...args);
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
    return this
}
Math.seed = function(s) {
    return function() {
        s = Math.sin(s) * 10000;
        return s - Math.floor(s);
    }
};

Tensor.prototype._log = function (){
    return this.any('_log');
}