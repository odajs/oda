export class TNum extends Number{
    g = 0;
    backs = []
    constructor(v, back_fn, l) {
        super(v);
        if (back_fn)
            this.backs.push(back_fn);
        if (l)
            this.l = l;
    }
    setVal(v){
        this.valueOf = valueOf;
        this._ = v;
    }
    back(g){
        this.g = g + this.g;
        for (let back of this.backs)
            back(this.g);
        this.backs = []
    }

}
export function num(val, back_fn, label){
    return ((val instanceof TNum) ? val : new TNum(val, back_fn, label));
}
function valueOf(){
    return this._;
}

Number.prototype.toTNumString = function () {
    const v = +this;
    return ((v < 0?' ':'  ') + (v).toExponential(2) + ' ').padStart(7, ' ');
}


// math functions

Number.prototype._mul = function (other){
    return num(this * other, g => {
        this.back(other * g);
        other.back?.(this * g);
    }, '_mul');
}
Number.prototype._add = function (other){
    return num(this + other, g => {
        this.back(g);
        other.back?.(g);
    }, '_add');
}

Number.prototype._add_ = function (other){
    this.setVal(this + other);
    this.backs.push(g=>{
        other.back(g);
    })
    this.l='_add_';
    return this;
}
Number.prototype._exp = function (){
    return num(Math.exp(this), g => {
        this.back(Math.E ** this * g);
    }, '_exp');
}
Number.prototype._pow = function (other){
    return num(this ** other, g => {
        this.back(other * this ** (other - 1) * g);
        other.back?.(this ** other * Math.log(this) * g);
    }, '_pow');
}
Number.prototype._div = function (other){
    return num(this / other, g => {
        this.back(1 / other * g);
        other.back?.(-(this / other ** 2) * g);
    },'_div');
}

Number.prototype._sqrt = function (){
    const res = Math.sqrt(this)
    return num(res, g => {
        this.back((1 / (2 * res)) * g);
    },'_sqrt');
}
Number.prototype._rsqrt = function (){
    return num(1)._div(this._sqrt());
}
Number.prototype._log = function (){
    return num(Math.log(this), g => {
        this.back((1 / this) * g);
    },'_log');
}
Number.prototype._log10 = function () {
    return num(Math.log10(this), g => {
        this.back((1 / (this * Math.log(10)) * g));
    },'_log10');
}

// activation functions

Number.prototype.softplus = function () {
    return num(Math.log(1 + Math.exp(this)), g => {
        this.back((1 / (1 + Math.exp (-this))) * g);
    },'softplus');
}
Number.prototype.sigmoid = function () {
    return num(1 / (1 + Math.exp(-this)), g => {
        this.back(this * (1 - this) * g);
    },'sigmoid');
}
Number.prototype.silu = function () {
    return num(this * 1 / (1 + Math.exp(-this)), g => {
        this.back(this * (1 - this) * g);
    },'silu');
}
Number.prototype.relu = function (leak = 0) {
    return num(this > 0 ? this : leak, g => {
        this.back((this > 0 ? 1 : leak) * g);
    },'relu');
}

Number.prototype.elu = function (alpha = 1){
    const elu = this > 0 ? this : (alpha * (Math.exp(this) - 1));
    return num(elu, g => {
        this.back((this > 0 ? 1 : elu + alpha) * g);
    },'elu');
}

