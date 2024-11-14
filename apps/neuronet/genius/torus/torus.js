globalThis.LEARNING_RATE = 0.1;
export class tensor/* extends Array*/{
    #data = null;
    dType = Float32Array;
    #src = undefined;
    #grad = undefined;
    #prev = undefined;
    #bins = undefined;
    #type = undefined;
    #shape_multipliers = undefined;
    isParam = false;
    backs = [];
    step = 0;
    id = genId();
    constructor(data, $ = {dType: Float32Array}) {
        $ = torus.$($)
        if(data === undefined)
            this.#data = new ($.dType)(0);
        else if (data?.$ === this.constructor.name){
            this.dType = globalThis[data.dType];
            this['#shape'] = data.shape;
            data = data.data.split(' ');
            this.#data = new this.dType(data);
        }
        else{

            if (Array.isArray(data)){
                let shape = [data.length];
                let next;
                while ((next = data[0]) && Array.isArray(next)){
                    shape.push(next.length);
                    data = data.flat();
                }
                if (next instanceof tensor){
                    $.dType = next.dType
                    shape.push(...next.shape);
                    let size = next.size;
                    next = new $.dType(shape.mul());
                    data = data.reduce((r, v, i)=>{
                        r.set(v.data, i * size);
                        return r
                    }, next);
                }
                else {
                    if(!(data instanceof $.dType))
                        data = new $.dType(data);
                }
                this['#shape'] = shape;
            }
            else if(this.dType === BinaryArray) {
                if (data?.length)
                    this['#shape'] = [data?.binLength];
            }
            else{
                if (data?.length === 1)
                    this['#shape'] = [1]
                else if (data?.length)
                    this['#shape'] = [data?.length]
                else if (!data?.buffer){
                    this['#shape'] = [1];
                    data = new this.dType([data])
                }

            }
            this.#data = data;
        }
        this.dType = this.data.constructor
    }
    _resize_data(data, ...shape){
        while (shape.some(i=>Array.isArray(i)))
            shape = shape.flat();
        const size = shape.mul();
        if (size !== data.length)
            throw new Error(`_shape from (${this.shape}) to (${shape}) not allow.`);
        this.#data = data;
        this['#shape'] = shape
        return this;
    }
    get out_map(){
        if(!this.allowGrad) return;
        if(this.isParam)
            return this['#out_map'] ??= {};
        return this.src.find(i => i.allowGrad)?.out_map;
    }
    get out(){
        return this.getOut();
    }
    getOut(src = this, add_key = ''){
        if(!this.allowGrad) return;
        const key = label_from_error()+ '.' + (src.map?.(t=>t.id).join('.') || src.id) + ' ' + add_key;
        return  this.out_map[key];
    }
    set out(n){
        this.setOut(n);
    }
    setOut(n, src = this, add_key = ''){
        if(!this.allowGrad) return;
        const key = label_from_error()+ '.' + (src.map?.(t=>t.id).join('.') || src.id) + ' ' + add_key;
        this.out_map[key] = n;
    }
    getPath(level = 0){
        let tab = '|'.repeat(level) + '|- '
        let path = [tab + this.label];
        let src = this.#src?.map(v=>v.getPath(level+1));
        if(src){
            path.push(...src.flat());
        }
        return path;
    }
    get path(){
        return this.getPath().join('\n');
    }
    get shape_multipliers(){
        return this.#shape_multipliers ??= this.shape.map((_,i)=> this.shape.slice(i+1).mul());
    }

    toJSON(){
        const result =  {
            $: this.constructor.name,
            label: this.label,
            shape: this.shape,
            isSerializable: this.isSerializable,
            isParam: this.isParam,
            dType: this.dType.name,
        }
        if (this.isDestroyed)
            result.data = 'DESTROYED';
        else
            result.data = this.data?.join(' ')
        return result;
    }
    _label(label){
        this['#label'] = label;
        return this;
    }
    _src(...src){
        this.#src = src.flat();
        return this;
    }
    get src(){
        return this.#src;
    }
    _dType(dType){
        if (this.dType !== dType){
            this.dType = dType;
            const data = new dType(this.data.length);
            let i = this.size;
            while(i--)
                data[i] = this.data[i];
            this.#data = data;
        }
        return this;
    }
    _data(data){
        this.#data = data;
        return this;
    }
    _param(){
        this.isParam = true;
        return this;
    }
    reshape(...shape){
        return this._shape(...shape);
    }
    _shape(...shape){ // shape or tensor
        shape = torus.flat(...shape);
        if(Object.equal(shape[0]?.constructor, tensor))
            shape = shape[0].shape;
        const size = shape.mul()
        if (size !== this.size)
            throw new Error(`_shape(${this.shape}) to (${shape}) not allow.`);
        this.#shape_multipliers = undefined;
        this['#shape'] = shape
        return this;
    }
    //inplace functions
    mul_(factor){
        this.#data = this.data.map(d=>d * factor);
        return this;
    }
    div_(factor){
        this.#data = this.data.map(d=>d / factor);
        return this;
    }
    plus_(factor){
        this.#data = this.data.map(d=>d + factor);
        return this;
    }
    minus_(factor){
        this.#data = this.data.map(d=>d - factor);
        return this;
    }
    get allowGrad(){
        return (this._back && !!this.src?.some(i=>i.allowGrad)) || this.isParam;
    }
    get data(){
        this.#data.__tensor__ = this.label;
        return this.#data;
    }
    set data(n){
        if (n.length !== this.size)
            throw new Error(`set data(n): dimension out of range (expected ${this.#data.length}, but got ${n.length})`);
        this.#data = n
        this.dType = this.#data.constructor;
    }
    set grad(n){
        this.#grad = n;
    }
    get BiTES_PER_ELEMENT(){
        return this.dType.BYTES_PER_ELEMENT * 8;
    }
    get bins(){
        return this.#bins ??= Array.prototype.map.call(this.data, d => d.toBin(this.BiTES_PER_ELEMENT)).join('').slice(0, this.size);
    }
    getBit(idx){
        return this.data.getBit(idx);
    }
    get T(){
        return this.transpose();
    }
    get g(){
        return tensor.from(this.grad)._shape(this);
    }
    get shape(){
        return this['#shape'] || [];
    }
    get size(){
        return this['#size'] ??= (this.shape.mul() || this.data.length); //У скаляров размерность 0, а количество элементов 1
    }
    get dim(){
        return this.shape.length;
    }
    get label(){
        return this['#label']
    }
    get type(){
        return this.#type ?? (()=>{
            switch (this.dim){
                case 0:{
                    if (!this.size)
                        return 'empty';
                    return `scalar`;
                }

                case 1:
                    return `vector`;
                case 2:
                    return `matrix`;
                default:
                    return `tensor`;
            }
        })();
    }
    get paramCount(){
        if (this.isParam)
            return this.size;
        return 0;
    }
    destroy(recurce = true){
        if(this.isParam) return;
        if (!this.data.length) return;
        this.data.buffer.transfer(0);
        this.isDestroyed = true;
        if (!recurce) return;
        if (!this.src?.length) return
        this.src.forEach(s=>s.destroy(recurce))
    }
    updateParams(){
        if (!this.isParam) return;
        if (this.dType === BinaryArray){
            let bins = this.bins;
            let data = this.data;
            let idx = 0;
            let val = '';
            let i = bins.length;
            while(i--){
                const rand = torus.generator();
                let g = this.grad[i]// * tensor.LEARNING_RATE;
                let value = bins[i];
                if (g !== 0){
                    let p = Math.max(0,Math.min(1,(g + 1)/2));
                    if (rand > p){
                        if (value === '1'){
                            if (p < .5)
                                value = '0'
                        }
                        else{
                            if (p > .5)
                                value = '1'
                        }
                    }
                }
                val += value;
                if (val.length === 64){
                    this.data[idx] = BigInt('0b'+val);
                    val = ''
                    idx++
                }
            }
            if (val.length){
                this.data[idx] = BigInt('0b'+val.padEnd(64, '0'));
            }
            this.#bins = undefined
        }
        else{

            let lr = torus.LEARNING_RATE
            let gamma = torus.generator();
            lr = 1 - gamma;
            let i = this.data.length;
            while(i--){
                let prev = this.prev[i] * gamma;
                let change = prev + this.grad[i] * lr;
                this.data[i] += change;
                this.prev[i] = change
            }
        }
    }
    get prev(){
        return this.#prev ??= new Float32Array(this.size);
    }
    update_grad(grad){
        if (!this.isParam){
            this.data.set(grad); // todo обновление с приращением!!!
        }
        else{
            let lr = torus.LEARNING_RATE
            let i = this.size;
            while (i--){
                let change = grad[i] * lr;
                this.data[i] += change;
            }
        }
    }
    back(grad){
        let topo = [];
        let visited = new Set();
        let build_topo = (t) => {
            if (!visited.has(t)) {
                visited.add(t)
                t.src?.forEach(ch => build_topo(ch))
                topo.push(t)
            }
        }
        build_topo(this);
        topo.reverse();
        if(grad){
            topo[0].grad = grad;
        }
        topo.forEach((node, index) => {
            if (!node.src) return;
            node._back?.();
            if (node.isParam) return;
            node.data.fill(0);
        })
    }



    static get generator(){
        return torus.__random_generator__;
    }
    static manual_seed(seed){
        if(seed){
            const gen = pseudoRandom(seed)
            torus.__random_generator__ = ()=>{
                return (gen.next().value / 2147483647);
            };
        }
        else
            torus.__random_generator__ = Math.random
        return torus.__random_generator__;
    }
    static stack(tensors, dim = 0){
        let first = tensors[0];

        if (((dim > 0)?(first.dim < dim):((first.dim + dim)<-1)))
            throw new Error(`torus.stack(): dimension out of range (expected to be in range of [-${dim+1}, ${dim}], but got ${dim})`);
        let shape = [tensors.length];
        let next;
        while ((next = tensors[0]) && Array.isArray(next)){
            shape.push(next.length);
            tensors = tensors.flat();
        }
        let dType = first.dType;
        let size = first.size;
        let step = size;
        if (dim < 0)
            dim += first.dim + 1
        let d = dim;
        for (let s of first.shape){
            if (!d) break;
            step /= s;
            d--;
        }
        const data = new dType(shape.mul() * size);
        let idx = -1;
        for (let i = 0; i < size; i += step){
            let delta = i + step;
            for (let j = 0; j < tensors.length; j++){
                let t = tensors[j];
                for (let d = i; d<delta; d++){
                    data[++idx] = t.data[d];
                }
            }
        }
        const out = tensor.from(data)._shape(...shape,  ...first.shape)._label(`stack(${tensors.length} tensors with shape(${first.shape}) by ${dim} axis)`)._src(tensors);
        out._back = ()=>{
            idx = -1;
            for (let i = 0; i < size; i += step){
                let delta = i + step;
                for (let j = 0; j < tensors.length; j++){
                    let t = tensors[j];
                    for (let d = i; d<delta; d++){
                        t.grad[d] = out.grad[++idx];
                    }
                }
            }
        }
        return out
    }
    static cross_entropy(tensor, target) {
        return tensor.crossEntropy(target);
    }

    static from(data, $){
        if (Object.equal(data?.constructor, tensor))
            return data;
        return new tensor(data, $);
    }
    static tensor(data, $){
        return torus.from(...arguments);
    }
    static param(src){
        src = tensor.from(src);
        src.isParam = true;
        src.isSerializable = true;
        return src;
    }
    static flat(...shape){
        // while(shape.some(Array.isArray))
        //     shape = shape.flat();
        // return shape;
        return shape.flat(Infinity);
    }
    reverse(dim = 0){
        if (-this.dim > dim || this.dim - 1 < dim)
            throw new Error(`tensor.reverse(${dim}): dimension out of range (expected to be in range of [-${this.dim}, ${this.dim - 1}], but got ${dim})`)
        if (dim < 0)
            dim += this.dim;


        this.data.reverse();

        return this;
    }
    repeat(...repeat_shape){
        if (repeat_shape.length === 1){
            if (Number.isInteger(repeat_shape[0])){
                repeat_shape = [repeat_shape[0]];
            }
            else if (Array.isArray(repeat_shape[0])){
                repeat_shape = repeat_shape[0];
            }
        }
        const multiply = repeat_shape.mul();
        const new_size = this.size * multiply;
        let data = new this.dType(new_size);
        const old_size = this.data.length;
        for (let i = 0; i < old_size; i++){
            let d = this.data[i]
            for (let m = i; m < new_size; m += old_size){
                data[m] = d;
            }
        }
        this.#data = data;
        this._shape([...repeat_shape, ...this.shape]);
        return this;
    }
    toString(step = 0, max = 8){
        let data = this.array.toTensorString(step, max, this.shape, this.dType).split('\n');
        data = data.join('\n');
        let tab = ('  ').repeat(step)
        let result  = tab + this.type + ` ${this.label}: `;
        if (this.dim)
            result += `shape(${this.shape}), size(${this.size.toLocaleString()}), ${this.dType.name}, ${this.backs.join(',')}\n${tab}(${data})`;
        else
            result += `${this.dType.name}, ${this.backs.join(',')}\n${tab}(${data.replaceAll('[', '').replaceAll(']', '').trim()})`;
        if (this.isParam)
            result = tab + 'Parameter containing:\n'+result;
        return result + '\n';
    }
    get array() {
        if(this.shape.length<2)
            return [this.data];
        let data;
        if (this.dType === BinaryArray)
            data = this.bins.match(/0|1/g).map(i=>i==='1'?1:-1);
        else
            data = Array.from(this.data);
        let res = [];
        const shape = Array.from(this.shape);
        let s
        while (s = shape.pop()){
            const size = data.length;
            for (let i = 0; i < size; i += s){
                res.push(Array.from(data.slice(i, i + s)))
            }
            data = res;
            res = [];
        }
        return data.flat();

    }
    static get LEARNING_RATE() {
        return globalThis.LEARNING_RATE
    }
    static set LEARNING_RATE(n) {
        globalThis.LEARNING_RATE = n
    }
}
export const tt = tensor;
export const torus = tensor;
torus.__random_generator__ = Math.random;
function* pseudoRandom(seed) {
    let value = seed * 16807 % 2147483647

    while(true) {
        value = value * 16807 % 2147483647

        yield value;
    }

}
// let generator = pseudoRandom(1);

