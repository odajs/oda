const USE_TESTS = false;
export const LEARNING_RATE = .33;
export const GRADIENT_DIVIDER = 1.618;
export class torus{
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
        return torus.from(this.grad).reshape(this.shape);
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
        if (this.data.length){
            for(let i = 0; i<this.data.length; i++){
                this.data[i] += this.grad[i] * LEARNING_RATE;
                if (Number.isNaN(this.data[i])){
                    console.log(this.grad[i])
                }
            }
        }
        else{
            this.data += this.grad * LEARNING_RATE;
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
        return torus.from(data, 'stack', array);
    }
    static fill(shape, value, label, children){
        if (!Array.isArray(shape))
            shape = [shape];
        const size = shape.reduce((r, v)=>r * v, 1);
        const handler = typeof value === 'function'?value:i=>value;
        let data = new Float32Array(size).map(handler);
        return torus.from(data, label, children).reshape(shape);
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
        return torus.from(data, label);
    }
    static arange(from = 0, to = 0, step = 1){
        if (!to){
            to = from;
            from = 0;
        }
        const data = []
        for(let i = from; i<to; i+=step){
            data.push(i);
        }
        return torus.from(data);
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
        return torus.from(data, 'hippo');
    }
    static from(data, label, children){
        if (data instanceof torus)
            return data;
        return new torus(data, label, children)
    }
    static param(tensor){
        if (!(tensor instanceof torus)){
            tensor = torus.from(tensor);
        }
        tensor.isParam = true;
        return tensor;
    }


    toString(max = 8){
        if (this.shape.length){
            let data = this.array.totorusString(max, this.shape).split('\r\n');
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
            let out = torus.from(res, `slice [${start}-${end}]`, [this]);
            result.push(out);
            start = end;
        }
        return result;
    }
}

torus.prototype.sum = function (){
    const out = EO.einsum('x->', this);
    out.label = `sum([${this.shape}])`;
    return out;
}

torus.prototype.log = function (){
    const data = this.data.map(Math.log);
    const out = torus.from(data, 'log', [this]).reshape(this.shape);
    for(let i = 0; i<this.data.length; i++){
        this.data[i].grads.push(()=>{
            return (1 / this.data[i]) * out.data[i].g;
        })
    }
    return out;
}

torus.prototype.exp = function (){
    const data = this.data.map(x => x.exp())
    return torus.from(data, `exp([${this.shape}])`, [this]).reshape(this.shape);
}

torus.prototype.oper = function (operation , other){
    other = torus.from(other);
    let axis_this = this.shape.reduce((r,v,i)=>r = String.fromCharCode(i+97) + r, '');
    let axis_other = other.shape.reduce((r,v,i)=>r = String.fromCharCode(i+97) + r, '');
    const expr = `${axis_this}, ${axis_other} -> ${axis_this}:`+operation;
    const out = EO.einsum(expr, this,  other);
    out.label = operation+`: ${this.label}, ${other.label}`;
    return out;
}

torus.prototype.add = function (other){
    return this.oper('add', other);
}
torus.prototype.minus = function (other){
    return this.oper('minus', other);
}
torus.prototype.mul = function (other){
    return this.oper('mul', other);
}
torus.prototype.div = function (other){
    return this.oper('div', other);
}
torus.prototype.tahn = function (){
    const data = this.data.map(x=>x.tahn());
    return torus.from(data, 'tahn', [this]).reshape(this.shape);
}
torus.prototype.pow = function (other){
    other = torus.from(other);
    let data;
    if (this.shape.length)
        data = this.data.map((x, i)=>x._pow(other.data[i] ?? other.data))
    else
        data = this.data._pow(other.data.reduce?.((r, v)=>r + v, 0) ?? other.data)
    return torus.from(data, `pow([${this.shape}] ^ ${other.data})`, [this, other]).reshape(this.shape);
}

