import {tensor, torus} from "../torus/torus.js";
export const nn = {};
nn.Module = nn.NeuroModule = class NeuroModule extends Function{
    #params = Object.create(null);
    #label = undefined;
    losses  = [];
    _listeners = [];
    destroyTime = 0;
    constructor(argumetns) {
        super();
        if (!argumetns)
            argumetns = [];
        if (argumetns.length === 1 && argumetns[0].constructor === Object){
            // const p = Object.assign(this.#params, argumetns[0])
            this.setModel(argumetns[0]);
        }
        else{
            let expr = this.constructor.toString();
            expr = expr.replace(/\/\/.*/g, '').replace(/\/\*[^\*\/]*\*\//g, '');
            const names = expr.match(/(?<=\()(.|(\r?\n))*?(?=\))/g)[0].split(',');
            for (let i = 0; i<names.length; i++){
                let name = names[i]
                if (name.startsWith('...')){
                    name = name.split('.').pop();
                    this[name] = this.#params[name] ??= argumetns;
                    break;
                }
                let [n, d] = name.split('=').map(i=>i.trim());
                this[n] = this.#params[n] ??= argumetns[i] ?? (new Function("return "+d))();
            }
            this.__init__?.call(this.params);
        }
        for (let n in this.params){
            this[n] ??= this.params[n];
        }

        this.params.losses ??= this.losses;
        return new Proxy(this, {
            get(target, p, receiver) {
                return target[p];
            },
            apply(target, _, args) {
                return target.forward(...args);
            }
        })
    }
    get loss(){
        return this.losses.last;
    }
    listen(event, handler){
        const listeners = this._listeners[event] ??= [];
        listeners.add(handler);
    }
    fire(event, value){
        (this._listeners[event] || []).forEach(handler=>{
            handler.call(this,  value);
        })
    }
    get model(){
        return JSON.stringify(this.params, undefined, 2)
    }
    setModel(model){
        for (let n in model){
            const item = model[n];
            this[n] = this.#params[n] = ((item)=>{
                function recurse (obj){
                    if (Array.isArray(obj)){
                        return obj.map(i=> {
                            if (i?.$)
                                return new (eval(i.$))(i);
                            return recurse (i);
                        })
                    }
                    if (obj?.$)
                        return new (eval(obj.$))(obj);
                    if (obj?.constructor === Object){
                        let res = Object.create(null);
                        for (let o in obj){
                            res[o] = recurse(obj[o])
                        }
                        return res;
                    }
                    return obj
                }
                return recurse (item);
            })(item)
        }
    }
    get params(){
        return this.#params;
    }
    forward(x, target, backward = true){
        return x;
    }
    train(input, target, loss_func = 'MSE'){
        const result  = this(input);
        let loss = result[loss_func](target);
        loss.back();
        this.losses.push(loss.data[0]);
        return result;
    }
    back(g){
        return g;
    }
    get parameters(){

    }
    get __children__(){
        let ch = Object.getOwnPropertyDescriptors(this);
        const result = []
        for (let n in ch){
            const prop = ch[n]
            if (prop.value instanceof  NeuroModule){
                result.push({[n]:prop.value})
            }
            else if (prop.value instanceof tensor){
                result.push({[n]:prop.value})
            }
            else if (Array.isArray(prop.value) && prop.value[0]  instanceof  NeuroModule ){
                result.push({[n]:prop.value.map(i=>i)})
            }
        }
        return result;
    }
    toString(step = 0){
        let tab = ('  ').repeat(step);
        let s = tab + `${this.label}\n`;
        tab = ('  ').repeat(++step);
        step++;
        s += this.__children__.map(obj => {
            const key = Object.keys(obj)[0];
            const prop = obj[key];
            if(Array.isArray(prop)){
                return tab + key + `[${prop.length}]:\n` + prop.map((m, i)=>(' ').repeat(step)+i+': '+m.toString(step)).join('')
            }
            return tab + key+':\n' + prop.toString(step);
        }).join('\n');
        return s;
    }
    _label(label){
        this.#label = label;
        return this;
    }
    get label(){
        return this.#label ??= `${this.constructor.name} (${Object.keys(this.params).filter(p=>typeof this.params[p] !== "object").map(p => p+': ' + this.params[p]).join(', ')})`;
    }
    toJSON(){
        const props = Object.getOwnPropertyDescriptors(this);
        const res = Object.assign({$: this.constructor.name},this.params);
        for(let key in props){
            const obj = props[key];
            if (!obj.enumerable) continue;
            if(obj?.value && typeof obj.value === 'object'){ // вложенный модуль
                res[key] = JSON.parse(JSON.stringify(obj.value));
            }
        }
        // res.losses = this.losses;
        return res
    }
}
nn.Linear = class Linear extends nn.Module{
    constructor(shape_in, shape_out, bias = false) {
        if(arguments.length>1){
            if(!Array.isArray(shape_in))
                shape_in = [shape_in];
            if(!Array.isArray(shape_out))
                shape_out = [shape_out];
            arguments[0] = shape_in;
            arguments[1] = shape_out;
        }
        super(arguments);
    }
    __init__() {
        this.size_in = this.shape_in.mul();
        this.size_out = this.shape_out.mul();
        let w = tensor.empty(this.shape_in, this.shape_out);
        this.weight = tensor.param(w._label(w.label + ': Weights'));
        if(this.bias){
            let b = tensor.empty(this.shape_out);
            this.B = tensor.param(b._label(b.label + ': Bias'));
        }

    }
    updateOutShape(new_shape){ //Изменение выходного размера слоя!!!
        if(!Array.isArray(new_shape))
            new_shape = [new_shape];

        if (new_shape.sum() <= this.shape_out.sum())
            return;
        this.shape_out = this.params.shape_out = new_shape;
        let data = new this.W.dType(this.shape_in.mul() * this.shape_out.mul());
        data = data.map((_,i)=>{
            return this.W.data[i] ?? (Math.random()-.5) * .1;
        })
        this.W._resize_data(data, this.shape_in, this.shape_out);
        if (this.bias){
            data = new this.B.dType(this.shape_out.mul());
            data = data.map((_,i)=>{
                return this.B.data[i] ?? (Math.random()-.5) * .1;
            })
            this.B._resize_data(data, this.shape_out);
        }
    }
    forward(input){
        input = tensor.from(input);
        input._label(`INPUT (${input.shape})`);
        let output = tensor.einsum('...a, ab->...b', [input, this.weight]);
        if (this.bias)
            output = output.plus(this.B)._label('plus BIAS');
        output._label(`Linear (${output.shape}): bias=`+this.bias);
        return output;
    }
}
nn.Embedding = class Embedding extends nn.Linear{
    constructor(shape_in, shape_out, bias = false) {
        super(arguments);
    }

    forward(input) {
        const data = new Uint8Array(input.size * this.size_in);
        for (let i = 0; i<input.size; i++){
            const idx = i * this.size_in;
            data[idx + input.data[i]] = 1;
        }
        input = tensor.from(data).reshape(input.shape, this.size_in);
        return super.forward(input);
    }
}
nn.Dropout = class Dropout extends nn.Module{
    constructor(probability = 0.5, inplace = false){
        super(arguments)
    }
    forward(x){
        return x.dropout(this.probability, this.inplace);
    }
}
nn.conv1D = class conv1D extends nn.Module {
    constructor(in_channels,
                out_channels,
                kernel_size = 4,
                stride = 1,
                padding = 0,
                padding_mode = 'zeros', // options('zeros', 'reflect', 'replicate', 'circular')
                dilation = 1,
                groups = 1,
                bias = true) {
        super(arguments);
    }
    __init__() {
        if (this.in_channels%this.groups)
            throw new Error('in_channels must be divisible by groups');
        if (this.out_channels%this.groups)
            throw new Error('out_channels must be divisible by groups');
        let k = Math.sqrt(this.groups / (this.in_channels * this.kernel_size))
        this.weight_shape = [this.out_channels, this.in_channels / this.groups, this.kernel_size];
        this.weights = tensor.param(tensor.rand(this.weight_shape).minus_(.5).mul_(2 * k));
        if (this.bias)
            this.bias_weights = tensor.param(tensor.rand([this.out_channels]).minus_(.5).mul_(2 * k));
        this.pads = Array(this.padding).fill(0);
    }
    forward(x) {
        let k_size = this.kernel_size;
        if ((x.getDim(-2) || 1) !== this.in_channels)
            throw new Error(`Given groups=${this.groups}, weight of size [${this.weight_shape}], expected input[${x.shape}] to have ${this.in_channels} channels, but got ${(x.getDim(-2) || 1)} channels instead`);
        let stride = this.stride;
        let dilation = this.dilation;
        let x_data = x.data;
        let k_data = this.weights.data;
        let padding = this.padding;
        let L_in = x.getDim(-1);
        let padded_size = L_in + padding * 2;
        let over_axis = x.shape.slice(0, x.dim-2);

        let batches = over_axis.mul();
        let dim_out = (padded_size - dilation * (k_size - 1) - 1) / stride + 1;
        const shape_out = [this.out_channels, dim_out];
        shape_out.unshift(...over_axis)
        const out_size = shape_out.mul();
        let data = new Float32Array(out_size);

        let outs = this.out_channels;
        let links = this.in_channels / this.groups;
        let ins = this.in_channels;
        let groups = this.groups;
        let in_idx = 0;
        let in_step = x.getDim(-1) * this.groups;
        const kernels = [];
        let idx = -1;
        let data_step = this.in_channels * L_in;
        batches *= data_step
        for (let b = 0; b < batches; b += data_step){
            let batch_data = x.data.slice(b, b + data_step);
            for (let o = 0; o < outs; o++) {
                let kernel = kernels[o] ??= this.weights.slice(o);
                let src_idx = 0;
                let k_idx = 0;
                for (let l = 0; l<links; l++){
                    let src = new Float32Array(L_in);
                    for (let g = 0; g < groups; g++){
                        const src_grp = batch_data.slice(src_idx, src_idx += L_in);
                        src = src.map((v, i)=>{
                            return v + src_grp[i];
                        })
                    }
                    let src_data =  [...this.pads, ...src, ...this.pads];

                    let k = kernel.slice(k_idx, k_idx += k_size);
                    for (let step = 0; step < dim_out; step++){
                        data[++idx] = k.reduce((r, k_val, i)=>{
                            let x_idx = step * stride + i * dilation;
                            return r + k_val * src_data[x_idx];
                        }, 0)
                    }
                }
            }
        }
        const out = tensor.from(data)._src(x, this.weights)._label(this.label)._shape(shape_out);
        out._back = ()=>{
            let out_idx = -1;
            let in_idx = -1;
            let o_grad = out.grad;
            let k_step = this.weights.size / this.weights.shape[0];
            let k_grad = this.weights.grad;
            for (let b = 0; b < batches; b += data_step){
                for (let o = 0; o < outs; o++) {
                    let src_idx = 0;
                    let k_idx = o * k_step;
                    for (let gr = 0; gr < groups; gr++){
                        for (let l = 0; l<links; l++){
                            let x_idx = (in_idx++) - this.padding;
                            // const src_grp = batch_data.slice(src_idx, src_idx += L_in);
                            let src_data =  [...this.pads, ...src_grp, ...this.pads];
                            for (let step = 0; step < dim_out; step++){
                                const g = o_grad[++out_idx];
                                for (let i = 0; i<k_size; i++){
                                    let x_idx = step * stride + i * dilation;
                                    k_grad[k_idx] += src_data[x_idx] * g;
                                    x_data[x_idx] += k_data[k_idx] * g;
                                    k_idx++;
                                }
                            }
                        }
                    }
                }
            }
        }
        return out;
    }

}
nn.RMSNorm = class RMSNorm extends nn.Module {
    constructor(dim, bias = false) {
        super(arguments);
    }
    __init__() {
        this.W = tensor.param(tensor.rand(this.dim))._label('RMSNorm - W');
        if (this.bias)
            this.B = tensor.param(tensor.rand(this.dim))._label('RMSNorm - bias');
        this.eps = 1e-5;
    }
    forward(x) {
        x = tensor.from(x);
        let axis = (x.shape.length>1)?Array(x.shape.length-1).fill(65).map((v,i)=>String.fromCharCode(v+i)).join(''):'';

        let p = x.pow(2);
        let m = p.mean();
        let eps = m.plus(this.eps);
        let sqrt = eps.func('_rsqrt');
        let mul = this.W.mul(sqrt);
        let out = mul.mul(x);
        if (this.bias)
            out = out.plus(this.B)
        return out;
    }
}

