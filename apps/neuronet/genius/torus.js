const USE_TESTS = false;
export const LEARNING_RATE = .3;
export const GRADIENT_DIVIDER = 1//.618;
export class tensor{
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
            else
                data = new Float32Array([data])
        }
        this.#data = data;
        this.id = genId();
    }
    get allowGrad(){
        return (this._back && !!this.children?.some(i=>i.allowGrad)) || this.isParam;
    }
    get grad(){
        return this['#grad'] ??= new Float32Array(this.size);
    }
    set grad(n){
        this['#grad'] = n;
    }
    get T(){
        let axis_this = this.shape.reduce((r,v,i)=>r = String.fromCharCode(i+97) + r, '');
        let axis_out = axis_this.split('');
        axis_out.reverse();
        axis_out = axis_out.join('')
        return tensor.einsum(axis_this+'->'+axis_out, [this]);
    }
    get g(){
        return tensor.from(this.grad).reshape(this);
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
        for(let i = 0; i<this.data.length; i++){
            this.data[i] += this.grad[i] * LEARNING_RATE;
        }
    }
    back(grad){
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
        if(grad){
            this.topo[0].grad = this.topo[0].grad.map(i=>grad)
        }

        this.topo.forEach((node) => {
            if (!node.children) return;
            node._back?.();
        })
        this.topo.forEach((node) => {
            if (node.children) return;
            node.updateParams();
        })
    }
    reshape(...shape){
        if(Array.isArray(shape[0]))
            shape = shape[0];
        if(shape[0] instanceof tensor)
            shape = shape[0].shape;
        const size = shape.reduce((r, v)=>r * v, 1);
        if (size !== this.size)
            throw new Error(`Reshape from (${this.shape}) to (${shape}) not allow.`);
        this.#shape = shape
        return this;
    }
    static concat(tensors, dim= 0){

    }
    split(split_sizes, dim = 0){
        if (Array.isArray(split_sizes)){

        }
        else if (Number.isInteger(split_sizes)){

        }
        else throw new Error(`Argument 'split_sizes' (position 1) must be 'Integer' or 'array of Integer', but not '${typeof split_sizes}'`)

    }
    static stack(tensors, dim= 0){
        let shape = [...tensors[0].shape];
        if (shape.length<dim)
            throw new Error(`Dimension out of range (expected to be in range of [-${shape.length+1}, ${shape.length}], but got ${dim})`)
        let size = tensors[0].size;
        let step = size;
        if (dim < 0)
            dim = shape.length + 1 + dim
        let d = dim;
        for (let s of shape){
            if (!d) break;
            step /= s;
            d--;
        }
        const data = new Float32Array(size * tensors.length);
        let idx = -1;
        for (let i = 0; i < size; i += step){
            for (let t of tensors){
                for (let j = i; j<i + step; j++)
                    data[++idx] = t.data[j];
            }

        }
        shape.splice(dim, 0, tensors.length);
        const out = tensor.from(data, `stack(${tensors.length} tensors with shape(${shape}), dim=${dim})`, tensors).reshape(shape);
        out._back = ()=>{
            for(let start = 0; start<size; start += step){
                let delta = start
                for (let t of tensors){
                    const slice = out.grad.slice(delta, delta + step);
                    for(let i = 0; i<slice.length; i++){
                        t.grad[start + i] += slice[i];
                    }
                    delta += step
                }
            }

        }
        return out
    }
    static fill(shape, value){
        if (!Array.isArray(shape))
            shape = [shape];
        const size = shape.reduce((r, v)=>r * v, 1);
        const handler = typeof value === 'function'?value:i=>value;
        let data = new Float32Array(size).map(handler);
        return tensor.from(data).reshape(shape);
    }
    static zeros(...shape) {
        return this.fill(shape, 0, );
    }
    static ones(...shape) {
        return this.fill(shape, 1);
    }
    static ones_like(src) {
        return this.ones(...src.shape);
    }
    static rands(...shape) {
        return this.fill(shape, ()=>(Math.random()-.5) * .1);
    }
    static rand(...shape) {
        return this.fill(shape, ()=>(Math.random()-.5));
    }
    static random(...shape) {
        return this.fill(shape, ()=>Math.random());
    }
    static randn(...shape){
        return this.fill(shape, ()=>Math.sqrt(-2 * Math.log(Math.random()))*Math.cos((2*Math.PI) * Math.random()));

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
        return tensor.from(data);
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
        return tensor.from(data, 'hippo');
    }
    static from(data, label, children){
        if (data instanceof tensor)
            return data;
        return new tensor(data, label, children)
    }
    static param(src){
        if (!(src instanceof tensor)){
            src = tensor.from(src);
        }
        src.isParam = true;
        return src;
    }


    toString(max = 8){
        if (this.shape.length){
            let data = this.array.toTensorString(max, this.shape).split('\r\n');
            if (data.length > max){
                const padding = data[0].length/2 + 2
                data = [...data.slice(0, Math.floor(max/2)), ('...').padStart(padding, ' '), ...data.slice(-Math.floor(max/2))]
            }
            data = data.join('\r\n')
            return `(${data}), shape(${this.shape})`;
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
                res.push(Array.from(data.slice(i, i+s)))
            }
            data = res;
            res = [];
        }
        return data.flat();
    }
    slice(...parts){
        let start = 0;
        const result = []
        for (let size of parts){
            let end = start + size;
            let data = this.data.slice(start,  end);
            let out = tensor.from(data, `slice [${start}-${end}]`, [this]);
            let s = start;
            out._back = ()=>{
                for(let i = 0; i<data.length; i++){
                    this.grad[i+s] += out.grad[i];
                }
            }
            result.push(out);
            start = end;
        }
        return result;
    }
}