torus.prototype.sigmoid = function (){
    const data = (this.data.length)?(this.data.map(x => 1 / (1 + Math.exp(-x)))): (1 / (1 + Math.exp(-this.data)));
    const out = torus.from(data, 'sigmoid', [this]).reshape(this.shape);
    out._back = ()=>{
        if (data.length){
            for(let i = 0; i<data.length; i++){
                let v = data[i];
                this.grad[i] += (1 - v) * v * out.grad[i] / GRADIENT_DIVIDER;
            }
        }
        else{
            this.grad += (1 - data) * data * out.grad / GRADIENT_DIVIDER;
        }
    }
    return out;
}
torus.prototype.softplus = function (){
    const data = this.data.map(x=>x.softplus());
    return torus.from(data, 'softplus', [this]).reshape(this.shape);
}
torus.prototype.softmax = function (){
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
    return torus.from(data, 'softmax', [this]).reshape(this.shape);
}
torus.prototype.MSE = function (other){
    if (other instanceof torus)
        other = other.data;
    let data;
    if(this.data.length)
        data = this.data.map((d, i)=>{
            return ((other[i] ?? other ?? 0) - d) ** 2;
        });
    else
        data = ((other ?? 0) - this.data) ** 2;
    const error = (data.length)?(data.reduce((r, d) => r + d, 0) / data.length):data;
    const out = torus.from(error, 'MSE', [this]);
    out._back = ()=>{
        if (data.length){
            for (let i = 0; i<data.length; i++){
                this.grad[i] += (-2 * data[i] / GRADIENT_DIVIDER);
            }
        }
        else{
            this.grad += (-2 * data / GRADIENT_DIVIDER);
        }
    }
    return out;
}

Array.prototype.totorusString = function (max = 4, shape = []){
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
   if (Number.isInteger(x))
        return x.toLocaleString();
    return x.toExponential(3).padStart(9, ' ')
}

