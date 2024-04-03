export class TFloat extends Number{
    grads = []
    constructor(v, l) {
        super(v);
        if (l) this.label = l;
    }
    set val(n){
        if (this._val === undefined)
            this.valueOf = valueOf;
        this._val = n;
    }
    get g(){
        if (this._g === undefined){
            this._g = 0;
            let grad
            while(grad = this.grads.shift()){
                this._g += grad();
            }
        }
        return this._g
    }
    set g(n){
        this._g = n;
    }
}

function valueOf(){
    return this._val;
}
export function TNum(v, l){
    return v.g?v:new TFloat(v, l);
}

Number.prototype.toTNumString = function () {
    const v = +this;
    return (v).toExponential(2).padStart(10, ' ') +' ';
}

// math functions

Number.prototype._mul = function (other){
    const out = TNum(this * other, '_mul');
    this.grads.push(()=>{
        return other * out.g;
    })
    other.grads?.push(()=>{
        return this * out.g;
    })
    return out;
}
Number.prototype._add = function (other){
    const out = TNum(this + other, '_add');
    this.grads.push(()=>{
        return out.g;
    })
    other.grads?.push(()=>{
        return out.g;
    })
    return out;
}
//
// Number.prototype._add_ = function (other){
//     this.setVal(this + other);
//     other.grads.push(()=>{
//         return this.g;
//     })
//     this.l='_add_';
//     return this;
// }
Number.prototype._exp = function (){
    const out = TNum(Math.exp(this), '_exp')
    this.grads.push(()=>{
        return (Math.E ** this * out.g);
    })
    return out;
}
Number.prototype._pow = function (other){
    const out = TNum(this ** other, '_pow')
    this.grads.push(()=>{
        return (other * this ** (other - 1) * out.g);
    })
    other.grads?.push(()=>{
        return (this ** other * Math.log(this) * out.g);
    })
    return out;
}
Number.prototype._div = function (other){
    const out = TNum(this / other, '_div')
    this.grads.push(()=>{
        return (1 / other * out.g);
    })
    other.grads?.push(()=>{
        return (-(this / other ** 2) * out.g);
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
    return TNum(1)._div(this._sqrt());
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

// activation functions

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
        return (this * (1 - this) * out.g);
    })
    return out;
}
Number.prototype.silu = function () {
    const out =  TNum(this * (1 / (1 + Math.exp(-this))), 'silu')
    this.grads.push(()=>{
        return (this * (1 - this) * out.g);
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