torus.prototype.item = function (...shape){
    shape = torus.flat(...shape);
    //todo
}

torus.genVarsArray = function(size, upper = false){
    let char_code = upper?65:97;
    return Array(size).fill().map((_,i)=>String.fromCharCode(i + char_code))
}

torus.prototype.dot = function (other){
    let expr, max_d = Math.max(this.dim, other.dim);
    if(other.dim < 2){
        const vars = torus.genVarsArray(max_d);
        vars.pop();
        const key = '$'
        const out = vars.join('');
        expr = out + key + ', ' + key + ' -> ' + out;
    }
    else{
        const t_vars = torus.genVarsArray(this.dim);
        const o_vars = torus.genVarsArray(other.dim, true);
        const t_shape = this.shape.toReversed();
        const o_shape = other.shape.toReversed();
        const outs = ['A'];
        if(this.dim>1)
            outs.push('b');
        for(let i = 2; i<max_d+1; i++){
            let t_axis = t_vars[i] || '';
            let o_axis = o_vars[i] || '';
            let t_dim = t_shape[i] || 0;
            let o_dim = o_shape[i] || 0;
            let axis = t_axis || o_axis;
            if(t_dim === o_dim)
                o_vars[i] = axis;
            else if(t_dim > o_dim)
                axis = t_axis;
            else
                axis = o_axis;
            outs.push(axis);
        }
        t_vars[0] = o_vars[1] = '$';
        expr = t_vars.reverse().join('') + ', ' + o_vars.reverse().join('') + ' -> ' + outs.reverse().join('');
    }
    const out = torus.einsum(expr, [this, other]);
    out._label('dot product ('+expr+')');
    return out;
}


torus.prototype.findIndex = function(...indeces){
    indeces = torus.flat(indeces);
    return indeces.reduce((r, v, i)=> (r + v * this.shape_multipliers[i]), 0)
}
torus.prototype.item = function(...indeces) {
    return this.get(...indeces)
}
torus.prototype.get = function(...indeces){
    indeces = torus.flat(indeces);
    const idx = indeces.reduce((r, v, i)=> (r + v * this.shape_multipliers[i]), 0)
    if(!indeces.length  || indeces.length === this.shape_multipliers.length)
        return this.data[idx];
    return this.data.slice(idx, idx + this.shape_multipliers.slice(indeces.length-1).mul())
}
torus.prototype.set = function(value, ...indeces){
    indeces = torus.flat(indeces);
    const idx = indeces.reduce((r, v, i)=>(r + v * this.shape_multipliers[i]), 0)
    this.data.set(value.data || torus.flat(value), idx);
}


torus.prototype.log_ = function (){
    let i = this.data.length
    while(i--){
        this.data[i] = Math.log(this.data[i]);
    }
    return this;
}

torus.prototype.allclose = function(other, rtol = 1e-05, atol = 1e-08, equal_nan = false ){
    const fn = equal_nan?(r, y, i)=>(r && (this.data[i] || 0) - (y || 0) <= atol + rtol * (y || 0)):((r, y, i)=>r && this.data[i] - y <= atol + rtol * y)
    return other.data.reduce(fn, true);
}

torus.prototype.masked_fill = function(other, value = 0, mask = 0){
    const h = `(x,y) => y === ${mask}?${value}:x`;
    return this._element_wise_operator(other, h);
}