function Conv1d(in_channels, out_channels, kernel_size, stride = 1, padding = 0, dilation = 1, groups = 1, bias = true, padding_mode = 'zeros') {
    const weight = new tensor([out_channels, in_channels / groups, kernel_size], 'float32');
    const input = new tensor([1, in_channels, input_data.length], 'float32');

    if (bias) {
        const bias_data = new Array(out_channels).fill(0);
        this.bias = new tensor([out_channels], 'float32', bias_data);
    }

    this.forward = function(input_data) {
        input.data = input_data;

        const output_length = Math.floor((input.shape[2] + 2 * padding - kernel_size) / stride) + 1;
        const output = new tensor([1, out_channels, output_length], 'float32');

        if (padding_mode === 'zeros') {
            const padded_input = tensor.pad(input, [0, 0, padding, padding], 'constant', 0);
            for (let g = 0; g < groups; g++) {
                for (let out_channel = g; out_channel < out_channels; out_channel += groups) {
                    for (let i = 0; i < output_length; i++) {
                        for (let j = 0; j < kernel_size; j++) {
                            const input_index = i * stride + j * dilation;
                            const in_channel = Math.floor(weight.data[out_channel + j * weight.shape[1] + g]) / groups;

                            output.data[i + out_channel * output_length] +=
                                padded_input.data[input_index + in_channel * padded_input.shape[2]] *
                                weight.data[out_channel + j * weight.shape[1] + g];
                        }
                    }
                    if (bias) {
                        output.data[i + out_channel * output_length] += bias.data[out_channel];
                    }
                }
            }
        } else {
            // Реализация других режимов заполнения (padding_mode)
        }

        return output;
    }
}


