export class TNum extends Number{
    g = 0;
    backs = []
    constructor(v, l) {
        super(v);
        if (l)
            this.l = l;
    }
    setVal(v){
        this.valueOf = valueOf;
        this._ = v;
    }
    back(){
        for (let back of this.backs)
            back();
        this.backs = []
    }
    grad(g){
        this.g += g;
        if (this.t) return;
        this.back?.();
    }
}
export function num(val, label){
    return ((val instanceof TNum) ? val : new TNum(val, label));
}
function valueOf(){
    return this._;
}

Number.prototype.toTNumString = function () {
    const v = +this;
    return (v).toExponential(2).padStart(10, ' ') +' ';
}


// math functions

Number.prototype._mul = function (other){
    const out = num(this * other, '_mul');
    out.back = () => {
        this.grad(other * out.g);
        other.grad?.(this * out.g);
    }
    return out;
}
Number.prototype._add = function (other){
    const out = num(this + other, '_add');
    out.back = () => {
        this.grad(out.g);
        other.grad?.(out.g);
    }
    return out;
}

Number.prototype._add_ = function (other){
    this.setVal(this + other);
    const back = ()=>{
        other.grad(this.g);
    };
    this.backs.push(back)
    this.l='_add_';
    return this;
}
Number.prototype._exp = function (){
    const out = num(Math.exp(this), '_exp')
    out.back = ()=>{
        this.grad(Math.E ** this * out.g);
    }
    return out;
}
Number.prototype._pow = function (other){
    const out = num(this ** other, '_pow')
    out.back = ()=>{
        this.grad(other * this ** (other - 1) * out.g);
        other.grad?.(this ** other * Math.log(this) * out.g);
    }
    return out;
}
Number.prototype._div = function (other){
    const out = num(this / other, '_div')
    out.back = ()=>{
        this.grad(1 / other * out.g);
        other.grad?.(-(this / other ** 2) * out.g);
    }
    return out;
}

Number.prototype._sqrt = function (){
    const res = Math.sqrt(this)
    const out = num(res, '_sqrt')
    out.back = ()=>{
        this.grad((1 / (2 * res)) * out.g);
    }
    return out;
}
Number.prototype._rsqrt = function (){
    return num(1)._div(this._sqrt());
}
Number.prototype._log = function (){
    const out = num(Math.log(this), '_log')
    out.back = ()=>{
        this.grad((1 / this) * out.g);
    }
    return out;
}
Number.prototype._log10 = function () {
    const out =  num(Math.log10(this), '_log10')
    out.back = ()=>{
        this.grad((1 / (this * Math.log(10)) * out.g));
    }
    return out;
}

// activation functions

Number.prototype.softplus = function () {
    const out =  num(Math.log(1 + Math.exp(this)),'softplus')
    out.back = ()=>{
        this.grad((1 / (1 + Math.exp (-this))) * out.g);
    }
    return out;
}
Number.prototype.sigmoid = function () {
    const out =  num(1 / (1 + Math.exp(-this)), 'sigmoid')
    out.back = ()=>{
        this.grad(this * (1 - this) * out.g);
    }
    return out;
}
Number.prototype.silu = function () {
    const out =  num(this * 1 / (1 + Math.exp(-this)), 'silu')
    out.back = ()=>{
        this.grad(this * (1 - this) * out.g);
    }
    return out;
}
Number.prototype.relu = function (leak = 0) {
    const out =  num(this > 0 ? this : leak, 'relu')
    out.back = ()=>{
        this.grad( (this > 0 ? 1 : leak) * out.g);
    }
    return out;
}

Number.prototype.elu = function (alpha = 1){
    const elu = this > 0 ? this : (alpha * (Math.exp(this) - 1));
    const out =  num(elu, 'elu')
    out.back = ()=>{
        this.grad((this > 0 ? 1 : elu + alpha) * out.g);
    }
    return out;
}