tensor.prototype.log = function (){
    const data = this.data.map(Math.log);
    const out = tensor.from(data, 'log', [this]).reshape(this);
    if (this.allowGrad){
        out._back = ()=>{
            let _x = this.grad;
            let _z = out.grad;
            let x = this.data;
            for(let i = 0; i<this.data.length; i++){
                _x[i] = 1 / x[i] * _z[i] / GRADIENT_DIVIDER;
            }
        }
    }
    return out;
}

tensor.prototype.exp = function (){
    const data = this.data.map(Math.exp);
    const out = tensor.from(data, `exp`, [this]).reshape(this);
    if (this.allowGrad){
        out._back = ()=>{
            let x_grad = this.grad;
            let o_grad = out.grad;
            let x_data = this.data;
            for(let i = 0; i<x_data.length; i++){
                x_grad[i] += x_data[i] * o_grad[i] / GRADIENT_DIVIDER;
            }
        }
    }
    return out;
}
tensor.prototype.invert = function (){
    const data = this.data.map(x=>-x);
    const out = tensor.from(data, `invert`, [this]).reshape(this);
    if (this.allowGrad){
        out._back = ()=>{
            let x_grad = this.grad;
            let o_grad = out.grad;
            for(let i = 0; i<this.data.length; i++){
                x_grad[i] += -o_grad[i] / GRADIENT_DIVIDER;
            }
        }
    }
    return out;
}

tensor.prototype.plus = function (other){
    let y = other.data;
    let data = this.data.map((x, i) => x + y[i]);
    const out = tensor.from(data, 'plus', [this, other]).reshape(this);
    out._back = ()=>{
        let _x = this.grad;
        let _y = other.grad;
        let _z = out.grad;
        for (let i = 0; i<data.length; i++){
            let g = _z[i] / GRADIENT_DIVIDER;
            _x[i] += g;
            _y[i] += g;
        }
    }
    return out;
}
tensor.prototype.minus = function (other){
    let y = other.data;
    let data = this.data.map((x, i) => x - y[i]);
    const out = tensor.from(data, 'minus', [this, other]).reshape(this);
    out._back = ()=>{
        let _x = this.grad;
        let _y = other.grad;
        let _z = out.grad;
        for (let i = 0; i<data.length; i++){
            let g = _z[i] / GRADIENT_DIVIDER;
            _x[i] += g;
            _y[i] += -g;
        }
    }
    return out;
}
tensor.prototype.mul = function (other){
    let y = other.data;
    let data = this.data.map((x, i) => x * y[i]);
    const out = tensor.from(data, 'mul', [this, other]).reshape(this);
    out._back = ()=>{
        let _x = this.grad;
        let x = this.data;
        let _y = other.grad;
        let _z = out.grad;
        for (let i = 0; i<data.length; i++){
            let g = _z[i] / GRADIENT_DIVIDER;
            _x[i] += y[i] * g;
            _y[i] += x[i] * g;
        }
    }
    return out;
}
tensor.prototype.div = function (other){
    let y = other.data;
    let data = this.data.map((x, i) => x / y[i]);
    const out = tensor.from(data, 'div', [this, other]).reshape(this);
    out._back = ()=>{
        let _x = this.grad;
        let x = this.data;
        let _y = other.grad;
        let _z = out.grad;
        for (let i = 0; i<data.length; i++){
            let g = _z[i] / GRADIENT_DIVIDER;
            _x[i] += 1 / _y[i] * g;
            _y[i] += -x[i]/(y ** 2) * g;
        }
    }
    return out;
}
tensor.prototype.pow = function (other){
    let y = other.data;
    let data = this.data.map((x, i)=>x ** y[i])
    let out =  tensor.from(data, `pow`, [this, other]).reshape(this);
    out._back = ()=>{
        let _x = this.grad;
        let x = this.data;
        let _y = other.grad;
        let _z = out.grad;
        for (let i = 0; i<data.length; i++){
            let g = _z[i] / GRADIENT_DIVIDER;
            let yi = y[i];
            let xi = x[i];
            _x[i] += yi * x[i] ** (yi - 1) * g;
            _y[i] += data[i] * Math.ln(xi) * g;
        }
    }
    return out;
}