function Conv1dBackward(input, grad_output, weight, bias = null, stride = 1, padding = 0, dilation = 1, groups = 1) {
    const in_channels = input.shape[1];
    const out_channels = grad_output.shape[1];
    const kernel_size = weight.shape[2];

    const grad_input = new Tensor(input.shape, 'float32');
    if (bias !== null) {
        const grad_bias = new Tensor(bias.shape, 'float32');
        for (let i = 0; i < out_channels; i++) {
            grad_bias.data[i] = grad_output.sum(0, i);
        }
        return [grad_input, grad_weight, grad_bias];
    } else {
        const grad_weight = new Tensor(weight.shape, 'float32');
        for (let g = 0; g < groups; g++) {
            for (let i = 0; i < out_channels; i++) {
                if (g === i % groups) {
                    for (let j = 0; j < kernel_size; j++) {
                        const weight_index = i * weight.shape[1] * weight.shape[2] + (g + j * groups) * weight.shape[2] + j;
                        for (let k = 0; k < in_channels / groups; k++) {
                            const input_index = k * in_channels / groups + g + j * dilation;
                            const output_index = k * out_channels + i;
                            grad_weight.data[weight_index] += input.data[input_index] * grad_output.data[output_index];
                        }
                    }
                }
            }
        }

        if (padding_mode === 'zeros') {
            const padded_input = Tensor.pad(input, [0, 0, padding, padding], 'constant', 0);
            for (let g = 0; g < groups; g++) {
                for (let i = 0; i < in_channels / groups; i++) {
                    for (let j = 0; j < out_channels; j++) {
                        if (g === j % groups) {
                            for (let k = 0; k < kernel_size; k++) {
                                const weight_index = j * weight.shape[1] * weight.shape[2] + (g + k * groups) * weight.shape[2] + k;
                                const input_index = i * in_channels / groups + g + k * dilation;
                                const output_index = i * out_channels + j;
                                grad_input.data[input_index] += weight.data[weight_index] * grad_output.data[output_index];
                            }
                        }
                    }
                }
            }
        } else {
            // Реализация других режимов заполнения (padding_mode)
        }

        return [grad_input, grad_weight];
    }
}
nn.ReLU = class ReLU extends nn.Module{
    constructor(){
        super(arguments);
    }
    forward(x){
        return x.relu();
    }
}
nn.Sequential = class Sequential extends nn.Module{
    constructor(...modules){
        super(arguments);
    }
    __init__(){
        this.modules = this.modules.map((m, i)=>{
            if(m instanceof nn.Module)
                return this[m.constructor.name] = m;
            else
                throw new Error(`nn.Sequential: unkcnown class of module ${i+1}`)
        })
    }
    forward(x){
        for(let module of this.modules){
            x = module(x);
        }
        return x;
    }
}

for(let module in nn){
    const ctor = nn[module];
    if(ctor !== nn.Module)
        nn[module] = function (){
            return new ctor(...arguments);
        }
}