torus.prototype.plus = function (other){
    return this._element_wise_operator(other, {forward: '(x, y) => x + y', backward_0: '(g) => g',  backward_1:'(_, g) => g'});
}
torus.prototype.minus = function (other){
    return this._element_wise_operator( other, {forward: '(x, y) => x - y', backward_0: '(g) => g', backward_1: '(_, g) => -g'});
}
torus.prototype.multiply = function (other){
    return this._element_wise_operator(other, {forward:  '(x, y) => x * y', backward_0: '(g, y) => g * y', backward_1: '(x, g) => x * g'});
}
torus.prototype.divide = function (other){
    return this._element_wise_operator(other, {forward: '(x, y) => x / y', backward_0: '(g, y) => g / y', backward_1: '(x, g) => -x / (g ** 2)'});
}
torus.prototype.pow = function (other){
    return this._element_wise_operator(other, {forward:  '(x, y) => x ** y', backward_0: '(g, y) => y * (g ** (y - 1))', backward_1: '(x, g) => x ** g * Math.log(x)'});
}
torus.$ = function (...$){
    return Object.assign({keepdim: false, dType: Float32Array, out: null}, ...$)
}
torus.prototype.softmax = function (dim = -1, $ = {}){
    $ = torus.$($);
    const step = this.shape[this.shape.length-1];
    const size = this.size/step;
    const exps = this.data.map(Math.exp);
    let out = this.out;
    const data = out?.data || new Float32Array(this.size);
    for (let x = 0; x<size; x++){
        let sum = 0;
        for (let y = 0; y<step; y++){
            sum += exps[y + step * x];
        }
        for (let y = 0; y<step; y++){
            let idx = y + step * x;
            data[idx] = exps[idx]/sum;
        }
    }
    if(!out){
        out =  tensor.from(data)._src(this)._label('softmax')._shape(this);
        out._back = ()=>{
            for (let x = 0; x<size; x++) {
                for (let y = 0; y < step; y++) {
                    let idx = y + step * x;
                    let d = data[idx];
                    let sum = data.reduce((r, sj, j) => {
                        let v = (y === j) ? d * (1 - d) : -d * sj;
                        return r + v
                    })
                    this.grad[idx] += sum * out.grad[idx];
                }
            }
        }
        this.out = out;
    }
    return out;
}
torus.prototype.maxIndex = function () {
    let step = this.shape.last;
    let data = new Uint8Array(this.size / step);
    let idx = -1;
    for (let i = 0; i<this.size; i+=step){
        const slice = this.data.slice(i, i + step)
        const max = Math.max(...slice);
        data[++idx] = slice.indexOf(max);
    }
    const out = tensor.from(data)._label('maxIndex')._shape(this.shape.slice(0, -1));
    return out;
}

torus.prototype.hardmax = function (){
    const step = this.shape[this.shape.length-1];
    const size = this.size/step;
    const data = new Float32Array(this.size);
    for (let x = 0; x<size; x++){
        let max = undefined;
        let idx;
        for (let y = 0; y<step; y++){
            let v = this.data[y + step * x];
            if (max === undefined || max < v){
                idx = y
                max = v;
            }
        }
        for (let y = 0; y<step; y++){
            data[y + step * x] = (idx === y)?1:0;
        }
    }
    const out =  tensor.from(data)._src(this)._label('hardmax')._shape(this);
    // out._back = ()=>{
    //     for (let x = 0; x<size; x++) {
    //         for (let y = 0; y < step; y++) {
    //             let idx = y + step * x;
    //             let d = data[idx];
    //             let sum = data.reduce((r, sj, j) => {
    //                 let v = (y === j) ? d * (1 - d) : -d * sj;
    //                 return r + v
    //             })
    //             this.grad[idx] += sum * out.grad[idx];
    //         }
    //     }
    // }
    return out;
}
torus.prototype.MSE = function (target){
    target = tensor.from(target);
    let y = target.data;
    if (target.size>this.size)
        throw new Error(`tensor.MSE(): size of target (${target.size}) must be less then size of source (${this.size})`);
    for (let i = 0; i<target.shape.length; i++){
        let target_dim = target.shape[target.shape.length - 1 - i];
        let this_dim = this.shape[this.shape.length - 1 - i];
        if (this_dim === undefined)
            throw new Error(`tensor.MSE(): size of target (${target.size}) must be less then size of source (${this.size})`);
        if (target_dim !== undefined && target_dim > this_dim)
            throw new Error(`tensor.MSE(): dimension (${target.shape.length - 1 - i} = ${target_dim}) of target must be equal with dimension (${this.shape.length - 1 - i} = ${this_dim}) of source`);
    }
    let step = this.shape.last;
    let errors = Array(this.size/step).fill().map((d, i)=>{
        let start = i * step
        let slice = this.data.slice(start, start + step);
        let y = start<target.size?target.data.slice(start, start + step):target.data.slice(0, step);
        let errors = Array.prototype.map.call(slice, (x, j)=>{
            return y[j] - x;
        });
        return errors
    })
    let losses = errors.map(i=>{
        return i.reduce((r, v) => r + (v**2), 0)/(i.length || 1);
    })
    const out = tensor.from(losses)._src(this)._label(`MSE (${this.shape})`);
    errors = errors.flat();
    out._back = ()=>{
        let i = this.grad.length;
        while (i--){
            this.grad[i] += errors[i];
        }
    }
    return out;
}

torus.prototype.repeat = function (count = 1) {
    return tensor.from(Array(count).fill().map(i=>this));
}


torus.prototype.crossEntropy = function (target) {
    if(this.label !== 'softmax'){
        return this.softmax().crossEntropy(target);
    }
    target = torus.tensor(target);
    const step = this.shape.last;
    const size = this.size/step;
    let ys = target.data;

    if (target.size === this.size)
        ys = ys.reduce((r,v,i)=>{
            if(v) r.push(i%step);
            return r;
        }, [])

    let data = this.data;
    let grad = data.map(x=>-x);
    let loss = Array.prototype.map.call(ys, (y, i) => {
        let idx = i * step + y;
        grad[idx] += 1;
        return Math.log(data[idx])
    })
    loss = -loss.avg();
    let out = this.out;
    if(!out){
        out = torus.tensor([loss])._src(this)._label('crossEntropy');
        this._back = ()=>{
            this.src.forEach(src => src.update_grad(grad));
        }
        this.out = out;
    }
    out.data[0] = loss;
    return out;
}

if (!Array.prototype.toTensorString) {
    Object.defineProperty(Array.prototype, 'toTensorString', {
        configurable:true,
        enumerable:false,
        value (step = 0, max = 4, shape = [], dType = Float32Array) {
            let float_type = dType.name[0] === 'F'
            function recurse(d, idx = 0, l = 0){
                let result = (idx?`\n${('  ').repeat(step)+(' ').repeat(l)}[`:'[');
                if (d[0]?.map){
                    let list = Array.from(d).map((v, i)=>{
                        return recurse(v, i, l + 1)
                    })
                    result += list.join(',');
                }
                else{
                    if (d.length > max){
                        const showing = Math.floor(max/2);
                        result += Array.from(d.slice(0, showing)).map(x=>{
                            return  num2text(x, float_type);
                        }).join(',') ;
                        result +=  `,  ...,`;
                        result +=  Array.from(d.slice(-showing)).map(x=>{
                            return num2text(x, float_type);
                        }).join(',');
                    }
                    else{
                        result += Array.from(d).map(x=>{
                            return num2text(x, float_type);
                        }).join(',') || num2text(d, float_type);
                    }
                }

                result = result + ']';
                return result;
            }
            let res = recurse(this);
            res = res.slice(1, -1);
            res = res.replaceAll(']],', ']],\n')
            return res;
        }
    } )
}
let max = 8;
function num2text(x, float_type = false){

    let num = Math.abs(x) > 10000?x.toExponential((x >= 10000000000)?1:2):x.toString();
    let repeat = (num[0] === '-')?1:2;
    if (!Number.isFinite(x))
        num = num.substring(0, 5 - repeat)
    num = ' '.repeat(repeat) + num;
    if (!Number.isInteger(x) && !Number.isNaN(x) && Number.isFinite(x))
        num = num.substring(0, max).padEnd(max, '0');
    else{
        if (Number.isInteger(x) && float_type)
            num+='.';
        num = num.padStart(max, ' ');
    }

    return num
}

function genId(){
    return ++_id;
}
let _id = 0;

