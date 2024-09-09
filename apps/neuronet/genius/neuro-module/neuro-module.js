import {tensor} from "../torus/torus.js";
export class NeuroModule extends Function{
    #params = Object.create(null);
    #label = undefined;
    losts  = [];
    constructor(argumetns) {
        super()

        if (argumetns.length === 1 && argumetns[0].constructor === Object){
            this.setModel(this.#params = argumetns[0]);
        }
        else{
            let expr = this.constructor.toString();
            expr = expr.replace(/\/\/.*/g, '').replace(/\/\*[^\*\/]*\*\//g, '');
            const names = expr.match(/(?<=\()(.|(\r?\n))*?(?=\))/g)[0].split(',');
            for (let i = 0; i<names.length; i++){
                let name = names[i]
                let [n, d] = name.split('=').map(i=>i.trim());
                this[n] = this.#params[n] ??= argumetns[i] ?? (new Function("return "+d))();
            }
            this.__init__.call(this.params);
        }
        for (let n in this.params){
            this[n] ??= this.params[n];
        }
        return new Proxy(this, {
            get(target, p, receiver) {
                return target[p];
            },
            apply(target, _, args) {
                return target.forward(...args)
            }
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
                        return item.map(i=> {
                            if (i.$)
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
    forward(x){
        return x;
    }
    back(g){
        return g;
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
        return this.#label ??= `${this.constructor.name} (${Object.keys(this.params).map(k=>k+': '+(this.params[k].name || this.params[k])).join(', ')})`;
    }
    toJSON(){
        const props = Object.getOwnPropertyDescriptors(this);
        const res = Object.assign({$: this.constructor.name},this.params);
        for(let key in props){
            const obj = props[key];
            if(obj?.value && typeof obj.value === 'object'){ // вложенный модуль
                res[key] = JSON.parse(JSON.stringify(obj.value));
            }
        }
        return res
    }
    train(dataset, getTrain, steps=1000, los_steps=100, loss_type='MSE', test_size=0.2, banch=10) {
        // for (let i= 0; i < steps; i++) {
        //     let [inputs,target] = getTrain(dataset, test_size, banch)
        //     for (let j=0; j <inputs.length; j++ ) {

        //         this(inputs[j]); 
        //     }
        //     let loss = .MSE(target);
        //     loss.back();
        //     if (i % los_steps === 0) console.log(loss)
        // }
        // return this    
    }

}
export class Embedding  extends NeuroModule{
    negativeSize = 3;
    constructor(dim = 1024, char_step = 0, win_size = 8) {
        super(arguments);
    }
    __init__(){
        this.BINS = Array(this.win_size).fill().map((v, i)=>(2. ** -(i+1) + .5));
        this.vocabulary = {"<end>":{
                id: 0,
                w: "<end>",
                emb: tensor.param(tensor.zeros(this.dim)),
                cnt: tensor.param(tensor.rand(this.dim).minus_(.5))
            }}
    }
    static cosSimilar(A, B) {
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
    forward(x){

    }
    plus(...tokens){
        let token = this._plus(...tokens);
        return this.near(token);
    }
    _plus(...tokens){
        tokens = tokens.map(t=>{
            if(typeof(t) === 'string')
                return this._plus(...this._tokenize(t));
            return tensor.from(t.emb || t);
        });
        tokens = tokens.reduce((res, v)=>{
            v = v.data;
            return res.map((x,i) => x + v[i])
        }, new Float32Array(this.dim))
        return tensor.from(tokens);
    }
    near(token){
        if(typeof(token) === 'string')
            token = this._plus(...this._tokenize(t));
        token = tensor.from(token.emb || token);
        const res = this.tokens.map(t=>{
            const v = Embedding.cosSimilar(t, token);
            return {w:t.w, v};
        }).sort((a,b)=>{
            return (a.v>b.v)?-1:1
        })
        return res;
    }
    get size(){
        return this['#size'] ??= this.tokens.length;
    }
    get error(){
        return this['#error'] ??= (()=>{
            const tokens = this.tokens.filter(i=>(i.error>0 && i.error<1))
            const size = tokens.length;
            if (!size)
                return 1;
            let error = tokens.reduce((r, t) =>{
                return r + t.error;
            }, 0)
            error /= size;
            return  error;
        })()
    }
    train(text){
        let tokens = this._tokenize(text);
        tokens.push(this.vocabulary['<end>']);
        let j;
        for (let i = 0; i<tokens.length; i++){
            let token = tokens[i];
            j = i + 1;
            let window = tokens.slice(j, j + this.win_size);
            this.trainStep(token, window);
        }
        return tokens;
    }
    trainStep(token, phrase){
        if (!phrase.length)
            return 1;
        let target = this.BINS.slice(0, phrase.length);
        let size = this.win_size * (this.negativeSize + 1);
        let stop = size * 2;
        while (stop-- && phrase.length < size && this.size > size){
            const idx = Math.ceil(Math.random() * this.size)
            const t = this.tokens[idx];
            if (t && !phrase.includes(t)){
                target.push(0);
                phrase.push(t);
            }
        }
        const emb = token.emb;
        phrase = tensor.stack(phrase.map(i=>i.cnt));
        let res = tensor.einsum(`x,yx->y`, [emb, phrase]);
        res = res.sigm();
        res = res.MSE(target);
        token.error = res.data[0];
        res.back();
        this['#error'] = undefined;
    }
    get tokens(){
        return this._tokens ??= Object.values(this.vocabulary);
    }
    _tokenize(text){
        if(this.char_step)
            return this._tokenizeByChars(text);
        return this._tokenizeByWord(text);
    }
    _tokenizeByWord(text){
        text = text.toLowerCase();
        let word = '';
        let tokens = [];
        for (let ch of text){
            switch (ch){
                case '\r':
                case '\n':
                case '\t':
                case ' ':{
                    if (word)
                        tokens.push(this._addToken(word + ' '));
                    word = ''
                } break;
                case '/':
                case '-':
                case '(':
                case ')':
                case '[':
                case ']':
                case '{':
                case '}':
                case ':':
                case ';':
                case ',':{
                    if (word)
                        tokens.push(this._addToken(word + ' '));
                    tokens.push(this._addToken(ch + ' '));
                    word = ''
                } break;
                case '!':
                case '?':
                case '.':{
                    if (word)
                        tokens.push(this._addToken(word + ' '));
                    tokens.push(this._addToken(ch + ' '));
                    word = ''
                } break;
                default:{
                    word += ch;
                }
            }
        }
        word = word.trim();
        if (word)
            tokens.push(this._addToken(word + ' '));
        return tokens;
    }
    _tokenizeByChars(text){
        text = text.toLowerCase();
        let tokens = [];
        for (let i = 0; i<text.length; i += this.char_step){
            const word = text.substr(i, this.char_step)
            let token = this._addToken(word);
            if(!token) continue;
            tokens.push(token)

        }
        return tokens;
    }
    _addToken(word){
        if (!word.trim().length)
            return;
        return this.vocabulary[word] ??= (()=>{
            const res = Object.create(null);
            res.w = word;
            res.id = Object.keys(this.vocabulary).length;
            res.emb = tensor.param(tensor.rand(this.dim).minus_(.5))._label('emb: '+word);
            res.cnt = tensor.param(tensor.rand(this.dim).minus_(.5))._label('cnt: '+word);
            this._tokens = undefined
            this['#size'] = undefined;
            return res;
        })()
    }
}
export class Linear extends NeuroModule{
    constructor(d_in, d_out, bias = false, dType = Float32Array) {
        super(arguments);
    }
    __init__() {
        this.W = tensor.param(tensor.rand([this.d_in, this.d_out], this.dType).minus_(.5).mul_(.1));
        this.W._label(this.W.label + ': Weights');
        if(this.bias){
            this.B = tensor.param(tensor.rand([this.d_out], this.dType).minus_(.5).mul_(.1));
            this.B._label(this.B.label + ': Bias');
        }

    }
    forward(x){
        x = tensor.from(x);
        x._label(`INPUT (${x.shape})`);
        let axis = (x.shape.length>1)?Array(x.shape.length-1).fill(65).map((v,i)=>String.fromCharCode(v+i)).join(''):'';
        x = tensor.einsum(`${axis}i, io -> ${axis}o`, [x, this.W]);
        if (this.bias)
            x = x.plus(this.B)._label('plus BIAS');
        x._label(`Linear (${x.shape}): bias=`+this.bias);
        return x;
    }
}
export class BinLayer extends NeuroModule{
    constructor(dim_in,  dim_out, bias = false) {
        super(arguments);
    }
    __init__(){
        this.WEIGHTS = tensor.param(tensor.rand([this.dim_in, this.dim_out], BinaryArray));
        if (this.bias)
            this.BIAS = tensor.param(tensor.rand([this.dim_out], BinaryArray));
    }
    forward(x) {
        x = tensor.from(x);
        let axis = (x.shape.length>1)?Array(x.shape.length-1).fill(65).map((v,i)=>String.fromCharCode(v+i)).join(''):'';
        let out = tensor.einsum(`${axis}i, io -> ${axis}o`, [x, this.WEIGHTS]);
        if (this.bias)
            out = out.plus(this.BIAS);
        return out;
    }
}
export class conv1D extends NeuroModule {
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

        let batches = over_axis.reduce((r,v)=>r*v,1);
        let dim_out = (padded_size - dilation * (k_size - 1) - 1) / stride + 1;
        const out_shape = [this.out_channels, dim_out];
        out_shape.unshift(...over_axis)
        const out_size = out_shape.reduce((r, v) => r * v, 1);
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
        const out = tensor.from(data)._src(x, this.weights)._label(this.label)._shape(out_shape);
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
                                const g = o_grad[++out_idx] / tensor.GRADIENT_DIVIDER;
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
export class RMSNorm extends NeuroModule {
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
export const nm = {
    linear(...args){
        return new Linear(...args);
    },
    binLayer(...args){
        return new BinLayer(...args);
    },
    Conv1d(...args){
        return new conv1D(...args);
    },
    RMSNorm(...args){
        return new RMSNorm(...args);
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