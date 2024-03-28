export class TNum extends Number{
    grads = []
    constructor(v, l) {
        super(v);
        if (l)
            this.l = l;
    }
    get g(){
        const res = this['#g'] ??= this.grads.reduce((r, grad)=>r + grad(), 0);
        return res;
    }
}
export function num(val, label){
    return ((val instanceof TNum) ? val : new TNum(val, label));
}

Number.prototype.toTNumString = function () {
    const v = +this;
    return (v).toExponential(2).padStart(10, ' ') +' ';
}


// math functions

Number.prototype._mul = function (other){
    const out = num(this * other, '_mul');
    this.grads.unshift(()=>{
        return other * out.g;
    })
    other.grads?.unshift(()=>{
        return this * out.g;
    })
    return out;
}
Number.prototype._add = function (other){
    const out = num(this + other, '_add');
    this.grads.unshift(()=>{
        return out.g;
    })
    other.grads?.unshift(()=>{
        return out.g;
    })
    return out;
}
//
// Number.prototype._add_ = function (other){
//     this.setVal(this + other);
//     other.grads.unshift(()=>{
//         return this.g;
//     })
//     this.l='_add_';
//     return this;
// }
Number.prototype._exp = function (){
    const out = num(Math.exp(this), '_exp')
    this.grads.unshift(()=>{
        return (Math.E ** this * out.g);
    })
    return out;
}
Number.prototype._pow = function (other){
    const out = num(this ** other, '_pow')
    this.grads.unshift(()=>{
        return other * this ** (other - 1) * out.g;
    })
    other.grads?.unshift(()=>{
        return this ** other * Math.log(this) * out.g;
    })
    return out;
}
Number.prototype._div = function (other){
    const out = num(this / other, '_div')
    this.grads.unshift(()=>{
        return (1 / other * out.g);
    })
    other.grads?.unshift(()=>{
        return (-(this / other ** 2) * out.g);
    })
    return out;
}

Number.prototype._sqrt = function (){
    const res = Math.sqrt(this)
    const out = num(res, '_sqrt')
    this.grads.unshift(()=>{
        return ((1 / (2 * res)) * out.g);
    })
    return out;
}
Number.prototype._rsqrt = function (){
    return num(1)._div(this._sqrt());
}
Number.prototype._log = function (){
    const out = num(Math.log(this), '_log')
    this.grads.unshift(()=>{
        return ((1 / this) * out.g);
    })
    return out;
}
Number.prototype._log10 = function () {
    const out =  num(Math.log10(this), '_log10')
    this.grads.unshift(()=>{
        return ((1 / (this * Math.log(10)) * out.g));
    })
    return out;
}

// activation functions

Number.prototype.softplus = function () {
    const out =  num(Math.log(1 + Math.exp(this)),'softplus')
    this.grads.unshift(()=>{
        return ((1 / (1 + Math.exp (-this))) * out.g);
    })
    return out;
}
Number.prototype.sigmoid = function () {
    const out =  num(1 / (1 + Math.exp(-this)), 'sigmoid')
    this.grads.unshift(()=>{
        return (this * (1 - this) * out.g);
    })
    return out;
}
Number.prototype.silu = function () {
    const out =  num(this * (1 / (1 + Math.exp(-this))), 'silu')
    this.grads.unshift(()=>{
        return (this * (1 - this) * out.g);
    })
    return out;
}
Number.prototype.relu = function (leak = 0) {
    const out =  num(+(this > 0 ? this : leak), 'relu')
    this.grads.unshift(()=>{
        return ( (this > 0 ? 1 : leak) * out.g)
    })
    return out;
}

Number.prototype.elu = function (alpha = 1){
    const elu = +(this > 0 ? this : (alpha * (Math.exp(this) - 1)));
    const out =  num(elu, 'elu');
    this.grads.unshift(()=>{
        return ((this > 0 ? 1 : elu + alpha) * out.g);
    })
    return out;
}

