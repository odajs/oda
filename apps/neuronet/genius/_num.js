const GRADIENT_DIVIDER = 1.618
export class N extends Number{
    grads = []
    constructor(v) {
        super(v);
        this[''] = v;
    }
    set val(n){
        this[''] = n;
    }
    get g(){
        if (this._g === undefined){
            let grad = this.grads.pop();
            let g = 1;
            if (grad){
                g = 0;
                while (grad) {
                    g += grad();
                    grad = this.grads.pop();
                }
                g /= GRADIENT_DIVIDER;
            }
            this._g = g;
        }
        return this._g;
    }
    valueOf(){
        return this[''];
    }
}

export function TNum(v, l){
    return (v instanceof N)?v:new N(v, l);
}

Number.prototype.toTNumString = function () {
    const v = +this;
    return (v).toExponential(2).padStart(9, ' ') ;
}

// math functions

Number.prototype.mul = function (other){
    const out = TNum(this * other, 'mul');
    this.grads.push(()=>{
        return other * out.g;
    })
    other.grads?.push(()=>{
        return this * out.g;
    })
    return out;
}
Number.prototype.add = function (other){
    const out = TNum(this + other, 'add');
    this.grads.push(()=>{
        return 1 * out.g;
    })
    other.grads?.push(()=>{
        return 1 * out.g;
    })
    return out;
}

Number.prototype.minus = function (other){
    const out = TNum(this - other, 'minus');
    this.grads.push(()=>{
        return 1 * out.g;
    })
    other.grads?.push(()=>{
        return -1 * out.g;
    })
    return out;
}

Number.prototype._sum = function (other){
    this.val = this + other;
    other.grads.push(()=>{
        return this.g;
    })
    this.label='_sum';
    return this;
}

Number.prototype._exp = function (){
    const out = TNum(Math.exp(this), '_exp')
    this.grads.push(()=>{
        return (Math.E ** this * out.g);
    })
    return out;
}
Number.prototype.pow = function (other){
    const out = TNum(this ** other, 'pow')
    this.grads.push(()=>{
        return (other * (this ** (other - 1)) * out.g);
    })
    other.grads?.push(()=>{
        return (this ** other * Math.log(this) * out.g);
    })
    return out;
}
Number.prototype.div = function (other){
    const out = TNum(this / other, 'div')
    this.grads.push(()=>{
        return ((1 / other) * out.g);
    })
    other.grads?.push(()=>{
        return (-(this /  other ** 2) * out.g);
    })
    return out;
}

Number.prototype._sqrt = function (){
    const res = Math.sqrt(this)
    const out = TNum(res, '_sqrt')
    this.grads.push(()=>{
        return ((1 / (2 * res)) * out.g);
    })
    return out;
}
Number.prototype._rsqrt = function (){
    return TNum(1).div(this._sqrt());
}
Number.prototype._log = function (){
    const out = TNum(Math.log(this), '_log')
    this.grads.push(()=>{
        return ((1 / this) * out.g);
    })
    return out;
}
Number.prototype._log10 = function () {
    const out =  TNum(Math.log10(this), '_log10')
    this.grads.push(()=>{
        return ((1 / (this * Math.log(10)) * out.g));
    })
    return out;
}
Number.prototype.exp = function (){
    const out = TNum(Math.exp(this), 'exp')
    this.grads.push(()=>{
        return out * out.g;
    })
    return out;
}


// activation functions

Number.prototype.tanh = function () {
    const exp = Math.exp(this);
    const nexp = Math.exp(-this);
    const res = (exp - nexp) / (exp + nexp);
    const out =  TNum(res, 'tanh')
    this.grads.push(()=>{
        return ((1 - res ** 2) * out.g);
    })
    return out;
}

Number.prototype.softmax = function () {
    const exp = Math.exp(this)
    const out =  TNum(Math.log(1 + exp), 'softmax')
    this.grads.push(()=>{
        return ((exp / (1 + exp)) * out.g);
    })
    return out;
}

Number.prototype.softplus = function () {
    const exp = Math.exp(this)
    const out =  TNum(Math.log(1 + exp), 'softplus')
    this.grads.push(()=>{
        return ((exp / (1 + exp)) * out.g);
    })
    return out;
}
Number.prototype.sigmoid = function () {
    const out =  TNum(1 / (1 + Math.exp(-this)), 'sigmoid')
    this.grads.push(()=>{
        return (out * (1 - out) * out.g);
    })
    return out;
}
Number.prototype.silu = function () {
    const out =  TNum(this * (1 / (1 + Math.exp(-this))), 'silu')
    this.grads.push(()=>{
        return (out * (1 - out) * out.g);
    })
    return out;
}
Number.prototype.relu = function (leak = 0) {
    const out =  TNum(+(this > 0 ? this : leak), 'relu')
    this.grads.push(()=>{
        return ( (this > 0 ? 1 : leak) * out.g)
    })
    return out;
}

Number.prototype.elu = function (alpha = 1){
    const elu = +(this > 0 ? this : (alpha * (Math.exp(this) - 1)));
    const out =  TNum(elu, 'elu');
    this.grads.push(()=>{
        return ((this > 0 ? 1 : elu + alpha) * out.g);
    })
    return out;
}