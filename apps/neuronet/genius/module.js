import {Parameter, Tensor} from "./neuro.js";
export class Module{
    constructor(...args) {
        this.__args__ = ''
        if (args.length){
            let s = this.constructor.toString();
            s = s.substr(s.indexOf('(')+1);
            s = s.substr(0, s.indexOf(')'));
            s = s.split(',');
            this.__args__= s.map((n, i)=>{
                n = n.split('=').shift().trim();
                return n +'='+ args[i];
            }).join(', ')
        }
        this.__init__(...args);
        const fwd = (...args)=>{
            // console.time('forward: ' + this.label)
            const res = this.forward(...args)
            // console.timeEnd('forward: ' + this.label)
            return res;
        }
        fwd.module = this;
        fwd.toString = this.toString.bind(this);
        return fwd
    }
    forward(x){
        return x;
    }
    back(g){
        return g;
    }
    get label(){
        return this.constructor.name;
    }
    get __children__(){
        let ch = Object.getOwnPropertyDescriptors(this);
        const result = []
        for (let n in ch){
            const prop = ch[n]
            if (prop.value?.module){
                result.push({[n]:prop.value.module})
            }
            else if (Array.isArray(prop.value) && prop.value[0]?.module){
                result.push({[n]:prop.value.map(i=>i.module)})
            }
        }
        return result;
    }
    toString(step = 0){
        const add = 3;
        const tab = (' ').repeat(step + add);
        let s = `${this.label} (${this.__args__})\r\n`;
        s += this.__children__.map(obj => {
            const key = Object.keys(obj)[0];
            const prop = obj[key];
            if(Array.isArray(prop)){
                return tab + key + `[${prop.length}]:\r\n` +prop.map((m, i)=>(' ').repeat(step + add * 2)+i+': '+m.toString(step + add * 2)).join('')
            }
            return tab + key+': '+prop.toString(step + add);
        }).join('');
        return s;
    }
}

export class Linear extends Module{
    __init__(in_size, out_size, bias = false) {
        this.W = Parameter(Tensor.random([in_size, out_size], 'linear-weights'));
        this.bias = bias?Parameter(Tensor.random([out_size], 'linear-bias')):null;
    }
    forward(x){
        x = x._mm(this.W);
        if (this.bias)
            x = x._add(this.bias);
        return x;
    }
}
export function linear(...args){
    return new Linear(...args)
}
export class RMSNorm extends Module {
    __init__(dim) {
        this.weight = Parameter(Tensor.ones(dim, 'rsm-norm-w'));
        this.eps = 1e-5;
    }
    forward(x) {
        let v = x._pow(2);
        v = v._mean();
        v = v._add(this.eps);
        v = v._rsqrt();
        v = v._mul(this.weight);
        x = x._mul(v);
        return x;
    }
}
export function rsmNorm(...args){
    return new RMSNorm(...args)
}