tensor.prototype.tahn = function (){
    const data = this.data.map(x=>x.tahn());
    return tensor.from(data, 'tahn', [this]).reshape(this);
}

tensor.prototype.sigmoid = function (){
    const data = this.data.map(x => 1 / (1 + Math.exp(-x)))
    const out = tensor.from(data, 'sigmoid', [this]).reshape(this);
    out._back = ()=>{
        let o_grad = out.grad;
        let x_grad = this.grad;
        for(let i = 0; i<data.length; i++){
            let x = data[i];
            x_grad[i] += (1 - x) * x * o_grad[i] / GRADIENT_DIVIDER;
        }
    }
    return out;
}
tensor.prototype.softplus = function () {
    const data = this.data.map(x => Math.log(1 + Math.exp(x)))
    const out = tensor.from(data, 'softplus', [this]).reshape(this);
    out._back = ()=>{
        let o_grad = out.grad;
        let x_grad = this.grad;
        for(let i = 0; i<data.length; i++){
            let x = data[i];
            let exp = Math.exp(x);
            x_grad[i] += (exp / (1 + exp)) * o_grad[i] / GRADIENT_DIVIDER;
        }
    }
    return out;
}

tensor.prototype.softmax = function (){
    const exp = this.data.map(Math.exp).reduce((r, v) => r + v);
    const data = this.data.map((x, i)=>  Math.exp(x) / exp);
    const out =  tensor.from(data, 'softmax', [this]).reshape(this);
    out._back = ()=>{
        for(let i = 0; i<data.length; i++){
            let d = data[i];
            let sum = data.reduce((r, sj, j)=>{
                if (i === j)
                    return d * (1 - d)
                return -d * sj;
            }) * out.grad[i];
            this.grad[i] += sum * out.grad[i] / GRADIENT_DIVIDER;
        }
    }
    return out;
}
tensor.prototype.silu = function () {
    const data = this.data.map((x, i)=> x * (1 / (1 + Math.exp(-x))));
    const out =  tensor.from(data, 'silu', [this]).reshape(this);
    out._back = ()=>{
        let o_grad = out.grad;
        let x_grad = this.grad;
        for(let i = 0; i<data.length; i++){
            let x = data[i];
            x_grad[i] += (1 - x) * x * o_grad[i] / GRADIENT_DIVIDER;
        }
    }
    return out;
}
tensor.prototype.MSE = function (target){
    let y = target.data ?? target;
    let error = 0;
    let data = this.data.map((x, i)=>{
        error += x = (x - y[i]) ** 2;
        return x;
    });
    error /= this.size;
    const out = tensor.from([error], 'MSE', [this]);
    out._back = ()=>{
        let _x = this.grad;
        for (let i = 0; i<data.length; i++){
            _x[i] += -2 * data[i] / GRADIENT_DIVIDER;
        }
    }
    return out;
}