tensor.cosSimilar = (A, B) => {
    if (A && B) {
        A = A.emb || A
        A = tensor.from(A).data;
        B = B.emb || B
        B = tensor.from(B).data;
        let scalar = 0;
        let avgA = 0;
        let avgB = 0;
        let a, b
        let i = A.length;
        while (i--){
            a = A[i];
            b = B[i];
            scalar += a * b;
            avgA += a * a;
            avgB += b * b;
        }
        if(scalar){
            avgA = Math.sqrt(avgA);
            avgB = Math.sqrt(avgB);
            scalar /= avgA * avgB;
            return Math.abs(scalar);
        }
    }
    return 0;
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


systems:{
    torus.async = (handler)=>{
        return new Promise(resolve=>{
            setTimeout(()=>{
                handler();
                resolve()
            })
        })
    }
    Object.defineProperty(torus.prototype, 'shape_info', {
        configurable: true,
        get(){
            return this['#shape_info'] ??= (()=>{
                let stride, c, m = 1;
                return this.shape.toReversed().map((dim, idx)=>{
                    stride = m;
                    m *= dim;
                    let char = String.fromCharCode(idx + 97);
                    idx = this.dim - idx - 1;
                    return {stride, dim, char, idx};
                }).toReversed();
            })()
        }
    })
    Object.defineProperty(torus.prototype, 'strides', {
        configurable: true,
        get(){
            let m = 1;
            return this.shape.toReversed().map((dim)=>{
                let s = m;
                m *= dim;
                return s;
            }).toReversed();
        }
    })
    torus.prototype.check_dim = function (dim){
        if (-this.dim > dim || this.dim - 1 < dim)
            throw new Error(`tensor.check_dim((dim = ${dim}): dimension out of range (expected to be in range of [-${this.dim}, ${this.dim - 1}], but got ${dim})`);
        if (dim < 0)
            dim += this.dim;
        return dim;
    }
    torus.prototype.dims_info = function(...dims){
        dims = torus.flat(dims);
        let shape_info = this.shape_info;
        return dims.reduce((r, d, idx)=>{
            idx = this.check_dim(d);
            let v = shape_info[idx];
            r.add(v)
            return r
        }, []).sort((a,b)=>{
            return a.idx<b.idx?-1:1
        })
    }
    torus.fill = (shape, value_or_handler, $ = {}) => {
        $ = torus.$($)
        shape = torus.flat(shape);
        let handler = typeof value_or_handler === 'function' ? value_or_handler : i => value_or_handler;
        let size = shape.mul();
        let data = new $.dType(size);
        data = data.map(handler);
        if(!data.length)
            shape = []
        else if (!shape.mul())
            shape = [1]
        return torus.from(data, $)._shape(shape);
    }
    torus.prototype._element_wise_operator = function (other, $ = {forward: '', backward_0: '', backward_1: ''}){
        $ = torus.$($);
        other = torus.from(other);
        let max_d = Math.max(this.dim, other.dim);
        const t_vars = torus.genVarsArray(this.dim);
        const o_vars = torus.genVarsArray(other.dim, true);
        const t_shape = this.shape.toReversed();
        const o_shape = other.shape.toReversed();
        const outs = [];
        for(let i = 0; i<max_d; i++){
            let t_axis = t_vars[i] || '';
            let o_axis = o_vars[i] || '';
            let t_dim = t_shape[i] || 0;
            let o_dim = o_shape[i] || 0;
            let axis = t_axis || o_axis;
            if(t_dim === o_dim)
                o_vars[i] = axis;
            else if(t_dim > o_dim)
                axis = t_axis;
            else
                axis = o_axis;
            outs.push(axis);
        }
        let expr = (t_vars.reverse().join('') || '$') + ', ' + (o_vars.reverse().join('') || '$') + ' -> ' + outs.reverse().join('');
        const out = torus.einsum(expr,  [this, other], $);
        out._label(label_from_error() + ' ('+expr+')');
        return out;
    }
    torus.prototype._element_wise_function = function ($ = {forward: '', backward_0: ''}){
        $ = torus.$($);
        const forward = eval($.forward);
        let label = label_from_error();
        let out = $.out || this.getOut(this, label);
        if(out){
            let i = this.size;
            while(i--){
                out.data[i] = forward(this.data[i])
            }
        }
        else{
            const data = this.data.map(forward);
            out = torus.from(data)._src(this)._shape(this);
            out._label(label+' ('+out.shape+')');
            if (this.allowGrad && $.backward_0){
                out._back = ()=>{
                    const backward = eval($.backward_0);
                    let i = this.size;
                    while(i--){
                        this.grad[i] += backward(this.data[i], out.data[i]) * out.grad[i];
                    }
                }
            }
            this.setOut(out, this, label);
        }
        return out;
    }
}
einops:{

    torus._einops_parse = (expression) => {
        const test_subscr = (subs = '', side)=>{
            subs = subs.trim()
            while(subs.includes('..'))
                subs = subs.replace('..', '.');
            while(subs.includes(' '))
                subs = subs.replace(' ', '');
            let expr = side === 'vars' ? /([a-zA-Z]=\d*,?)+/g : /([a-zA-Z]+)|\.?/g;
            if(subs.length && !subs.match(expr))
                throw new Error(`torus.einops_parse('${expression}'): invalid ${side} subscript '${subs}' given in the equation string, subscripts must be in ${expr}`);
            return subs;
        }
        const parts = expression.split('->');
        let inputs = parts[0].trim().split(',').map((subs,i)=>{
            subs = test_subscr(subs, ('input['+i+']'));
            return subs.split('');
        });
        const out_parts = (parts[1] || '').trim().split(':');
        let vars = test_subscr(out_parts[1], 'vars').split(',').filter(Boolean).reduce((r,v)=>{
            v = v.split('=');
            r[v[0]] = +v[1]
            return r;
        }, {});

        let output = test_subscr(out_parts[0], 'output').split('').map((subs, i, outputs)=>{
            if(!inputs.some(i=>i.some(i=>i === subs)) && !vars[subs])
                throw new Error(`torus.einops_parse('${expression}'): output subscript '${subs}' in expression '${expression}' does not appear in the equation for any input or variable operand.`)
            if(outputs.filter(o=>o === subs).length>1)
                throw new Error(`torus.einops_parse('${expression}'): output subscript '${subs}' in expression '${expression}' appears more than once in the output.`)
            return subs;
        })
        return {inputs, output, vars}
    }
    torus.einsum = (expression, tensors = [], $ = {turbo: false})=>{
        tensors = torus.flat(tensors);
        $ = torus.$({forward: '', backward_0: ''}, $);
        const shapes = tensors.map(i=>i.shape);
        let key = expression + ': [' + shapes.join(']-[') + '] ' + JSON.stringify($);
        let inputs, out_shape, output;
        let fn = fn_cache?.einsum?.[key];
        if (!fn){
            const subscrs = torus._einops_parse(expression);
            if(subscrs.inputs.length > tensors.length)
                throw new Error(`torus.einsum('${expression}'): fewer tensors were provided than specified in the equation`);
            else if(subscrs.inputs.length < tensors.length)
                throw new Error(`torus.einsum('${expression}'): number of einsum subscripts (${subscrs.inputs.length}), must be equal to the number of tensors (${tensors.length})`);
            subscrs.axes = Object.create(null);
            let m = 1;
            inputs = shapes.map((shape, s)=>{
                let subs = subscrs.inputs[s];
                if(subs.includes('.')){// с точкой
                    if(!subscrs.dots){
                        const axes = [...subscrs.inputs.flat(), ...subscrs.output];
                        subscrs.dots = [];
                        let sp = shape;
                        if(subs.first === '.'){
                            subs.shift();
                            sp = sp.toReversed();
                            subs.reverse();
                        }
                        else if(subs.last === '.'){
                            subs.pop();
                        }
                        else
                            throw new Error(`torus.einsum('${expression}'): dots cannot be between operators`)
                        let char = 97;
                        subs = sp.map((_, i)=>{
                            let s = subs[i];
                            if(!s){
                                while((s = String.fromCharCode(char++)) && axes.includes(s));
                                subscrs.dots.push(s);
                            }
                            return s;
                        });
                        if(sp !== shape){
                            subscrs.dots
                            subs.reverse();
                        }
                        subscrs.inputs[s] = subs;
                    }
                    else{
                        const idx = subscrs.inputs[s].indexOf('.');
                        subscrs.inputs[s].splice(idx, 1, ...subscrs.dots);
                    }


                }
                else if(shape.length != subs.length)
                    throw new Error(`torus.einsum('${expression}'): number of tensors in '${subs}' (${subs.length}), must be equal to the number of dimentions [${shape}] (${tensors.length})`);

                let m = 1;
                let input = shape.map((d, i)=>{
                    const n = subs[i];
                    const old = subscrs.axes[n];
                    if(old && old != d)
                        throw new Error(`torus.einsum('${expression}'): subscript '${n}' has size ${d} for tensor ${s} which does not broadcast with previously seen size ${old}`);
                    subscrs.axes[n] = d;
                    return {n, d}
                }).toReversed().map((ax)=>{
                    ax.s = m;
                    m *= ax.d;
                    return ax;
                }).toReversed();
                return input
            })


            if(subscrs.output.includes('.')){ // замена точек в выходе
                if(!subscrs.dots)
                    throw new Error(`torus.einsum('${expression}'): dots must be declared in the input operands`);
                let idx = subscrs.output.indexOf('.');
                subscrs.output.splice(idx, 1, ...subscrs.dots);
            }
            output = subscrs.output.map(n=>({n, d: subscrs.axes[n] || subscrs.vars[n]}));
            // let out_expr = subscrs.output.join('');
            let code = '';
            let ins = inputs.flat().reduce((r,a)=>{
                r.add(a.n);
                return r;
            },[]);
            if(subscrs.inputs.length > 1 && ins.length>output.length && $.turbo){
                const exprs = [];
                code += inputs.map((input, i)=>{
                    let out_expr = subscrs.output.filter(o=>input.some(ai=>o === ai.n)).join('');
                    exprs.push(out_expr);
                    let expr = input.map(a=>a.n).join('')+'->'+out_expr;
                    // let over = output.filter(ao=>!input.some(ai=>ai.n === ao.n));
                    // if(over.length){
                    //     expr+=':'+over.map(a=>a.n+'='+a.d).join(',');
                    // }
                    return `let out${i} = torus.einsum('${expr}', t[${i}]);\n`
                }).join('');
                let expr = exprs.join(',')+'->'+output.map(a=>a.n).join('');
                $.turbo = true;
                code += `return torus.einsum('${expr}', [${inputs.map((_,i)=>'out'+i).join(',')}], ${JSON.stringify($)});\n`
            }
            else{
                code = tensors.map((tensor, i)=>`let val_${i}, data_${i} = t[${i}].data;\n`).join('');
                const func = $.forward || '('+tensors.map((_, i)=>'v'+i).join(',')+')=>'+tensors.map((_, i)=>'v'+i).join(' * ');
                let size = output.map(a=>a.d).mul() || 1;
                code += `let using = t.filter(i=>i.allowGrad);\n`;
                code += `let main = using[0];\n`;
                code += `let out = main?.getOut(using, '${expression}') || torus.tensor(new Float32Array(${size}))._src(t)._shape(${output.length?output.map(a=>a.d):1})._label('${'einsum: ' + expression}');\n`;
                code += `let out_data = out.data;\n`;
                code += `let func = eval(${func});\n`

                const axes = [];
                m = 1;
                output = output.toReversed().map(axo=>{
                    axo.s = m;
                    m *= subscrs.axes[axo.n] || subscrs.vars[axo.n];
                    return axo;
                }).toReversed().filter(a=>!subscrs.vars[a.n]);
                code += output.map((out, o)=>{
                    axes.push(out.n);
                    let tab = ' '.repeat(axes.length * 2);
                    let s1 = '';
                    inputs.forEach((input, i)=>input
                    .forEach(a=>{
                        if(a.n === out.n)
                            s1 += `, _${a.n}${i} = 0`;
                    }))
                    let s2 = '';
                    inputs.forEach((input, i)=>input
                    .forEach(a=>{
                        if(a.n === out.n)
                            s2 += `, _${a.n}${i} += ${a.s/* || 1*/}`;
                    }))

                    let expr = tab + `for(let ${out.n} = 0, ${out.n}_ = 0${s1}; ${out.n}<${out.d}; ${out.n}++, ${out.n}_ += ${out.s}${s2}){\n`;
                    return expr;
                }).join('');

                let tab = ' '.repeat(axes.length * 2);
                code += tab + `  let sum = 0;\n`;
                inputs.forEach((input, i)=>{
                    input.forEach(inp=>{
                        if(axes.includes(inp.n)) return;
                        axes.push(inp.n);
                        let tab = ' '.repeat(axes.length * 2);
                        let s1 = ''
                        inputs.forEach((input, i)=>input
                        .forEach(a=>{
                            if(a.n === inp.n)
                                s1 += `, _${a.n}${i} = 0`;

                        }))
                        let s2 = '';
                        inputs.forEach((input, i)=>input
                        .forEach(a=>{
                            if(a.n === inp.n)
                                s2 += `, _${a.n}${i} += ${a.s/* || 1*/}`;
                        }))
                        code += tab + `for(let ${inp.n} = 0 ${s1}; ${inp.n}<${inp.d}; ${inp.n}++ ${s2}){\n`;
                    })
                    let tab = ' '.repeat(axes.length * 2);
                })
                tab = ' '.repeat(axes.length * 2);
                inputs.forEach((input, i)=>{
                    code += tab + `  val_${i} = data_${i}[${input.map(ax=>'_'+ax.n+i).join(' + ')}];\n`;
                })
                code += tab + `  sum += func(${inputs.map((_,i)=>'val_'+i).join(', ')});\n`;

                axes.forEach((out, o)=>{
                    let idx = axes.length - o;
                    if(idx === output.length)
                        code += ' '.repeat(2 * idx) + `  out_data[${output.map(ax=>ax.n+'_').join(' + ')}] = sum;\n`;
                    code +=' '.repeat(2 * idx)+`}\n`
                });

                if(!output.length){
                    code += `  out_data[0] = sum;\n`;
                }

                code += `if(main) main.setOut(out, using, '${expression}');\n`
                code += 'return out;\n'
            }
            // >code
            fn = new Function('t', code);
            fn = (fn_cache.einsum[key] = {fn, out_shape, inputs, output}).fn;
        }
        else{
            out_shape = fn.out_shape;
            inputs = fn.inputs;
            output = fn.output;
            fn = fn.fn
        }
        let out;
        try{
            out = fn(tensors);
        }
        catch(e){
            throw new Error(`SubcodeError torus.einsum('${expression}'):\n`+e.message + '\n' + e.stack)
        }

        out._back = function (){
            const out_res = []
            tensors.forEach((t, i)=>{
                if(!t.allowGrad) return;
                const in_vars = inputs.map((input, ii)=>{
                    if(ii === i)
                        return output.map(ax=>ax.n).join('');
                    return input.map(ax=>ax.n).join('');
                })
                let out_vars = inputs[i].map(i=>i.n);
                let adds = inputs[i].filter(ax=>!in_vars.some(i => i.includes(ax.n)))
                let expr = in_vars.join(',')  + '->' + out_vars.join('');
                if (adds.length)
                    expr += JSON.stringify(adds.map(a=>{
                        delete a.used;
                        return a;
                    }));
                let sources = tensors.map((tt,ii)=>{
                    if(ii === i)
                        return out;
                    return tt;
                })
                $.forward = $['backward_'+ i]?.toString();
                let out_back = torus.einsum(expr, sources, $);
                out_res.push(out_back);
                this.update_grad(out_back.data);
            })
            return out_res;
        }
        return out;
    }
}
generators:{

// ФУНКЦИИ ГЕНЕРАТОРЫ
    torus.hippo = (size)=>{
        const data = Array(size).fill().map((_,n)=>{
            return Array(size).fill().map((_,k)=>{
                if (n>k)
                    return -Math.sqrt(2 * n + 1) * Math.sqrt(2 * k + 1);
                if(n === k)
                    return -(n + 1);
                return 0
            })
        })
        return tensor.from(data)._label('hippo');
    }

    torus.rand_n = (...shape)=>{
        const handle = ()=>{
            return Math.sqrt(-2 * Math.log(torus.generator())) * Math.cos((2 * Math.PI) * torus.generator())
        }
        return torus.fill(shape, handle, Float32Array)._label(`rand_n`);
    }
    torus.zeros_like = (pattern) => {
        return torus.zeros(pattern.shape);
    }
    torus.ones_like = (pattern) => {
        return torus.ones(pattern.shape);
    }

    torus.rand_int = (min_or_max = 0, max, ...shape)=>{
        shape = torus.flat(shape)
        if(max === undefined){
            max = min_or_max;
            min_or_max = 0;

        }
        if(max <= min_or_max)
            throw new Error('torus.rand_int(min_or_max = ${min_or_max}, max = ${max}, ...shape = [${shape}]): max <= min');
        if (shape.length === 0)
            shape = [Math.round(max - min_or_max)];
        const data = new Int32Array(shape.mul() || 1).map(i=>{
            const r = torus.generator();
            return Math.round(r * (max - min_or_max) + min_or_max);
        });
        return new torus(data, Int32Array)._shape(shape)._label(`rand_int ${min_or_max}-${max}`);
    }
    torus.rand_bin = (...shape) => {
        const handler = ()=>{
            let value = torus.generator().toString(2).substring(2);
            return BigInt('0b' + value.padEnd(64, value))
        }
        return torus.fill(...shape, handler, BinaryArray)._label('rand_bin');
    }

    // FINAL


    torus.arange = (from_or_size = 0, to, ...step_or_shape)=>{
        step_or_shape = torus.flat(step_or_shape);
        let step, steps;
        let label = 'arange';
        if (to === undefined) {   //Если у метода один параметр — размер прогрессии
            to = from_or_size;
            from_or_size = 0;
            step = Math.sign(to);
            steps = Math.ceil(Math.abs(to));
        }
        else if (step_or_shape.length === 0) {   //Если у метода два параметра — начало и конец прогрессии
            step = Math.sign(to - from_or_size)
            steps = Math.ceil(Math.abs(to - from_or_size));
        }
        else if (step_or_shape.length === 1) {   //Если указан шаг прогрессии
            step = step_or_shape[0];
            if (step === 0)
                throw new Error('step must be nonzero');
            if (Math.sign(step) !== Math.sign(to - from_or_size) && to !== from_or_size)
                throw new Error("starting and final bounds inconsistent with step sign");
            steps = Math.ceil(Math.abs( (to - from_or_size) / step ));
        }
        else {   //Если указана форма тензора
            steps = step_or_shape.mul();
            step = (to - from_or_size) / steps;

        }
        let dType = Float32Array;
        const data = new dType(steps);
        if ( steps ) {
            for ( let i = 0, v = from_or_size; i < steps ; i++, v += step){
                data[i] = v;
            }
            label += ` ${from_or_size} … ${to}`;
        }
        if (step_or_shape.length <= 1)   //Если форма тензора не задана
            return torus.tensor(data)._label(label);
        return torus.tensor(data)._shape(step_or_shape)._label(label);
    }



    torus.eye = (...shape)=>{
        shape = torus.flat(shape);
        if (shape.length === 1)   //Если укана только одна ось, то создаётся вторая того же размера. Тензор приводится к 2-D.
            shape[1] = shape[0];
        const columns = shape[shape.length - 1] ?? 0;
        const rows = shape[shape.length - 2] ?? 0;
        const steps = Math.min( rows, columns);
        const step = columns + 1;
        let data = [];
        let repeat = 1;
        if (shape.length > 2) {
            repeat = shape.slice(0, -2).mul();
        }
        if( repeat ) {   //Если передано более 2-х осей, и среди них нет осей с нулевой длинной
            data = Array(rows * columns).fill(0);
            for (let i = 0, idx = 0; i<steps; i++, idx+=step){
                data[idx] = 1;
            }
            data = new Int8Array(Array(repeat).fill(data).flat());
        }
        return torus.from(data)._shape(shape)._label('eye');
    }

    torus.ones = (...shape) => {
        shape = torus.flat(shape);
        let size = shape.mul();
        if(!size){
            size = 1;
            shape = [1]
        }
        return torus.tensor(new Int32Array(size).fill(1))._label('ones')._shape(shape);
    }
    torus.zeros = (...shape) => {
        shape = torus.flat(shape);
        let size = shape.mul();
        if(!size){
            size = 1;
            shape = [1]
        }
        return torus.tensor(new Int32Array(size))._label('zeros')._shape(shape);
    }
    torus.empty = (...shape)=>{
        shape = torus.flat(shape);
        let size = shape.mul();
        if(!size){
            size = 1;
            shape = [1]
        }
        const data = new Float32Array(size);
        while(size--)
            data[size] = torus.generator() - .5
        return torus.tensor(data)._label('empty')._shape(shape);
    }
    torus.rand = (...shape) => {
        shape = torus.flat(shape);
        let size = shape.mul();
        if(!size){
            size = 1;
            shape = [1]
        }
        const data = new Float32Array(size);
        while(size--)
            data[size] = torus.generator()
        return torus.tensor(data)._label('rand')._shape(shape);
    }
}
functions:{

    torus.prototype.sqrt = function(){
        return this._element_wise_function({forward: 'x => Math.sqrt(x)', backward_0: 'x => 1 / (2 * Math.sqrt(x))'})
    }
    torus.prototype.invert = function (){
        return this._element_wise_function({forward: 'x=>x * -1', backward_0: '()=>-1'});
    }
    torus.prototype.exp = function (){
        return this._element_wise_function({forward: 'Math.exp',  backward_0: 'x=>x'});
    }
    torus.prototype.log = function (){
        return this._element_wise_function({forward: 'Math.log', backward_0: '(x, y)=>1/x*y'});
    }
    torus.prototype.tanh = function (){
        return this._element_wise_function({forward: 'Math.tanh', backward_0: 'x=>(1 - x ** 2)'});
    }
    torus.prototype.sigmoid = function (params){
        return this._element_wise_function({forward: 'x=>(1 / (1 + Math.exp(-x)))', backward_0: '(x, y)=>y * (1 - y)'});
    }
    torus.prototype.sigm = function (params){
        return this.sigmoid(params);
    }
    torus.prototype.relu = function (params) {
        return this._element_wise_function({forward: '(x)=>(x>0?x:0)', backward_0: '(x, y)=>(y>0?1:0)'});
    }
    torus.prototype.mandelbrot = function (params){
        return this._element_wise_function({forward: 'x=>(Math.pow(x,  2) + 1)', backward_0: '(x, y)=>(2 * y)'});
    }
    torus.prototype.softplus = function (params) {
        return this._element_wise_function({forward: 'x=>(Math.log(1 + Math.exp(x)))', backward_0: `(x, y)=> { 
            let exp = Math.exp(y); 
            return exp / (1 + exp); 
        }`});
    }
    torus.prototype.silu = function (params) {
        return this._element_wise_function({forward: 'x=>(x  / (1 + Math.exp(-x)))', backward_0: `(x, y)=> {
            let ex = Math.exp(-y);
            let onePlusEx = 1 + ex;
            return (onePlusEx + ex * y) / (onePlusEx ** 2);
        }`})
    }
}
aggregates:{
    torus.prototype.max = function(dim,  $ = {}){
        $ = torus.$($);
        if(dim === undefined){
            const data = this.data.reduce((r, v)=>r>v?r:v,this.data[0]);
            return torus.tensor(data)._label('max');
        }
        else{
            // const dims = this.check_dims([dim]);
            throw new Error('tensor.max(dim = ${dim}): not ready!')
        }
    }
    torus.prototype.min = function(dim,  $ = {}){
        $ = torus.$($);
        if(dim === undefined){
            const data = this.data.reduce((r, v)=>r<v?r:v,this.data[0]);
            return  torus.tensor(data)._label('min');
        }
        else{
            // const dims = this.check_dims([dim]);
            throw new Error('tensor.min(dim = ${dim}): not ready!')
        }
    }
    torus.prototype.sum = function (dims = [], $ = {}){
        $ = torus.$($);
        let shape_info = this.shape_info;
        const from = shape_info.map(i=>i.char);
        let dims_info = this.dims_info(dims)
        let to = dims_info.map(i=>i.char);
        to = !to.length?to:from.filter(a=>!to.includes(a))

        let expr = from.join('') + '->' + to.join('');

        $.forward ??= x => x;
        $.backward_0 ??= g => g;
        let out = torus.einsum(expr, this, $)

        if($.keepdim){
            const shape = this.shape_info.map((v, i)=>{
                return !dims_info.length || dims_info.includes(v)?1:v.dim;
            })
            out._shape(shape);
        }
        out._label(`sum(dims=[${dims}], ${JSON.stringify($)}):\'${expr}\'`);
        return out;
    }
    torus.prototype.mean = function(dims = [], $ = {}){
        $ = torus.$($);
        let sum = this.sum(...arguments);
        let out = sum.divide(this.size / sum.size);
        out._label(sum.label.replace('sum', 'mean'))
        return out;
    }
    torus.prototype.var = function(dims = [], $ = {}){
        $ = torus.$($, {correction: 1});
        const avg = this.mean(dims, $);
        let s1 = this.shape_info;
        let s2 = avg.shape_info;
        s1 = s1.map((v1, i)=>{
            let v2 = s2[i];
            if(v2 === undefined || v2.dim === v1.dim)
                return v1.char;
            return v1.char.toUpperCase();
        }).join('')
        s2 = s2.map(v2=>v2.char).join('');
        let expr = s1+','+s2+'->'+ s2;
        $.forward = '(x, y)=>(x - y) ** 2';
        const sum = torus.einsum(expr, [this, avg], $);
        const multiplier = 1/Math.max(0, this.size / avg.size - $.correction);
        const out = sum.multiply(multiplier);
        out._label(`var(dims=[${dims}], ${JSON.stringify($)}):\'${expr}\'`);
        return out;
    }
    torus.prototype.std = function(dim = [], $ = {}){
        $ = torus.$($, {correction: 1});
        let out = this.var(...arguments);
        out = out.sqrt();
        out._label(`std(dim = [${dim}], ${JSON.stringify($)})`);
        return out
    }
}
convertors:{

    function slice_codegenerator(slicers, back = false){
        let space = '   ';
        let shape = [];
        let code = ['let idx=-1;'];
        code.push('let data = tensor.data;');
        let dim, start, end, step, add_shape;
        this.strides.forEach((stride, d)=>{
            let slicer = (slicers[d]?.toString() || '').toString().trim();
            dim = this.shape[d];
            if (slicer.length && !Number.isNaN(+slicer)){
                add_shape = false;
                start = +slicer;
                if (start<0)
                    start += dim;
                end = start + 1;
                step = 1;
            }
            else{
                add_shape = true;
                slicer = slicer.split(':');
                start = +(slicer[0]?.trim() || 0);
                if (start < 0)
                    start += dim;
                end = +(slicer[1]?.trim() || dim);
                if (end < 0)
                    end += dim;
                step = +(slicer[2]?.trim() || 1);
                if (step < 0)
                    step += dim;
            }
            if (end > dim)
                end = dim
            dim = Math.ceil((end - start)/step);
            if (dim < 0)
                dim = 0;
            let t = space.repeat(d);
            code.push(t + `for(let d${d} = ${start}, _i${d} = ${start * stride}; d${d}<${end}; d${d} += ${step}, _i${d} += ${step * stride}){`)
            if (add_shape)
                shape.push(dim);
        })
        if(!back){
            code.push(space.repeat(this.dim)+`out[++idx] = data[${this.shape.map((_,i)=>'_i'+i).join(' + ')}];`);
        }
        else{
            code.push(space.repeat(this.dim)+`grad[${this.shape.map((_,i)=>'_i'+i).join(' + ')}] = out.grad[++idx];`);
        }
        this.shape.forEach((_, d)=>{
            code.push(space.repeat(this.dim - d - 1)+`}`);
        })
        let size = shape.mul() || 1;
        if(!back){
            code.unshift(`out ??= new tensor.dType(${size})`);
            if(!shape.length)
                shape = [1];
            code.push(`return torus.tensor(out)._shape(${shape})`);
        }
        return code.join('\n');
    }
    torus.prototype.slice = function (...slicers){
        if (slicers.length>this.dim)
            throw new Error(`tensor.slice(${slicers}): indexError: too many indices for tensor of dimension ${this.dim}`);
        let key = '(' + this.shape.toString() + '):  [' + slicers.map(i=>i).join(',')+']';
        let fn = fn_cache.slice?.[key];
        if (!fn){
            let code = slice_codegenerator.call(this, slicers)
            fn_cache.slice[key] = fn = new Function('tensor', 'out', code);
        }
        let out = this.getOut(this, key);
        out = fn(this, out);
        out._label('slice '+key)._src(this);
        if (this.allowGrad){
            out._back = ()=>{
                let key = '('+ this.shape.toString()+'): ' + slicers.map(i=>i).join(',') + ': back'
                let fn = fn_cache.slice?.[key];
                if (!fn){
                    let code = slice_codegenerator.call(this, slicers, true)
                    fn_cache.slice[key] = fn = new Function('tensor', 'out', code);
                }
                fn(this, out);
            }
        }
        this.setOut(out, this, key);
        return out;
    }

    torus.prototype.view = function (...shape) {
        shape = torus.flat(shape);
        if(shape.mul() !== this.size)
            throw new Error(`tensor.view(...shape = [${shape}]): shape is invalid for input of size ${this.size}`)
        let out = this.getOut(this, shape.toString());
        if(!out){
            out = torus.from(this.data)._src(this)._label('view')._shape(shape);
            out._back = ()=>{
                this.update_grad(out.data)
            }
            this.setOut(out, this, shape.toString());
        }
        out._data(this.data);
        return out;
    }
    torus.prototype.multinomial = function(num_samples = 1, replacement = false, $ = {}){
        $ = torus.$({generator: null, out: null}, $);
        const step = this.shape.last;
        if(!$.generator)
            $.generator = torus.generator;
        let out = $.out || this.out;
        let steps = this.size / step
        if(!out){
            this.out = out = torus.from(new Uint8Array(steps * num_samples))._shape([steps, num_samples])._label('multinomial');
            out._back = ()=>{
                for(let s = 0; s<steps; s++){
                    let l = s * step;
                    for(let n = 0; n<num_samples; n++){
                        let i = l + n
                        const idx = out.data[i]
                        this.grad[l + idx] += out.grad[i];
                    }
                }
            }
        }
        let idx = -1
        for (let s = 0; s<steps; s++){
            let sum = 0;
            let arr = [];
            let l = s * step;
            for(let i = 0; i<step; i++){
                let d = this.data[i+l];
                sum += Math.abs(d);
                arr[i] = sum;
            }
            for(let n = 0; n<num_samples; n++){
                let rand = $.generator() * sum;
                for(let a = 0; a<step; a++){
                    if(arr[a]>=rand){
                        out.data[++idx] = a;
                        break;
                    }
                }
            }
        }
        return out;
    }
    torus.cat = torus.concat  = (tensors = [], dim=-1, $ = {out: null}) => {
        const first = tensors.first;
        dim = first.check_dim(dim);
        let out = first.getOut(tensors, dim);
        if(!out){
            const shape = tensors.reduce((r, tensor, t)=>{
                const shape = tensor.shape;
                if(shape.length < r.length)
                    throw new Error(`torus.concat(): incorrect dimentions of tensor №${t}: must [${r}], but `);
                r = shape.map((s, i)=>{
                    const old = r[i] || 0;
                    if(i === dim)
                        return old + s;
                    if(old && old != s)
                        throw new Error(`torus.concat(): incorrect dim ${i} on tensor №${t} have size ${s} but must be ${old}`);
                    return s;
                })
                return r;
            },[]);
            const size = shape.mul();
            out = torus.tensor(new first.dType(size))._label(`concat ${tensors.length} tensors`)._shape(shape)._src(...tensors);
            const step = out.size / out.shape.slice(0, dim).mul() || 1;
            const di = out.dims_info(dim)[0]
            out._back = ()=>{
                let from = 0;
                tensors.map((tensor, t)=>{
                    let split_size = di.stride * tensor.shape[dim];
                    let to = 0;
                    for(let p = 0; p < size; p += step){
                        const slice = out.grad.slice(from + p, from + p + split_size);
                        tensor.grad.set(slice, to);
                        to += split_size;
                    }
                    from += split_size;
                })
            }
            first.setOut(out, tensors, dim);
        }
        const di = out.dims_info(dim)[0]
        const step = out.size / out.shape.slice(0, dim).mul() || 1;
        let size = out.size;
        let from = 0;
        tensors.map((tensor, t)=>{
            let split_size = di.stride * tensor.shape[dim];
            let to = 0;
            for(let p = 0; p < size; p += step){
                const slice = tensor.data.slice(to, to + split_size);
                out.data.set(slice, from + p);
                to += split_size;
            }
            from += split_size;
        })
        return out;
    }
    torus.prototype.split = function(split_size_or_sections = [], dim = 0){
        split_size_or_sections = torus.flat(split_size_or_sections);
        let sum = split_size_or_sections.sum();                           // считаем сумму указанных срезов
        if(!sum)                                                            // не указаны размеры срезов, возвращаем исходный тензор
            return this;
        const di = this.dims_info(dim)[0]
        let max = di.dim;                                                   // корректируем изменение среза
        if(sum > max)
            throw new Error(`split_size_or_sections expects to sum exactly to ${max} (input tensor's size at dimension ${dim}), but got split_size_or_sections=[${split_size_or_sections}]`);
        if(split_size_or_sections.length === 1){                            // если указан только 1 срез
            let count = Math.floor(max/sum);
            split_size_or_sections = Array(count).fill(sum);
            sum = split_size_or_sections.sum();
        }
        if(sum < max)
            split_size_or_sections.push(max - sum);

        let outs = this.out;
        const period = this.shape.slice(0, di.idx).mul() || 1;
        const step = this.size / period;
        const shape = Array.from(this.shape);
        outs = split_size_or_sections.map((s, idx)=>{
            let split_size = di.stride * s;
            let out = outs?.[idx];
            if(!out){
                shape[di.idx] = s;
                out = torus.tensor(new this.dType(shape.mul()))._shape(shape)._src(this)._label(`split ${idx+1} of ${split_size_or_sections.length} -> ${s}`);
                out._back = ()=>{
                    let from = split_size_or_sections.slice(0, idx).sum() * di.stride;
                    let to = 0;
                    for(let p = 0; p < this.size; p += step){
                        const slice = out.grad.slice(to, to + split_size);
                        this.grad.set(slice, from + p);
                        to += split_size;
                    }
                }
            }
            let from = split_size_or_sections.slice(0, idx).sum() * di.stride;
            let to = 0;
            for(let p = 0; p < this.size; p += step){
                const slice = this.data.slice(from + p, from + p + split_size);
                out.data.set(slice, to);
                to += split_size;
            }
            return out;
        });
        this.out = outs;
        return outs;
    }
    torus.prototype.float = function (){
        if (this.dtype !== Float32Array){
            let data = new Float32Array(this.size);
            for (let i = 0; i<this.size; i++){
                data[i] = this.data[i];
            }
            this.destroy(false);
            this.data = data;
        }
        return this;
    }
    torus.prototype.tril = function (diagonal = 0){
        if (this.dim < 2)
            throw new Error('input tensor must have at least 2 dimensions');

        const _x = this.shape[this.dim - 1];
        const _y = this.shape[this.dim - 2];
        let step = _x * _y;
        let _z = this.size/step;
        const data = new this.dType(this.size)
        let idx = 0;
        for (let z = 0; z < _z; z ++){
            for (let y = 0; y < _y; y++){
                for (let x = 0; x < _x; x++){
                    data[idx] = (x - y > diagonal)?0:this.data[idx];
                    idx++;
                }
            }
        }
        const out = torus.from(data)._shape(this)._label('tril');
        out._back = () => {
            this.grad = this.grad.map((g, i)=>{
                return g + out.grad[i];
            })
        }
        return out;

    }
}
torus.prototype.transpose = function(dim0= -1, dim1 = -2) {
    if (this.dim < 2)
        throw new Error(`Dimension out of range (expected more 2 or more, but got ${this.dim})`);

    if (dim0 < 0)
        dim0 += this.dim ;
    if (dim1 < 0)
        dim1 += this.dim;

    if (dim0 === dim1)
        throw new Error(`Измерения должны отличаться`);
    if (dim0 > this.dim -1)
        throw new Error(`Выходит за пределы`);
    if (dim1 > this.dim -1)
        throw new Error(`Выходит за пределы`);

    let char_code = 65;
    const var_in = this.shape.map((_, i)=>{
        return String.fromCharCode(i + char_code)
    })
    const var_out = var_in.map((v, i)=>{
        if (i === dim0)
            return var_in[dim1]
        if (i === dim1)
            return var_in[dim0]
        return v;
    })
    const expression = var_in.join('')+'->'+var_out.join('');
    return torus.einsum(expression, this)._label(`transpose ${dim0}->${dim1}`);
}
torus.prototype.pad = function(paddings, mode = 'constant', constant_value = 0) {
    let new_shape = this.shape.slice();
    for (let i = 0; i < paddings.length; i++) {
        new_shape[i] += paddings[i] * 2;
    }
    let new_data = new this.dType(new_shape.mul()).fill(constant_value);
    let offsets = paddings.slice();
    let strides = [1];
    for (let i = this.dim - 1; i >= 0; i--) {
        strides[i] = strides[i + 1] * this.shape[i];
    }
    let index = (indices) => {
        let offset = 0;
        for (let i = 0; i < indices.length; i++) {
            offset += indices[i] * strides[i];
        }
        return offset;
    }
    let unpadded_indices = (indices) => {
        let result = [];
        for (let i = 0; i < indices.length; i++) {
            result.push(Math.max(Math.min(indices[i] - offsets[i], this.shape[i]), 0));
        }
        return result;
    }
    let padded_indices = (indices) => {
        let result = [];
        for (let i = 0; i < indices.length; i++) {
            result.push(Math.max(Math.min(indices[i], new_shape[i]), 0));
        }
        return result;
    }
    let i = this.data.length;
    while(i--){
        let indices = unpadded_indices(index(i));
        new_data[index(indices)] = this.data[i];
    }
    if (mode === 'reflect') {
        for (let i = 0; i < paddings.length; i++) {
            let axis_size = this.shape[i];
            let padding_size = paddings[i];
            for (let j = 0; j < axis_size; j++) {
                let left_index = index([...Array(i).fill(0), j, ...Array(this.dim - i - 1).fill(0)]);
                let right_index = index([...Array(i).fill(0), axis_size - 1 - j, ...Array(this.dim - i - 1).fill(0)]);
                let left_offset = Math.floor((left_index - padding_size) / (axis_size + padding_size * 2));
                let right_offset = Math.floor((right_index - padding_size) / (axis_size + padding_size * 2));
                for (let k = 1; k <= padding_size; k++) {
                    let left_padded_index = index([...Array(i).fill(0), padding_size - k + left_offset * (axis_size + padding_size * 2), ...Array(this.dim - i - 1).fill(0)]);
                    let right_padded_index = index([...Array(i).fill(0), padding_size - k + right_offset * (axis_size + padding_size * 2), ...Array(this.dim - i - 1).fill(0)]);
                    new_data[left_padded_index] = this.data[left_index];
                    new_data[right_padded_index] = this.data[right_index];
                }
            }
        }
    } else if (mode === 'replicate') {
        for (let i = 0; i < paddings.length; i++) {
            let axis_size = this.shape[i];
            let padding_size = paddings[i];
            for (let j = 0; j < axis_size; j++) {
                let left_index = index([...Array(i).fill(0), j, ...Array(this.dim - i - 1).fill(0)]);
                let right_index = index([...Array(i).fill(0), axis_size - 1 - j, ...Array(this.dim - i - 1).fill(0)]);
                for (let k = 1; k <= padding_size; k++) {
                    let left_padded_index = index([...Array(i).fill(0), padding_size - k, ...Array(this.dim - i - 1).fill(0)]);
                    let right_padded_index = index([...Array(i).fill(0), new_shape[i] - padding_size + k, ...Array(this.dim - i - 1).fill(0)]);
                    new_data[left_padded_index] = this.data[left_index];
                    new_data[right_padded_index] = this.data[right_index];
                }
            }
        }
    } else if (mode === 'circular') {
        for (let i = 0; i < paddings.length; i++) {
            let axis_size = this.shape[i];
            let padding_size = paddings[i];
            for (let j = 0; j < axis_size; j++) {
                let left_index = index([...Array(i).fill(0), j, ...Array(this.dim - i - 1).fill(0)]);
                let right_index = index([...Array(i).fill(0), axis_size - 1 - j, ...Array(this.dim - i - 1).fill(0)]);
                for (let k = 1; k <= padding_size; k++) {
                    let left_padded_index = index([...Array(i).fill(0), padding_size - k, ...Array(this.dim - i - 1).fill(0)]);
                    let right_padded_index = index([...Array(i).fill(0), new_shape[i] - padding_size + k, ...Array(this.dim - i - 1).fill(0)]);
                    new_data[left_padded_index] = this.data[index([...Array(i).fill(0), (left_index + k) % axis_size, ...Array(this.dim - i - 1).fill(0)])];
                    new_data[right_padded_index] = this.data[index([...Array(i).fill(0), (right_index + k) % axis_size, ...Array(this.dim - i - 1).fill(0)])];
                }
            }
        }
    }
    let result = new tensor(new_data, this.dType);
    result._shape(new_shape);
    result._label(`pad(${paddings}, ${mode}, ${constant_value})`);
    result._src(this);
    result._back = () => {
        let unpadded_grad = new this.dType(this.data.length);
        let i = this.data.length
        while (i--) {
            let indices = unpadded_indices(index(i));
            unpadded_grad[i] = result.grad[index(indices)];
        }
        this.grad = unpadded_grad;
    }
    return result;
}
BigInt.prototype.toBin = function (dim = 64){
    return this.toString(2).padStart(dim, '0');
}
globalThis.BinaryArray = class BinaryArray extends BigUint64Array{
    _binSize = 0;
    #length = 0;
    #bins = undefined;
    _self = undefined;
    bit_mask = BigInt(1);
    constructor(size) {
        super(Math.ceil((Array.isArray(size)?size.length:size)/64));
        if (Array.isArray(size)){
            let data = size;
            this.#length = this._binSize = data.length;
            const str = data.map(i=>i>0?1:0).join('');
            let step = 0;
            let v;
            while (v = str.substr(step * 64, step * 64 + 64)){
                this[step] = '0b'+v.padEnd(64, '0');
                step++
            }
        }
        else{
            this.#length = this._binSize = size;
        }
        this._self = this;
        return new Proxy(this, {
            get: (target, key, receiver) =>{
                const v =  target[key];
                if(typeof v == "function")
                    return v.bind(target);
                return v;
            },
            set: (target, key, value) => {
                switch (value?.constructor){
                    case BigInt:{
                        target[key] = value;
                    } break;
                    case Number:{
                        target[key] = BigInt(value);
                    } break;
                    case Boolean:
                        value = value?'1':'0';
                    case String:{
                        switch (value){
                            case '1':
                            case '0':{
                                key = +key
                                let idx = (key / 64);
                                key = Math.floor(idx);
                                idx = (idx - key) * 64;
                                let bin = target[key].toBin();
                                bin = '0b' + bin.substr(0, idx) + value + bin.substr(idx + 1);
                                target[key] = BigInt(bin);
                            } break;
                            default:{
                                if (value.startsWith('0b'))
                                    target[key] = BigInt(value);
                                else
                                    target[key] = BigInt('0b'+value.padStart(64, '0'));
                            }
                        }
                    } break;
                }
                return true;
            },
        })
    }
    get bins(){
        return this.#bins ??= Array.prototype.map.call(this.data, d => d.toBin());
    }
    get binLength(){
        return this.#length
    }
    get binSize(){
        return this._binSize;
    }
    map(h){
        return this._self.reduce((res, v, i)=>{
            res[i] = h(v, i, this._self);
            return res;
        }, new BinaryArray(this._binSize))
    }
    getBit(idx){
        const data_idx = idx>>6;
        idx = 63-(idx&63);
        return (this[data_idx]>>BigInt(idx))&this.bit_mask;
    }
}
const fn_cache = {einsum:{}, slice: {}};

globalThis.range ??= (count = 0)=>{
    return Array(count).fill().map((_, i)=>i);
}

const descr = Object.getOwnPropertyDescriptors(torus.prototype);
for (let n in descr){
    if (n.startsWith('_') || n.endsWith('_')) continue;
    const d = descr[n];
    if (!d.enumerable)
        continue;
    if (d.value?.constructor !== Function)
        continue;
    torus[n] ??= (tensor, ...params)=>{
        return d.value.call(tensor, ...params);
    }
}

function label_from_error(){
    return new Error().stack.split('at torus.')?.[1].split(' ')?.[0] || 'torus';
}