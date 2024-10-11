globalThis.LEARNING_RATE = 0.1;
globalThis.GRADIENT_DIVIDER = 1;
export class tensor{
    #shape = [];
    #data = null;
    #dType = Float32Array;
    #label = undefined;
    #src = undefined;
    #grad = undefined;
    #bins = undefined;
    #path = undefined;
    constructor(data, dType = Float32Array) {
        if(!data) return;
        if (data?.$ === this.constructor.name){
            this.#dType = globalThis[data.dType];
            this.#shape = data.shape;
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
                else{
                    if (!(data instanceof dType))
                        data = new dType(data);
                }
                this.#shape = shape;
                this.#dType = dType;

            }
            else if(this.dType === BinaryArray) {
                if (data?.length)
                    this.#shape = [data?.binLength];
            }
            else{
                if (data?.length)
                    this.#shape = [data?.length]
                else
                    data = new this.dType([data])
            }
            this.#data = data;
        }
        this.id = genId();
    }
    _resize_data(data, ...shape){
        while (shape.some(i=>Array.isArray(i)))
            shape = shape.flat();
        const size = shape.mul();
        if (size !== data.length)
            throw new Error(`_shape from (${this.shape}) to (${shape}) not allow.`);
        this.#data = data;
        this.#shape = shape
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
        return this.getPath();
    }
    toJSON(){
        const result =  {
            $: this.constructor.name,
            label: this.label,
            shape: this.shape,
            isSerializable: this.isSerializable,
            isParam: this.isParam,
            dType: this.dType.name,
            data: this.data?.join(' ')
        }
        return result;
    }
    _label(label){
        this.#label = label;
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
    _shape(...shape){ // shape or tensor
        if(Array.isArray(shape[0]))
            shape = shape[0];
        if(Object.equal(shape[0]?.constructor, tensor))
            shape = shape[0].shape;
        const size = shape.reduce((r, v)=>r * (v || 1), 1);
        if (size !== this.size)
            throw new Error(`_shape from (${this.shape}) to (${shape}) not allow.`);
        this.#shape = shape
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
        return this.#data;
    }
    set data(n){
        if (n.length !== this.#data.length)
            throw new Error(`Dimension out of range (expected ${this.#data.length}, but got ${n.length})`);
        this.#data = n
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
        let axis_this = this.shape.reduce((r,v,i)=>r = String.fromCharCode(i + 97) + r, '');
        let axis_out = axis_this.split('');
        axis_out.reverse();
        axis_out = axis_out.join('')
        return tensor.einsum(axis_this+'->'+axis_out, [this]);
    }
    get g(){
        return tensor.from(this.grad)._shape(this);
    }
    get shape(){
        return this.#shape;
    }
    get size(){
        return this.shape.mul();
    }
    get dim(){
        return this.shape.length;
    }
    get label(){
        return this.#label ?? (()=>{
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
    get paramCount(){
        if (this.isParam)
            return this.size;
        return 0;
    }
    clearGrad(){
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
                const rand = Math.random();
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
            // if (!this.grad[0])
            //     console.log('empty gradient', this)
            for(let i = 0; i<this.data.length; i++){
                this.data[i] += this.grad[i] * tensor.LEARNING_RATE;
            }
        }
    }
    back(grad){
        const topo = [];
        let visited = new Set();
        let build_topo = (t) => {
            if (!visited.has(t)) {
                visited.add(t)
                t.src?.forEach(ch => build_topo(ch))
                topo.push(t)
            }
        }
        build_topo(this);
        topo.forEach((node) => {
            node.clearGrad();
        })
        topo.reverse();
        if(grad){
            topo[0].grad = grad;
        }
        topo.forEach((node) => {
            if (!node.src) return;
            node._back?.();
            if (topo[0] !== node && !node.grad[0]){
                console.log('back no_grads: '+topo.indexOf(node), node.label, node.grad)
            }
        })
        topo.forEach((node) => {
            if (node.src) return;
            node.updateParams();
        })
    }

    static concat(tensors, dim= 0){
        throw new Error(`to do`);
    }
    getDim(dim){
        if (-this.dim > dim || this.dim - 1 < dim)
            throw new Error(`Dimension out of range (expected to be in range of [-${this.dim}, ${this.dim - 1}], but got ${dim})`);
        if (dim < 0)
            dim = this.dim + dim;
        return  this.shape[dim];
    }
    split(split_sizes, dim = 0){
        let max = this.getDim(dim);
        if (Number.isInteger(split_sizes)){
            let arr = [];
            let i;
            for (i = 0; i < max; i += split_sizes){
                if (i + split_sizes < max)
                    arr.push(split_sizes);
                else
                    arr.push(max - i);
            }
            split_sizes = arr;
        }
        if (!Array.isArray(split_sizes))
            throw new Error(`Argument 'split_sizes' (position 1) must be 'Integer' or 'array of Integer', but not '${typeof split_sizes}'`)
        if(split_sizes.sum() !== max)
                throw new Error(`split_sizes expects to sum exactly to ${max} (input tensor's size at dimension ${dim}), but got split_sizes=[${split_sizes}]`);
        let idx = -1;
        const src = this.data;
        let shape = [...this.shape];
        if (dim < 0)
            dim = this.dim + dim;
        const result = split_sizes.map((v, i)=>{
            shape[dim] = v;
            const size = shape.mul();
            let start = idx;
            const d = new this.dType(size).map(x=>src[++idx]);
            let out = tensor.from(d)._shape(...shape)._src(this)._label(`split (${shape}): ${i+1} of ${split_sizes.length} -> ${v}`);
            if (this.allowGrad){
                out._back = ()=>{
                    out.grad.forEach((g, i)=>{
                        this.grad[i + start] = g;
                    })
                }
            }
            return out
        });
        return result;

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
            dim = first.dim + 1 + dim
        let d = dim;
        for (let s of first.shape){
            if (!d) break;
            step /= s;
            d--;
        }
        const data = new dType(shape.mul() * size);
        let idx = 0;
        for (let i = 0; i < size; i += step){
            let delta = i + step;
            for (let j = 0; j<tensors.length; j++){
                let t = tensors[j];
                data.set(t.data.slice(i, delta), idx);
                idx+=step;

            }
        }
        const out = tensor.from(data)._shape(...shape,  ...first.shape)._label(`stack(${tensors.length} tensors with shape(${first.shape}) by ${dim} axis)`)._src(tensors);
        out._back = ()=>{
            idx = 0;
            for (let i = 0; i < size; i += step){
                for (let t of tensors){
                    const slice = out.grad.slice(idx, idx + step);
                    t.grad = t.grad.map((v,j)=>{
                        return v+slice[j];
                    })
                    idx+=step;
                }
            }
            if (tensors.map(i=>i.grad).filter(i=>i.indexOf(0)>-1)>0){
                console.log('УПС!!')
            }
        }
        return out
    }
    static fill(shape, value, dType = Float32Array){
        if (!Array.isArray(shape))
            shape = [shape];
        let handler = typeof value === 'function'?value:i=>value;
        let size = shape.mul();
        let data = new dType(size);
        data = data.map(handler);
        return tensor.from(data, dType)._shape(shape);
    }
    static zeros(shape, dType = Float32Array) {
        return this.fill(shape, 0, dType);
    }
    static ones(shape, dType = Float32Array) {
        return this.fill(shape, 1, dType);
    }
    static ones_like(src) {
        return this.ones(src.shape, src.dType);
    }
    static rand(shape, dType) {
        let handler = Math.random;
        if (dType === BinaryArray){
            // handler = BigInt('0b'+Math.round(Math.random() * 2 ** 32).toString(2).padStart(32, '0') + Math.round(Math.random() * 2 ** 32).toString(2).padStart(32, '0'));
            handler = ()=>{
                // return 5508166759905001231n
                let value = Math.random().toString(2).substring(2);
                return BigInt('0b' + value.padEnd(64, value))
                //return BigInt('0b'+Math.round(Math.random() * 2 ** 32).toString(2).padStart(32, '0') + Math.round(Math.random() * 2 ** 32).toString(2).padStart(32, '0'));
            }
        }
        return this.fill(shape, handler, dType);
    }
    static random(shape, from = 0, to = 1, dType = Float32Array) {
        let handler = ()=>{
            return Math.random() * (to - from) + from;
        }
        if (dType === BinaryArray){
            // handler = BigInt('0b'+Math.round(Math.random() * 2 ** 32).toString(2).padStart(32, '0') + Math.round(Math.random() * 2 ** 32).toString(2).padStart(32, '0'));
            handler = ()=>{
                // return 5508166759905001231n
                let value = Math.random().toString(2).substring(2);
                return BigInt('0b' + value.padEnd(64, value))
                //return BigInt('0b'+Math.round(Math.random() * 2 ** 32).toString(2).padStart(32, '0') + Math.round(Math.random() * 2 ** 32).toString(2).padStart(32, '0'));
            }
        }
        return this.fill(shape, handler, dType);
    }
    static randNorm(shape){
        return this.fill(shape, ()=>Math.sqrt(-2 * Math.log(Math.random()))*Math.cos((2 * Math.PI) * Math.random()), Float32Array);
    }
    static arange(shape, from = 0, to, dType =Float32Array){
        if (!Array.isArray(shape))
            shape = [shape];
        let steps = shape.pop();
        let repeat = shape.mul();
        shape.push(steps);
        if (to === undefined){
            to = from + steps - 1;
        }
        let step = (to - from) / (steps - 1);
        let data = [];
        let idx = -1;
        let v = from-step;
        for (let i = 0; i < steps; i++){
            data[++idx] = (v += step);

        }
        data = new dType(Array(repeat).fill(data).flat());
        return tensor.from(data, dType)._shape(shape);
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
    static param(src){
        src = tensor.from(src);
        src.isParam = true;
        src.isSerializable = true;
        return src;
    }
    reverse(dim = 0){
        if (-this.dim > dim || this.dim - 1 < dim)
            throw new Error(`Dimension out of range (expected to be in range of [-${this.dim}, ${this.dim - 1}], but got ${dim})`)
        if (dim < 0)
            dim = this.dim + dim;


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
    toString(step = 0, max = 6){
        if (this.shape.length){
            let data = this.array.toTensorString(step, max, this.shape).split('\n');
            data = data.join('\n')
            let tab = ('  ').repeat(step)
            return tab +`tensor[${this.label}]: dType=${this.dType.name}, shape(${this.shape}), size(${this.size})\n${tab}(${data})`;
        }
        return this.data;
    }
    get array() {
        if(!this.shape.length)
            return [this.data];
        let data;
        if (this.dType === BinaryArray)
            data = this.bins.match(/0|1/g).map(i=>i==='1'?1:-1);
        else
            data = this.data;
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
    static get GRADIENT_DIVIDER() {
        return globalThis.GRADIENT_DIVIDER
    }
    static set GRADIENT_DIVIDER(n) {
        globalThis.GRADIENT_DIVIDER = n
    }

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

tensor.prototype._element_wise_operator = function (label, other, forward_func, this_back_func, other_back_func){
    other = tensor.from(other);
    let dim  = Math.max(this.dim, other.dim);
    let shape = []
    for (let i = 0; i<dim; i++){
        let idx1 = this.shape[this.shape.length - i - 1] || '';
        let idx2 = other.shape[other.shape.length - i - 1] || '';
        if (idx1 && idx2 && idx1 !== idx2)
            throw new Error(`RuntimeError: The size of first tensor (${idx1}) must match the size of second tensor (${idx2}) at ${i} dimension`);
        shape.push(Math.max(idx1, idx2));
    }
    let size = shape.mul();
    let func = [`let out = new Float32Array(${size});`];
    func.push('let idx, g;');
    func.push('const x_data = this.data;');
    func.push('const y_data = other.data;');
    if (this.shape.length === 0)
        func.push(`let x = this.data[0];`);
    if (other.shape.length === 0)
        func.push(`let y = other.data[0];`);
    let t;
    for (let i = 0; i<dim; i++){
        t = '\t'.repeat(i);
        let s = shape.slice(0, i+1).mul();
        func.push(t+`for(let i${i} = 0; i${i} < ${s}; i${i} += ${s/shape[i]}){`);
        let idx = Array(i+1).fill().map((_,  i)=>'i'+i).join(' + ')
        if (dim - i === 1)
            func.push(t+`\tidx = ${idx};`);
        if (this.shape.length === i + 1) {
            func.push(t+`\tlet x = x_data[${dim - i === 1?'idx':idx}];`);
        }
        if (other.shape.length === i + 1) {
            func.push(t+`\tlet y = y_data[${dim - i === 1?'idx':idx}];`);
        }
    }
    func.push(t+`\tout[idx] = func(x,y);`);
    shape.forEach((_, i)=>func.push('\t'.repeat(dim - i - 1)+`}`))
    func.push(`return out;`);
    func = func.join('\n')
    func = new Function('other', 'func', func);
    let data = func.call(this, other, forward_func);
    const out = tensor.from(data)._src(this, other)._shape(shape.toReversed());
    out._label(label+' ('+out.shape+')');
    if (this_back_func && (this.allowGrad || other.allowGrad)){
        out._back = ()=>{
            func = ['let idx;'];
            func.push(`let _x, x = 0;`);
            func.push(`let _y, y = 0;`);
            func.push('const x_data = this.data;');
            func.push('const y_data = other.data;');
            func.push('const o_grad = out.grad;');
            func.push('const x_grad = this.grad;');
            func.push('const y_grad = other.grad;');
            for (let i = 0; i<dim; i++){
                t = '\t'.repeat(i);
                let s = shape.slice(0, i+1).mul()
                func.push(t+`for(let i${i} = 0; i${i} < ${s}; i${i} += ${s/shape[i]}){`);
                let idx = Array(i+1).fill().map((_,  i)=>'i'+i).join(' + ')
                if (dim - i === 1)
                    func.push(t+`\tidx = ${idx};`);
                if (this.shape.length === i + 1) {
                    func.push(t+`\tx = ${dim - i === 1?'idx':idx};`);
                }
                if (other.shape.length === i + 1) {
                    func.push(t+`\ty = ${dim - i === 1?'idx':idx};`);
                }
            }
            func.push(t+`\tg = o_grad[idx] / ${GRADIENT_DIVIDER};`);
            func.push(t+`\t_x = x_data[x];`);
            func.push(t+`\t_y = y_data[y];`);
            if (this.allowGrad)
                func.push(t+`\tx_grad[x] += x_func(_x,_y) * g;`);
            if (other.allowGrad)
                func.push(t+`\ty_grad[y] += y_func(_x,_y) * g;`);
            shape.forEach((_, i)=>func.push('\t'.repeat(dim - i - 1)+`}`));
            func = func.join('\n')
            func = new Function('other', 'out', 'x_func', 'y_func', func);
            func.call(this, other, out, this_back_func, other_back_func || this_back_func);
        }
    }
    return out;
}
tensor.prototype.plus = function (other){
    return this._element_wise_operator('plus', other, (x,y)=>x+y, ()=>1);
}
tensor.prototype.minus = function (other){
    return this._element_wise_operator('minus', other, (x,y)=>x-y, ()=>1, ()=>-1);
}
tensor.prototype.multiply = function (other){
    return this._element_wise_operator('multiply', other, (x,y)=>x*y, (x,y)=>y, x=>x);
}
tensor.prototype.divide = function (other){
    return this._element_wise_operator('divide', other, (x,y)=>x/y, (x,y)=>1/y, (x,y)=>-x/(y**2));
}
tensor.prototype.pow = function (other){
    return this._element_wise_operator('pow', other, (x,y)=>x**y, (x,y)=>y * (x ** (y - 1)), (x,y)=>x ** y * Math.log(x));
}
tensor.prototype._element_wise_function = function (label, forward_func, back_func){
    const data = this.data.map(forward_func);
    const out = tensor.from(data)._src(this)._shape(this);
    out._label(label+' ('+out.shape+')');
    if (back_func && this.allowGrad){
        out._back = ()=>{
            let x_grad = this.grad;
            let x_data = this.data;
            let o_data = out.data;
            let x, y, g
            this.grad = this.grad.map((res, i)=>{
                x = this.data[i];
                y = out.data[i];
                g = out.grad[i] / GRADIENT_DIVIDER;
                return res + back_func(x, y) * g
            })
            if (this.grad.indexOf(0)>-1){
                console.log('УПС!!')
            }
        }
    }
    return out;
}
tensor.prototype.invert = function (){
    return this._element_wise_function('invert', x=>x * -1, ()=>-1);
}
tensor.prototype.exp = function (){
    return this._element_wise_function('exp', Math.exp, x=>x);
}
tensor.prototype.log = function (){
    return this._element_wise_function('log', Math.log, (x, y)=>1/x*y);
}
tensor.prototype.tanh = function (){
    return this._element_wise_function('tanh', Math.tanh, x=>(1 - x ** 2));
}
tensor.prototype.sigmoid = function (params){
    return this._element_wise_function('sigmoid', x=>(1 / (1 + Math.exp(-x))), (x, y)=>y * (1 - y));
}
tensor.prototype.sigm = function (params){
    return this.sigmoid(params);
}
tensor.prototype.relu = function (params) {
    return this._element_wise_function('relu', (x)=>(x>0?x:0), (x, y)=>(y>0?1:0));
}
tensor.prototype.mandelbrot = function (params){
    return this._element_wise_function('mandelbrot', x=>(Math.pow(x,  2) + 1), (x, y)=>(2 * y));
}
tensor.prototype.softplus = function (params) {
    return this._element_wise_function('softplus', x=>(Math.log(1 + Math.exp(x))), (x, y)=> {
        let exp = Math.exp(y);
        return exp / (1 + exp);
    });
}
tensor.prototype.silu = function (params) {
    return this._element_wise_function('silu', x=>(x  / (1 + Math.exp(-x))), (x, y)=> {
        let ex = Math.exp(-y);
        let onePlusEx = 1 + ex;
        return (onePlusEx + ex * y) / (onePlusEx ** 2);
    })
}
tensor.prototype.softmax = function (){
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
                this.grad[idx] += sum * out.grad[idx] / tensor.GRADIENT_DIVIDER;
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
    //             this.grad[idx] += sum * out.grad[idx] / tensor.GRADIENT_DIVIDER;
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
        let y = start>target.size?target.data.slice(0, step):target.data.slice(start, start + step);
        let errors = Array.prototype.map.call(slice, (x, j)=>{
            return (y[j] || 0) - x;
        });
        return errors
    })
    let losses = errors.map(i=>{
        return i.reduce((r, v) => r + (v**2), 0)/(i.length || 1);
    })
    const out = tensor.from(losses)._src(this)._label(`MSE (${this.shape})`);
    errors = errors.flat();
    out._back = ()=>{
        for (let i = 0; i<errors.length; i++){
            this.grad[i] += errors[i];
        }
        if (this.grad.indexOf(0)>-1){
            console.log('УПС!!')
        }
    }
    return out;
}

tensor.prototype.repeat = function (count = 1) {
    return tensor.from(Array(count).fill().map(i=>this));
}

tensor.prototype.crossEntropy = function (target) {
    target = tensor.from(target);

    let ys = target.data;
    const step = this.shape.last;
    const size = this.size/step;

    let errors = Array(this.size/step).fill().map((d, i)=>{
        let start = i * step
        let slice = this.data.slice(start, start + step);
        let y = start>target.size?target.data.slice(0, step):target.data.slice(start, start + step);
        let errors = Array.prototype.map.call(slice, (x, j)=>{
            x = -y[j] * Math.log(x);
            return x;
        });
        return errors
    })
    let losses = errors.map((e)=>{
        return e.reduce((r,v)=> r+v );
    });
    const out = tensor.from(losses)._src(this)._label('crossEntropy');
    this._back = ()=>{
        this.src.forEach(src=>{
            src.grad = this.grad;
        })
    }
    out._back = ()=>{
        this.grad = ys.map((y, i)=> {
            let x = this.data[i];
            return y - x;
        });
    }
    return out;
}

if (!Array.prototype.toTensorString) {
    Object.defineProperty(Array.prototype, 'toTensorString', {
        configurable:true,
        enumerable:false,
        value (step = 0, max = 4, shape = []) {
            function recurse(d, idx = 0, l = 0){
                let result = (idx?`\n${('  ').repeat(step)+(' ').repeat(l)}[`:'[');
                if (d[0]?.map){
                    let list = Array.from(d).map((v, i)=>{
                        return recurse(v, i, l + 1);
                    })
                    result += list.join(' ');
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
    } )
}

function num2text(x){
   if (Number.isInteger(x) || Number.isNaN(x) || !Number.isFinite(x))
        return x.toString().padStart(2, ' ');
    return x.toExponential(2).padStart(9, ' ');
}

function genId(){
    return ++_id;
}
let _id = 0;
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

tensor.eye = (...shape)=>{
    if(Array.isArray(shape[0]))
        shape = shape[0];
    const size = shape.reduce((r, v)=>r * (v || 1), 1);
    const data = new Float32Array(size);
    let dim = shape.last
    let step = Math.min(size/ dim, dim);
    for (let i = 0; i<step; i++){
        data[i * dim + i] = 1;
    }
    return tensor.from(data)._shape(shape)._label('eye');
}
tensor.einsum = (in_expr, sources = [])=>{
    const tensors = sources.map(t => tensor.from(t));
    let key = in_expr + ':' + tensors.map(i=> i.shape.toString()+'('+ i.dType.name +')' ).join('-');
    let fn = fn_cache.einsum?.[key];
    let inputs, outs;
    if (!fn){         // Выделение из выражения оператора
        let expr = in_expr.split('->');                            // Разделение выражения на вход и выход
        const axis = [];//Object.keys(ext_axis).map(a =>({a, d:ext_axis[a]}));
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
                    throw new Error(`Axis '${a}' == ${ax.d} but on tensor №${i+1} this axis == ${d}`);
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
            [...outs, ...axis].map((o, i) =>`let _${o.a} = ${o.d};`).join('\n'),
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
        // vars += `\nlet mult, sign;`;
        // if (outs.length)
        vars += `\nlet idx = -1;\n`;


        const out_tabs = '\t'.repeat(outs.length);

        // let data_idx = (outs.length)?`[++idx]`:'';
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
                res += `\n\t${tabs + v} *= ${prev_v.join(' * ')};`;
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
                        result += '\n\t'+tabs + v + ' *= ' + prev_v.join(' * ')+';';
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
        fn = (fn_cache.einsum[in_expr + ': ' + key] = {fn, outs, inputs}).fn;
    }
    else{
        outs = fn.outs;
        inputs = fn.inputs;
        fn = fn.fn
    }

    const data = outs.length?new Float32Array(outs.reduce((r,a)=> r * a.d, 1)):new Float32Array(1);
    let out = tensor.from(data);
    out._shape(outs.map(i=>i.d));
    out._src(tensors);
    out._back = function (){
        const grad = tensor.from(out.grad)._shape(out);
        tensors.forEach((t, i)=>{
            if(!t.allowGrad) return;
            let expr =  inputs.map((tt, ii)=>{
                if(ii === i)
                    return outs.map(o=>o.a).join('');
                return tt.map(o=>o.a).join('');
            }).join(',') + '->' + inputs[i].map(i=>i.a).join('');
            let sources = tensors.map((tt,ii)=>{
                if(ii === i)
                    return grad;
                return tt;
            })
            let out = tensor.einsum(expr, sources);
            for (let j = 0; j<out.size; j++){
                t.grad[j] += out.data[j] / GRADIENT_DIVIDER;
            }
            if (t.grad.indexOf(0)>-1){
                console.log('УПС - einsum')
            }
        })
    }
    fn(tensors, out.data);
    out._label(`einsum (${out.shape}): '${in_expr}'`);
    return out;
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