tensor.prototype.crossEntropy = function (target) {
    let y = target.data ?? target;
    let error = -this.data.reduce((r, x, i)=>r + y[i] * Math.log(x), 0)
    const out = tensor.from(error, 'crossEntropy', [this]);
    out._back = ()=>{
        this.grad = this.data.map((x, i)=>y[i]-x);
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
   if (Number.isInteger(x) || Number.isNaN(x) || !Number.isFinite(x))
        return x;
    return x.toExponential(2).padStart(9, ' ')
}

function genId(){
    return ++_id;
}
let _id = 0;


//einops


const tests = [
    (check = 15)=>{
        const v = Tensor.from([1, 2, 3, 4, 5]);
        const res = tensor.einsum("i->", [v]);
        if (res.data !== check) throw new Error('Сумма всех значений вектора');
    },
    (check = 21)=>{
        const v = Tensor.from([[1, 2], [3, 4], [5, 6]]);
        const res = tensor.einsum("ij->", [v]);
        if (res.data !== check) throw new Error('Сумма всех значений матрицы');
    },
    (check = [9, 12])=>{
        const v = Tensor.from([[1, 2], [3, 4], [5, 6]]);
        const res = tensor.einsum("ij->j", [v]);
        for(let i = 0; i<check.length; i++){
            if (res.data[i] !== check[i]) throw new Error('Сумма значений по столбцам');
        }
    },
    (check = [3, 7, 11])=>{
        const v = Tensor.from([[1, 2], [3, 4], [5, 6]]);
        const res = tensor.einsum("ij->i", [v]);
        for(let i = 0; i<check.length; i++){
            if (res.data[i] !== check[i]) throw new Error('Сумма значений по строкам');
        }
    },
    (check = [[1, 3, 5], [2, 4, 6]])=>{
        const v = Tensor.from([[1, 2], [3, 4], [5, 6]]);
        const res = tensor.einsum("ij->ji", [v]);
        check = check.flat();
        for(let i = 0; i<check.length; i++){
            if (res.data[i] !== check[i]) throw new Error('Транспонирование');
        }
    },
    (check = [[5], [11], [17]])=>{
        const v1 = Tensor.from([[1, 2], [3, 4], [5, 6]]);
        const v2 = Tensor.from([[1, 2]]);
        const res = tensor.einsum("ij,kj->ik", [v1,  v2]);
        check = check.flat();
        for(let i = 0; i<check.length; i++){
            if (res.data[i] !== check[i]) throw new Error('Умножение матрицы на вектор');
        }
    },
    (check = [[1, 2], [3, 4], [5, 6]])=>{
        const v1 = Tensor.from([[1, 2], [3, 4], [5, 6]]);
        const v2 = Tensor.from([[1, 0], [0, 1]]);
        const res = tensor.einsum("ik,kj->ij", [v1,  v2]);
        check = check.flat();
        for(let i = 0; i<check.length; i++){
            if (res.data[i] !== check[i]) throw new Error('Умножение матрицы на матрицу');
        }
    },
    (check = 6)=>{
        const v1 = Tensor.from([[1, 2, 3]]);
        const v2 = Tensor.from([[1, 1, 1]]);
        const res = tensor.einsum("ik,jk->", [v1,  v2]);
        if (res.data !== check) throw new Error('Скалярное произведение векторов');
    },
    (check = 15)=>{
        const v1 = Tensor.from([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
        const res = tensor.einsum("ii->", [v1]);
        if (res.data !== check) throw new Error('След матрицы');
    },
    (check = [[1, 0, 0], [0, 5, 0], [0, 0, 9]])=>{
        const v1 = Tensor.from([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
        const v2 = Tensor.from([[1, 0, 0], [0, 1, 0], [0, 0, 1]]);
        const res = tensor.einsum("ij,ij->ij", [v1,  v2]);
        check = check.flat();
        for(let i = 0; i<check.length; i++){
            if (res.data[i] !== check[i]) throw new Error('Адамарово (покомпонентное) произведение');
        }
    },
    (check = [[1, 0, 0], [2, 0, 0], [3, 0, 0]])=>{
        const v1 = Tensor.from([1, 2, 3]);
        const v2 = Tensor.from([1, 0, 0]);
        const res = tensor.einsum("i,j->ij", [v1,  v2]);
        check = check.flat();
        for(let i = 0; i<check.length; i++){
            if (res.data[i] !== check[i]) throw new Error('Кронекерово (внешнее) произведение векторов');
        }
    },
    (check = [[[0, 1, 2], [1, 2, 3]], [[1, 2, 3], [2, 3, 4]], [[2, 3, 4], [3, 4, 5]]])=>{
        const v1 = Tensor.from([[[0, 1], [1, 2], [2, 3]], [[1, 2], [2, 3], [3, 4]], [[2, 3], [3, 4], [4, 5]]]);
        const res = tensor.einsum("ijk->jki", [v1]);
        check = check.flat().flat();
        for(let i = 0; i<check.length; i++){
            if (res.data[i] !== check[i]) throw new Error('Транспонирование тензора');
        }
    },
    (check = [[[2, 3], [5, 8], [8, 13]], [[5, 8], [8, 13], [11, 18]], [[8, 13], [11, 18], [14, 23]]])=>{
        const v1 = Tensor.from([[[0, 1], [1, 2], [2, 3]], [[1, 2], [2, 3], [3, 4]], [[2, 3], [3, 4], [4, 5]]]);
        const v2 = Tensor.from([[1, 2], [2, 3]]);
        const res = tensor.einsum("ijk,nk->ijn", [v1,  v2]);
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

tensor.einsums = {};
tensor.parse_shape = (expr, src)=>{
    const shape = src.shape;
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

tensor.rearrange = (expr, src)=>{
    //todo
}
tensor.reduce = (expr, src, agg_func = 'max')=>{
    //todo
}
tensor.repeat = (expr, src, vars = {})=>{
    //todo
}
tensor.pack = (expr, inputs)=>{
    //todo
}
tensor.unpack = (expr, inputs)=>{
    //todo
}
tensor.einsum = (in_expr, sources = [], ext_axis={})=>{
    const tensors = sources.map(t => tensor.from(t));
    let expr = in_expr.split('->');                            // Разделение выражения на вход и выход
    const axis = Object.keys(ext_axis).map(a =>({a, d:ext_axis[a]}));
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
    let outs = expr[1].trim().split('').map(a => {   // Разделение выходного терма на индексы и их анализ
        if(!a) return;
        let idx = axis.findIndex(v => v.a === a);
        if(idx < 0)
            throw new Error(`Unknown axis: '${a}'`);
        let ax = axis[idx];
        axis.splice(idx, 1);
        return ax;
    }).filter(i=>i)
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
        if(t.length){
            expr += `idx${i} = `;
            let m = ''
            for (let o of t.toReversed()){
                if (m)
                    expr += ' + ' + m;
                expr += o.a;
                m =  '_' + o.a +' * (';
            }
            expr += ')'.repeat(t.length - 1);
        }
        t.idx_expr = expr;
    })

    let out_for = outs.map((o, i) => {
        let axis_name = o.a;
        let tab = '\t'.repeat(i)
        let res = tab + `for(let ${axis_name} = 0; ${axis_name} < _${axis_name}; ${axis_name}++){`;
        return res
    }).join('\n')+'\n'
    const input_for_func = function (ts){
        const uses = outs.map(o => o.a);
        let result = ''
        let cl = 0;
        let tab = 0
        let tabs = out_tabs;
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
            if(input.idx_expr){
                result += tabs + input.idx_expr + ';\n';
                result += tabs+`v${i} = t${i}[idx${i}];\n`;
            }
            else
                result += tabs+`v${i} = t${i};\n`;
        })
        result += tabs + 'res += ' + inputs.map((_,i)=>'v'+i).join(` * `) + ';\n';
        result += Array(cl).fill('').map((c, i)=> out_tabs + '\t'.repeat(i) + '}').toReversed().join('\n')
        return result + '\n';
    }

    let body = '';
    body += input_for_func(inputs);
    body += out_tabs + `out.data${data_idx}`;
    body += ' = res;';

    let fwd_expr = vars + '\n';
    fwd_expr += out_for + '\n'
    fwd_expr +=  out_tabs + `let res = 0;`;
    fwd_expr += '\n' + body + '\n';
    fwd_expr += outs.map((_, i)=>'\t'.repeat(i)+'}').toReversed().join('\n');

    const data = outs.length?new Float32Array(outs.reduce((r,a)=> r * a.d, 1)):0;
    let out = tensor.from(data);
    out.reshape(outs.map(i=>i.d));
    out.children = tensors;
    const fn = new Function('t', 'out', fwd_expr);
    out._back = function (){
        out = tensor.from(out.grad).reshape(out);
        tensors.forEach((t, i)=>{
            if(!t.allowGrad) return;
            let expr =  inputs.map((tt, ii)=>{
                if(ii === i)
                    return outs.map(o=>o.a).join('');
                return tt.map(o=>o.a).join('');
            }).join(',') + '->' + inputs[i].map(i=>i.a).join('');
            let sources = tensors.map((tt,ii)=>{
                if(ii === i)
                    return out;
                return tt;
            })
            t.grad = tensor.einsum(expr, sources).data.map(d=>d / GRADIENT_DIVIDER);
        })
    }
    fn(tensors, out);
    out.label = 'einsum: \"'+in_expr+'\"' + (out.shape.length?(' ('+out.shape+')'):'');
    return out;
}