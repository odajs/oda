import {tensor} from "./torus.js";
export class Module{
    #params = Object.create(null);
    constructor(argumetns) {


        let expr = this.constructor.toString();

        expr = expr.replace(/\/\/.*/g, '').replace(/\/\*[^\*\/]*\*\//g, '');

        const names = expr.match(/(?<=\()(.|(\r?\n))*?(?=\))/g)[0].split(',')/*.map(name => {
            return name.split('=')[0].trim();
        });*/

        for (let i = 0; i<names.length; i++){
            let name = names[i]
            let [n, d] = name.split('=').map(i=>i.trim());
            this[n] = this.#params[n] = argumetns[i] ?? (new Function("return "+d))();
        }
        this.__init__();
        const fwd = (...args)=>{
            return this.forward(...args);
        }
        fwd.module = this;
        fwd.toString = this.toString.bind(this);
        return fwd
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
            if (prop.value?.module){
                result.push({[n]:prop.value.module})
            }
            else if (prop.value instanceof tensor){
                result.push({[n]:prop.value})
            }
            else if (Array.isArray(prop.value) && prop.value[0]?.module){
                result.push({[n]:prop.value.map(i=>i.module)})
            }
        }
        return result;
    }
    toString(){
        return this.toStringTree()
    }
    toStringTree(step = 0){
        const add = 3;
        const tab = (' ').repeat(step + add);
        let s = `${this.label} (${this.__params__})\r\n`;
        s += this.__children__.map(obj => {
            const key = Object.keys(obj)[0];
            const prop = obj[key];
            if(Array.isArray(prop)){
                return tab + key + `[${prop.length}]:\r\n` +prop.map((m, i)=>(' ').repeat(step + add * 2)+i+': '+m.toString(step + add * 2)).join('')
            }
            return tab + key+': ' + (prop.toStringTree?.(step + add) || prop.toString());
        }).join('');
        return s;
    }
    get label(){
        return `${this.constructor.name} (${Object.keys(this.#params).map(k=>k+'='+this.#params[k])})`;
    }
}
class Linear extends Module{
    constructor(d_in, d_out, bias = false) {
        super(arguments);
    }
    __init__() {
        this.W = tensor.param(tensor.rand([this.d_in, this.d_out]).minus_(.5));
        this.W._label(this.W.label + '/linear weights');
        if(this.bias){
            this.B = tensor.param(tensor.rand(this.d_out).minus_(.5));
            this.B._label(this.bias._label + '/linear bias');
        }

    }
    forward(x){
        let axis = ''
        if (x.shape.length>1){
            axis = Array(x.shape.length-1).fill(65).map((v,i)=>String.fromCharCode(v+i)).join('')
        }
        x = tensor.einsum(`${axis}i, io -> ${axis}o`, [x, this.W]);
        if (this.bias)
            x = x.plus(this.B);
        return x;
    }
}

class conv1D extends Module {
    constructor(in_channels,
                out_channels /*eee*/,
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

    }
    forward(x) {

    }
    getRightPosition(step) {
        return step * this.stride + (this.kernel_size - 1) * this.dilation + 1;
    }
}


class RMSNorm extends Module {
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
export const nn = {
    linear(...args){
        return new Linear(...args);
    },
    conv1D(...args){
        return new conv1D(...args);
    },
    RMSNorm(...args){
        return new RMSNorm(...args);
    }
}