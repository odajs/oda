export class TNum extends Number{
    _ = undefined;
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
        this._ = v;
        this.valueOf = valueOf;
    }
    toTesorString(width = 2) {
        const v = (+this);
        if (v.toString().length > 6)
            return ((v < 0?' ':'  ') + v.toExponential(width) + ' ')
        return v
    }

}
export function num(val, back_fn, label){
    return val instanceof TNum ? val : new TNum(val, back_fn, label);
}
function valueOf(){
    return this._;
}


Number.prototype.back = function (g){
    for (let back of this.backs)
        back(g);
    this.backs = []
}

// math functions

Number.prototype._mul = function (other){
    return num(this * other, g => {
        this.back(this.g += other * g);
        other.back( other.g += this * g);
    }, '_mul');
}
Number.prototype._add = function (other){
    return num(this + other, g => {
        this.back(this.g += g);
        other.back(other.g += g);
    }, '_add');
}

Number.prototype._add_ = function (other){
    this.setVal(this + other);
    this.backs.push(g=>{
        other.back(other.g += g);
    })
    return this;
}
Number.prototype._exp = function (){
    return num(Math.exp(this), g => {
        this.back(this.g += Math.E * this ** (Math.E - 1) * g);
    });
}
Number.prototype._pow = function (e){
    return num(this ** e, g => {
        this.back(this.g += this * e ** (this - 1) * g);
    });
}
Number.prototype._div = function (e){
    return num(this / e, g => {
        this.back(this.g += this * e / e ** 2 * g);
    });
}
Number.prototype._sqrt = function (){
    return num(Math.sqrt(this), g => {
        this.back(this.g += (1 / (2 * Math.sqrt(this) ** 2)) * g);
    });
}
Number.prototype._rsqrt = function (){
    return num(1)._div(this._sqrt());
}
Number.prototype._log = function (){
    return num(Math.log(this), g => {
        this.back(this.g += (1 / (this * Math.log(Math.exp())) * g));
    });
}
Number.prototype._log10 = function () {
    return num(Math.log10(this), g => {
        this.back(this.g += (1 / (this * Math.log(10)) * g));
    });
}

// activation functions

Number.prototype._softplus = function () {
    return num(Math.log(1 + Math.exp(this)), g => {
        this.back(this.g += (1 / (1 + Math.exp (-this))) * g);
    });
}
Number.prototype._sigmoid = function () {
    return num(1 / (1 + Math.exp(-this)), g => {
        this.back(this.g += this * (1 - this) * g);
    });
}
Number.prototype._silu = function () {
    return num(this * 1 / (1 + Math.exp(-this)), g => {
        this.back(this.g += this * (1 - this) * g);
    });
}
Number.prototype._relu = function (leak = 0) {
    return num(this > 0 ? this : leak, g => {
        this.back(this.g += (this > 0 ? 1 : leak) * g);
    });
}

Number.prototype._elu = function (alpha = 1){
    const elu = this > 0 ? this : (alpha * (Math.exp(this) - 1));
    return num(elu, g => {
        this.back(this.g += (this > 0 ? 1 : elu + alpha) * g);
    });
}

