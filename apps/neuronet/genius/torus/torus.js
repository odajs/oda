globalThis.LEARNING_RATE = 0.1;
export class tensor/* extends Array*/{
    #data = null;
    #dType = Float32Array;
    #src = undefined;
    #grad = undefined;
    #prev = undefined;
    #bins = undefined;
    #type = undefined;
    #shape_multipliers = undefined;
    isParam = false;
    backs = [];
    constructor(data, dType) {
        if(data === undefined)
            this.#data = new (dType || this.#dType)(0);
        else if (data?.$ === this.constructor.name){
            this.#dType = globalThis[data.dType];
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
                    dType = next.dType
                    shape.push(...next.shape);
                    let size = next.size;
                    next = new dType(shape.mul());
                    data = data.reduce((r, v, i)=>{
                        r.set(v.data, i * size);
                        return r
                    }, next);
                }
                else {
                    if(!dType)
                        dType = Float32Array
                    if(!(data instanceof dType))
                        data = new dType(data);
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
                else if (!data?.buffer)
                    data = new this.dType([data])
            }
            this.#data = data;
        }
        this.#dType = dType || this.#data.constructor || this.#dType;
        this.id = genId();
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
    _dType(type){
        if (this.#dType !== type){
            this.#dType = type;
            const data = new type(this.data.length);
            for(let i = 0; i<data.length; i++){
                data[i] = this.data[i];
            }
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
            throw new Error(`_shape from (${this.shape}) to (${shape}) not allow.`);
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
    get dType(){
        return this.#dType;
    }
    get allowGrad(){
        return (this._back && !!this.src?.some(i=>i.allowGrad)) || this.isParam;
    }
    get grad(){
        return this.#grad ??= new Float32Array(this.size);
    }
    get data(){
        this.#data.__tensor__ = this.label;
        return this.#data;
    }
    set data(n){
        if (n.length !== this.size)
            throw new Error(`Dimension out of range (expected ${this.#data.length}, but got ${n.length})`);
        this.#data = n
        this.#dType = this.#data.constructor;
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
        // return this.shape.mul();
        // // return this.data.length;
        return this.shape.mul() || this.data.length; //У скаляров размерность 0, а количество элементов 1
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
        this.clearGrad();
        if(this.isParam) return;
        if (!this.data.length) return;
        this.data.buffer.transfer(0);
        this.isDestroyed = true;
        if (!recurce) return;
        if (!this.src?.length) return
        this.src.forEach(s=>s.destroy(recurce))
    }
    clearGrad(){
        if (!this.#grad?.length) return;
        this.#grad?.buffer.transfer(0);
        this.#grad = undefined;
    }
    updateParams(){
        if (!this.isParam) return;
        if (this.dType === BinaryArray){
            let bins = this.bins;
            let data = this.data;
            let idx = 0;
            let val = '';

            for(let i = 0; i<bins.length; i++){
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
            // for(let i = 0; i<this.data.length; i++){
            //     let change = this.grad[i] * lr * torus.generator();
            //     this.data[i] += change;
            // }

            let gamma = torus.generator();
            lr = 1 - gamma;
            for(let i = 0; i<this.data.length; i++){
                let prev = this.prev[i] * gamma;
                let change = prev + this.grad[i] * lr;
                this.data[i] += change;
                this.prev[i] = change
            }


            // let lr = torus.LEARNING_RATE || .01
            // for(let i = 0; i<this.data.length; i++){
            //     let prev = this.prev[i];
            //     let change = this.grad[i] * lr + prev * .5;
            //     this.data[i] += change;
            //     this.prev[i] = change;
            // }


            //

            // for(let i = 0; i<this.data.length; i++){
            //     const lr = torus.generator() / 3;
            //     const lambda = 1 - lr;
            //     let prev = this.prev[i];
            //     let change = (this.grad[i] + lambda * prev) * lr;
            //     this.data[i] += change;
            //     this.prev[i] = change * lr;
            //
            // }
        }
        this.clearGrad();
    }
    get prev(){
        return this.#prev ??= new Float32Array(this.size);
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
            let back_fn;
            if (node._back){
                node._back();
                back_fn = node.label+'_back';
            }
            else{
                back_fn = 'no-back('+node.label+')';
            }
            node.src.forEach(i=>i.backs.push(back_fn))
        })
        topo.forEach((node) => {
            if (!node.src){
                node.updateParams();
            }
        })
        setTimeout(()=>{
            topo[0]?.destroy();
        },0)
    }


    getDim(dim){
        if (-this.dim > dim || this.dim - 1 < dim)
            throw new Error(`Dimension out of range (expected to be in range of [-${this.dim}, ${this.dim - 1}], but got ${dim})`);
        if (dim < 0)
            dim += this.dim;
        return  this.shape[dim];
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
    static split(tensor, split_size_or_sections, dim = 0){
        return tensor.split(split_size_or_sections, dim = 0);
    }
    static stack(tensors, dim = 0){
        let first = tensors[0];

        if (((dim > 0)?(first.dim < dim):((first.dim + dim)<-1)))
            throw new Error(`Dimension out of range (expected to be in range of [-${dim+1}, ${dim}], but got ${dim})`);
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
    split(split_size_or_sections, dim = 0){
        let max = this.getDim(dim);
        if (Number.isInteger(split_size_or_sections)){
            let arr = [];
            let i;
            for (i = 0; i < max; i += split_size_or_sections){
                if (i + split_size_or_sections < max)
                    arr.push(split_size_or_sections);
                else
                    arr.push(max - i);
            }
            split_size_or_sections = arr;
        }
        if (!Array.isArray(split_size_or_sections))
            throw new Error(`Argument 'split_size_or_sections' (position 1) must be 'Integer' or 'array of Integer', but not '${typeof split_size_or_sections}'`)
        if(split_size_or_sections.sum() !== max)
            throw new Error(`split_size_or_sections expects to sum exactly to ${max} (input tensor's size at dimension ${dim}), but got split_size_or_sections=[${split_size_or_sections}]`);
        let idx = -1;
        const src = this.data;
        let shape = [...this.shape];
        if (dim < 0)
            dim += this.dim;
        const result = split_size_or_sections.map((v, i)=>{
            shape[dim] = v;
            const size = shape.mul();
            let start = idx;
            const d = new this.dType(size).map(x=>src[++idx]);
            let out = tensor.from(d)._shape(...shape)._src(this)._label(`split ${i+1} of ${split_size_or_sections.length} -> ${v}`);
            if (this.allowGrad){
                out._back = ()=>{
                    out.grad.forEach((g, i)=>{
                        this.grad[i + start] += g;
                    })
                }
            }
            return out
        });
        return result;

    }
    static concat (tensors = [], dim=-1){
        const first = tensors[0];
        if (dim < 0)
            dim += first.dim;
        let join_dim = tensors.reduce((r, t)=>r + t.shape[dim], 0);
        const shape = [...first.shape];
        shape[dim] = join_dim;
        const size = shape.mul();
        const data = new first.dType(size);
        let states = [...tensors.map(i=>({from: 0}))]
        let idx = 0;
        do{
            tensors.map((t, i)=>{
                const state = states[i];
                state.step ??= t.shape.reduce((r, v, i)=> r * (i<dim?1:v), 1)
                const to =  state.from + state.step;
                const slice = t.data.slice(state.from, to);
                state.from = to;
                data.set(slice, idx);
                idx += state.step;
            })
        }
        while (idx < size)
        tensors.map(t=>{
            t.__step = undefined
            t.__from = undefined
        })
        const out = tensor.from(data)._shape(shape)._label('concat('+tensors.length+')')._src(tensors);
        out._back = ()=>{
            //todo
        }
        return out;
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
        return tensor.from(data)._label('hippo');
    }
    static from(data, dType){
        if (Object.equal(data?.constructor, tensor))
            return data;
        return new tensor(data, dType);
    }
    static tensor(data, dType){
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
            throw new Error(`Dimension out of range (expected to be in range of [-${this.dim}, ${this.dim - 1}], but got ${dim})`)
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
            result += `${this.dType.name}, ${this.backs.join(',')}\n${tab}(${data.replaceAll('[', '').replaceAll(']', '')})`;
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
            for (let i = 0; i < data.length; i += s){
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

tensor.prototype.item = function (...shape){
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

torus.prototype.check_dims = function(...dims){
    dims = torus.flat(dims);
    return dims.map(d=>{
        let r = d
        if(r < 0)
            r = d + this.dim;
        if(r >= this.dim)
            throw new Error(`dim ${d} out of range ${this.dim}`);
        return r;
    })
}

torus.prototype.findIndex = function(...indexes){
    indexes = torus.flat(indexes);
    return indexes.reduce((r, v, i)=> (r + v * this.shape_multipliers[i]), 0)
}
torus.prototype.get = function(...indexes){
    indexes = torus.flat(indexes);
    const idx = indexes.reduce((r, v, i)=> (r + v * this.shape_multipliers[i]), 0)
    if(indexes.length === this.shape_multipliers.length)
        return this.data[idx];
    return this.data.slice(idx, idx + this.shape_multipliers.slice(indexes.length-1).mul())
}
torus.prototype.set = function(value, ...indexes){
    indexes = torus.flat(indexes);
    const idx = indexes.reduce((r, v, i)=>(r + v * this.shape_multipliers[i]), 0)
    this.data.set(value.data || torus.flat(value), idx);
}

tensor.prototype.slice = function (...slicers){
    if (slicers.length>this.dim)
        throw new Error(`IndexError: too many indices for tensor of dimension ${this.dim}`);
    let key = '(' + this.shape.toString() + '):  [' + slicers.map(i=>i).join(',')+']';
    let fn = fn_cache.slice?.[key];
    if (!fn){
        let shape = [];
        let func = ['let idx=-1;'];
        func.push('let data = tensor.data;');
        let size, start, end, step, add_shape;
        for (let d = 0; d < this.dim; d++){
            let slicer = (slicers[d]?.toString() || '').toString().trim();
            size = this.shape[d];
            if (slicer.length && !Number.isNaN(+slicer)){
                add_shape = false;
                start = +slicer;
                if (start<0)
                    start += size;
                end = start + 1;
                step = 1;
            }
            else{
                add_shape = true;
                slicer = slicer.split(':');
                start = +(slicer[0]?.trim() || 0);
                if (start < 0)
                    start += size;
                end = +(slicer[1]?.trim() || size);
                if (end < 0)
                    end += size;
                step = +(slicer[2]?.trim() || 1);
                if (step < 0)
                    step += size;
            }
            if (end > size)
                end = size
            size = Math.ceil((end - start)/step);
            if (size < 0)
                size = 0;
            let t = '\t'.repeat(d);
            func.push(t+`for(let v${d} = ${start}; v${d}<${end}; v${d} += ${step}){`)
            func.push(t+`\tlet vi${d} = (${(d - 1 < 0) ? 0 :'vi' +  (d-1)} + v${d}) * ${this.shape[d+1] || 1};`);
            if (add_shape)
                shape.push(size);
        }
        func.push('\t'.repeat(this.dim)+`out[++idx] = data[vi${this.dim-1}];`);
        this.shape.forEach((_, d)=>{
            func.push('\t'.repeat(this.dim - d - 1)+`}`);
        })
        size = shape.mul();
        func.unshift(`let out = new tensor.dType(${size})`);
        func.push(`return tensor.constructor.from(out)._shape(${shape})`);
        func = func.join('\n');
        fn_cache.slice ??= Object.create(null);
        fn_cache.slice[key] = fn = new Function('tensor', func);
    }
    let out =  fn(this);
    out._label('slice '+key)._src(this);
    if (this.allowGrad){
        out._back = ()=>{
            let key = '('+ this.shape.toString()+'): ' + slicers.map(i=>i).join(',') + ': back'
            let fn = fn_cache.slice?.[key];
            if (!fn){
                let shape = [];
                let func = ['let idx=-1;'];
                func.push('let grad = tensor.grad;');
                let size, start, end, step, add_shape;
                for (let d = 0; d < this.dim; d++){
                    let slicer = (slicers[d]?.toString() || '').toString().trim();
                    size = this.shape[d];
                    if (slicer.length && !Number.isNaN(+slicer)){
                        add_shape = false;
                        start = +slicer;
                        end = start + 1;
                        step = 1;
                    }
                    else{
                        add_shape = true;
                        slicer = slicer.split(':');
                        start = +(slicer[0]?.trim() || 0);
                        if (start < 0)
                            start += size;
                        end = +(slicer[1]?.trim() || size);
                        if (end < 0)
                            end += size;
                        step = +(slicer[2]?.trim() || 1);
                        if (step < 0)
                            step += size;
                    }
                    if (end > size)
                        end = size
                    size = Math.ceil((end - start)/step);
                    if (size < 0)
                        size = 0;
                    let t = '\t'.repeat(d);
                    func.push(t+`for(let v${d} = ${start}; v${d}<${end}; v${d} += ${step}){`)
                    func.push(t+`\tlet vi${d} = (${(d - 1 < 0) ? 0 :'vi' +  (d-1)} + v${d}) * ${this.shape[d+1] || 1};`);
                    if (add_shape)
                        shape.push(size);
                }
                func.push('\t'.repeat(this.dim)+`grad[vi${this.dim-1}] += out[++idx];`);
                this.shape.forEach((_, d)=>{
                    func.push('\t'.repeat(this.dim - d - 1)+`}`);
                })
                size = shape.mul();
                func.unshift(`out = out.grad;`);
                func = func.join('\n');
                fn_cache.slice ??= Object.create(null);
                fn_cache.slice[key] = fn = new Function('tensor', 'out', func);
            }
            fn(this, out);
        }
    }
    return out;
}

tensor.prototype.log_ = function (){
    for(let i = 0; i<this.data.length; i++){
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

tensor.prototype.plus = function (other){
    return this._element_wise_operator(other, {forward: '(x, y) => x + y', backward_0: '(g) => g',  backward_1:'(_, g) => g'});
}
tensor.prototype.minus = function (other){
    return this._element_wise_operator( other, {forward: '(x, y) => x - y', backward_0: '(g) => g', backward_1: '(_, g) => -g'});
}
tensor.prototype.multiply = function (other){
    return this._element_wise_operator(other, {forward:  '(x, y) => x * y', backward_0: '(g, y) => g * y', backward_1: '(x, g) => x * g'});
}
tensor.prototype.divide = function (other){
    return this._element_wise_operator(other, {forward: '(x, y) => x / y', backward_0: '(g, y) => g / y', backward_1: '(x, g) => -x / (g ** 2)'});
}
tensor.prototype.pow = function (other){
    return this._element_wise_operator(other, {forward:  '(x, y) => x ** y', backward_0: '(g, y) => y * (g ** (y - 1))', backward_1: '(x, g) => x ** g * Math.log(x)'});
}

tensor.prototype.softmax = function (dim = -1){
    const step = this.shape[this.shape.length-1];
    const size = this.size/step;
    const exps = this.data.map(Math.exp);
    const data = new Float32Array(this.size);
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
    const out =  tensor.from(data)._src(this)._label('softmax')._shape(this);
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
    return out;
}
tensor.prototype.maxIndex = function () {
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
tensor.prototype.multinomial = function(num_samples = 1, replacement = false){
    const data = [];
    const step = this.shape.last;
    for (let i = 0; i<this.size; i += step){
        data.push(this.data.slice(i, i + step));
    }
    const sums = data.map(d=>d.reduce((r, v)=>(r + v), 0));
    const res = Array(data.length).fill().map(_=>[]);
    for (let  i = 0; i< num_samples; i++){
        const randoms = sums.map(s=>s * torus.generator());
        data.map((d, i)=>{
            const p = randoms[i];
            let v = 0;
            for (let x = 0; x < step; x++){
                v += d[x];
                if (p > v) continue;
                res[i].push(x);
                break;
            }
        })
    }
    const shape = [...this.shape];
    shape[shape.length - 1] = num_samples;
    const out = tensor.from(res)._shape(shape)._label('multinomial');
    return out;
}
tensor.prototype.hardmax = function (){
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
tensor.prototype.MSE = function (target){
    target = tensor.from(target);
    let y = target.data;
    if (target.size>this.size)
        throw new Error(`Size of target (${target.size}) must be less then size of source (${this.size})`);
    for (let i = 0; i<target.shape.length; i++){
        let target_dim = target.shape[target.shape.length - 1 - i];
        let this_dim = this.shape[this.shape.length - 1 - i];
        if (this_dim === undefined)
            throw new Error(`Size of target (${target.size}) must be less then size of source (${this.size})`);
        if (target_dim !== undefined && target_dim > this_dim)
            throw new Error(`Dimension (${target.shape.length - 1 - i} = ${target_dim}) of target must be equal with dimension (${this.shape.length - 1 - i} = ${this_dim}) of source`);
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
        for (let i = 0; i < this.grad.length; i++){
            this.grad[i] += errors[i];
        }
    }
    return out;
}

tensor.prototype.repeat = function (count = 1) {
    return tensor.from(Array(count).fill().map(i=>this));
}


tensor.prototype.view = function (...shape) {
    shape = torus.flat(shape);
    if(Object.equal(shape[0]?.constructor, tensor))
        shape = shape[0].shape;
    const out =  tensor.from(this.data).reshape(shape)._src(this)._label('view');
    out._back = ()=>{
        this.grad = out.grad;
    }
    return out;
}

tensor.prototype.crossEntropy = function (target) {
    if(this.label !== 'softmax'){
        return this.softmax().crossEntropy(target);
    }
    target = tensor.from(target);
    const step = this.shape.last;
    const size = this.size/step;
    let ys = target.data;

    this.grad = this.data.map(x => - x);
    if (target.size === this.size)
        ys = ys.reduce((r,v,i)=>{
            if(v) r.push(i%step);
            return r;
        }, [])

    let loss = Array.prototype.map.call(ys, (y, i) => {
        let idx = i * step + y;
        this.grad[idx] += 1;
        return Math.log(this.data[idx])
    })
    loss = -loss.avg();
    const out = tensor.from([loss])._src(this)._label('crossEntropy');
    this._back = ()=>{
        this.src.forEach(src=>src.grad = this.grad)
    }
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

    let num = Math.abs(x) > 10000?x.toExponential((x >= 10000000000)?0:1):x.toString();
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
// tensor.parse_shape = (expr, src)=>{
//     const shape = src.shape;
//     const vars = expr.split('');
//     if(vars.length !== shape.length)
//         throw new Error(`Shape size [${shape.length}] does not match variable count [${vars.length}]`);
//     vars.reduce((r, d, i)=>{
//         d = d.trim();
//         switch (d){
//             case '_':{
//
//             } break;
//             default:{
//                 r[d] = shape[i];
//             }
//         }
//         return r
//     },{})
// }
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
        for (let i = 0; i < A.length; i++){
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
                let step, c, m = 1;
                return this.shape.toReversed().map((dim, i)=>{
                    step = m;
                    m *= dim;
                    let char = String.fromCharCode(i + 97);
                    i = this.dim - i - 1;
                    return {step, dim, char, i};
                }).toReversed();
            })()
        }
    })

    torus.prototype.dims_info = function(...dims){
        dims = torus.flat(dims);
        let shape_info = this.shape_info;
        return dims.reduce((r, d, i)=>{
            i = (d<0)?d + this.dim: d;
            let v = shape_info[i];
            if(v === undefined)
                throw new Error(`Index ${i} out of range for shape [${this.shape}]`)
            r.add(v)
            return r
        }, []).sort((a,b)=>{
            return a.i<b.i?-1:1
        })
    }
    torus.fill = (shape, value_or_handler, dType = Float32Array) => {
        shape = torus.flat(shape);
        let handler = typeof value_or_handler === 'function' ? value_or_handler : i => value_or_handler;
        let size = shape.mul();
        let data = new dType(size);
        data = data.map(handler);
        if(!data.length)
            shape = []
        else if (!shape.mul())
            shape = [1]
        return torus.from(data, dType)._shape(shape);
    }
    torus.prototype._element_wise_operator = function (other, attributes = {},
                                                       $ = Object.assign({forward: '', backward_0: '', backward_1: ''}, attributes)){
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
        let label;
        try{
            throw new Error()
        }
        catch (e){
            label = e.stack.split('\n');
            const idx = label.findIndex(v=>v.includes('._element_wise')) + 1;
            label = label[idx];
            label = label.substr(label.indexOf('.') + 1);
            label = label.substr(0, label.indexOf(' '));

        }
        out._label(label + ' ('+expr+')');
        return out;
    }
    tensor.prototype._element_wise_function = function (attributes = {},
                                                        $ = Object.assign({forward: '', backward_0: ''}, attributes)){
        const data = this.data.map(eval($.forward));
        const out = tensor.from(data)._src(this)._shape(this);
        let label;
        try{
            throw new Error()
        }
        catch (e){
            label = e.stack.split('\n');
            const idx = label.findIndex(v=>v.includes('._element_wise')) + 1;
            label = label[idx];
            label = label.substr(label.indexOf('.') + 1);
            label = label.substr(0, label.indexOf(' '));

        }
        out._label(label+' ('+out.shape+')');
        if ($.backward_0 && this.allowGrad){
            out._back = ()=>{
                for(let i = 0; i<this.grad.length; i++){
                    this.grad[i] += eval($.backward_0)(this.data[i], out.data[i]) * out.grad[i];
                }
            }
        }
        return out;
    }
}
generators:{

// ФУНКЦИИ ГЕНЕРАТОРЫ

    torus.empty = (...shape)=>{
        const handle = ()=>(torus.generator() - .5) / 2
        return torus.fill(shape, handle, Float32Array)._label(`empty`);
    }

    torus.rand_n = (...shape)=>{
        const handle = ()=>{
            return Math.sqrt(-2 * Math.log(torus.generator())) * Math.cos((2 * Math.PI) * torus.generator())
        }
        return torus.fill(shape, handle, Float32Array)._label(`rand_n`);
    }
    torus.ones_like = (src) => {
        return torus.ones(src.shape);
    }
    torus.arange = (from_or_size = 0, to, step = 1, ...shape)=>{
        shape = torus.flat(shape);
        let repeat = shape.mul() || 1;
        let steps;
        let label = 'arange';
        if(from_or_size !== undefined)
            label +=' '+from_or_size;
        if(to !== undefined)
            label +=' … '+to;
        if (to === undefined){
            to = from_or_size
            from_or_size = 0;
        }
        else
            to -= from_or_size;
        step *= Math.sign(to - from_or_size);
        to = Math.abs(step>0?Math.ceil(to / step):Math.floor(to / step));
        if(to){
            let data = [];
            let idx = -1;
            let v = from_or_size - step;
            for (let i = 0; i < to; i++){
                data[++idx] = (v += step)
            }
            data = new Float32Array(Array(repeat).fill(data).flat());
            shape.push(to)
            return torus.tensor(data)._shape(shape)._label(label);
        }
        return torus.tensor()._label(label)
    }
    torus.rand_int = (min_or_max = 0, max, ...shape)=>{
        shape = torus.flat(shape)
        if(max === undefined){
            max = min_or_max;
            min_or_max = 0;

        }
        if(max <= min_or_max)
            throw new Error('max <= min');
        if (shape.length === 0)
            shape = [Math.round(max - min_or_max)];
        const data = new Int32Array(shape.mul() || 1).map(i=>{
            const r = torus.generator();
            return Math.round(r * (max - min_or_max) + min_or_max);
        });
        return new torus(data, Int32Array)._shape(shape)._label(`rand_int ${min_or_max}-${max}`);
    }
    torus.rand = (...shape) => {
        return torus.fill(shape, torus.generator, Float32Array)._label('rand');
    }
    torus.rand_bin = (...shape) => {
        const handler = ()=>{
            let value = torus.generator().toString(2).substring(2);
            return BigInt('0b' + value.padEnd(64, value))
        }
        return torus.fill(...shape, handler, BinaryArray)._label('rand_bin');
    }
    torus.zeros = (...shape) => {
        return torus.fill(shape, 0, Int8Array)._label('zeros');
    }
    torus.ones = (...shape) => {
        return torus.fill(shape, 1, Int8Array)._label('ones');
    }
    torus.eye = (...shape)=>{
        shape = torus.flat(shape);
        const size = shape.mul();
        const data = new Int8Array(size);
        let dim = shape.last
        let step = Math.min(size/ dim, dim);
        for (let i = 0; i<step; i++){
            data[i * dim + i] = 1;
        }
        return torus.from(data)._shape(shape)._label('eye');
    }

}
functions:{

    torus.prototype.sqrt = function(){
        return this._element_wise_function({forward: 'x => Math.sqrt(x)', backward_0: 'x => 1 / (2 * Math.sqrt(x))'})
    }
    tensor.prototype.invert = function (){
        return this._element_wise_function({forward: 'x=>x * -1', backward_0: '()=>-1'});
    }
    tensor.prototype.exp = function (){
        return this._element_wise_function({forward: 'Math.exp',  backward_0: 'x=>x'});
    }
    tensor.prototype.log = function (){
        return this._element_wise_function({forward: 'Math.log', backward_0: '(x, y)=>1/x*y'});
    }
    tensor.prototype.tanh = function (){
        return this._element_wise_function({forward: 'Math.tanh', backward_0: 'x=>(1 - x ** 2)'});
    }
    tensor.prototype.sigmoid = function (params){
        return this._element_wise_function({forward: 'x=>(1 / (1 + Math.exp(-x)))', backward_0: '(x, y)=>y * (1 - y)'});
    }
    tensor.prototype.sigm = function (params){
        return this.sigmoid(params);
    }
    tensor.prototype.relu = function (params) {
        return this._element_wise_function({forward: '(x)=>(x>0?x:0)', backward_0: '(x, y)=>(y>0?1:0)'});
    }
    tensor.prototype.mandelbrot = function (params){
        return this._element_wise_function({forward: 'x=>(Math.pow(x,  2) + 1)', backward_0: '(x, y)=>(2 * y)'});
    }
    tensor.prototype.softplus = function (params) {
        return this._element_wise_function({forward: 'x=>(Math.log(1 + Math.exp(x)))', backward_0: `(x, y)=> { 
            let exp = Math.exp(y); 
            return exp / (1 + exp); 
        }`});
    }
    tensor.prototype.silu = function (params) {
        return this._element_wise_function({forward: 'x=>(x  / (1 + Math.exp(-x)))', backward_0: `(x, y)=> {
            let ex = Math.exp(-y);
            let onePlusEx = 1 + ex;
            return (onePlusEx + ex * y) / (onePlusEx ** 2);
        }`})
    }
}
aggregates:{
    torus.prototype.max = function(dim, keepdim = false){
        if(dim === undefined){
            const data = this.data.reduce((r, v)=>r>v?r:v,this.data[0]);
            return torus.tensor(data)._label('max');
        }
        else{
            // const dims = this.check_dims([dim]);
            throw new Error('not ready!')
        }
    }
    torus.prototype.min = function(dim, keepdim = false){
        if(dim === undefined){
            const data = this.data.reduce((r, v)=>r<v?r:v,this.data[0]);
            return  torus.tensor(data)._label('min');
        }
        else{
            // const dims = this.check_dims([dim]);
            throw new Error('not ready!')
        }
    }
    torus.prototype.sum = function (dims = [], attributes = {},
                                    $ = Object.assign({keepdim: false, dType: Float32Array, out: null}, attributes)){
        let shape_info = this.shape_info;
        const from = shape_info.map(i=>i.char);
        let dims_info = this.dims_info(dims)
        let to = dims_info.map(i=>i.char);
        to = !to.length?to:from.filter(a=>!to.includes(a))

        let expr = from.join('') + '->' + to.join('');

        $.forward ??= (x,y) => x + y;
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
    torus.prototype.mean = function(dims = [], attributes = {},
                                    $ = Object.assign({keepdim: false, dType: Float32Array, out: null}, attributes)){

        let sum = this.sum(...arguments);
        let out = sum.divide(this.size / sum.size);
        out._label(sum.label.replace('sum', 'mean'))
        return out;
    }
    torus.prototype.var = function(dims = [], attributes = {},
                                   $ = Object.assign({correction: 1, keepdim: false, dType: Float32Array, out: null}, attributes)){

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
        // const sum = this.data.reduce((r, x)=>r + (x - avg) ** 2, 0);
        // const data =  * sum;
        // const out = torus.tensor([data])._label('var')
        return out;
    }
}
convertors:{
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
        const out = tensor.from(data)._shape(this)._label('tril');
        out._back = () => {
            this.grad = this.grad.map((g, i)=>{
                return g + out.grad[i];
            })
        }
        return out;

    }
}

tensor.einsum = (in_expr, sources = [], attributes = {},
    $ = Object.assign({dType: Float32Array, forward: ''}, attributes))=>{
    sources = tensor.flat(sources);
    const tensors = sources.map(t => tensor.from(t));
    let key = in_expr + ':' + tensors.map(i=> i.shape.toString()+'('+ i.dType.name +')' ).join('-') + JSON.stringify($);
    // console.time(key)
    let fn = fn_cache.einsum?.[key];
    let inputs, outs;
    if (!fn){         // Выделение из выражения оператора
        let expr = in_expr.split('[');
        const axis = JSON.parse('['+(expr[1] || ']'));
        expr = expr[0];
        expr = expr.split('->');                            // Разделение выражения на вход и выход
        const terms = expr[0].trim().split(',');            // Разделение входа на термы
        inputs = terms.map((term, i)=>{                  // Анализ входных термов по размерностям
            term = term.trim();
            const tensor = tensors[i];
            let inp =  term.split('').map((a, j)=>{            // Разделение терма на индексы и их анализ
                let d =  tensor.shape[j];
                let ax = axis.find(v => v.a === a);
                if(ax === undefined){
                    ax = {a, d};
                    axis.push(ax);
                }
                else if(ax.d !== d)
                    throw new Error(`In expression '${in_expr}':\n axis '${a}' have size ${ax.d} but on tensor №${i+1} this got ${d}`);
                return ax;
            })
            inp.t = tensor;
            return inp;
        });
        outs = expr[1].trim().split('').map(a => {   // Разделение выходного терма на индексы и их анализ
            if(!a) return;
            let idx = axis.findIndex(v => v.a === a);
            if(idx < 0)
                throw new Error(`Unknown axis: '${a}'`);
            let ax = axis[idx];
            axis.splice(idx, 1);
            return ax;
        }).filter(i=>i)


        let vars = [
            [...outs, ...axis].map((o, i) =>`let _${o.a} = ${o.d} || 1;`).join('\n'),
            inputs.map((_, i) => {
                const t = tensors[i]
                let str =  '';//`let dType${i} = ${t.dType.name};\n`;
                if (t.dType === BinaryArray){
                    str += `let t${i} = t[${i}].bins;`
                    str += `\nlet b${i} = 0;`;
                }
                else{
                    str += `let t${i} = t[${i}].data;`;
                    str += `\nlet v${i} = 0;`;
                }

                return str;
            }).join('\n'),
        ].join('\n');
        vars += `\nlet idx = -1;\n`;
        if ($.forward)
            vars += `let forward = eval(${$.forward.toString()});\n`;


        const out_tabs = '\t'.repeat(outs.length);

        inputs.map((t, i) => {
            let expr = ''
            if(t.length){
                if (t.t.dType === BinaryArray)
                    expr += `b${i}`;
                else
                    expr += `v${i}`;
                expr += ` = t${i}[`;
                let m = ''
                for (let o of t.toReversed()){
                    if (m)
                        expr += ' + ' + m;
                    expr += o.a;
                    m =  '_' + o.a +' * (';
                }
                expr += ')'.repeat(t.length - 1);
                expr+=']'
            }
            t.idx_expr = expr;
            if (t.t.dType === BinaryArray)
                t.v = `b${i}`;
            else
                t.v = `v${i}`;
        })
        let last_input = null
        let prev_v = [];
        let prev_b = [];
        let out_for = outs.map((o, i) => {
            let axis_name = o.a;
            let tabs = '\t'.repeat(i)
            let res = tabs + `for(let ${axis_name} = 0; ${axis_name} < _${axis_name}; ${axis_name}++){\n`;
            let inps = inputs.filter(i=>{
                return i.some(a => {
                    if (a.a === axis_name){
                        a.used = true;
                        return  true;
                    }
                });
            })
            res += inps.filter(i=>{
                return i.every(a=>a.used)
            }).map(i=>{
                let res = '\t'+tabs;
                if (last_input?.t === i?.t)
                    res += `${i.v} = ${last_input.v}`;
                else
                    res += i.idx_expr;
                last_input = i;
                if (i.t.dType === BinaryArray)
                    prev_b.push(i.v)
                else
                    prev_v.push(i.v)
                return res + ';'
            }).join('\n');
            if (prev_v.length>1){
                let v = prev_v.pop();
                if ($.forward)
                    res += `\n\t${tabs + v} = forward(${prev_v.join(' * ')}, ${v});`
                else
                    res += `\n\t${tabs + v} = ${prev_v.join(' * ')} * ${v};`;
                prev_v = [v]
            }
            if (prev_b.length>1){
                let b = prev_b.last;
                result += '\n\t'+tabs + b + ` = (${prev_b.join(' + ')} - ${prev_b.length})&1;`;
                prev_b = [b]
            }
            return res;
        }).join('\n')+'\n'
        const input_for_func = function (ts){
            const uses = outs.map(o => o.a);
            let result = ''
            let cl = 0;
            let tab = 0
            let tabs = out_tabs;
            inputs.map((input, i)=>{
                for (let axis of input){
                    let axis_name = axis.a;
                    if (uses.includes(axis_name))
                        continue;
                    uses.push(axis_name);
                    result+= '\n'+tabs + `for(let ${axis_name} = 0; ${axis_name} < _${axis_name}; ${axis_name}++){\n`

                    let inps = inputs.filter(i=>{
                        return i.some(a => {
                            if (a.a === axis_name){
                                a.used = true;
                                return  true;
                            }
                        });
                    })
                    result += inps.filter(i=>{
                        return i.every(a=>a.used)
                    }).map(i=>{
                        let res = '\t'+tabs;
                        if (last_input?.t === i?.t)
                            res += `${i.v} = ${last_input.v}`;
                        else
                            res += i.idx_expr;
                        if (i.t.dType === BinaryArray)
                            prev_b.push(i.v)
                        else
                            prev_v.push(i.v)
                        last_input = i;
                        return res + ';'
                    }).join('\n');
                    if (prev_v.length>1){
                        let v = prev_v.pop();
                        if ($.forward)
                            result += `\n\t${tabs + v} = forward(${prev_v.join(' * ')}, ${v});`
                        else
                            result += `\n\t${tabs + v} = ${prev_v.join(' * ')} * ${v};`;
                        prev_v = [v]
                    }
                    if (prev_b.length>1){
                        let b = prev_b.last;
                        result += '\n\t'+tabs + b + ` = (${prev_b.join(' + ')} - ${prev_b.length})&1;`;
                        prev_b = [b]
                    }
                    cl++;
                    tab++
                    tabs = out_tabs + '\t'.repeat(tab)
                }
            })
            const has_bins = tensors.some(t=>t.dType === BinaryArray)
            result += '\n';
            if (has_bins){
                let b = prev_b.pop();
                if (prev_v.length){
                    let v = prev_v.pop();
                    result += tabs + `if(${b} === '1')\n`;
                    result += tabs + `\tres += ${v};\n`;
                    result += tabs + `else\n`;
                    result += tabs + `\tres -= ${v};\n`;
                }
                else
                    result += tabs + `res += (${b}==='1')?1:-1;\n`;
            }
            else{
                result += tabs + `res += ${last_input.v};\n`;
            }


            result += Array(cl).fill('').map((c, i)=> out_tabs + '\t'.repeat(i) + '}').toReversed().join('\n')
            return result + '\n';
        }

        let body = '';
        body += input_for_func(inputs);
        body += out_tabs + 'out[++idx]  = res;';

        let fwd_expr = vars + '\n';
        fwd_expr += out_for;

        fwd_expr +=  out_tabs + 'let res = 0;';
        fwd_expr += '\n' + body + '\n';
        fwd_expr += outs.map((_, i)=>'\t'.repeat(i)+'}').toReversed().join('\n');

        fn = new Function('t', 'out', fwd_expr);
        fn_cache.einsum ??= Object.create(null);
        fn = (fn_cache.einsum[key] = {fn, outs, inputs}).fn;
    }
    else{
        outs = fn.outs;
        inputs = fn.inputs;
        fn = fn.fn
    }

    const data = outs.length?new $.dType(outs.reduce((r,a)=> r * a.d, 1)):new $.dType(1);
    let out = tensor.from(data);
    let shape = outs.map(i=>i.d);
    if(!shape.length)
        shape = [1];
    out._shape(shape);
    out._src(tensors);
    out._back = function (){
        const grad = tensor.from(out.grad)._shape(out);
        const out_res = []
        tensors.forEach((t, i)=>{
            if(!t.allowGrad) return;
            const in_vars = inputs.map((tt, ii)=>{
                if(ii === i)
                    return outs.map(o=>o.a).join('');
                return tt.map(o=>o.a).join('');
            })
            let out_vars = inputs[i].map(i=>i.a);//.filter(o=>in_vars.some(i => i.includes(o)))
            let adds = inputs[i].filter(o=>!in_vars.some(i => i.includes(o.a)))
            let expr = in_vars.join(',')  + '->' + out_vars.join('');
            if (adds.length)
                expr += JSON.stringify(adds.map(a=>{
                    delete a.used;
                    return a;
                }));
            let sources = tensors.map((tt,ii)=>{
                if(ii === i)
                    return grad;
                return tt;
            })
            let out_back = tensor.einsum(expr, sources, {forward: $['backward_'+ i]?.toString()});
            out_res.push(out_back);
            t.grad = t.grad.map((g,i)=>{
                return g + out_back.data[i];
            });
        })
        return out_res;
    }
    fn(tensors, out.data);
    out._label(`einsum (${out.shape}): '${in_expr}'`);
    // console.timeEnd(key)
    return out;
}
tensor.prototype.transpose = function(dim0= -1, dim1 = -2) {
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
    return tensor.einsum(expression, this)._label(`transpose ${dim0}->${dim1}`);
}
tensor.prototype.pad = function(paddings, mode = 'constant', constant_value = 0) {
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
    for (let i = 0; i < this.data.length; i++) {
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
        for (let i = 0; i < this.data.length; i++) {
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
const fn_cache = Object.create(null);

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