torus.einsums = {};
torus.parse_shape = (expr, tensor)=>{
    const shape = tensor.shape;
    const vars = expr.split('');
    if(vars.length !== shape.length)
        throw new Error(`Shape size [${shape.length}] does not match variable count [${vars.length}]`);
    vars.reduce((r, d, i)=>{
        d = d.trim();
        switch (d){
            case '_':{

            } break;
            default:{
                r[d] = shape[i];
            }
        }
        return r
    },{})
}
torus.einsum = (in_expr, ...sources)=>{
    const tensors = sources.map(t => torus.from(t));
    let expr = in_expr.split('->');                            // Разделение выражения на вход и выход
    const axis = [];
    const terms = expr[0].trim().split(',');            // Разделение входа на термы
    const inputs = terms.map((term, i)=>{                  // Анализ входных термов по размерностям
        term = term.trim();
        const tensor = tensors[i];
        return term.split('').map((a, j)=>{            // Разделение терма на индексы и их анализ
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
    let outs = expr[0].trim().split('').map(a => {   // Разделение выходного терма на индексы и их анализ
        if(!a) return;
        let idx = axis.findIndex(v => v.a === a);
        if(idx < 0)
            throw new Error(`Unknown axis: '${a}'`);
        let ax = axis[idx];
        axis.splice(idx, 1);
        return ax;
    }).filter(i=>i)
    expr = expr[1]?.trim();
    let operator = expr?.length?expr:'mul'; // выбор оператора
    let vars = [
        [...outs, ...axis].map((o, i) =>`let _${o.a} = ${o.d};`).join('\n'),
        inputs.map((_, i) => `let t${i} = t[${i}].data;`).join('\n'),
        inputs.map((_, i) => `let idx${i} = 0;`).join('\n'),
        inputs.map((_, i) => `let v${i} = 0;`).join('\n')
    ].join('\n');
    if (outs.length)
        vars += `\nlet idx = -1;\n`;

    const out_tabs = '\t'.repeat(outs.length);

    let data_idx = (outs.length)?`[++idx]`:'';
    inputs.map((t, i) => {
        let expr = ''
        let m = ''
        for (let o of t.toReversed()){
            if (m)
                expr += ' + ' + m;
            expr += o.a;
            m =  '_' + o.a +' * (';
        }
        expr += ')'.repeat(t.length - 1);
        t.idx_expr = expr;
    })

    let out_for = outs.map((o, i) => {
        let axis_name = o.a;
        let tab = '\t'.repeat(i)
        let res = tab + `for(let ${axis_name} = 0; ${axis_name} < _${axis_name}; ${axis_name}++){`;
        return res
    }).join('\n')+'\n'
    const input_for_func = function (ts, back = false){
        const uses = outs.map(o => o.a);
        let result = ''
        let cl = 0;
        let tab = 0
        let tabs = out_tabs;
        let backs = '';
        inputs.map((input, i)=>{
            for (let axis of input){
                if (uses.includes(axis.a))
                    continue;
                uses.push(axis.a);
                result+= tabs + `for(let ${axis.a} = 0; ${axis.a} < _${axis.a}; ${axis.a}++){\n`
                cl++;
                tab++
                tabs = out_tabs + '\t'.repeat(tab)
            }
            result += tabs+`idx${i} = ${input.idx_expr};\n`;
            result += tabs+`v${i} = t${i}[idx${i}];\n`;
            backs += tabs+`grad${i}[idx${i}] += ${inputs.map((_, gi)=>{
                if (gi !== i)
                    return 'v'+gi
            }).filter(n=>n).join(` ${operators[operator]} `)}`;
            if(inputs.length>1)
                backs +=' * ';
            backs += '_g;\n';


        })
        if (!back)
            result += tabs + 'res += ' + inputs.map((_,i)=>'v'+i).join(` ${operators[operator]} `) + ';\n';
        else{
            result += backs;
        }
        result += Array(cl).fill('').map((c, i)=> out_tabs + '\t'.repeat(i) + '}').toReversed().join('\n')
        return result + '\n';
    }

    function build_expr(mode = ''){
        let body = '';
        switch (mode){
            case 'mul':{
                body += input_for_func(inputs, true);
            } break;
            default:{
                body += input_for_func(inputs);
                body += out_tabs + `out.data${data_idx}`;
                body += ' = res;';
            }
        }
        // body += '\n'+out_tabs + 'idx++'

        if (mode !== ''){
            vars += '\nlet grad = out.grad\n';
            vars += inputs.map((_, i) => `let grad${i} = t[${i}].grad;`).join('\n')
        }

        let result = vars + '\n';
        result += out_for + '\n'
        if (mode !== ''){
            result += out_tabs + `let _g = grad${data_idx} / ${GRADIENT_DIVIDER}\n`;
        }
        else
            result +=  out_tabs + `let res = 0;`;
        result += /*axis_for + */'\n' + body + '\n';
        result += outs.map((_, i)=>'\t'.repeat(i)+'}').toReversed().join('\n');
        return result;
    }


    let fwd_expr = build_expr();
    const data = outs.length?new Float32Array(outs.reduce((r,a)=> r * a.d, 1)):0;
    const out = torus.from(data);
    out.reshape(outs.map(i=>i.d));
    out.children = tensors;
    const fn = new Function('t', 'out', fwd_expr);
    let back_expr = build_expr(operator);
    const back_fn = new Function('t', 'out', back_expr);
    out._back = function (){
        // console.time(in_expr+'-back')
        back_fn(tensors, out);
        // console.timeEnd(in_expr+'-back')
    }
    // console.time(in_expr)
    fn(tensors, out);
    // console.timeEnd(in_expr)
    out.label = 'einsum: \"'+in_expr+'\"' + (out.shape.length?(' ('+out.shape+')'):'');



    return out;
}
torus.rearrange = (expr, tensor)=>{
    //todo
}
torus.reduce = (expr, tensor, agg_func = 'max')=>{
    //todo
}
torus.repeat = (expr, tensor, vars = {})=>{
    //todo
}
torus.pack = (expr, inputs)=>{
    //todo
}
torus.unpack = (expr, inputs)=>{
    //todo
}
const operators = {
    'mul': ' * ',
    '*': ' * ',
    'div': ' / ',
    '/': ' / ',
    'plus': ' + ',
    '+': ' + ',
    'add': ' + ',
    'minus': ' - ',
    '-': ' - ',
}



const tests = [
    (check = 15)=>{
        const v = Tensor.from([1, 2, 3, 4, 5]);
        const res = EO.einsum("i->", v);
        if (res.data !== check) throw new Error('Сумма всех значений вектора');
    },
    (check = 21)=>{
        const v = Tensor.from([[1, 2], [3, 4], [5, 6]]);
        const res = EO.einsum("ij->", v);
        if (res.data !== check) throw new Error('Сумма всех значений матрицы');
    },
    (check = [9, 12])=>{
        const v = Tensor.from([[1, 2], [3, 4], [5, 6]]);
        const res = EO.einsum("ij->j", v);
        for(let i = 0; i<check.length; i++){
            if (res.data[i] !== check[i]) throw new Error('Сумма значений по столбцам');
        }
    },
    (check = [3, 7, 11])=>{
        const v = Tensor.from([[1, 2], [3, 4], [5, 6]]);
        const res = EO.einsum("ij->i", v);
        for(let i = 0; i<check.length; i++){
            if (res.data[i] !== check[i]) throw new Error('Сумма значений по строкам');
        }
    },
    (check = [[1, 3, 5], [2, 4, 6]])=>{
        const v = Tensor.from([[1, 2], [3, 4], [5, 6]]);
        const res = EO.einsum("ij->ji", v);
        check = check.flat();
        for(let i = 0; i<check.length; i++){
            if (res.data[i] !== check[i]) throw new Error('Транспонирование');
        }
    },
    (check = [[5], [11], [17]])=>{
        const v1 = Tensor.from([[1, 2], [3, 4], [5, 6]]);
        const v2 = Tensor.from([[1, 2]]);
        const res = EO.einsum("ij,kj->ik", v1,  v2);
        check = check.flat();
        for(let i = 0; i<check.length; i++){
            if (res.data[i] !== check[i]) throw new Error('Умножение матрицы на вектор');
        }
    },
    (check = [[1, 2], [3, 4], [5, 6]])=>{
        const v1 = Tensor.from([[1, 2], [3, 4], [5, 6]]);
        const v2 = Tensor.from([[1, 0], [0, 1]]);
        const res = EO.einsum("ik,kj->ij", v1,  v2);
        check = check.flat();
        for(let i = 0; i<check.length; i++){
            if (res.data[i] !== check[i]) throw new Error('Умножение матрицы на матрицу');
        }
    },
    (check = 6)=>{
        const v1 = Tensor.from([[1, 2, 3]]);
        const v2 = Tensor.from([[1, 1, 1]]);
        const res = EO.einsum("ik,jk->", v1,  v2);
        if (res.data !== check) throw new Error('Скалярное произведение векторов');
    },
    (check = 15)=>{
        const v1 = Tensor.from([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
        const res = EO.einsum("ii->", v1);
        if (res.data !== check) throw new Error('След матрицы');
    },
    (check = [[1, 0, 0], [0, 5, 0], [0, 0, 9]])=>{
        const v1 = Tensor.from([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
        const v2 = Tensor.from([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
        const res = EO.einsum("ij,ij->ij", v1,  v2);
        check = check.flat();
        for(let i = 0; i<check.length; i++){
            if (res.data[i] !== check[i]) throw new Error('Адамарово (покомпонентное) произведение');
        }
    },
    (check = [[1, 0, 0], [2, 0, 0], [3, 0, 0]])=>{
        const v1 = Tensor.from([1, 2, 3]);
        const v2 = Tensor.from([1, 0, 0]);
        const res = EO.einsum("i,j->ij", v1,  v2);
        check = check.flat();
        for(let i = 0; i<check.length; i++){
            if (res.data[i] !== check[i]) throw new Error('Кронекерово (внешнее) произведение векторов');
        }
    },
    (check = [[[0, 1, 2], [1, 2, 3]], [[1, 2, 3], [2, 3, 4]], [[2, 3, 4], [3, 4, 5]]])=>{
        const v1 = Tensor.from([[[0, 1], [1, 2], [2, 3]], [[1, 2], [2, 3], [3, 4]], [[2, 3], [3, 4], [4, 5]]]);
        const res = EO.einsum("ijk->jki", v1);
        check = check.flat().flat();
        for(let i = 0; i<check.length; i++){
            if (res.data[i] !== check[i]) throw new Error('Транспонирование тензора');
        }
    },
    (check = [[[2, 3], [5, 8], [8, 13]], [[5, 8], [8, 13], [11, 18]], [[8, 13], [11, 18], [14, 23]]])=>{
        const v1 = Tensor.from([[[0, 1], [1, 2], [2, 3]], [[1, 2], [2, 3], [3, 4]], [[2, 3], [3, 4], [4, 5]]]);
        const v2 = Tensor.from([[1, 2], [2, 3]]);
        const res = EO.einsum("ijk,nk->ijn", v1,  v2);
        check = check.flat().flat();
        for(let i = 0; i<check.length; i++){
            if (res.data[i] !== check[i]) throw new Error('Произведение тензора на матрицу по третьей модев');
        }
    },
]
if (USE_TESTS){
    setTimeout(()=>{
        for (let test of tests)
            test()
    })
}
function genId(){
    return ++_id;
}
let _id = 0;