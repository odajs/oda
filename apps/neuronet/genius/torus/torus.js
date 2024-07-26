const USE_TESTS = false;
export const LEARNING_RATE = .1;
export const GRADIENT_DIVIDER = 1//.618;
BigInt.prototype.toBin = function (dim = 64){
    return this.toString(2).padStart(dim, '0');
}
globalThis.BinaryArray = class BinaryArray extends BigUint64Array{
    _binSize = 0;
    #length = 0;
    _self = undefined;
    bit_mask = BigInt(1);
    constructor(size) {
        super(Math.ceil(size/64));
        this._binSize = size;
        this['#length'] = size;
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
        return this['#bins'] ??= Array.prototype.map.call(this.data, d => d.toBin());
    }
    get binLength(){
        return this['#length']
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
export class tensor{
    #shape = [];
    #data = null;
    #dType = Float32Array;
    #label = 'tensor';
    #src = undefined;
    constructor(data, dType = Float32Array) {
        if(!data) return;
        if (data?.$ === this.constructor.name){
            this.#dType = globalThis[data.dType];
            this.#shape = data.shape.split(',');
            data = data.data.split(' ');
            // if (this.dType === BigUint64Array)
            //     data = data.map(i=>BigInt('0b'+i));
            this.#data = new this.dType(data);

        }
        else{
            this.#dType = dType;
            if (Array.isArray(data)){
                let shape = [];
                let d = data;
                while(Array.isArray(d) && d.length){
                    shape.push(d.length);
                    d = d[0];
                    data = data.flat()
                }
                this.#shape = shape;
                if (!(data instanceof this.dType))
                    data = new this.dType(data);

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
    toJSON(){
        const result =  {
            $: this.constructor.name,
            shape: this.shape.toString(),
            isSerializable: this.isSerializable,
            isParam: this.isParam,
            dType: this.dType.name,
            data: this.data.join(' ').toString()
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
        const size = shape.reduce((r, v)=>r * v, 1);
        if (size !== this.size)
            throw new Error(`_shape from (${this.shape}) to (${shape}) not allow.`);
        this.#shape = shape
        return this;
    }
    _slice(...dims){
        if(Array.isArray(dims[0]))
            dims = dims[0];
        if (dims.length >= this.dim)
            throw new Error(`Axis count for _slice(...) must be less then tensor.dim, expected ${dims.length} to have ${this.dim}`);
        dims.forEach((v, i)=>{
            if (v >= this.shape[i])
                throw new Error(`Axis[${i}] for _slice(...) must be less dimension then tensor.shape[${i}], expected ${v} to have ${this.shape[i]}`);
        })
        let step =  this.shape.slice(dims.length).reduce((r, v, i)=>r * v, 1);
        let start = dims.reduce((r, v, i)=>r * v, 1) * step;
        return this.#data.slice(start, start + step);
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
        return this['#grad'] ??= new Float32Array(this.size);
    }
    get data(){
        return this.#data;
    }
    set grad(n){
        this['#grad'] = n;
    }
    get BiTES_PER_ELEMENT(){
        return this.dType.BYTES_PER_ELEMENT * 8;
    }
    get bins(){
        return this['#bins'] ??= Array.prototype.map.call(this.data, d => d.toBin(this.BiTES_PER_ELEMENT)).join('').slice(0, this.size);
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
        return this.shape.reduce((r, v)=>r * v, 1);
    }

    get data(){
        return this.#data;
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
        if (this.dType === BinaryArray){
            let bins = this.bins;
            let data = this.data;
            let idx = 0;
            let val = '';
            for(let i = 0; i<bins.length; i++){
                let g = this.grad[i];
                let sign = Math.sign(g)
                let value = bins[i];
                switch (sign){
                    case 1: //g>0
                        // if(!value && Math.max(0,Math.min(1,(g + 1)/2))>Math.random())
                           value = 1
                        break;
                    case -1: //g<0
                        // if(value && Math.max(0,Math.min(1,(g + 1)/2))>Math.random())
                           value = 0
                        break;
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
            this['#bins'] = undefined
        }
        else{
            for(let i = 0; i<this.data.length; i++){
                this.data[i] += this.grad[i] * LEARNING_RATE;
            }
        }
    }
    back(grad){
        this.topo = [];
        let visited = new Set();
        let build_topo = (t) => {
            if (!visited.has(t)) {
                visited.add(t)
                t.src?.forEach(ch => build_topo(ch))
                this.topo.push(t)
            }
        }
        build_topo(this);
        this.topo.forEach((node) => {
            node.clearGrad();
        })
        this.topo.reverse();
        if(grad){
            this.topo[0].grad = grad;
        }
        this.topo.forEach((node) => {
            if (!node.src) return;
            node._back?.();
        })
        this.topo.forEach((node) => {
            if (node.src) return;
            node.updateParams();
        })
    }

    static concat(tensors, dim= 0){
        throw new Error(`to do`);
    }
    slice(from, to, step){
        throw new Error(`to do`);
    }
    getDim(dim){
        if (-this.dim > dim || this.dim - 1 < dim)
            throw new Error(`Dimension out of range (expected to be in range of [-${this.dim}, ${this.dim - 1}], but got ${dim})`)
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
        if(split_sizes.reduce((r, v)=>r + v, 0) !== max)
                throw new Error(`split_sizes expects to sum exactly to ${max} (input tensor's size at dimension ${dim}), but got split_sizes=[${split_sizes}]`);
        let idx = -1;
        const src = this.data;
        let shape = [...this.shape];
        if (dim < 0)
            dim = this.dim + dim;
        const data = split_sizes.map(v=>{
            shape[dim] = v;
            const size = shape.reduce((r, s)=>r * s, 1);
            const d = new this.dType(size).map(x=>src[++idx]);
            return tensor.from(d, 'split', [this])._shape(...shape);
        });
        console.log(data)
        return data;

    }
    static stack(tensors, dim= 0){
        let shape = [...tensors[0].shape];
        if (this.dim < dim)
            throw new Error(`Dimension out of range (expected to be in range of [-${this.dim+1}, ${this.dim}], but got ${dim})`)
        let size = tensors[0].size;
        let step = size;
        if (dim < 0)
            dim = this.dim + 1 + dim
        let d = dim;
        for (let s of shape){
            if (!d) break;
            step /= s;
            d--;
        }
        const max = Math.max(...tensors.map(t=>t.dType.BYTES_PER_ELEMENT));
        let t = tensors.find(t => {
            return t.dType.BYTES_PER_ELEMENT === max;
        });

        const data = new t.dType(size * tensors.length);
        let idx = -1;
        for (let i = 0; i < size; i += step){
            for (let t of tensors){
                for (let j = i; j<i + step; j++)
                    data[++idx] = t.data[j];
            }
        }
        shape.splice(dim, 0, tensors.length);
        const out = tensor.from(data)._shape(shape)._label(`stack(${tensors.length} tensors with shape(${shape}), dim=${dim})`)._src(tensors);
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
    static fill(shape, value, dType = Float32Array){
        if (!Array.isArray(shape))
            shape = [shape];
        let handler = typeof value === 'function'?value:i=>value;
        let size = shape.reduce((r, v)=>r * v, 1);
        let data = new dType(size);
        data = data.map(handler);
        return tensor.from(data, dType)._shape(shape);
    }
    static zeros(shape, dType = Int8Array) {
        return this.fill(shape, 0, dType);
    }
    static ones(shape, dType = Int8Array) {
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
                return BigInt('0b'+Math.round(Math.random() * 2 ** 32).toString(2).padStart(32, '0') + Math.round(Math.random() * 2 ** 32).toString(2).padStart(32, '0'));
            }
        }
        return this.fill(shape, handler, dType);
    }
    static randNorm(shape){
        return this.fill(shape, ()=>Math.sqrt(-2 * Math.log(Math.random()))*Math.cos((2 * Math.PI) * Math.random()), Float32Array);
    }
    static arange(arange_params, dType = Float32Array){
        if (Number.isInteger(arange_params)){
            arange_params = [0, arange_params,  1];
        }
        if (!Array.isArray(arange_params))
            throw new Error('arange');
        if (arange_params.length === 0)
            throw new Error('arange');
        if (arange_params.length < 2){
            arange_params[0] = arange_params[0];
            arange_params.unshift(0);
        }
        if (arange_params.length < 3)
            arange_params.push(1);
        let [from, to, step] = arange_params;
        step = Math.abs(step)
        const size = Math.round((Math.max(from, to) - Math.min(from, to)) / step);
        const data = new dType(size);
        let idx = -1;
        if (from < to){
            for(let d = from; d < to; d += step){
                data[++idx] = d
            }
        }
        else if (from > to){
            for(let d = from; d > to; d -= step){
                data[++idx] = d
            }
        }


        return tensor.from(data, dType);
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
        if (Object.equal(data.constructor, tensor))
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
        const multiply = repeat_shape.reduce((r, v)=>r*v, 1);
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
    toString(max = 8){
        if (this.shape.length){
            let data = this.array.toTensorString(max, this.shape).split('\r\n');
            // if (data.length > max){
            //     const padding = data[0].length/2 + 2
            //     data = [...data.slice(0, Math.floor(max/2)), ('...').padStart(padding, ' '), ...data.slice(-Math.floor(max/2))]
            // }
            data = data.join('\r\n')
            return `(${data}),\r\ndType=${this.dType.name}, shape(${this.shape}), size(${this.size.toLocaleString()})`;
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
            for (let i = 0; i < data.length; i += s){
                res.push(Array.from(data.slice(i, i + s)))
            }
            data = res;
            res = [];
        }
        return data.flat();
    }
}
tensor.prototype.matmul = function (other){
    let expr, label;
    if(Array.isArray(other)){
        let mm = other.map(o=>{
            return tensor.einsum('x,x ->', [this, o]);
        })
        let data = mm.map(i=>{
            return i.data;
        })
        let out = tensor.from(data)._src(...mm)._label('matmul tensor X Array');
        out._back = ()=>{
            mm.forEach((o, i)=>{
                for (let gi = 0; gi<o.grad.length; gi++){
                    o.grad[gi] += out.grad[i + gi];
                }
            })
        }
        return out;
    }
    else{
    //     let x = this.data;
    //     if (this.dType === BinaryArray){
    //         // todo
    //     }
    //     else{
    //
    //         if (other.dType === BinaryArray){
    //             switch (this.dim){
    //                 case 1:{
    //                     switch (other.dim){
    //                         case 2:{
    //                             if (this.shape[0] !== other.shape[0])
    //                                 throw new Error();
    //                             let y_bins = other.bins;
    //                             let x_size = this.shape[0];
    //                             let y_size = other.shape[1];
    //                             const data = new Float32Array(y_size);
    //                             for (let y = 0; y < y_size; y++){
    //                                 let y_out = 0;
    //                                 for (let x = 0; x < x_size; x++){
    //                                     let idx = y + y_size * x;
    //                                     if (y_bins[idx] === '1')
    //                                         y_out += this.data[x];
    //                                     else
    //                                         y_out -= this.data[x];
    //                                 }
    //                                 data[y] = y_out;
    //                             }
    //                             const out = tensor.from(data)._src(x, other)._label(`matmul: ${x_size} x (${other.shape}, Bin)`);
    //                             out._back = ()=>{
    //                                 const out_grad = tensor.from(out.grad)
    //                                 this.grad = out_grad.matmul(other.T);
    //                                 other.grad = out_grad.matmul(this); //todo
    //                             }
    //                             return out;
    //                         } break;
    //                     }
    //
    //                 } break;
    //
    //             }
    //         }
    //         else {
    //             // todo
    //         }
    //     }
    // //
    // //
    // //     const other_shape = [...other.shape];
    // //     const out_shape = [];
    // //     while (other_shape.length>2){
    // //         out_shape.unshift(other_shape.shift())
    // //     }
    // //
    // //
    // //     if (other.dType === BinaryArray){
    // //         if (this.dType === BinaryArray){
    // //             let data = other.bins.reduce((r_bins, o_bins, i_bins)=>{
    // //                 let this_bins = this.bins[i_bins].split('');
    // //                 return r_bins + o_bins.split('').reduce((r, o, i)=>{
    // //                     let x = +this_bins[i] || -1;
    // //                     if (+o)
    // //                         return r + x;
    // //                     return r - x;
    // //
    // //                 }, 0)
    // //             }, 0)
    // //             let out = tensor.from(data)._src(this, other)._label('matmul 1 bin X 1 bin');
    // //             out._back = ()=>{
    // //                 let gradient = out.grad[0] / GRADIENT_DIVIDER;
    // //                 let x_grad = this.grad;
    // //                 let o_grad = other.grad;
    // //                 other.bins.forEach((b, i_bins)=>{
    // //                     let o_bin = b.split('');
    // //                     let x_bin = this.bins[i_bins].split('');
    // //                     for (let i = 0; i<64; i++){
    // //                         let idx = i_bins + i;
    // //                         x_grad[idx] += (+o_bin[i]>0?gradient:-gradient);
    // //                         o_grad[idx] += (+x_bin[i]>0?gradient:-gradient);
    // //                     }
    // //                 })
    // //             }
    // //             return out;
    // //         }
    // //         else{
    // //
    // //         }
    // //     }
    // //     else{
    // //         switch (this.dim){ //todo дописать различные варианты
    // //             case 1:{
    // //                 switch (other.dim){
    // //                     case 1:{
    // //                         expr = 'x,y=>xy';
    // //                     } break;
    // //                     case 2:{
    // //                         if (other.shape[0] === this.size)
    // //                             expr = 'x, xy=>y';
    // //                         else if (other.shape[1] === this.size)
    // //                             expr = 'x, yx=>y';
    // //                         else throw new Error(`One of the matrix axes must have the same dimension as the input vector, but the vector has dimension ${this.shape} and the matrix is ${other.shape}`)
    // //                     }
    // //                 }
    // //             } break;
    // //         }
    // //         return tensor.einsum(expr, [this, matrix])._label(label);
    // //     }
    }

}
tensor.prototype.log = function (){
    const data = this.data.map(Math.log);
    const out = tensor.from(data, 'log', [this])._shape(this);
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
    const out = tensor.from(data, `exp`, [this])._shape(this);
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
    const out = tensor.from(data, `invert`, [this])._shape(this);
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
    const out = tensor.from(data, 'plus', [this, other])._shape(this);
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
    const out = tensor.from(data, 'minus', [this, other])._shape(this);
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
    const out = tensor.from(data, 'mul', [this, other])._shape(this);
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
    const out = tensor.from(data, 'div', [this, other])._shape(this);
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
    let out =  tensor.from(data, `pow`, [this, other])._shape(this);
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
    return tensor.from(data, 'tahn', [this])._shape(this);
}

tensor.prototype.sigm = function (y = 1, z = 1, exp = Math.E){
    const data = this.data.map((x,i) => (y[i] ?? y) / ((z[i] ?? z) + Math.pow((exp[i] ?? exp), -x)))
    const out = tensor.from(data)._shape(this)._src(this)._label('sigm');
    out._back = ()=>{
        for(let i = 0; i<data.length; i++){
            let x = data[i];
            this.grad[i] += (1 - x) * x * out.grad[i] / GRADIENT_DIVIDER;
        }
    }
    return out;
}
tensor.prototype.mandelbrot = function (storage_tensor){
    let data;
    let size = this.size;
    if(storage_tensor){
        if(!storage_tensor.data){
            data = new Float32Array(size * 2).map(i=>Math.random()-.5);
            data.fill(2, size, size * 2);
            storage_tensor._data(data)._shape(2, ...this.shape);
        }
        data = storage_tensor.data;
        data = this.data.map((x, i)=> Math.pow(x,  data[i +size]) + data[i]);
    }
    else
        data = this.data.map(x => Math.pow(x,  2) + 1)
    const out = tensor.from(data)._shape(this)._src(this)._label('mandelbrot');
    if(storage_tensor){
        out._src(this, storage_tensor);
        out._back = ()=>{
            let o_grad = out.grad;
            let x_grad = this.grad;
            let s_grad = storage_tensor.grad;
            let s_data = storage_tensor.data;
            for(let i = 0; i<data.length; i++){
                let x = data[i];
                let y = s_data[i];
                let z = s_data[i+size];
                let g = o_grad[i] / GRADIENT_DIVIDER;
                x_grad[i] += y * Math.pow(x, y-1) * g;
                s_grad[i] += g;
                s_grad[i+size] += Math.pow(x, y) * Math.ln(x) * g;
            }
        }
    }
    else{
        out._back = ()=>{
            let o_grad = out.grad;
            let x_grad = this.grad;
            for(let i = 0; i<data.length; i++){
                x_grad[i] += 2 * data[i] * o_grad[i] / GRADIENT_DIVIDER;
            }
        }
    }
    return out;
}
tensor.prototype.softplus = function (storage_tensor) {
    let data;
    let size = this.size;
    if(storage_tensor){
        if(!storage_tensor.data){
            data = new Float32Array(size * 2).fill(1,0, this.size);
            data.fill(Math.E, size, size * 2);
            storage_tensor._data(data)._shape(2, ...this.shape);
        }
        data = storage_tensor.data;
        data = this.data.map((x, i)=> Math.log(data[i] + data[i + size] ** x));
    }
    else
        data = this.data.map(x => Math.log(1 + Math.exp(x)))
    const out =  tensor.from(data)._label('this')._src(this)._shape(this);
    if(storage_tensor){
        out._src(this, storage_tensor);
        out._back = ()=>{
            let o_grad = out.grad;
            let x_grad = this.grad;
            let s_grad = storage_tensor.grad;
            let s_data = storage_tensor.data;
            for(let i = 0; i<data.length; i++){
                let og = o_grad[i] / GRADIENT_DIVIDER;
                let x = data[i];
                let y = s_data[i];
                let z = s_data[i+size];
                let expX = z ** x;
                let yPlusExpX = y + expX;
                let lnZ = Math.log(z)
                x_grad[i] += (expX / yPlusExpX) * og;
                s_grad[i] += (1 / (lnZ * (yPlusExpX))) * og;
                s_grad[i+size] += (x * expX * lnZ - Math.log(yPlusExpX) * yPlusExpX) / (z * lnZ ** 2 * yPlusExpX) * og;

            }
        }
    }
    else {
        out._back = () => {
            let o_grad = out.grad;
            let x_grad = this.grad;
            for (let i = 0; i < data.length; i++) {
                let x = data[i];
                let exp = Math.exp(x);
                x_grad[i] += (exp / (1 + exp)) * o_grad[i] / GRADIENT_DIVIDER;
            }
        }
    }
    return out;
}


tensor.prototype.silu = function (storage_tensor) {
    let data;
    let size = this.size;
    if(storage_tensor){
        if(!storage_tensor.data){
            data = new Float32Array(size * 2).fill(1,0, this.size);
            data.fill(Math.E, size, size * 2);
            storage_tensor._data(data)._shape(2, ...this.shape);
        }
        data = storage_tensor.data;
        data = this.data.map((x, i)=> (x  / (data[i] + data[i + size] ** -x)));
    }
    else
        data = this.data.map((x, i)=> x  / (1 + Math.exp(-x)));
    const out =  tensor.from(data)._label('silu')._src(this)._shape(this);
    if(storage_tensor){
        out._src(this, storage_tensor);
        out._back = ()=>{
            let o_grad = out.grad;
            let x_grad = this.grad;
            let s_grad = storage_tensor.grad;
            let s_data = storage_tensor.data;
            for(let i = 0; i<data.length; i++){
                let og = o_grad[i] / GRADIENT_DIVIDER;
                let x = data[i];
                let y = s_data[i];
                let z = s_data[i+size];
                let ex = z ** -x;
                let onePlusEx = y + ex;
                let onePlusEx2 = onePlusEx ** 2;

                x_grad[i] += (onePlusEx + ex * x * Math.log(z)) / onePlusEx2 * og;
                s_grad[i] += -x/onePlusEx2 * og;
                s_grad[i+size] += x ** 2 * z ** -(x-1)/onePlusEx2 * og;
            }
        }
    }
    else{
        out._back = ()=>{
            let o_grad = out.grad;
            let x_grad = this.grad;
            for(let i = 0; i<data.length; i++){
                let x = data[i];
                let ex = Math.exp(-x);
                let onePlusEx = 1 + ex;
                let g = (onePlusEx + ex * x) / (onePlusEx ** 2);
                x_grad[i] += g * o_grad[i] / GRADIENT_DIVIDER;
            }
        }
    }

    return out;
}

tensor.prototype.softmax = function (){
    const exp = this.data.map(Math.exp).reduce((r, v) => r + v);
    const data = this.data.map((x, i)=>  Math.exp(x) / exp);
    const out =  tensor.from(data)._src(this)._label('softmax')._shape(this);
    out._back = ()=>{
        for(let i = 0; i<data.length; i++){
            let d = data[i];
            let sum = data.reduce((r, sj, j)=>{
                let v = (i === j) ?d * (1 - d): -d * sj;
                return r + v
            })// * out.grad[i];
            this.grad[i] += sum * out.grad[i] / GRADIENT_DIVIDER;
        }
    }
    return out;
}
tensor.prototype.MSE = function (target){
    let y = target.data ?? target;
    let loss = 0;
    let errors = this.data.map((x, i)=>{
        x = (x - y[i]);
        loss += x ** 2;
        return x;
    });
    loss /= this.size;
    const out = tensor.from([loss])._src(this)._label('MSE');
    out._back = ()=>{
        let _x = this.grad;
        for (let i = 0; i<errors.length; i++){
            _x[i] += -2 * errors[i];
        }
    }
    return out;
}

tensor.prototype.crossEntropy = function (target) {
    let y = target.data ?? target;
    let error = -this.data.reduce((r, x, i)=>r + y[i] * Math.log(x), 0)
    const out = tensor.from(error)._src(this)._label('crossEntropy');
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
    return x.toExponential(2).padStart(9, ' ');
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
        inputs.map((_, i) => {
            const t = tensors[i]
            let str =  `let dType${i} = ${t.dType.name};\n`;
            if (t.dType === BinaryArray)
                str += `let t${i} = t[${i}].bins;`
            else
                str += `let t${i} = t[${i}].data;`
            return str;
        }).join('\n'),
        inputs.map((_, i) => `let idx${i} = 0;`).join('\n'),
        inputs.map((_, i) => `let v${i} = 0;`).join('\n')
    ].join('\n');
    vars += `\nlet mult, sign;`;
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
        const has_bins = tensors.some(t=>t.dType === BinaryArray)
        const mult = inputs.map((_,i)=>{
            const t = tensors[i];
            if (t.dType !== BinaryArray)
                return 'v'+i;
        }).filter(l=>l).join(` * `)
        if (mult)
            result += tabs + 'mult = ' + mult + ';\n';
        if (has_bins){
            result += tabs + 'sign = (' + inputs.map((_,i)=>{
                const t = tensors[i];
                if (t.dType === BinaryArray)
                    return '(v'+i+' - 1)';
            }).filter(l=>l).join(` + `) + ')&1;\n';
            // }).filter(l=>l).join(` * `) + ');\n';
            // }).filter(l=>l).join(` + `) + ')%2||1;\n';
            if (mult)
                result += tabs + 'res += sign?-mult:mult;\n';
            else
                result += tabs + 'res += sign?-1:1;\n';
        }
        else{
            result += tabs + 'res += mult;\n';
        }


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
    out._shape(outs.map(i=>i.d));
    out._src(tensors);
    const fn = new Function('t', 'out', fwd_expr);
    out._back = function (){
        out = tensor.from(out.grad)._shape(out);
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
    out._label('einsum: \"'+in_expr+'\"' + (out.shape.length?(' ('+out.shape+')'):''));
    return out;
}

tensor.prototype.pad = function(paddings, mode = 'constant', constant_value = 0) {
    let new_shape = this.shape.slice();
    for (let i = 0; i < paddings.length; i++) {
        new_shape[i] += paddings[i] * 2;
    }
    let new_data = new this.dType(new_shape.reduce((a, b) => a * b, 1)).fill(constant_value);
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

function binarize (grad_i) {return grad_i>0} 
// function binarize (grad_i) {
//     let p = Math.max(0,Math.min(1,(grad_i+1)/2)) // σ(x) = hard sigmoid
//     return p>Math.random() // +1 with probability p = σ(x), -1 otherwise.
// }